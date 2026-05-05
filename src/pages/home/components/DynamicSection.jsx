// DynamicSections.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSectionsProduct } from "../../../global_redux/features/sectionProducts/sectionProductThunks";
import SectionCarousel from "./SectionCarousel";

const DynamicSection = () => {
  const dispatch = useDispatch();
  const { sections, loading, error, hasLoaded } = useSelector((state) => state.sectionProduct);

  useEffect(() => {
    // Skip if already loading
    if (loading) {
      return;
    }

    // Only fetch if sections haven't been loaded yet
    if (!hasLoaded) {
      dispatch(fetchSectionsProduct());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount - removed all dependencies to prevent infinite loops

  if (loading) {
    return (
      <div className="mx-auto w-full px-4 py-10 md:px-10 md:py-16">
        <div className="flex h-56 flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white text-slate-500 shadow-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-200 border-t-primary"></div>
          <p className="mt-4 text-sm font-medium">Loading curated sections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full px-4 py-10 md:px-10 md:py-16">
        <div className="rounded-3xl border border-red-100 bg-red-50/70 px-6 py-12 text-center text-red-500 shadow-sm">
          <p className="text-xl font-bold">Unable to load sections</p>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Filter out sections with no products
  const activeSections = sections.filter(
    (section) => section.products && section.products.length > 0
  );

  if (activeSections.length === 0) {
    return (
      <div className="mx-auto w-full px-4 py-10 md:px-10 md:py-16">
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center text-slate-500 shadow-sm">
          <p className="text-xl font-bold">No sections available right now</p>
          <p className="mt-2 text-sm">New sections will appear here automatically.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full  bg-gradient-to-b from-white to-slate-50/60 py-2 md:py-5">
      {activeSections.map((section) => (
        <SectionCarousel
          key={section._id}
          sectionId={section._id}
          sectionName={section.section}
          productIds={section.products}
        />
      ))}
    </section>
  );
};

export default DynamicSection;