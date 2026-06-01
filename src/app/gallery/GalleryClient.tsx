"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  User, 
  Download, 
  Search, 
  X, 
  ExternalLink,
  SlidersHorizontal,
  Compass,
  FileImage
} from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: "Events" | "Research Posters" | "Lab Work";
  imageUrl: string;
  date: string;
  location: string;
  author: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "biotech-summit-2026",
    title: "Healix Biotech Summit 2026",
    description: "Annual summit showcasing cutting-edge breakthroughs in CRISPR, precision medicine, and neurobiotechnology. Features international keynote speakers and lab demonstrations.",
    category: "Events",
    imageUrl: "/event_summit_2026.png",
    date: "October 14-16, 2026",
    location: "Apex Biotech Research Center, San Diego, CA",
    author: "Healix Organizing Committee"
  },
  {
    id: "genomic-sequencing-poster",
    title: "Advanced Genomic Sequencing & CRISPR",
    description: "Academic poster highlighting CRISPR-Cas9 editing efficiency, HITI-mediated integration, and off-target assessment pipelines for gene therapies.",
    category: "Research Posters",
    imageUrl: "/research_genomics.png",
    date: "May 12, 2026",
    location: "Genomics Department, Institute of Biotech",
    author: "Dr. Eleanor Vance et al."
  },
  {
    id: "ai-medicine-symposium",
    title: "AI in Medicine Symposium",
    description: "International symposium exploring neural network integrations in diagnostics, predictive analytics, and personalized patient treatment pathways.",
    category: "Events",
    imageUrl: "/event_symposium.png",
    date: "October 25-26, 2024",
    location: "Harvard Innovation Lab, Boston, MA",
    author: "HealthTech Alliance"
  },
  {
    id: "biotech-lab-workbench",
    title: "High-Tech Molecular Diagnostics Workbench",
    description: "Overview of the main molecular biology workbench containing automatic PCR sequences, microfluidics arrays, and high-performance microscope analysis screens.",
    category: "Lab Work",
    imageUrl: "/lab_workbench.png",
    date: "Ongoing Project",
    location: "Healix Core Lab 4",
    author: "Healix Lab Technicians"
  }
];

export default function GalleryClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = ["All", "Events", "Research Posters", "Lab Work"];

  const filteredItems = useMemo(() => {
    return GALLERY_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="relative z-10 max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* HEADER SECTION */}
      <div className="text-center max-w-4xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <Compass className="w-3.5 h-3.5 text-accent-blue" />
          <span>Interactive Showcase</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-research-blue tracking-tight">
          Event Posters & <span className="text-accent-blue">Scientific Works</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Explore visual summaries of our biological symposiums, event bulletins, published research posters, and high-precision laboratory achievements.
        </p>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between border-b border-slate-800 pb-8 mb-12">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center space-x-2 mr-2 text-slate-400 text-xs font-semibold">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-accent-blue text-white shadow-md shadow-accent-blue/15"
                  : "bg-slate-900/40 border border-slate-800 text-slate-400 hover:bg-slate-900 hover:border-slate-700 hover:text-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search gallery works..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/50 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue shadow-sm"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* GALLERY GRID */}
      {filteredItems.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="group cursor-pointer bg-[#0B0F19]/65 border border-slate-800/85 hover:border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col h-full"
              >
                {/* Poster Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950 border-b border-slate-900">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  {/* Subtle category badge overlay */}
                  <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-xs text-brand-white text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border border-white/10">
                    {item.category}
                  </span>
                </div>

                {/* Card Details */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold font-heading text-slate-100 leading-snug group-hover:text-accent-blue transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-900 text-[10px] text-slate-500 font-semibold">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.date}</span>
                    </span>
                    <span className="text-accent-blue hover:underline font-bold inline-flex items-center space-x-0.5">
                      <span>View Poster</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-20 bg-[#0B0F19]/30 border border-slate-800 rounded-3xl p-8 max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <FileImage className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold font-heading text-slate-300">No gallery posters found</h3>
          <p className="text-xs text-slate-400">
            We couldn&apos;t find any items matching your search query or filters. Try adjusting your category or terms.
          </p>
        </div>
      )}

      {/* DETAIL LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10">
            {/* Dark Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveItem(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[85vh] z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-xs flex items-center justify-center text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Image Section */}
              <div className="relative md:w-3/5 bg-slate-950 flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-slate-800">
                <img
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                  className="w-full h-full max-h-[40vh] md:max-h-full object-contain"
                />
                <a
                  href={activeItem.imageUrl}
                  download={activeItem.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".png"}
                  className="absolute bottom-4 left-4 bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-lg flex items-center space-x-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download High-Res</span>
                </a>
              </div>

              {/* Meta Info Section */}
              <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between bg-slate-950 overflow-y-auto">
                <div className="space-y-6">
                  {/* Category */}
                  <span className="inline-block text-[9px] font-bold px-2.5 py-0.5 rounded-md uppercase bg-blue-950/20 text-accent-blue border border-blue-900/30 tracking-wider">
                    {activeItem.category}
                  </span>

                  {/* Title & Description */}
                  <div className="space-y-3">
                    <h2 className="text-xl font-bold font-heading text-slate-100 leading-snug">
                      {activeItem.title}
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {activeItem.description}
                    </p>
                  </div>

                  {/* Scientific metadata table */}
                  <div className="space-y-4 pt-4 border-t border-slate-800">
                    <div className="flex items-start space-x-3 text-xs">
                      <Calendar className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-bold text-slate-200">Date</span>
                        <span className="text-slate-400">{activeItem.date}</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 text-xs">
                      <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-bold text-slate-200">Location / Venue</span>
                        <span className="text-slate-400">{activeItem.location}</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 text-xs">
                      <User className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-bold text-slate-200">Author / Organizers</span>
                        <span className="text-slate-400">{activeItem.author}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex items-center justify-between">
                  <a
                    href={activeItem.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-accent-blue hover:bg-accent-blue/90 text-brand-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 shadow-sm text-center cursor-pointer"
                  >
                    <span>View Image Directly</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
