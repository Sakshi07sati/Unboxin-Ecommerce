// // import React from "react";
// // import { Swiper, SwiperSlide } from "swiper/react";
// // import { Navigation } from "swiper/modules";
// // import { ChevronRight } from "lucide-react";

// // // Import Swiper styles
// // import "swiper/css";
// // import "swiper/css/navigation";

// // const categories = [
// //   { id: 1, name: "Westernwear", img: "https://placehold.co/400x400?text=Western" },
// //   { id: 2, name: "Indianwear", img: "https://placehold.co/400x400?text=Indian" },
// //   { id: 3, name: "Men", img: "https://placehold.co/400x400?text=Men" },
// //   { id: 4, name: "Footwear", img: "https://placehold.co/400x400?text=Footwear" },
// //   { id: 5, name: "Lingerie", img: "https://placehold.co/400x400?text=Lingerie" },
// //   { id: 6, name: "Activewear", img: "https://placehold.co/400x400?text=Active" },
// //   { id: 7, name: "Kids", img: "https://placehold.co/400x400?text=Kids" },
// //   { id: 8, name: "Bags", img: "https://placehold.co/400x400?text=Bags" },
// //   { id: 9, name: "Jewellery", img: "https://placehold.co/400x400?text=Jewelry" },
// //   { id: 10, name: "Sneakers", img: "https://placehold.co/400x400?text=Sneakers" },
// // ];

// // const ProductCategory = () => {
// //   return (
// //       <section className="relative max-w-[1440px] mx-auto px-4 py-8 group">
// //       <Swiper
// //         modules={[Navigation]}
// //         spaceBetween={12}
// //         slidesPerView={3.5} // Mobile default
// //         navigation={{
// //           nextEl: ".custom-next-button",
// //         }}
// //         breakpoints={{
// //           // Tablet
// //           640: { slidesPerView: 5.5, spaceBetween: 15 },
// //           // Desktop
// //           1024: { slidesPerView: 8.5, spaceBetween: 20 },
// //         }}
// //         className="category-swiper"
// //       >
// //         {categories.map((cat) => (
// //           <SwiperSlide key={cat.id}>
// //             <div className="flex flex-col items-center cursor-pointer">
// //               {/* Image Container - Square Aspect Ratio */}
// //               <div className="w-full aspect-square overflow-hidden bg-gray-100 mb-2">
// //                 <img
// //                   src={cat.img}
// //                   alt={cat.name}
// //                   className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
// //                 />
// //               </div>
// //               {/* Category Name */}
// //               <span className="text-[13px] md:text-sm font-medium text-gray-900 text-center whitespace-nowrap">
// //                 {cat.name}
// //               </span>
// //             </div>
// //           </SwiperSlide>
// //         ))}
// //       </Swiper>

// //       {/* Custom Next Button - Positioned exactly like screenshot */}
// //       <button className="custom-next-button absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center border border-gray-100 hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 hidden md:flex">
// //         <ChevronRight size={24} className="text-gray-600" />
// //       </button>
// //     </section>

// //   );
// // };

// // export default ProductCategory;
// import React from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, A11y } from 'swiper/modules';

// // Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';

// const categories = [
//   { id: 1, name: 'MEN', img: '/images/men-category.jpg' },
//   { id: 2, name: 'WOMEN', img: '/images/women-category.jpg' },
//   { id: 3, name: 'SKINCARE', img: '/images/skincare-category.jpg' },
//   { id: 4, name: 'MAKEUP', img: '/images/makeup-category.jpg' },
//   { id: 5, name: 'SPORTS', img: '/images/sports-category.jpg' },
//   { id: 6, name: 'HAIRCARE', img: '/images/haircare-category.jpg' },
//   { id: 7, name: 'LAPTOPS', img: '/images/laptops-category.jpg' },
//   { id: 8, name: 'MOBILE', img: '/images/mobile-category.jpg' },
// ];

// const ProductCategory = () => {
//   return (
//     <section className="py-10 bg-white px-6">
//       <div className="max-w-7xl mx-auto">
//         <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
//           Shop by Category
//         </h2>

//         <Swiper
//           modules={[Navigation, Pagination, A11y]}
//           spaceBetween={20}
//           slidesPerView={2} // Mobile default
//           navigation
//           breakpoints={{
//             640: { slidesPerView: 3 },
//             1024: { slidesPerView: 5 },
//             1280: { slidesPerView: 6 },
//           }}
//           className="category-swiper"
//         >
//           {categories.map((cat) => (
//             <SwiperSlide key={cat.id}>
//               <div className="group cursor-pointer flex flex-col items-center">
//                 <div className="w-full aspect-square overflow-hidden rounded-full bg-gray-100 border border-gray-100 shadow-sm transition-transform duration-300 group-hover:scale-105">
//                   <img
//                     src={cat.img}
//                     alt={cat.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <h3 className="mt-4 text-sm font-bold tracking-wider text-gray-700 group-hover:text-pink-600 transition-colors">
//                   {cat.name}
//                 </h3>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>

//       {/* Custom Styling for Swiper Arrows */}
//       <style jsx global>{`
//         .swiper-button-next, .swiper-button-prev {
//           color: #e91e63 !important;

