// // import React, { useEffect, useState } from "react";
// // import { useParams } from "react-router-dom";
// // import API from "../../global_redux/api";

// // export default function ProductDetails() {
// //   const { id } = useParams();

// //   const [product, setProduct] = useState(null);
// //   const [selectedImage, setSelectedImage] = useState("");
// //   const [selectedSize, setSelectedSize] = useState("");

// //   useEffect(() => {
// //     const fetchProduct = async () => {
// //       try {
// //        const res = await API.get(`/products/${id}`);
// //         const data = res.data.data;

// //         setProduct(data);
// //         setSelectedImage(data.img?.[0]);
// //       } catch (err) {
// //         console.error(err);
// //       }
// //     };

// //     fetchProduct();
// //   }, [id]);

// //   if (!product) return <div>Loading...</div>;

// //   const discount = product.originalPrice
// //     ? Math.round(
// //         ((product.originalPrice - product.price) /
// //           product.originalPrice) *
// //           100
// //       )
// //     : 0;

// //   return (
// //     <div className="p-6 grid md:grid-cols-2 gap-10">
      
// //       {/* LEFT - Images */}
// //       <div>
// //         <img
// //           src={selectedImage}
// //           className="w-full h-[400px] object-contain border"
// //         />

// //         <div className="flex gap-2 mt-3">
// //           {product.img?.map((img, i) => (
// //             <img
// //               key={i}
// //               src={img}
// //               onClick={() => setSelectedImage(img)}
// //               className="w-16 h-16 border cursor-pointer"
// //             />
// //           ))}
// //         </div>
// //       </div>

// //       {/* RIGHT - Details */}
// //       <div>
// //         <h1 className="text-2xl font-bold">{product.name}</h1>

// //         {/* Rating */}
// //         <div className="mt-2 text-sm bg-pink-600 text-white inline-block px-2 py-1 rounded">
// //           {product.rating} ★
// //         </div>

// //         {/* Price */}
// //         <div className="mt-4 flex items-center gap-3">
// //           <span className="text-2xl font-bold">₹{product.price}</span>

// //           <span className="line-through text-gray-500">
// //             ₹{product.originalPrice}
// //           </span>

// //           <span className="text-pink-600 font-medium">
// //             {discount}% OFF
// //           </span>
// //         </div>

// //         {/* Size Selection */}
// //         <div className="mt-5">
// //           <h3 className="font-medium mb-2">Select Size</h3>

// //           <div className="flex gap-2">
// //             {product.sizes?.map((s, i) => (
// //               <button
// //                 key={i}
// //                 onClick={() => setSelectedSize(s.size)}
// //                 className={`px-3 py-1 border rounded ${
// //                   selectedSize === s.size
// //                     ? "bg-pink-600 text-white"
// //                     : ""
// //                 }`}
// //               >
// //                 {s.size}
// //               </button>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Buttons */}
// //         <div className="mt-6 flex gap-4">
// //           <button className="bg-pink-600 text-white px-6 py-2 rounded">
// //             Add to Bag
// //           </button>

// //           <button className="border px-6 py-2 rounded">
// //             Wishlist
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import API from "../../global_redux/api";
// import { ChevronRight, Star, Heart, ShoppingBag } from "lucide-react";
// import toast from "react-hot-toast";

// export default function ProductDetails() {
//   const { id } = useParams();

//   const [product, setProduct] = useState(null);
//   const [selectedImage, setSelectedImage] = useState("");
//   const [selectedSize, setSelectedSize] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setLoading(true);
//         const res = await API.get(`/products/${id}`);
//         const data = res.data.data;

//         setProduct(data);
//         // Set initial image
//         if (data.img && data.img.length > 0) {
//           setSelectedImage(data.img[0]);
//         }
//       } catch (err) {
//         console.error("Fetch Error:", err);
//         toast.error("Failed to load product details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   if (loading) return <div className="h-screen flex items-center justify-center font-medium text-gray-500">Loading Product...</div>;
//   if (!product) return <div className="h-screen flex items-center justify-center">Product not found.</div>;

//   // Calculate Discount
//   const discount = product.originalPrice
//     ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
//     : 0;

//   // Parse Sizes if they come as a JSON string from backend
//   const availableSizes = typeof product.sizes === 'string' 
//     ? JSON.parse(product.sizes) 
//     : product.sizes;

//   return (
//     <div className="max-w-[1280px] mx-auto p-4 md:p-10 font-sans text-[#282c3f]">
      
//       {/* Breadcrumbs */}
//       <nav className="flex items-center gap-2 text-sm mb-6 text-gray-500">
//         <span>Home</span> <ChevronRight size={14} />
//         <span className="capitalize">{product.category?.name || "Category"}</span> <ChevronRight size={14} />
//         <span className="font-bold text-gray-800 truncate">{product.name}</span>
//       </nav>

