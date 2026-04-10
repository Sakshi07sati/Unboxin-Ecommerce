// Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-black text-white mt-10">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 py-10">

        <div>
          <h3 className="text-primary font-semibold mb-3">Shop</h3>
          <p>Makeup</p>
          <p>Skincare</p>
          <p>Haircare</p>
        </div>

        <div>
          <h3 className="text-primary font-semibold mb-3">Help</h3>
          <p>Contact Us</p>
          <p>Returns</p>
          <p>Shipping</p>
        </div>

        <div>
          <h3 className="text-primary font-semibold mb-3">Company</h3>
          <p>About</p>
          <p>Careers</p>
          <p>Blog</p>
        </div>

        <div>
          <h3 className="text-primary font-semibold mb-3">Subscribe</h3>
          <input
            placeholder="Enter email"
            className="w-full p-2 bg-gray-800 rounded mb-2"
          />
          <button className="bg-primary w-full py-2 rounded">
            Subscribe
          </button>
        </div>

      </div>

      <p className="text-center text-gray-500 pb-4 text-sm">
        © 2026 YourStore. All rights reserved.
      </p>
    </footer>
  );
}