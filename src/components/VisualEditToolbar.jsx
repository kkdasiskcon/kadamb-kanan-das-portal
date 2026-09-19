import React from 'react';
import { Edit3, Save, RefreshCw, CheckCircle2, Lock, Eye } from 'lucide-react';

export default function VisualEditToolbar({
  isEditMode,
  onToggleEditMode,
  onSave,
  onReset,
  hasUnsaved,
  saveSuccess
}) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-full shadow-2xl border border-slate-700/80 flex items-center gap-4 text-xs font-semibold">
        
        {/* Status indicator */}
        <div className="flex items-center gap-2 pr-2 border-r border-slate-700">
          <div className={`w-2.5 h-2.5 rounded-full ${isEditMode ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
          <span className="font-bold tracking-wide">
            {isEditMode ? 'Visual Editor Mode' : 'Live Website View'}
          </span>
        </div>

        {/* Toggle Mode Switch */}
        <button
          onClick={onToggleEditMode}
          className={`px-3.5 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 ${
            isEditMode
              ? 'gradient-saffron text-white shadow-lg scale-105'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
        >
          {isEditMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{isEditMode ? 'Editing Active (Click text)' : 'Enable Visual Editor'}</span>
        </button>

        {/* Save Changes Button */}
        {isEditMode && (
          <button
            onClick={onSave}
            className={`px-4 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 ${
              hasUnsaved
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg animate-bounce'
                : 'bg-emerald-600 text-white opacity-90'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save All Visual Changes</span>
          </button>
        )}

        {/* Reset Button */}
        {isEditMode && (
          <button
            onClick={onReset}
            className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-red-600/80 text-slate-300 hover:text-white transition-all flex items-center gap-1 text-[11px]"
            title="Reset all visual text edits to defaults"
          >
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        )}

        {/* Save success toast banner inside bar */}
        {saveSuccess && (
          <div className="flex items-center gap-1 text-emerald-400 font-bold animate-fade-in pl-2 border-l border-slate-700">
            <CheckCircle2 className="w-4 h-4" /> Saved Live!
          </div>
        )}

      </div>
    </div>
  );
}
