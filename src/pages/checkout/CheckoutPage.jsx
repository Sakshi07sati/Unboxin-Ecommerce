// src/pages/Checkout/CheckoutPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  MapPin,
  CreditCard,
  Lock,
  AlertCircle,
  CheckCircle,
  X,
  Tag,
  Loader2,
  Package,
} from "lucide-react";
import {
  selectCartItems,
  selectBuyNowItem,
  clearBuyNowItem,
} from "../../global_redux/features/cart/cartSlice";
import {
  applyPromoCode,
  removePromoCode,
} from "../../global_redux/features/promoCode/promoCodeThunks";
import { fetchUserProfile } from "../../global_redux/features/auth/authThunks";
import toast from "react-hot-toast";
import CheckoutForm from "./components/CheckoutForm";
import OrderSummary from "./components/OrderSummary";
import PaymentSection from "./components/PaymentSection";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Payment state (replaces the removed usePayment hook)
  const [processingPayment, setProcessingPayment] = useState(false);

  const cartItems = useSelector(selectCartItems);
  const buyNowItem = useSelector(selectBuyNowItem);
  const { appliedPromo, discount, status } = useSelector(
    (state) => state.promoCode,
  );
  const user = useSelector((state) => state.auth?.user);
  const userId = useSelector((state) => state.auth?.userId);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [showProducts, setShowProducts] = useState(false);
  const [hasAutoFilled, setHasAutoFilled] = useState(false);

  // Check if this is a Buy Now flow
  const isBuyNow = Boolean(buyNowItem);

  // Get items for checkout (either buyNowItem or cartItems)
  const checkoutItems = useMemo(() => {
    return isBuyNow ? [buyNowItem] : cartItems;
  }, [isBuyNow, buyNowItem, cartItems]);

  // Fetch user profile if needed (to get complete profile with city, state, pincode)
  useEffect(() => {
    const currentUserId = userId || localStorage.getItem("userId");
    if (currentUserId) {
      // Fetch profile to ensure we have all fields (city, state, pincode, etc.)
      dispatch(fetchUserProfile(currentUserId));
    }
  }, [userId, dispatch]);

  // Initialize form with user data - auto-fill from profile
  useEffect(() => {
    if (user && !hasAutoFilled) {
      // Map user fields to form fields
      // Handle both 'name' and 'username' fields
      const userName = user.name || user.username || "";

      setFormData((prev) => {
        // Only auto-fill empty fields (don't overwrite user input)
        return {
          name: prev.name || userName,
          email: prev.email || user.email || "",
          phone: prev.phone || user.phone || "",
          address: prev.address || user.address || "",
          city: prev.city || user.city || "",
          state: prev.state || user.state || "",
          pincode: prev.pincode || user.pincode || "",
          landmark: prev.landmark || user.landmark || "",
        };
      });

      // Mark as auto-filled to prevent re-running
      setHasAutoFilled(true);
    }
  }, [user, hasAutoFilled]);

  // Validate form on change
  useEffect(() => {
    validateForm();
  }, [formData]);

  // Clear buyNowItem when leaving page
  useEffect(() => {
    return () => {
      if (isBuyNow) {
        // Only clear if user navigates away from checkout
        // dispatch(clearBuyNowItem());
      }
    };
  }, [isBuyNow, dispatch]);

  // Calculate totals
  const subtotal = useMemo(() => {
    return checkoutItems.reduce((total, item) => {
      // For customized items, use price directly (already includes base + customization)
      // For regular items, use originalPrice or price
      const itemPrice = item.isCustomized
        ? item.price // Customized: price already includes base + customization cost
        : item.originalPrice || item.price; // Regular: use originalPrice if available, else price

      const discountPercent = item.discount || 0;
      const discountedPrice = itemPrice - (itemPrice * discountPercent) / 100;
      return total + discountedPrice * (item.quantity || 1);
    }, 0);
  }, [checkoutItems]);

  const finalAmount = useMemo(() => subtotal - discount, [subtotal, discount]);

  // 🔢 Sort items (used for promo application)
  const sortedProductsByPrice = useMemo(() => {
    return checkoutItems
      .map((item) => {
        // For customized items, use price directly (already includes base + customization)
        // For regular items, use originalPrice or price
        const itemPrice = item.isCustomized
          ? item.price // Customized: price already includes base + customization cost
          : item.originalPrice || item.price; // Regular: use originalPrice if available, else price

        const discountPercent = item.discount || 0;
        const discountedPrice = itemPrice - (itemPrice * discountPercent) / 100;
        const finalItemPrice = discountedPrice * (item.quantity || 1);

        return {
          item,
          productId: (item._id || item.id || "").split("_")[0],
          subCategoryId: item.subCategory?._id || item.subCategory || item.subCategoryId || item.category?._id || item.category || item.categoryId,
          itemPrice: finalItemPrice,
        };
      })
      .sort((a, b) => b.itemPrice - a.itemPrice);
  }, [checkoutItems]);

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Invalid email format";

    if (!formData.phone.trim()) errors.phone = "Phone is required";
    else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\s+/g, "")))
      errors.phone = "Invalid phone number";

    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";

    if (!formData.pincode.trim()) errors.pincode = "Pincode is required";
    else if (!/^[1-9][0-9]{5}$/.test(formData.pincode))
      errors.pincode = "Invalid pincode";

    setFormErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  // ✅ Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ✅ Handle field blur (mark as touched)
  const handleFieldBlur = (field) => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  // 🎟 Apply Promo Code
  const handleApplyPromo = useCallback(async () => {
    const trimmedCode = promoCode.trim();
    if (!trimmedCode) {
      setPromoError("Please enter a promo code");
      setPromoSuccess("");
      return;
    }

    setPromoError("");
    setPromoSuccess("");

    try {
      let applied = false;
      let lastError = "";
      console.log("CheckoutPage: Applying promo code. Items in check:", sortedProductsByPrice);
      for (const product of sortedProductsByPrice) {
        try {
          const result = await dispatch(
            applyPromoCode({
              code: trimmedCode,
              productId: product.productId,
              subCategoryId: product.subCategoryId,
              totalAmount: subtotal,
              productName: product.item.name,
              userEmail: formData.email || user?.email,
            }),
          ).unwrap();

          setPromoSuccess({
            message: result?.message || "Promo code applied successfully!",
            productName: product.item.name,
            discount: result?.discount || 0,
          });
          applied = true;
          break;
        } catch (err) {
          const errorMessage =
            err?.response?.data?.message ||
            (typeof err === "string" ? err : err?.message) ||
            "Invalid or expired promo code";

          lastError = errorMessage;

          if (errorMessage.toLowerCase().includes("already used")) break;
          continue;
        }
      }

      if (!applied) {
        setPromoError(
          lastError || "Promo code not applicable to any product in cart",
        );
      }
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        (typeof err === "string" ? err : err?.message) ||
        "Invalid or expired promo code";
      setPromoError(errorMessage);
    }
  }, [promoCode, sortedProductsByPrice, subtotal, dispatch]);

  const handleRemovePromo = useCallback(() => {
    dispatch(removePromoCode());
    setPromoSuccess("");
    setPromoError("");
    setPromoCode("");
  }, [dispatch]);

  // ✅ Handle payment
  const handlePayment = useCallback(async () => {
    setProcessingPayment(true);
    try {
      // TODO: Integrate Razorpay here
      // For now, show a success message
      toast.success("Order placed successfully! (Payment integration pending)");
      if (isBuyNow) {
        dispatch(clearBuyNowItem());
      }
      navigate("/");
    } catch (err) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  }, [isBuyNow, dispatch, navigate]);

  // ✅ Handle payment click - validates form first
  const handlePaymentClick = () => {
    const requiredFields = ["name", "email", "phone", "address", "city", "state", "pincode"];
    const allTouched = requiredFields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouchedFields(allTouched);

    if (!isFormValid) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    if (checkoutItems.length === 0) {
      toast.error("No items to checkout");
      return;
    }

    handlePayment();
  };

  // Auto-clear promo messages
  useEffect(() => {
    if (promoError || promoSuccess) {
      const timer = setTimeout(() => {
        setPromoError("");
        setPromoSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [promoError, promoSuccess]);

  // Redirect if no items
  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No items to checkout
          </h2>
          <p className="text-gray-600 mb-6">
            Add some products to proceed to checkout
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Buy Now indicator */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
              {isBuyNow && (
                <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  Quick Buy
                </span>
              )}
            </div>
            <p className="text-gray-600">
              {isBuyNow
                ? "Quick purchase with secure payment"
                : "Complete your order with secure payment"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="space-y-6">
              {/* Shipping Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Shipping Information
                  </h2>
                </div>

                <CheckoutForm
                  formData={formData}
                  formErrors={formErrors}
                  touchedFields={touchedFields}
                  onInputChange={handleInputChange}
                  onFieldBlur={handleFieldBlur}
                />
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Payment Method
                  </h2>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg border">
                      <CreditCard className="w-6 h-6 text-gray-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">
                        Credit/Debit Card
                      </h3>
                      <p className="text-sm text-gray-600">
                        Pay securely with Razorpay
                      </p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                    <Lock className="w-4 h-4" />
                    <span>Your payment details are secure and encrypted</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Order Summary & Payment */}
            <div className="space-y-6">
              <OrderSummary
                cartItems={checkoutItems}
                subtotal={subtotal}
                discount={discount}
                finalAmount={finalAmount}
                appliedPromo={appliedPromo}
                promoCode={promoCode}
                promoError={promoError}
                promoSuccess={promoSuccess}
                promoLoading={status === "loading"}
                onApplyPromo={handleApplyPromo}
                onRemovePromo={handleRemovePromo}
                onPromoCodeChange={setPromoCode}
                showProducts={showProducts}
                setShowProducts={setShowProducts}
                isBuyNow={isBuyNow}
              />

              <PaymentSection
                isFormValid={isFormValid}
                processingPayment={processingPayment}
                finalAmount={finalAmount}
                onPaymentClick={handlePaymentClick}
                formData={formData}
                formErrors={formErrors}
                isBuyNow={isBuyNow}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
