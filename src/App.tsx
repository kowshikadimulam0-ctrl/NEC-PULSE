import React, { useState, useEffect } from 'react';
import {
  StudentProfile,
  DaySchedule,
  StudyGoal,
  BagItem,
  ReminderConfig,
  SubjectItem,
} from './types';
import {
  DEFAULT_PROFILE,
  SEMESTER_3_SUBJECTS,
  INITIAL_TIMETABLE,
  INITIAL_STUDY_GOALS,
  INITIAL_BAG_ITEMS,
  INITIAL_REMINDERS,
} from './data/mockData';
import { Navbar, ActiveTab } from './components/Navbar';
import { ThreeDStudentCompanion } from './components/ThreeDStudentCompanion';
import { LetterWriterView } from './components/LetterWriter/LetterWriterView';
import { TimetableSection } from './components/Timetable/TimetableSection';
import { BagChecklistSection } from './components/BagChecklist/BagChecklistSection';
import { StudyGoalsSection } from './components/StudyGoals/StudyGoalsSection';
import { ReminderSettingsModal } from './components/Reminders/ReminderSettingsModal';
import { ProfileModal } from './components/Profile/ProfileModal';
import { SubjectCatalogModal } from './components/Subjects/SubjectCatalogModal';
import { playReminderChime } from './utils/notificationAudio';
import {
  FileText,
  Clock,
  Briefcase,
  Target,
  Bell,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  BookOpen,
  Calendar,
} from 'lucide-react';

