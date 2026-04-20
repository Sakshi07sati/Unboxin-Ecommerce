// store/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('teezine_cart');
    return savedCart ? JSON.parse(savedCart) : { items: [], appliedPromo: null };
  } catch (error) {
    console.error('Error loading cart:', error);
    return { items: [], appliedPromo: null };
  }
};

// Save cart to localStorage
const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('teezine_cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

// Calculate totals WITHOUT tax
const calculateTotals = (items, discount = 0) => {
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const shipping = subtotal > 0 ? (subtotal >= 999 ? 0 : 50) : 0;
  const total = subtotal + shipping - discount;
  
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    totalItems,
    shipping,
    total: Math.round(total * 100) / 100,
    discount: Math.round(discount * 100) / 100
  };
};

const savedCart = loadCartFromStorage();
const initialState = {
  items: savedCart.items || [],
   buyNowItem: null,
  appliedPromo: savedCart.appliedPromo || null,
  ...calculateTotals(savedCart.items || [], savedCart.appliedPromo?.discount || 0)
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { 
        productId, 
        name, 
        price, 
        originalPrice, // ✅ ADD THIS
        discount, 
        image, 
        size, 
        memberSavings, 
        sizes, 
        maxStock 
      } = action.payload;

      console.log("Adding to cart:", action.payload);
      
      // Create unique item id based on productId and size
      const itemId = `${productId}_${size}`;
      const existingItem = state.items.find(item => item.id === itemId);
      
      if (existingItem) {
        // Check stock before incrementing
        const currentSizeStock = existingItem.maxStock || maxStock;
        if (existingItem.quantity >= currentSizeStock) {
          console.warn(`Cannot add more items. Stock limit reached for size ${size}`);
          return; // Don't add if stock limit reached
        }
        existingItem.quantity += 1;
      } else {
        state.items.push({
          id: itemId,
          productId,
          name,
          price,
          originalPrice, // ✅ STORE THIS
          discount,
          image,
          size,
          quantity: 1,
          memberSavings: memberSavings || 0,
          sizes: sizes || [], // Store all sizes with stock for cart validation
          maxStock: maxStock // Store max available stock for this size
        });
      }
      
      // Recalculate totals with current discount
      const totals = calculateTotals(state.items, state.discount);
      Object.assign(state, totals);
      
      // Save to localStorage
      saveCartToStorage({ items: state.items, appliedPromo: state.appliedPromo });
    },

    removeFromCart: (state, action) => {
      const itemId = action.payload;
      const removedItem = state.items.find(item => item.id === itemId);
      
      state.items = state.items.filter(item => item.id !== itemId);
      
      // If promo was applied to removed item, check if promo should be removed
      if (state.appliedPromo && removedItem) {
        const validProducts = state.appliedPromo.validProducts || [];
        const updatedValidProducts = validProducts.filter(
          p => state.items.some(item => item.productId === p.productId)
        );
        
        if (updatedValidProducts.length === 0) {
          // No more valid products, remove promo
          state.appliedPromo = null;
          state.discount = 0;
        } else {
          // Recalculate discount based on remaining valid products
          const newDiscount = updatedValidProducts.reduce((sum, p) => sum + (p.discount || 0), 0);
          state.appliedPromo.validProducts = updatedValidProducts;
          state.discount = newDiscount;
        }
      }
      
      // Recalculate totals with current discount
      const totals = calculateTotals(state.items, state.discount);
      Object.assign(state, totals);
      
      // Save to localStorage
      saveCartToStorage({ items: state.items, appliedPromo: state.appliedPromo });
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item && quantity > 0) {
        // Check stock limit
        const maxAllowed = item.maxStock || Infinity;
        if (quantity > maxAllowed) {
          console.warn(`Cannot set quantity to ${quantity}. Max stock is ${maxAllowed}`);
          return;
        }
        item.quantity = quantity;
        
        // Recalculate totals with current discount
        const totals = calculateTotals(state.items, state.discount);
        Object.assign(state, totals);
        
        // Save to localStorage
        saveCartToStorage({ items: state.items, appliedPromo: state.appliedPromo });
      }
    },

    incrementQuantity: (state, action) => {
      const itemId = action.payload;
      const item = state.items.find(item => item.id === itemId);
      
      if (item) {
        // Check stock before incrementing
        const maxAllowed = item.maxStock || Infinity;
        if (item.quantity >= maxAllowed) {
          console.warn(`Cannot increment. Max stock reached for ${item.name} (${item.size})`);
          return;
        }
        item.quantity += 1;
        
        // Recalculate totals with current discount
        const totals = calculateTotals(state.items, state.discount);
        Object.assign(state, totals);
        
        // Save to localStorage
        saveCartToStorage({ items: state.items, appliedPromo: state.appliedPromo });
      }
    },

    decrementQuantity: (state, action) => {
      const itemId = action.payload;
      const item = state.items.find(item => item.id === itemId);
      
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        
        // Recalculate totals with current discount
        const totals = calculateTotals(state.items, state.discount);
        Object.assign(state, totals);
        
        // Save to localStorage
        saveCartToStorage({ items: state.items, appliedPromo: state.appliedPromo });
      }
    },

    updateSize: (state, action) => {
      const { id, size } = action.payload;
      const item = state.items.find((i) => i.id === id);
      
      if (item) {
        // Check if the new size is available
        const newSizeInfo = item.sizes?.find(s => s.size === size);
        if (!newSizeInfo || newSizeInfo.stock <= 0) {
          console.warn(`Size ${size} is not available for ${item.name}`);
          return;
        }
        
        // Create new unique ID for the product+size combination
        const newItemId = `${item.productId}_${size}`;
        
        // Check if item with same productId and new size already exists
        const existingItemWithNewSize = state.items.find(
          i => i.id === newItemId && i.id !== id
        );
        
        if (existingItemWithNewSize) {
          // Merge quantities if same product with different size already exists
          existingItemWithNewSize.quantity += item.quantity;
          
          // Remove the old item
          state.items = state.items.filter(i => i.id !== id);
        } else {
          // Update the existing item with new size and ID
          item.size = size;
          item.id = newItemId;
          item.maxStock = newSizeInfo.stock;
          // ✅ originalPrice is preserved automatically
        }
        
        // Save to localStorage
        saveCartToStorage({ items: state.items, appliedPromo: state.appliedPromo });
      }
    },

    applyPromoToCart: (state, action) => {
      const { promoCode, discount } = action.payload;
      
      state.appliedPromo = {
        code: promoCode.code,
        validProducts: promoCode.validProducts || []
      };
      
      state.discount = discount;
      
      const totals = calculateTotals(state.items, discount);
      Object.assign(state, totals);
      
      saveCartToStorage({ items: state.items, appliedPromo: state.appliedPromo });
    },

    removePromoFromCart: (state) => {
      state.appliedPromo = null;
      state.discount = 0;
      
      const totals = calculateTotals(state.items, 0);
      Object.assign(state, totals);
      
      saveCartToStorage({ items: state.items, appliedPromo: null });
    },
 setBuyNowItem: (state, action) => {
      state.buyNowItem = action.payload;
    },

     clearBuyNowItem: (state) => {
      state.buyNowItem = null;
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.totalItems = 0;
      state.shipping = 0;
      state.total = 0;
      state.discount = 0;
      state.appliedPromo = null;
      
      localStorage.removeItem('teezine_cart');
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  updateSize,
  applyPromoToCart,
  removePromoFromCart,
  setBuyNowItem,
  clearBuyNowItem
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartSubtotal = (state) => state.cart.subtotal;
export const selectCartItemsCount = (state) => state.cart.totalItems;
export const selectCartShipping = (state) => state.cart.shipping;
export const selectCartDiscount = (state) => state.cart.discount;
export const selectAppliedPromo = (state) => state.cart.appliedPromo;
export const selectBuyNowItem = (state) => state.cart.buyNowItem;
export const selectCheckoutItems = (state) => 
  state.cart.buyNowItem ? [state.cart.buyNowItem] : state.cart.items;

export default cartSlice.reducer;