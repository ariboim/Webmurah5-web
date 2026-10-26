import React from 'react';
import { TESTIMONIALS } from '../data/testimonialsData';
import { Star, CheckCircle, TrendingUp } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimoni" className="py-20 bg-slate-50/60 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="text-xs font-semibold text-sky-700 tracking-wider uppercase">
            Bukti Nyata Klien Kami
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
            Dipercaya Pelaku UMKM dari Berbagai Kota di Indonesia
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Dengarkan pengalaman langsung para pengusaha kuliner, fashion, dan penyedia jasa yang telah melipatgandakan omzet setelah beralih ke landing page kustom webkilat.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="bg-white p-7 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                {/* Rating stars & date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">{item.date}</span>
                </div>

                {/* Review quote */}
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  "{item.content}"
                </p>

                {/* Concrete outcome badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-150">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{item.metric}</span>
                </div>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sky-500 to-sky-700 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                  {item.avatarText}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-900">{item.name}</span>
                    <span title="Klien Terverifikasi">
                      <CheckCircle className="w-3.5 h-3.5 text-sky-600" />
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {item.role} · <strong className="text-slate-700 font-semibold">{item.businessName}</strong> ({item.city})
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