//           width: 20px !important;
//           height: 20px !important;
//           border-radius: 50%;
//           box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
//         }
//         .swiper-button-next:after, .swiper-button-prev:after {
//           font-size: 18px !important;
//           font-weight: bold;
//         }
//       `}</style>
//     </section>
//   );
// };

// export default ProductCategory;

// components/Home/CategorySlider.jsx
// import { useRef } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// const categories = [
//   { name: "Men", img: "http://i.pravatar.cc/100?img=1" },
//   { name: "Women", img: "http://i.pravatar.cc/100?img=2" },
//   { name: "Beauty", img: "http://i.pravatar.cc/100?img=3" },
//   { name: "Electronics", img: "http://i.pravatar.cc/100?img=4" },
//   { name: "Mobiles", img: "http://i.pravatar.cc/100?img=5" },
//   { name: "Skincare", img: "http://i.pravatar.cc/100?img=6" },
//   { name: "Haircare", img: "http://i.pravatar.cc/100?img=7" },
//   { name: "Sports", img: "http://i.pravatar.cc/100?img=8" },

// ];

// export default function ProductCategory() {
//   const scrollRef = useRef();

//   const scroll = (direction) => {
//     const { current } = scrollRef;
//     if (direction === "left") {
//       current.scrollBy({ left: -300, behavior: "smooth" });
//     } else {
//       current.scrollBy({ left: 300, behavior: "smooth" });
//     }
//   };

//   return (
//     <div className="relative bg-white py-6 px-4">

//       {/* Title */}
//       <h2 className="text-xl font-bold text-textPrimary mb-4">
//         Shop by Category
//       </h2>

//       {/* Left Arrow */}
//       <button
//         onClick={() => scroll("left")}
//         className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
//       >
//         <ChevronLeft size={20} />
//       </button>

//       {/* Scroll Container */}
//       <div
//         ref={scrollRef}
//         className="flex gap-6 overflow-x-auto scrollbar-hide px-8"
//       >
//         {categories.map((cat, i) => (
//           <div key={i} className="flex  flex-col items-center min-w-[80px] w-full cursor-pointer">

//             {/* Circle Image */}
//             <div className="w-40 h-40 my-6 rounded-full overflow-hidden border-2 border-primary hover:scale-105 transition">
//               <img
//                 src={cat.img}
//                 alt={cat.name}
//                 className="w-full h-full object-cover"
//               />
//             </div>

//             {/* Name */}
//             <p className="text-sm mt-2 text-center text-textPrimary">
//               {cat.name}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Right Arrow */}
//       <button
//         onClick={() => scroll("right")}
//         className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
//       >
//         <ChevronRight size={20} />
//       </button>
//     </div>
//   );
// }

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  { name: "Men",         img: "https://ui-avatars.com/api/?name=Men&background=fce7f3&color=be185d&size=128&bold=true&font-size=0.4" },
  { name: "Women",       img: "https://ui-avatars.com/api/?name=Women&background=fdf2f8&color=9d174d&size=128&bold=true&font-size=0.3" },
  { name: "Beauty",      img: "https://ui-avatars.com/api/?name=Beauty&background=fef3c7&color=92400e&size=128&bold=true&font-size=0.3" },
  { name: "Electronics", img: "https://ui-avatars.com/api/?name=Elec&background=dbeafe&color=1e40af&size=128&bold=true&font-size=0.4" },
  { name: "Mobiles",     img: "https://ui-avatars.com/api/?name=Mobile&background=dcfce7&color=166534&size=128&bold=true&font-size=0.35" },
  { name: "Skincare",    img: "https://ui-avatars.com/api/?name=Skin&background=fae8ff&color=86198f&size=128&bold=true&font-size=0.4" },
  { name: "Haircare",    img: "https://ui-avatars.com/api/?name=Hair&background=ffe4e6&color=be123c&size=128&bold=true&font-size=0.4" },
  { name: "Sports",      img: "https://ui-avatars.com/api/?name=Sport&background=ecfdf5&color=065f46&size=128&bold=true&font-size=0.35" },
];

export default function ProductCategory() {
  const scrollRef = useRef();

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (direction === "left") {
      current.scrollBy({ left: -400, behavior: "smooth" });
    } else {
      current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  return (
    <div className="relative bg-white py-10 px-4">
      <h2 className="text-xl font-bold text-slate-800 mb-6 ml-8">
        Shop by Category
      </h2>

      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-4 top-[55%] -translate-y-1/2 z-20 bg-white shadow-lg p-3 rounded-full border border-gray-100 hover:bg-gray-50 transition-all active:scale-95"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-10 overflow-x-auto scrollbar-hide px-12 pb-4"
      >
        {categories.map((cat, i) => (
          <div
            key={i}
            className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
          >
            {/* Circle Image Container */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-pink-600 group-hover:scale-105 transition-transform duration-300 shadow-sm">
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name */}
            <p className="text-sm font-semibold mt-4 text-center text-slate-700 group-hover:text-pink-600 transition-colors">
              {cat.name}
            </p>
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-4 top-[55%] -translate-y-1/2 z-20 bg-white shadow-lg p-3 rounded-full border border-gray-100 hover:bg-gray-50 transition-all active:scale-95"
      >
        <ChevronRight size={24} />
      </button>

      {/* Custom CSS to hide scrollbar (Add to your global CSS or use this style tag) */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
