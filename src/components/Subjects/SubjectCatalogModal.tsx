import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  X,
  UserCheck,
  Award,
  MapPin,
  FileText,
  Sparkles,
  Edit2,
  Check,
} from 'lucide-react';
import { SubjectItem } from '../../types';

interface SubjectCatalogModalProps {
  subjects: SubjectItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateNotes: (subjectId: string, notes: string) => void;
}

export const SubjectCatalogModal: React.FC<SubjectCatalogModalProps> = ({
  subjects,
  isOpen,
  onClose,
  onUpdateNotes,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedNote, setEditedNote] = useState('');

  if (!isOpen) return null;

  const filtered = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.faculty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startEdit = (s: SubjectItem) => {
    setEditingId(s.id);
    setEditedNote(s.notes);
  };

  const saveEdit = (id: string) => {
    onUpdateNotes(id, editedNote);
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight">
                NEC Semester 3 Curriculum & Faculty Catalog
              </h3>
              <p className="text-xs text-slate-400">
                Official course syllabus, allocated credits, and student personal notes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by subject name, code, or professor..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Subjects List Scrollable */}
        <div className="overflow-y-auto space-y-3 pr-1 text-xs">
          {filtered.map((sub) => (
            <div
              key={sub.id}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 space-y-3 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-teal-950/80 border border-teal-800 text-teal-300 font-mono text-[10px]">
                      {sub.code}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {sub.type}
                    </span>
                    <span className="text-[11px] text-amber-400 font-mono flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {sub.credits} Credits
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-100">{sub.name}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                    <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                    <span>{sub.faculty}</span>
                    <span className="text-slate-600">•</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3 h-3" />
                      {sub.room}
                    </span>
                  </p>
                </div>
              </div>

              {/* Syllabus Highlights */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {sub.syllabusHighlights.map((topic, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              {/* Personal Notes / Reminders */}
              <div className="pt-2 border-t border-slate-800/80">
                {editingId === sub.id ? (
                  <div className="space-y-2">
                    <textarea
                      rows={2}
                      value={editedNote}
                      onChange={(e) => setEditedNote(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-teal-500/50 rounded-lg text-slate-200 text-xs focus:outline-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-1 text-slate-400 hover:text-slate-200 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEdit(sub.id)}
                        className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Save Note</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2 text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/50">
                    <div className="flex items-start gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                      <p className="text-[11px] leading-relaxed text-slate-300 italic">
                        "{sub.notes || 'No personal notes added yet.'}"
                      </p>
                    </div>
                    <button
                      onClick={() => startEdit(sub)}
                      className="text-slate-500 hover:text-teal-300 shrink-0 p-1"
                      title="Edit note"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
