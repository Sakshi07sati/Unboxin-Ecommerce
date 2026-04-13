// StyleSection.jsx
import { useEffect, useState } from "react";

export default function StyleSection() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then(res => res.json())
      .then(data => {
        const filtered = data.products.filter(p =>
          ["fragrances", "skincare"].includes(p.category)
        );
        setProducts(filtered);
      });
  }, []);

  return (
    <div className="bg-white py-8 px-4">
        
      <h3 className="text-3xl font-bold font-playfair text-textprimary mb-10 text-center">
        Style in Motion 
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(p => (
          <div key={p.id} className="group cursor-pointer">

            {/* Image with overlay */}
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src={p.thumbnail}
                crossOrigin="anonymous"
                className="h-48 w-full object-contain group-hover:scale-105 transition"
              />

              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <button className="bg-primary text-white px-4 py-1 rounded">
                  Shop Now
                </button>
              </div>
            </div>

            <h3 className="text-sm mt-2 text-center">{p.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}