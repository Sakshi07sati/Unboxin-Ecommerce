import React from "react";
import Navbar from "../../components/common/Navbar";
import HeroPage from "./HeroPage";
import DealsSection from "../../components/Sections/DealSection";
import StyleSection from "../../components/Sections/StyleSection";
import Footer from "../../components/common/Footer";
import FeatureProduct from "./components/FeatureProduct";
import DynamicSection from "./components/DynamicSection";
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white font-sans">
      <Navbar />
      <HeroPage />
      <FeatureProduct />
      {/* <DealsSection /> */}
      {/* <StyleSection /> */}
       <DynamicSection/>
      <Footer />
    </div>
  );
}
