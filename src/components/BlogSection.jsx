import React from 'react';
import { BookOpen, ArrowRight, Calendar } from 'lucide-react';

export default function BlogSection({ blogList = [] }) {
  return (
    <section id="blogs" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron-500/10 text-saffron-600 text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen className="w-4 h-4" /> Articles & Insights
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Wisdom Articles on Mind, Leadership & Values
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            Read inspiring essays on work-life harmony, digital focus, and timeless Vedic principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogList.map((blog) => (
            <div
              key={blog.id}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-saffron-600 mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{blog.created_at}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-xl mb-3 group-hover:text-saffron-600 transition-colors">
                  {blog.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  {blog.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Universal Values</span>
                <button className="text-saffron-600 hover:text-saffron-700 font-bold text-sm flex items-center gap-1">
                  Read Full Article <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
