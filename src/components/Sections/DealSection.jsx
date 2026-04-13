// DealsSection.jsx
import { useEffect, useState } from "react";

export default function DealSection() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then(res => res.json())
      .then(data => {
        const deals = data.products
          .sort((a, b) => b.discountPercentage - a.discountPercentage)
          .slice(0, 10);
        setProducts(deals);
      });
  }, []);

  return (
    <div className="bg-[#FFF0F5] py-6 px-4">
      <h2 className="text-2xl font-bold font-playfair text-textprimary mb-8">
         Deals of the Day
      </h2>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide ">
        {products.map(p => (
          <div key={p.id} className="min-w-[220px] bg-white rounded-lg p-3 shadow relative">

            {/* Discount Badge */}
            <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
              {Math.round(p.discountPercentage)}% OFF
            </span>

            <img src={p.thumbnail} crossOrigin="anonymous" className="h-40 mx-auto object-contain" />

            <h3 className="text-sm mt-2 line-clamp-2">{p.title}</h3>

            <p className="text-lg font-bold mt-1">₹{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}