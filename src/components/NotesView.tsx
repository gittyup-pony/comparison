import React, { useState } from 'react';
import { ReviewItem } from '../types';
import { INITIAL_REVIEW_ITEMS } from '../data';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Star, 
  Download, 
  Sparkles,
  Check,
  Tag,
  FileText
} from 'lucide-react';

interface NotesViewProps {
  onExportReport: () => void;
}

export const NotesView: React.FC<NotesViewProps> = ({ onExportReport }) => {
  const [items, setItems] = useState<ReviewItem[]>(INITIAL_REVIEW_ITEMS);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for adding new feature note
  const [newCategory, setNewCategory] = useState<ReviewItem['category']>('Hero & Banner');
  const [newFeature, setNewFeature] = useState('');
  const [newV1Desc, setNewV1Desc] = useState('');
  const [newV2Desc, setNewV2Desc] = useState('');
  const [newStatus, setNewStatus] = useState<ReviewItem['status']>('Improved');
  const [newRating, setNewRating] = useState<number>(5);
  const [newNotes, setNewNotes] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeature.trim()) return;

    const newItem: ReviewItem = {
      id: `rev-${Date.now()}`,
      category: newCategory,
      feature: newFeature.trim(),
      v1Description: newV1Desc.trim() || 'Baseline implementation',
      v2Description: newV2Desc.trim() || 'Updated implementation',
      status: newStatus,
      rating: newRating,
      notes: newNotes.trim() || 'No additional notes',
    };

    setItems([newItem, ...items]);
    setShowAddModal(false);
    setNewFeature('');
    setNewV1Desc('');
    setNewV2Desc('');
    setNewNotes('');
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleRatingChange = (id: string, rating: number) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, rating } : item))
    );
  };

  const getStatusBadge = (status: ReviewItem['status']) => {
    switch (status) {
      case 'Improved':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Improved</span>;
      case 'Redesigned':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">Redesigned</span>;
      case 'Needs Work':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">Needs Work</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/30">Unchanged</span>;
    }
  };

  return (
    <div className="flex-1 bg-slate-950 p-4 md:p-6 min-h-[calc(100vh-170px)] flex flex-col items-center">
      <div className="max-w-[1400px] w-full flex flex-col gap-6">
        {/* Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Feature Comparison & Review Checklist
              </h2>
              <p className="text-xs text-slate-400">
                Log observations, rate design updates, and annotate differences between Property V1 and V2.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Review Item</span>
            </button>

            <button
              onClick={onExportReport}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Full Report</span>
            </button>
          </div>
        </div>

        {/* Review Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between gap-4 group"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 uppercase tracking-wider">
                      {item.category}
                    </span>
                    {getStatusBadge(item.status)}
                  </div>

                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 rounded-lg transition-all cursor-pointer"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Feature Title */}
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  {item.feature}
                </h3>

                {/* Side-by-side V1 vs V2 desc */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                      V1 (Original)
                    </span>
                    <p className="text-slate-300 leading-relaxed">{item.v1Description}</p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-indigo-900/50">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                      V2 (Redesign) <Sparkles className="w-3 h-3" />
                    </span>
                    <p className="text-slate-200 leading-relaxed">{item.v2Description}</p>
                  </div>
                </div>

                {/* Review Notes */}
                {item.notes && (
                  <div className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/50 flex items-start gap-2">
                    <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span>{item.notes}</span>
                  </div>
                )}
              </div>

              {/* Bottom Rating Stars */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-xs text-slate-400 font-medium">Rating Improvement:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingChange(item.id, star)}
                      className="p-0.5 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= item.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95">
              <h3 className="text-lg font-bold text-white mb-4">Add Comparison Item</h3>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="Hero & Banner">Hero & Banner</option>
                    <option value="Listing Grid">Listing Grid</option>
                    <option value="Search & Filters">Search & Filters</option>
                    <option value="Typography & Colors">Typography & Colors</option>
                    <option value="Navigation & Footer">Navigation & Footer</option>
                    <option value="Performance & UX">Performance & UX</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Feature Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Header Navigation Menu"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">V1 Behavior</label>
                    <textarea
                      placeholder="How it worked in V1"
                      value={newV1Desc}
                      onChange={(e) => setNewV1Desc(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none h-20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">V2 Behavior</label>
                    <textarea
                      placeholder="How it works in V2"
                      value={newV2Desc}
                      onChange={(e) => setNewV2Desc(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none h-20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                    >
                      <option value="Improved">Improved</option>
                      <option value="Redesigned">Redesigned</option>
                      <option value="Unchanged">Unchanged</option>
                      <option value="Needs Work">Needs Work</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Rating (1 to 5)</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={newRating}
                      onChange={(e) => setNewRating(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Review Notes</label>
                  <input
                    type="text"
                    placeholder="Additional notes..."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 cursor-pointer shadow-lg"
                  >
                    Save Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
