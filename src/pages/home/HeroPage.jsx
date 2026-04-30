import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBanners } from '../../global_redux/features/banner/bannerThunks';

const HeroPage = () => {
  const dispatch = useDispatch();
  const { banners } = useSelector((state) => state.banner || { banners: [] });

  const defaultSlides = [
    {
      _id: 'default-1',
      img: "https://i.pinimg.com/1200x/75/1d/2b/751d2b30f041d6a7ec336dbdef797311.jpg",
      heading: "Retro Glamour Finds",
      title: "Curated Vintage Fashion for You"
    },
    {
      _id: 'default-2',
      img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=80",
      heading: "Timeless Elegance",
      title: "Classic Silhouettes for the Modern Woman"
    },
    {
      _id: 'default-3',
      img: "https://i.pinimg.com/1200x/bc/8b/66/bc8b66bfc85c48d38c4e00ecfbaaec0a.jpg",
      heading: "Groceries with a Twist",
      title: "Healthy, Unique & Delicious Finds for Your Pantry"
    }
  ];

  const slides = banners && banners.length > 0 ? banners : defaultSlides;
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [handleNext, slides.length]);

  return (
    <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden flex items-center justify-center text-center bg-gray-200">
      
      {/* 1. Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide._id || slide.id || index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'
          }`}
        >
          <Link to={`/product/${slides[currentSlide]?.productId?._id || ""}`} >
          <div
            className="w-full h-full bg-contain  transition-transform duration-[5000ms]"
            style={{
              backgroundImage: `url(${slide.img || slide.image})`,
              transform: index === currentSlide ? 'scale(1)' : 'scale(1.1)'
            }}
          >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40" />
            </div>
          </Link>
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
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg capitalize tracking-tighter">
          {slides[currentSlide].heading || ""}
        </h1>
        <p className="text-lg md:text-xl font-light mb-8 drop-shadow-md">
          { slides[currentSlide].title || "" }
        </p>
        
        {/* <Link to={`/product/${slides[currentSlide]?.productId?._id || ""}`} className="inline-block px-8 py-3 bg-primary text-white rounded-md font-bold hover:scale-105 transition-transform uppercase tracking-widest text-sm"> */}
         {/* View Now */}
        {/* </Link> */}
         
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
