"use client";

import React, { useState, useEffect } from "react";
import { Bug, BookOpen, Lightbulb, Search, ArrowRight, Loader2, Info } from "lucide-react";
import { Input } from "@/components/ui/input";

// ── Dummy Data ────────────────────────────────────────────────
const MOCK_ARTICLES = [
  {
    id: 1,
    title: "Hidroponik Skala Mikro untuk Petani Muda",
    desc: "Memanfaatkan lahan sempit di belakang rumah untuk budidaya sayuran premium bernilai tinggi. Teknik ini tidak hanya menghemat ruang dan konsumsi air secara signifikan, tetapi juga memberikan peluang bisnis yang menjanjikan bagi generasi milenial yang ingin memulai usaha agrikultur dengan modal terbatas dan paparan risiko cuaca yang sangat minim.",
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80",
    category: "Budidaya",
  },
  {
    id: 2,
    title: "Penerapan IoT dalam Irigasi Tetes Otomatis",
    desc: "Mengoptimalkan penggunaan air di lahan kering melalui sistem irigasi tetes yang terintegrasi dengan sensor kelembapan tanah dan prakiraan cuaca. Teknologi cerdas ini memungkinkan setiap tanaman mendapatkan asupan air dan nutrisi cair yang presisi secara real-time, sehingga mencegah risiko gagal panen sekaligus menekan biaya operasional harian perkebunan.",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80",
    category: "Teknologi",
  },
  {
    id: 3,
    title: "Strategi Rotasi Tanaman Sayur Semusim",
    desc: "Mencegah penumpukan patogen dan penyakit dalam tanah dengan mengatur jadwal rotasi penanaman yang ketat antara keluarga kubis-kubisan, sayuran daun, dan umbi-umbian. Metode penanaman bergilir ini telah terbukti mampu memutus siklus hidup hama spesifik secara alami dan secara bertahap meningkatkan keragaman mikroba baik di dalam ekosistem lahan pertanian.",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
    category: "Tips",
  },
  {
    id: 4,
    title: "Restorasi Tanah Pasca Panen Raya Terpadu",
    desc: "Langkah-langkah efektif untuk mengembalikan unsur hara dan struktur mikrobiologi tanah setelah musim panen besar selesai. Proses ini melibatkan penggunaan pupuk kompos organik yang difermentasi, rotasi tanaman pelindung (cover crop), serta teknik pengolahan tanah minimal untuk memastikan kesuburan lahan tetap terjaga dan siap untuk siklus penanaman berikutnya.",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80",
    category: "Budidaya",
  },
  {
    id: 5,
    title: "Antisipasi Serangan Kutu Daun Musim Kemarau",
    desc: "Panduan komprehensif untuk mendeteksi secara dini dan mengendalikan ledakan populasi hama kutu daun yang sering terjadi saat suhu udara meningkat. Artikel ini membahas kombinasi efektif antara penggunaan pestisida nabati dari ekstrak daun mimba dan pengenalan predator alami seperti kepik (ladybug) untuk menjaga ekosistem lahan tetap seimbang.",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    category: "Hama & Penyakit",
  },
];

const CATEGORIES = ["Semua", "Budidaya", "Teknologi", "Tips", "Hama & Penyakit"];

