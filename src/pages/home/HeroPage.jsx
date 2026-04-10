// import { useState, useEffect,useCallback } from 'react';
// // import { useScrollToTop } from '../../../hooks/useScrollToTop';
// import { Link } from 'react-router-dom';
// import { ChevronLeft, ChevronRight } from 'lucide-react'; 

// const HeroPage = () => {
// //   useScrollToTop();

//   const slides = [
//     {
//       id: 1,
//       image: "https://i.pinimg.com/1200x/75/1d/2b/751d2b30f041d6a7ec336dbdef797311.jpg",
//         title: "Unbox the Extraordinary",
//     },
//     {
//       id: 2,
//       image: "https://i.pinimg.com/1200x/bc/8b/66/bc8b66bfc85c48d38c4e00ecfbaaec0a.jpg",
     
//     },
//     {
//       id: 3,
//       image: "https://i.pinimg.com/1200x/25/c1/ea/25c1ea3d44ba8df0115adf4ca33144e9.jpg",
     
//     },
//     {
//       id: 4,
//       image: "https://i.pinimg.com/736x/21/f9/ea/21f9ea6000fad9961ae9cfa192627bf9.jpg",
//       title: "The Summer Archive",
//       subtitle: "Cherry Blossoms & Sun-Kissed Hues"
//     }
//   ];

//   const [currentSlide, setCurrentSlide] = useState(0);

//   const handleNext = useCallback(() => {
//     setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
//   }, [slides.length]);

//   const handlePrev = () => {
//     setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
//   };
  
//   useEffect(() => {
//     const timer = setInterval(() => {
//       handleNext();
//     }, 4000); 
//     return () => clearInterval(timer);
//   }, [handleNext]);



//   return (
//     <section className="relative lg:h-[110vh] md:min-h-screen aspect-square sm:aspect-ratio-[3/4] w-full object-cover overflow-hidden flex flex-col items-center justify-center text-center">
//       {/* 1. Background Slides with dark overlay */}
//       {slides.map((slide, index) => (
//         <div
//           key={slide.id}
//           className={`absolute inset-0 -z-10 transition-opacity duration-1000 ease-in-out ${
//             index === currentSlide ? 'opacity-100' : 'opacity-0'
//           }`}
//         >
//           <div
//             className="w-full h-full bg-cover bg-center transition-transform duration-[5000ms] scale-110"
//             style={{
//               backgroundImage: `url(${slide.image})`,
//               transform: index === currentSlide ? 'scale(1)' : 'scale(1.1)'
//             }}
//           >
//             {/* Overlay for darkening the image */}
//             <div className="absolute inset-0 bg-black/60" />
//           </div>
//         </div>
//       ))}

//       {/* 2. Manual Navigation Arrows */}
//       <button
//         onClick={handlePrev}
//         className="absolute left-4 md:left-8 z-30 p-2 rounded-full bg-black/30 backdrop-blur-md border border-white/20 hover:bg-black/50 transition-all text-white hidden md:block"
//       >
//         <ChevronLeft size={32} strokeWidth={1} />
//       </button>

//       <button
//         onClick={handleNext}
//         className="absolute right-4 md:right-8 z-30 p-2 rounded-full bg-black/30 backdrop-blur-md border border-white/20 hover:bg-black/50 transition-all text-white hidden md:block"
//       >
//         <ChevronRight size={32} strokeWidth={1} />
//       </button>

//       {/* 3. Central Content with improved text color */}
//       <div className="z-10 px-4 max-w-4xl">
//         <h1 className="text-5xl md:text-7xl font-serif mb-4 drop-shadow-2xl transition-all duration-700 text-white">
//           {slides[currentSlide].title}
//         </h1>
//         <p className="text-xl md:text-2xl font-light mb-8 italic drop-shadow-lg text-white/90">
//           {slides[currentSlide].subtitle}
//         </p>
//         <Link to="/shop" className="inline-block px-10 py-3 border border-white rounded-full bg-primary/90 hover:bg-primary hover:text-white transition-all duration-500 uppercase tracking-widest text-sm font-bold text-white shadow-lg">
//           Shop Now
//         </Link>
//       </div>

//       {/* 4. Bottom Progress Indicators */}
//       <div className="absolute bottom-12 z-20 flex gap-4">
//         {slides.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrentSlide(index)}
//             className={`h-[2px] transition-all duration-500 ${
//               index === currentSlide ? 'w-12 bg-white' : 'w-6 bg-white/30'
//             }`}
//           />
//         ))}
//       </div>
//     </section>
//   );
// };

// export default HeroPage;

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroPage = () => {
  const slides = [
    {
      id: 1,
      image: "https://i.pinimg.com/1200x/75/1d/2b/751d2b30f041d6a7ec336dbdef797311.jpg", // Using Unsplash for reliable loading
      title: "Retro Glamour Finds",
      subtitle: "Curated Vintage Fashion for You"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=80",
      title: "Timeless Elegance",
      subtitle: "Classic Silhouettes for the Modern Woman"
    },
    {
      id: 3,
      image: "https://i.pinimg.com/1200x/bc/8b/66/bc8b66bfc85c48d38c4e00ecfbaaec0a.jpg",
      title: "Groceries with a Twist",
      subtitle: "Healthy, Unique & Delicious Finds for Your Pantry"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [handleNext]);

  return (
    /* REMOVED -z-10 from children and fixed container height */
    <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden flex items-center justify-center text-center bg-gray-200">
      
      {/* 1. Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'
          }`}
        >
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-[5000ms]"
            style={{
              backgroundImage: `url(${slide.image})`,
              transform: index === currentSlide ? 'scale(1)' : 'scale(1.1)'
            }}
          >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
        </div>
      ))}

      {/* 2. Manual Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 z-20 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-all text-white"
      >
        <ChevronLeft size={32} />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 z-20 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-all text-white"
      >
        <ChevronRight size={32} />
      </button>

      {/* 3. Central Content */}
      <div className="z-10 px-4 max-w-4xl text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg uppercase tracking-tighter">
          {slides[currentSlide].title}
        </h1>
        <p className="text-lg md:text-xl font-light mb-8 drop-shadow-md">
          {slides[currentSlide].subtitle}
        </p>
        <Link to="/shop" className="inline-block px-8 py-3 bg-primary text-white rounded-md font-bold hover:scale-105 transition-transform uppercase tracking-widest text-sm">
          Shop Now
        </Link>
      </div>

      {/* 4. Indicators */}
      <div className="absolute bottom-8 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1 transition-all duration-500 ${
              index === currentSlide ? 'w-10 bg-white' : 'w-4 bg-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroPage;