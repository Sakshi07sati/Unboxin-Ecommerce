import React from 'react';

import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-16 px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
         
          <div className="space-y-6">
            <div className="flex items-center gap-2">
           
              <span className="text-4xl font-bold text-white tracking-tight">
                UN<span className="text-[#e91e63]">BOX</span>
              </span>
            </div>
            <div className="flex gap-4">
              <span className="w-5 h-5 cursor-pointer hover:text-[#e91e63] transition-colors inline-block">
                {/* Facebook SVG */}
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                  <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
                </svg>
              </span>
              <span className="w-5 h-5 cursor-pointer hover:text-[#e91e63] transition-colors inline-block">
                {/* Youtube SVG */}
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-5 h-7">
                  <path d="M21.8 8.001a2.75 2.75 0 0 0-1.93-1.946C18.07 5.5 12 5.5 12 5.5s-6.07 0-7.87.555A2.75 2.75 0 0 0 2.2 8.001 28.6 28.6 0 0 0 1.5 12a28.6 28.6 0 0 0 .7 3.999 2.75 2.75 0 0 0 1.93 1.946C5.93 18.5 12 18.5 12 18.5s6.07 0 7.87-.555a2.75 2.75 0 0 0 1.93-1.946A28.6 28.6 0 0 0 22.5 12a28.6 28.6 0 0 0-.7-3.999ZM10 15.5v-7l6 3.5-6 3.5Z" />
                </svg>
              </span>
              <span className="w-5 h-5 cursor-pointer hover:text-[#e91e63] transition-colors inline-block">
                {/* Instagram SVG */}
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.13 4.602.388 3.545 1.445 2.488 2.502 2.23 3.675 2.172 4.952.013 8.332 0 8.741 0 12c0 3.259.013 3.668.072 4.948.058 1.277.316 2.45 1.373 3.507 1.057 1.057 2.23 1.315 3.507 1.373C8.332 23.987 8.741 24 12 24c3.259 0 3.668-.013 4.948-.072 1.277-.058 2.45-.316 3.507-1.373 1.057-1.057 1.315-2.23 1.373-3.507.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.058-1.277-.316-2.45-1.373-3.507C19.398.388 18.225.13 16.948.072 15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
                </svg>
              </span>
            </div>
            <div className="text-slate-400 text-sm leading-relaxed tracking-wide">
              <p className="font-semibold text-slate-200">UNBOX Private Ltd</p>
              <p>Building No.: D-257, Sector 63,</p>
              <p>Marathalli Bridge, Bengaluru</p>
              <p>Karnataka, 201301</p>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h3 className="text-white font-bold text-lg mb-8 uppercase tracking-wider">Shop</h3>
            <div className="flex flex-col gap-3 text-slate-400 text-sm">
              <Link to="/FeaturedCollection" className="hover:text-[#e91e63] transition-colors">New Arrivals</Link>
              <Link to="/fashion" className="hover:text-[#e91e63] transition-colors">Fashion</Link>
              <Link to="/beauty" className="hover:text-[#e91e63] transition-colors">Beauty</Link>
              <Link to="/perfume" className="hover:text-[#e91e63] transition-colors">Perfumes</Link>
            </div>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="text-white font-bold text-lg mb-8 uppercase tracking-wider">Support</h3>
            <div className="flex flex-col gap-3 text-slate-400 text-sm">
              <a href="#" className="hover:text-[#e91e63] transition-colors">Shipping Policy</a>
              <a href="#" className="hover:text-[#e91e63] transition-colors">Return & Exchange</a>
              <a href="#" className="hover:text-[#e91e63] transition-colors">FAQs</a>
              <Link to="/about" className="hover:text-[#e91e63] transition-colors">About Us</Link>
              <Link to="/contacts" className="hover:text-[#e91e63] transition-colors">Contact Us</Link>
            </div>
          </div>

          {/* Column 4: Newsletter or Policy */}
          <div>
            <h3 className="text-white font-bold text-lg mb-8 uppercase tracking-wider">Newsletter</h3>
            <p className="text-slate-400 text-sm mb-4">Subscribe to get the latest updates.</p>
            <div className="flex">
              <input 
                type="text" 
                placeholder="Email Address" 
                className="bg-slate-800 border-none px-4 py-2 w-full text-sm focus:ring-1 focus:ring-[#e91e63] outline-none rounded-l-md"
              />
              <button className="bg-[#e91e63] px-4 py-2 rounded-r-md text-sm font-bold hover:bg-pink-700 transition-colors">
                GO
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-3 items-center  transition-all">
             <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4 bg-white p-1 rounded" alt="Visa" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
             <div className="bg-white px-2 py-0.5 rounded text-[10px] font-bold text-blue-600">Paytm</div>
          </div>
          <p className="text-slate-500 text-[11px] uppercase tracking-[0.2em] text-center md:text-right">
            © 2026 UNBOX. All rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;