export default function InsightPage() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  // Simulate network fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Filter logic
  const filteredArticles = MOCK_ARTICLES.filter((article) => {
    const matchesCategory =
      activeCategory === "Semua" || article.category === activeCategory;
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full space-y-8 pb-10">
      
      {/* ── Highlights Section ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Highlight 1: Waspada Hama */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 ring-1 ring-black/5 flex flex-col justify-between relative overflow-hidden min-h-[220px]">
          {/* Bottom Right Decorative Arcs */}
          <div className="absolute -bottom-12 -right-12 w-52 h-52 pointer-events-none opacity-80">
            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
              <circle cx="160" cy="160" r="140" fill="#fde8e8" opacity="0.35" />
              <circle cx="160" cy="160" r="100" fill="#fde8e8" opacity="0.55" />
              <circle cx="160" cy="160" r="60" fill="#fde8e8" opacity="0.85" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <Bug className="w-6 h-6 text-[#d60000]" />
              <span className="text-xs font-semibold text-[#d60000] bg-[#fce8e6] px-3.5 py-1 rounded-full">
                Waspada
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#d60000] mb-2">Waspada Hama</h3>
            <p className="text-xs sm:text-sm text-[#e53935] font-medium leading-relaxed max-w-[92%]">
              Dapatkan informasi terkini mengenai serangan hama, penyakit tanaman, dan langkah pencegahannya dari berbagai sumber terpercaya.
            </p>
          </div>
          <div className="mt-6 relative z-10">
            <button className="bg-[#d60000] hover:bg-[#b50000] text-white text-xs font-semibold px-5 py-2 rounded-full transition shadow-xs cursor-pointer">
              Selengkapnya
            </button>
          </div>
        </div>

        {/* Highlight 2: Panduan Budidaya */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 ring-1 ring-black/5 flex flex-col justify-between relative overflow-hidden min-h-[220px]">
          {/* Top Left Decorative Arcs */}
          <div className="absolute -top-12 -left-12 w-52 h-52 pointer-events-none opacity-80">
            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
              <circle cx="40" cy="40" r="140" fill="#e2ebe6" opacity="0.4" />
              <circle cx="40" cy="40" r="100" fill="#e2ebe6" opacity="0.65" />
              <circle cx="40" cy="40" r="60" fill="#e2ebe6" opacity="0.9" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="w-6 h-6 text-[#1b4332]" />
              <span className="text-xs font-semibold text-[#1b4332] bg-[#dce6e2] px-3.5 py-1 rounded-full">
                Update
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#1b4332] mb-2">Panduan Budidaya</h3>
            <p className="text-xs sm:text-sm text-[#2d4a3e] font-medium leading-relaxed max-w-[92%]">
              Temukan berbagai panduan budidaya tanaman mulai dari persiapan lahan hingga masa panen berdasarkan praktik terbaik.
            </p>
          </div>
          <div className="mt-6 relative z-10">
            <button className="bg-[#1b4332] hover:bg-[#032e21] text-white text-xs font-semibold px-5 py-2 rounded-full transition shadow-xs cursor-pointer">
              Selengkapnya
            </button>
          </div>
        </div>

        {/* Highlight 3: Tips & Trick */}
        <div className="bg-[#1b4332] rounded-3xl p-6 shadow-sm border border-[#06543c] ring-1 ring-black/5 flex flex-col justify-between relative overflow-hidden min-h-[220px]">
          {/* Decorative Arcs in dark card */}
          <div className="absolute -top-16 -left-16 w-60 h-60 pointer-events-none opacity-30">
            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
              <circle cx="40" cy="40" r="150" fill="white" opacity="0.15" />
              <circle cx="40" cy="40" r="105" fill="white" opacity="0.25" />
              <circle cx="40" cy="40" r="60" fill="white" opacity="0.35" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Tips & Trick</h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium leading-relaxed max-w-[92%]">
              Temukan berbagai tips, pengalaman, dan solusi praktis yang dapat diterapkan dalam kegiatan pertanian sehari-hari.
            </p>
          </div>
          <div className="mt-6 relative z-10">
            <button className="bg-white hover:bg-gray-100 text-[#1b4332] text-xs font-semibold px-5 py-2 rounded-full transition shadow-xs cursor-pointer">
              Selengkapnya
            </button>
          </div>
        </div>

      </div>

      {/* ── Main Content: Kabar Tani ── */}
      <div className="space-y-6 pt-4">
        
        {/* Section Header & Filters */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-extrabold text-[#1B4332] mb-1">Kabar Tani</h2>
            <p className="text-sm text-gray-500 font-medium">Tren terkini di dunia pertanian</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64 xl:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-emerald-300 focus-visible:ring-emerald-500 rounded-full h-11 text-sm shadow-[0_2px_10px_rgba(3,59,42,0.03)]"
              />
            </div>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex flex-nowrap overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#1B4332] text-white shadow-md shadow-[#1B4332]/20"
                  : "bg-white text-gray-600 border border-emerald-200 hover:border-[#1B4332] hover:text-[#1B4332]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-emerald-100 shadow-sm flex flex-col h-full animate-pulse">
                <div className="h-56 bg-gray-200 w-full"></div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="h-4 bg-gray-200 w-24 rounded-full mb-3"></div>
                  <div className="h-6 bg-gray-200 w-full rounded-md mb-2"></div>
                  <div className="h-6 bg-gray-200 w-3/4 rounded-md mb-4"></div>
                  <div className="space-y-2 mb-6">
                    <div className="h-3 bg-gray-100 w-full rounded-md"></div>
                    <div className="h-3 bg-gray-100 w-full rounded-md"></div>
                    <div className="h-3 bg-gray-100 w-5/6 rounded-md"></div>
                  </div>
                  <div className="mt-auto h-4 bg-gray-200 w-32 rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredArticles.length > 0 ? (
          /* Articles Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(3,59,42,0.04)] border border-emerald-100 ring-1 ring-black/5 flex flex-col h-full hover:shadow-[0_8px_30px_rgba(3,59,42,0.08)] hover:border-emerald-300 transition-all duration-300 group"
              >
                {/* Image Container */}
                <div className="h-56 w-full relative overflow-hidden bg-emerald-900/10">
                  {!failedImages[article.id] ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [article.id]: true }))
                      }
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] flex flex-col items-center justify-center p-4 text-white text-center">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2 backdrop-blur-xs">
                        <BookOpen className="w-6 h-6 text-emerald-200" />
                      </div>
                      <span className="text-xs font-semibold text-emerald-100/90">{article.category}</span>
                    </div>
                  )}
                  {/* Category Badge over image */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/95 backdrop-blur-sm text-[#1B4332] text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wide">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-[#1B4332] transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-3 mb-6">
                    {article.desc}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <button className="text-[#1B4332] font-bold text-sm inline-flex items-center gap-1.5 hover:text-[#032e21] transition-colors cursor-pointer group/btn">
                      Baca Selengkapnya
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl p-12 shadow-[0_4px_20px_rgba(3,59,42,0.04)] border border-emerald-200 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5 border-[1.5px] border-dashed border-gray-300">
              <Info className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Artikel tidak ditemukan</h3>
            <p className="text-sm text-gray-500 font-medium max-w-sm mb-6">
              Maaf, kami tidak dapat menemukan artikel yang cocok dengan pencarian "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("Semua");
              }}
              className="bg-[#1B4332] hover:bg-[#032e21] text-white font-bold text-sm px-6 py-2.5 rounded-full transition-colors cursor-pointer shadow-sm"
            >
              Reset Pencarian
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