export default function App() {
  // 1. Persistent State
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('nec_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [timetable, setTimetable] = useState<DaySchedule[]>(() => {
    const saved = localStorage.getItem('nec_timetable');
    return saved ? JSON.parse(saved) : INITIAL_TIMETABLE;
  });

  const [bagItems, setBagItems] = useState<BagItem[]>(() => {
    const saved = localStorage.getItem('nec_bag_items');
    return saved ? JSON.parse(saved) : INITIAL_BAG_ITEMS;
  });

  const [studyGoals, setStudyGoals] = useState<StudyGoal[]>(() => {
    const saved = localStorage.getItem('nec_study_goals');
    return saved ? JSON.parse(saved) : INITIAL_STUDY_GOALS;
  });

  const [reminders, setReminders] = useState<ReminderConfig>(() => {
    const saved = localStorage.getItem('nec_reminders');
    return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
  });

  const [subjects, setSubjects] = useState<SubjectItem[]>(() => {
    const saved = localStorage.getItem('nec_subjects');
    return saved ? JSON.parse(saved) : SEMESTER_3_SUBJECTS;
  });

  // UI State
  const [activeTab, setActiveTab] = useState<ActiveTab>('letters');
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSubjectsOpen, setIsSubjectsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('nec_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('nec_timetable', JSON.stringify(timetable));
  }, [timetable]);

  useEffect(() => {
    localStorage.setItem('nec_bag_items', JSON.stringify(bagItems));
  }, [bagItems]);

  useEffect(() => {
    localStorage.setItem('nec_study_goals', JSON.stringify(studyGoals));
  }, [studyGoals]);

  useEffect(() => {
    localStorage.setItem('nec_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('nec_subjects', JSON.stringify(subjects));
  }, [subjects]);

  // Periodic Reminder Checker
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeFormatted = `${currentHours}:${currentMinutes}`;

      // Check night-before reminder
      if (reminders.nightBeforeEnabled && currentTimeFormatted === reminders.nightBeforeTime) {
        const lastFired = sessionStorage.getItem('last_night_fired');
        if (lastFired !== currentTimeFormatted) {
          sessionStorage.setItem('last_night_fired', currentTimeFormatted);
          if (reminders.soundEnabled) playReminderChime('alert');
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('NEC Pulse • Evening Bag Packing Reminder', {
              body: 'Time to prepare! Check your Semester 3 timetable and pack required books & ID card for tomorrow.',
            });
          }
        }
      }

      // Check morning readiness reminder
      if (reminders.morningEnabled && currentTimeFormatted === reminders.morningTime) {
        const lastFired = sessionStorage.getItem('last_morning_fired');
        if (lastFired !== currentTimeFormatted) {
          sessionStorage.setItem('last_morning_fired', currentTimeFormatted);
          if (reminders.soundEnabled) playReminderChime('alert');
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('NEC Pulse • Morning College Readiness Alert', {
              body: 'College begins at 9:10 AM. Final check: Identity Card, bus pass, and lab record!',
            });
          }
        }
      }
    };

    const interval = setInterval(checkReminders, 15000); // Check every 15s
    return () => clearInterval(interval);
  }, [reminders]);

  // Handlers
  const handleUpdateSlot = (day: string, slotId: string, updated: any) => {
    setTimetable((prev) =>
      prev.map((d) => {
        if (d.day === day) {
          return {
            ...d,
            slots: d.slots.map((s) => (s.id === slotId ? { ...s, ...updated } : s)),
          };
        }
        return d;
      })
    );
  };

  const handleResetTimetable = () => {
    setTimetable(INITIAL_TIMETABLE);
    playReminderChime('gentle');
  };

  const handleToggleBagItem = (id: string) => {
    setBagItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, packed: !item.packed } : item))
    );
  };

  const handleAddBagItem = (name: string, category: any, linkedSubject?: string) => {
    const newItem: BagItem = {
      id: `bag-${Date.now()}`,
      name,
      category,
      linkedSubject,
      requiredForDay: 'All',
      packed: false,
    };
    setBagItems((prev) => [newItem, ...prev]);
  };

  const handleDeleteBagItem = (id: string) => {
    setBagItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleResetBagItems = () => {
    setBagItems(INITIAL_BAG_ITEMS);
    playReminderChime('gentle');
  };

  const handleToggleGoal = (id: string) => {
    setStudyGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  const handleAddGoal = (goalData: any) => {
    const newGoal: StudyGoal = {
      ...goalData,
      id: `goal-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setStudyGoals((prev) => [newGoal, ...prev]);
  };

  const handleDeleteGoal = (id: string) => {
    setStudyGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const handleUpdateSubjectNotes = (subjectId: string, notes: string) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === subjectId ? { ...s, notes } : s))
    );
  };

  const handleResetAllData = () => {
    if (confirm('Reset all demo student data, customized timetable, and packing list back to defaults?')) {
      localStorage.clear();
      setProfile(DEFAULT_PROFILE);
      setTimetable(INITIAL_TIMETABLE);
      setBagItems(INITIAL_BAG_ITEMS);
      setStudyGoals(INITIAL_STUDY_GOALS);
      setReminders(INITIAL_REMINDERS);
      setSubjects(SEMESTER_3_SUBJECTS);
      playReminderChime('gentle');
    }
  };

  // Stats calculation
  const packedPercent =
    bagItems.length > 0
      ? Math.round((bagItems.filter((i) => i.packed).length / bagItems.length) * 100)
      : 0;

  const pendingGoalsCount = studyGoals.filter((g) => !g.completed).length;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0B1120] text-slate-100' : 'bg-slate-50 text-slate-900'} flex flex-col font-sans transition-colors duration-200`}>
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        profile={profile}
        reminders={reminders}
        onOpenReminders={() => setIsRemindersOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSubjects={() => setIsSubjectsOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onResetAllData={handleResetAllData}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Hero Banner with Student Overview & 3D Knowledge Tome */}
        <section className="rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Column: Greeting, College Details & Quick Stats (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>NEC Autonomous • Semester 3</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Roll No: <strong className="text-slate-200">{profile.studentId}</strong>
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                  Welcome, {profile.fullName.split(' ')[0]}
                </h1>
                <p className="text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                  Your academic portal for drafting official institutional letters, tracking daily lectures (9:10 AM – 4:00 PM), and managing next-day bag packing.
                </p>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div
                  onClick={() => setActiveTab('timetable')}
                  className="cursor-pointer p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-teal-500/40 transition group"
                >
                  <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-teal-400" />
                    <span>Daily Schedule</span>
                  </p>
                  <p className="text-sm font-semibold text-white mt-1 group-hover:text-teal-300 transition">
                    9:10 AM – 4:00 PM
                  </p>
                  <span className="text-[10px] text-slate-500">7 Periods + 2 Breaks</span>
                </div>

                <div
                  onClick={() => setActiveTab('checklist')}
                  className="cursor-pointer p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-teal-500/40 transition group"
                >
                  <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-cyan-400" />
                    <span>Bag Readiness</span>
                  </p>
                  <p className="text-sm font-semibold text-teal-300 mt-1">
                    {packedPercent}% Packed
                  </p>
                  <span className="text-[10px] text-slate-500">
                    {bagItems.filter((i) => i.packed).length}/{bagItems.length} items ready
                  </span>
                </div>

                <div
                  onClick={() => setActiveTab('goals')}
                  className="cursor-pointer p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-teal-500/40 transition group"
                >
                  <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Target className="w-3 h-3 text-amber-400" />
                    <span>Study Targets</span>
                  </p>
                  <p className="text-sm font-semibold text-amber-300 mt-1">
                    {pendingGoalsCount} Pending
                  </p>
                  <span className="text-[10px] text-slate-500">
                    {studyGoals.length - pendingGoalsCount} completed
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => setActiveTab('letters')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shadow-md active:scale-[0.98] ${
                    activeTab === 'letters'
                      ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-950/50'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Compose Official Letter</span>
                </button>

                <button
                  onClick={() => setIsRemindersOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium transition"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  <span>Configure Night & Morning Alerts</span>
                </button>
              </div>
            </div>

            {/* Right Column: Subtle 3D Academic Tome (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center pt-4 lg:pt-0">
              <ThreeDStudentCompanion />
              <p className="text-[11px] text-slate-400 font-medium text-center mt-2 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Drag to inspect 3D NEC Knowledge Tome</span>
              </p>
            </div>
          </div>
        </section>

        {/* Tab Content Display */}
        {activeTab === 'letters' && <LetterWriterView profile={profile} />}

        {activeTab === 'timetable' && (
          <TimetableSection
            schedule={timetable}
            onUpdateSlot={handleUpdateSlot}
            onResetTimetable={handleResetTimetable}
          />
        )}

        {activeTab === 'checklist' && (
          <BagChecklistSection
            items={bagItems}
            onToggleItem={handleToggleBagItem}
            onAddItem={handleAddBagItem}
            onDeleteItem={handleDeleteBagItem}
            onResetItems={handleResetBagItems}
          />
        )}

        {activeTab === 'goals' && (
          <StudyGoalsSection
            goals={studyGoals}
            onToggleGoal={handleToggleGoal}
            onAddGoal={handleAddGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-800/80 bg-slate-950/80 py-8 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <p className="font-semibold text-slate-300">
              NEC Pulse • Narasaraopeta Engineering College (Autonomous)
            </p>
            <p className="text-[11px] text-slate-500">
              Official Academic Letter Writing Assistant, Grievance Cell, and Student Companion Suite.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button
              onClick={() => setIsSubjectsOpen(true)}
              className="hover:text-teal-400 transition"
            >
              Semester 3 Curriculum
            </button>
            <span>•</span>
            <button
              onClick={() => setIsProfileOpen(true)}
              className="hover:text-teal-400 transition"
            >
              Student Credentials
            </button>
            <span>•</span>
            <button
              onClick={handleResetAllData}
              className="hover:text-rose-400 flex items-center gap-1 transition"
              title="Clear locally cached demo values"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ReminderSettingsModal
        config={reminders}
        isOpen={isRemindersOpen}
        onClose={() => setIsRemindersOpen(false)}
        onSaveConfig={(cfg) => setReminders(cfg)}
      />

      <ProfileModal
        profile={profile}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onSaveProfile={(p) => setProfile(p)}
      />

      <SubjectCatalogModal
        subjects={subjects}
        isOpen={isSubjectsOpen}
        onClose={() => setIsSubjectsOpen(false)}
        onUpdateNotes={handleUpdateSubjectNotes}
      />
    </div>
  );
}
