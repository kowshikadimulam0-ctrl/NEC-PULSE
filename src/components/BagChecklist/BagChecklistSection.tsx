import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Briefcase,
  Book,
  FileSpreadsheet,
  Cpu,
  ShieldAlert,
} from 'lucide-react';
import { BagItem } from '../../types';
import { playReminderChime } from '../../utils/notificationAudio';

interface BagChecklistProps {
  items: BagItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (name: string, category: BagItem['category'], linkedSubject?: string) => void;
  onDeleteItem: (id: string) => void;
  onResetItems: () => void;
}

export const BagChecklistSection: React.FC<BagChecklistProps> = ({
  items,
  onToggleItem,
  onAddItem,
  onDeleteItem,
  onResetItems,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<BagItem['category']>('Notebook');
  const [newItemSubject, setNewItemSubject] = useState('');

  const packedCount = items.filter((i) => i.packed).length;
  const totalCount = items.length;
  const percentage = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  const handleToggle = (id: string) => {
    onToggleItem(id);
    playReminderChime('gentle');
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onAddItem(newItemName.trim(), newItemCategory, newItemSubject.trim() || undefined);
    setNewItemName('');
    setNewItemSubject('');
    playReminderChime('success');
  };

  const getCategoryIcon = (cat: BagItem['category']) => {
    switch (cat) {
      case 'Mandatory':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
      case 'Lab Record':
        return <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-400" />;
      case 'Textbook':
        return <Book className="w-3.5 h-3.5 text-amber-400" />;
      case 'Tool':
        return <Cpu className="w-3.5 h-3.5 text-cyan-400" />;
      default:
        return <CheckSquare className="w-3.5 h-3.5 text-teal-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Progress Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Briefcase className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-white tracking-tight">
                Daily Bag-Packing Checklist
              </h2>
              <p className="text-xs text-slate-400">
                Ensure all required textbooks, lab records, ID badge, and engineering tools are ready
              </p>
            </div>
          </div>

          <button
            onClick={onResetItems}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Checklist</span>
          </button>
        </div>

        {/* Progress Bar & Status */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-2">
              <span>Packing Readiness:</span>
              <span
                className={`font-semibold ${
                  percentage === 100
                    ? 'text-emerald-400'
                    : percentage > 50
                    ? 'text-teal-400'
                    : 'text-amber-400'
                }`}
              >
                {percentage}% Ready
              </span>
            </span>
            <span className="text-slate-500 font-mono text-[11px]">
              {packedCount} of {totalCount} essentials packed
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-800 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentage === 100
                  ? 'bg-gradient-to-r from-teal-400 to-emerald-400'
                  : 'bg-gradient-to-r from-teal-600 to-cyan-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {percentage === 100 ? (
            <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>All set for college! ID card, lab records, and stationery safely packed.</span>
            </p>
          ) : (
            <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {totalCount - packedCount} items remaining before night-time reminder cutoff.
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Main Grid: Checklist Items List & Quick Add */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Checklist items (8 cols) */}
        <div className="lg:col-span-8 space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`cursor-pointer rounded-xl p-3.5 border transition-all flex items-center justify-between select-none ${
                item.packed
                  ? 'bg-slate-900/40 border-slate-800/80 text-slate-500'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="p-1 rounded text-teal-400 hover:text-teal-300 transition"
                >
                  {item.packed ? (
                    <CheckSquare className="w-5 h-5 text-teal-400" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-600" />
                  )}
                </button>

                <div>
                  <p
                    className={`text-sm font-medium ${
                      item.packed ? 'line-through text-slate-500' : 'text-slate-200'
                    }`}
                  >
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      {getCategoryIcon(item.category)}
                      <span>{item.category}</span>
                    </span>
                    {item.linkedSubject && (
                      <>
                        <span>•</span>
                        <span className="text-teal-400/80 font-mono text-[11px]">
                          {item.linkedSubject}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteItem(item.id);
                }}
                className="opacity-40 hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-400 transition"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Quick Add Custom Item (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Plus className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-semibold text-white">Add Custom Item</h3>
          </div>

          <form onSubmit={handleAdd} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400">Item Name</label>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="e.g. Workshop Tool Kit, Drawing Board"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Category</label>
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-teal-500"
              >
                <option value="Mandatory">Mandatory / ID</option>
                <option value="Lab Record">Lab Record Book</option>
                <option value="Textbook">Textbook / Reference</option>
                <option value="Notebook">Lecture Notebook</option>
                <option value="Tool">Engineering Tool / Calculator</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Subject / Module (Optional)</label>
              <input
                type="text"
                value={newItemSubject}
                onChange={(e) => setNewItemSubject(e.target.value)}
                placeholder="e.g. Data Structures Lab"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-teal-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Packing List</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