//       <div className="grid md:grid-cols-12 gap-8">
        
//         {/* LEFT - Image Gallery (Myntra Grid Style) */}
//         <div className="md:col-span-7 grid grid-cols-2 gap-3">
//           {product.img?.map((img, i) => (
//             <div key={i} className="overflow-hidden border border-gray-100 group">
//               <img
//                 src={img}
//                 alt={`Product View ${i}`}
//                 className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
//               />
//             </div>
//           ))}
//         </div>

//         {/* RIGHT - Content Section */}
//         <div className="md:col-span-5 flex flex-col gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-[#282c3f] leading-tight">{product.name}</h1>
//             <p className="text-lg text-gray-500 mt-1">{product.productDetails}</p>
//           </div>

//           {/* Rating Badge */}
//           <div className="flex items-center gap-1 border w-fit px-2 py-1 rounded-sm font-bold text-sm hover:border-gray-800 cursor-pointer transition-colors">
//             <span>{product.rating || "4.2"}</span>
//             <Star size={14} className="fill-[#14958f] text-[#14958f]" />
//             <span className="text-gray-400 font-normal border-l ml-1 pl-1">2.4k Ratings</span>
//           </div>

//           <hr className="my-2 border-gray-100" />

//           {/* Price Section */}
//           <div className="flex items-baseline gap-3">
//             <span className="text-2xl font-bold text-[#282c3f]">₹{product.price}</span>
//             {product.originalPrice && (
//               <>
//                 <span className="text-xl text-gray-400 line-through">MRP ₹{product.originalPrice}</span>
//                 <span className="text-xl font-bold text-[#ff905a]">({discount}% OFF)</span>
//               </>
//             )}
//           </div>
//           <p className="text-[#03a685] text-sm font-bold">inclusive of all taxes</p>

//           {/* Size Selection */}
//           <div className="mt-4">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-base font-bold uppercase tracking-wider">Select Size</h3>
//               <button className="text-[#ff3f6c] font-bold text-sm uppercase tracking-tight">Size Chart {'>'}</button>
//             </div>

//             <div className="flex flex-wrap gap-3">
//               {availableSizes?.map((s, i) => (
//                 <button
//                   key={i}
//                   disabled={s.stock === 0}
//                   onClick={() => setSelectedSize(s.size)}
//                   className={`w-12 h-12 rounded-full border flex items-center justify-center text-sm font-bold transition-all
//                     ${s.stock === 0 ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed italic" : "hover:border-[#ff3f6c]"}
//                     ${selectedSize === s.size ? "border-[#ff3f6c] text-[#ff3f6c] border-2" : "border-gray-300 text-gray-700"}
//                   `}
//                 >
//                   {s.size}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="mt-8 flex gap-4">
//             <button className="flex-1 bg-[#ff3f6c] text-white flex items-center justify-center gap-3 py-4 rounded font-bold text-base hover:bg-[#e63a62] transition-colors shadow-md"
//             //   disabled={!selectedSize}
//               navigate={`/cart?productId=${product._id}`}>
//               <ShoppingBag size={20} />
//               ADD TO BAG
//             </button>

//             <button className="flex-1 border border-gray-300 flex items-center justify-center gap-3 py-4 rounded font-bold text-base hover:border-gray-800 transition-colors">
//               <Heart size={20} className={selectedSize ? "" : "text-gray-400"} />
//               WISHLIST
//             </button>
//           </div>

//           {/* Product Description */}
//           <div className="mt-8 pt-8 border-t border-gray-100">
//             <h3 className="text-base font-bold uppercase tracking-wider mb-4">Product Details</h3>
//             <p className="text-sm text-[#282c3f] leading-relaxed whitespace-pre-line">
//               {product.productDescription || "No description available for this product."}
//             </p>
            
//             {/* Delivery Features (Myntra Style) */}
//             <div className="mt-6 space-y-3">
//               <div className="flex items-center gap-4 text-sm font-medium">
//                 <span className="text-gray-400">100% Original Products</span>
//               </div>
//               <div className="flex items-center gap-4 text-sm font-medium">
//                 <span className="text-gray-400">Pay on delivery might be available</span>
//               </div>
//               <div className="flex items-center gap-4 text-sm font-medium">
//                 <span className="text-gray-400">Easy 14 days returns and exchanges</span>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }
import React from 'react'
import Navbar from '../../components/common/Navbar'
import ProductDetail from './components/ProductDetails'
import Footer from '../../components/common/Footer'

const ProductDetails = () => {
  return (
    <div>
      <Navbar/>
      <ProductDetail />
      <Footer/>
    </div>
  )
}

export default ProductDetails
