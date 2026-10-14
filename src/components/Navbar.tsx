import React from 'react';
import {
  FileText,
  Clock,
  Briefcase,
  Target,
  BookOpen,
  Bell,
  User,
  ShieldAlert,
  Moon,
  Sun,
  RotateCcw,
} from 'lucide-react';
import { StudentProfile, ReminderConfig } from '../types';

export type ActiveTab = 'letters' | 'timetable' | 'checklist' | 'goals';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  profile: StudentProfile;
  reminders: ReminderConfig;
  onOpenReminders: () => void;
  onOpenProfile: () => void;
  onOpenSubjects: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onResetAllData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  profile,
  reminders,
  onOpenReminders,
  onOpenProfile,
  onOpenSubjects,
  isDarkMode,
  onToggleTheme,
  onResetAllData,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80">
      {/* Top institution banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950/50 to-slate-900 border-b border-teal-500/10 py-1 px-4 text-center text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          <span className="font-semibold text-slate-300">
            Narasaraopeta Engineering College (Autonomous)
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline font-mono text-[10px]">
            AI Official Letter Assistant & Student Companion
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-[10px]">
          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300/90 border border-amber-500/20 font-medium">
            Student Companion Prototype
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => onSelectTab('letters')}
            className="cursor-pointer flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-teal-500/20 group-hover:scale-105 transition">
              N
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-white tracking-tight font-sans">
                  NEC Pulse
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 font-mono">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-none">
                Autonomous Academic Suite
              </p>
            </div>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <button
            onClick={() => onSelectTab('letters')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition ${
              activeTab === 'letters'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>AI Letter Writer</span>
          </button>

          <button
            onClick={() => onSelectTab('timetable')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition ${
              activeTab === 'timetable'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Timetable</span>
          </button>

          <button
            onClick={() => onSelectTab('checklist')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition ${
              activeTab === 'checklist'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Bag Checklist</span>
          </button>

          <button
            onClick={() => onSelectTab('goals')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition ${
              activeTab === 'goals'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Study Goals</span>
          </button>
        </nav>

        {/* Right Tools (Reminders, Subjects, Profile, Theme) */}
        <div className="flex items-center gap-2">
          {/* Subjects Catalog */}
          <button
            onClick={onOpenSubjects}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium transition"
            title="View Semester 3 subjects catalog and personal notes"
          >
            <BookOpen className="w-3.5 h-3.5 text-teal-400" />
            <span>Subjects</span>
          </button>

          {/* Reminders Trigger */}
          <button
            onClick={onOpenReminders}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 text-slate-300 text-xs font-medium transition relative group"
            title="Configure night-before & morning reminders"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Reminders</span>
            <span className="text-[10px] text-teal-400 font-mono hidden md:inline">
              {reminders.nightBeforeTime}
            </span>
            {reminders.nightBeforeEnabled && (
              <span className="w-2 h-2 rounded-full bg-teal-400 absolute -top-0.5 -right-0.5" />
            )}
          </button>

          {/* Student Profile Pill */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 text-slate-200 text-xs font-medium transition"
            title="Edit student academic profile"
          >
            <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-[10px]">
              {profile.fullName.substring(0, 2).toUpperCase()}
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-[11px] font-semibold text-slate-200 leading-tight">
                {profile.fullName.split(' ')[0]}
              </p>
              <p className="text-[9px] text-slate-500 font-mono leading-none">
                {profile.studentId}
              </p>
            </div>
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition"
            title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="flex md:hidden items-center justify-around px-2 py-2 border-t border-slate-800/60 bg-slate-950 text-xs">
        <button
          onClick={() => onSelectTab('letters')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
            activeTab === 'letters' ? 'text-teal-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="text-[10px]">Letters</span>
        </button>
        <button
          onClick={() => onSelectTab('timetable')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
            activeTab === 'timetable' ? 'text-teal-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span className="text-[10px]">Timetable</span>
        </button>
        <button
          onClick={() => onSelectTab('checklist')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
            activeTab === 'checklist' ? 'text-teal-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span className="text-[10px]">Packing</span>
        </button>
        <button
          onClick={() => onSelectTab('goals')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
            activeTab === 'goals' ? 'text-teal-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Target className="w-4 h-4" />
          <span className="text-[10px]">Goals</span>
        </button>
        <button
          onClick={onOpenSubjects}
          className="flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-slate-400"
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-[10px]">Subjects</span>
        </button>
      </div>
    </header>
  );
};
