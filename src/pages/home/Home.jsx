import React, { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar";
import HeroPage from "./HeroPage";
import ProductCategory from "../../components/Sections/ProductCategory";
import ProductCard from "../../components/Products/ProductCard";
import DealsSection from "../../components/Sections/DealSection";
import API  from "../../global_redux/api";
import StyleSection from "../../components/Sections/StyleSection";
import Footer from "../../components/common/Footer";


export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
       const res = await API.get("/products");
setProducts(res.data.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-white min-h-screen font-sans">
      <Navbar />
      <HeroPage />
      <ProductCategory />

      {/* Featured Products Section */}
      <section className="bg-[#F9F9F9] py-12">
        <div className="max-w-[1400px] mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-8 uppercase tracking-widest">
            Featured Products
          </h3>
          {loading && <div className="text-center">Loading...</div>}
          {error && <div className="text-center text-red-500">{error}</div>}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products && products.length > 0 && products.slice(0, 8).map((product) => (
             <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>
      <DealsSection />
      <StyleSection />
      <Footer />
    </div>
  );
}