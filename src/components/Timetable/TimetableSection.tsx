import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  Edit2,
  Check,
  X,
  BookOpen,
  MapPin,
  UserCheck,
  Coffee,
  Sparkles,
} from 'lucide-react';
import { DaySchedule, TimetableSlot } from '../../types';

interface TimetableSectionProps {
  schedule: DaySchedule[];
  onUpdateSlot: (day: string, slotId: string, updatedSlot: Partial<TimetableSlot>) => void;
  onResetTimetable: () => void;
}

export const TimetableSection: React.FC<TimetableSectionProps> = ({
  schedule,
  onUpdateSlot,
  onResetTimetable,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [editingSlot, setEditingSlot] = useState<{ day: string; slot: TimetableSlot } | null>(null);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  // Auto-select today's day on mount
  useEffect(() => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayIndex = new Date().getDay();
    const todayName = daysOfWeek[todayIndex];
    if (todayName !== 'Sunday') {
      setSelectedDay(todayName);
    } else {
      setSelectedDay('Monday');
    }

    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const activeDaySchedule = schedule.find((s) => s.day === selectedDay) || schedule[0];

  const handleSaveEdit = () => {
    if (!editingSlot) return;
    onUpdateSlot(editingSlot.day, editingSlot.slot.id, editingSlot.slot);
    setEditingSlot(null);
  };

  return (
    <div className="space-y-6">
      {/* Header and Day Selector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Clock className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-white tracking-tight">
                  Semester 3 Class Timetable (9:10 AM – 4:00 PM)
                </h2>
                <p className="text-xs text-slate-400">
                  Daily period allocation, lab sessions, and classroom rooms. Click any slot to edit or customize.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-teal-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              Live Time: {currentTimeStr || '9:15 AM'}
            </span>
            <button
              onClick={onResetTimetable}
              className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
              title="Reset to default NEC Semester 3 schedule"
            >
              Reset Schedule
            </button>
          </div>
        </div>

        {/* Day Pills */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-slate-800">
          {schedule.map((d) => (
            <button
              key={d.day}
              onClick={() => setSelectedDay(d.day)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition ${
                selectedDay === d.day
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-950/60 font-semibold'
                  : 'bg-slate-950/60 text-slate-400 border border-slate-800/80 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {d.day}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Timeline View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeDaySchedule.slots.map((slot, index) => {
          if (slot.isBreak) {
            return (
              <div
                key={slot.id}
                className="col-span-full py-3 px-4 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 flex items-center justify-between text-xs text-slate-400"
              >
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-amber-400" />
                  <span className="font-medium text-slate-300">{slot.subjectName}</span>
                  <span className="text-slate-500">({slot.breakLabel})</span>
                </div>
                <span className="font-mono text-slate-500">
                  {slot.startTime} – {slot.endTime}
                </span>
              </div>
            );
          }

          const isLab = slot.subjectName.toLowerCase().includes('lab');

          return (
            <div
              key={slot.id}
              className={`group relative rounded-2xl p-4 transition border ${
                isLab
                  ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30 border-indigo-500/30 hover:border-indigo-400'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              } shadow-lg hover:shadow-xl flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
                  <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] font-mono text-teal-400">
                    Period {slot.periodNumber}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {slot.startTime} – {slot.endTime}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-white tracking-tight leading-snug">
                      {slot.subjectName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800/80 text-teal-300 font-mono text-[10px]">
                      {slot.subjectCode}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {slot.room}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 flex items-center gap-1 pt-1">
                    <UserCheck className="w-3 h-3 text-slate-500" />
                    <span>{slot.faculty}</span>
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">
                  {isLab ? 'Hands-on Practical' : 'Core Theory'}
                </span>
                <button
                  onClick={() => setEditingSlot({ day: selectedDay, slot: { ...slot } })}
                  className="opacity-80 group-hover:opacity-100 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                  title="Edit period details"
                >
                  <Edit2 className="w-3 h-3 text-teal-400" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Slot Modal */}
      {editingSlot && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-teal-400" />
                Edit Period {editingSlot.slot.periodNumber} ({editingSlot.day})
              </h3>
              <button
                onClick={() => setEditingSlot(null)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400">Subject Name</label>
                <input
                  type="text"
                  value={editingSlot.slot.subjectName}
                  onChange={(e) =>
                    setEditingSlot({
                      ...editingSlot,
                      slot: { ...editingSlot.slot, subjectName: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-400">Subject Code</label>
                  <input
                    type="text"
                    value={editingSlot.slot.subjectCode}
                    onChange={(e) =>
                      setEditingSlot({
                        ...editingSlot,
                        slot: { ...editingSlot.slot, subjectCode: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Room / Hall</label>
                  <input
                    type="text"
                    value={editingSlot.slot.room}
                    onChange={(e) =>
                      setEditingSlot({
                        ...editingSlot,
                        slot: { ...editingSlot.slot, room: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Faculty In-Charge</label>
                <input
                  type="text"
                  value={editingSlot.slot.faculty}
                  onChange={(e) =>
                    setEditingSlot({
                      ...editingSlot,
                      slot: { ...editingSlot.slot, faculty: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-400">Start Time</label>
                  <input
                    type="text"
                    value={editingSlot.slot.startTime}
                    onChange={(e) =>
                      setEditingSlot({
                        ...editingSlot,
                        slot: { ...editingSlot.slot, startTime: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">End Time</label>
                  <input
                    type="text"
                    value={editingSlot.slot.endTime}
                    onChange={(e) =>
                      setEditingSlot({
                        ...editingSlot,
                        slot: { ...editingSlot.slot, endTime: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingSlot(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
