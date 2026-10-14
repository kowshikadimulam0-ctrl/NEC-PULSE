import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Mail,
  Phone,
  Building2,
  X,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { StudentProfile } from '../../types';
import { DEFAULT_PROFILE } from '../../data/mockData';
import { playReminderChime } from '../../utils/notificationAudio';

interface ProfileModalProps {
  profile: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (profile: StudentProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSaveProfile,
}) => {
  const [current, setCurrent] = useState<StudentProfile>(profile);

  if (!isOpen) return null;

  const handleFillDemo = () => {
    setCurrent(DEFAULT_PROFILE);
    playReminderChime('gentle');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(current);
    playReminderChime('success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <User className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight">
                Student Academic Profile & Credentials
              </h3>
              <p className="text-xs text-slate-400">
                Official institutional identification used across letterheads and schedules
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

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-400">Full Name</label>
              <input
                type="text"
                required
                value={current.fullName}
                onChange={(e) => setCurrent({ ...current, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Student Roll / ID Number</label>
              <input
                type="text"
                required
                value={current.studentId}
                onChange={(e) => setCurrent({ ...current, studentId: e.target.value })}
                placeholder="e.g. 23471A0589"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-400">College Email</label>
              <input
                type="email"
                required
                value={current.email}
                onChange={(e) => setCurrent({ ...current, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Phone Number</label>
              <input
                type="tel"
                value={current.phone}
                onChange={(e) => setCurrent({ ...current, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-teal-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400">College / Institution</label>
            <input
              type="text"
              required
              value={current.collegeName}
              onChange={(e) => setCurrent({ ...current, collegeName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-slate-400">Branch & Engineering Discipline</label>
              <select
                value={current.branch}
                onChange={(e) => setCurrent({ ...current, branch: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-teal-500"
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering (CSE)</option>
                <option value="Artificial Intelligence & Data Science">AI & Data Science (AI&DS)</option>
                <option value="Electronics & Communication Engineering">Electronics & Communication (ECE)</option>
                <option value="Information Technology">Information Technology (IT)</option>
                <option value="Electrical & Electronics Engineering">Electrical & Electronics (EEE)</option>
                <option value="Mechanical Engineering">Mechanical Engineering (MECH)</option>
                <option value="Civil Engineering">Civil Engineering (CIVIL)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Section</label>
              <select
                value={current.section}
                onChange={(e) => setCurrent({ ...current, section: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-teal-500"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
                <option value="D">Section D</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-400">Academic Year</label>
              <select
                value={current.year}
                onChange={(e) => setCurrent({ ...current, year: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value={1}>Year 1</option>
                <option value={2}>Year 2 (Sophomore)</option>
                <option value={3}>Year 3 (Junior)</option>
                <option value={4}>Year 4 (Final Year)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Semester</label>
              <select
                value={current.semester}
                onChange={(e) => setCurrent({ ...current, semester: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value={1}>Semester 1</option>
                <option value={2}>Semester 2</option>
                <option value={3}>Semester 3 (Current Curriculum)</option>
                <option value={4}>Semester 4</option>
                <option value={5}>Semester 5</option>
                <option value={6}>Semester 6</option>
                <option value={7}>Semester 7</option>
                <option value={8}>Semester 8</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleFillDemo}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Load Sample Student</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs shadow-md shadow-teal-950/40 flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Profile</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
