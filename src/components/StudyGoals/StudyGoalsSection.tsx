import React, { useState } from 'react';
import {
  Target,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Calendar,
  AlertCircle,
  Tag,
  BookOpen,
} from 'lucide-react';
import { StudyGoal } from '../../types';
import { playReminderChime } from '../../utils/notificationAudio';

interface StudyGoalsProps {
  goals: StudyGoal[];
  onToggleGoal: (id: string) => void;
  onAddGoal: (goal: Omit<StudyGoal, 'id' | 'createdAt'>) => void;
  onDeleteGoal: (id: string) => void;
}

export const StudyGoalsSection: React.FC<StudyGoalsProps> = ({
  goals,
  onToggleGoal,
  onAddGoal,
  onDeleteGoal,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isAdding, setIsAdding] = useState(false);

  // New goal state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('Data Structures & Algorithms (23CS301)');
  const [deadline, setDeadline] = useState('2026-10-18T18:00');
  const [priority, setPriority] = useState<StudyGoal['priority']>('High');

  const filteredGoals = goals.filter((g) => {
    if (filter === 'pending') return !g.completed;
    if (filter === 'completed') return g.completed;
    return true;
  });

  const completedCount = goals.filter((g) => g.completed).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddGoal({
      title: title.trim(),
      description: description.trim(),
      subject,
      deadline,
      priority,
      completed: false,
    });
    setTitle('');
    setDescription('');
    setIsAdding(false);
    playReminderChime('success');
  };

  const handleToggle = (id: string) => {
    onToggleGoal(id);
    playReminderChime('gentle');
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Target className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-white tracking-tight">
                Academic Study Goals & Milestones
              </h2>
              <p className="text-xs text-slate-400">
                Track lab assignments, exam revisions, and coding objectives with deadlines
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs shadow-md shadow-teal-950/40 transition active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>{isAdding ? 'Cancel' : 'Add New Goal'}</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs & Stats Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filter === 'all'
                  ? 'bg-slate-800 text-teal-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Goals ({goals.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filter === 'pending'
                  ? 'bg-slate-800 text-amber-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              In Progress ({goals.length - completedCount})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filter === 'completed'
                  ? 'bg-slate-800 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>

          <span className="text-slate-400 font-mono text-[11px]">
            Goal Completion Rate:{' '}
            <strong className="text-teal-400">
              {goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0}%
            </strong>
          </span>
        </div>
      </div>

      {/* Add New Goal Form Drawer */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-teal-500/30 rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-3"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-teal-400" />
              Create Study Objective
            </h3>
            <span className="text-xs text-slate-400">Semester 3 Target</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 md:col-span-2">
              <label className="text-slate-400">Goal Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Implement Dijkstra’s Shortest Path Algorithm"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Subject / Course</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="Data Structures & Algorithms (23CS301)">DSA (23CS301)</option>
                <option value="OOP through Java (23CS302)">OOP through Java (23CS302)</option>
                <option value="Discrete Mathematical Structures (23BS301)">DMS (23BS301)</option>
                <option value="Digital Logic Design (23EC303)">Digital Logic Design (23EC303)</option>
                <option value="Data Structures Lab (23CS303)">DSA Lab (23CS303)</option>
                <option value="Java Programming Lab (23CS304)">Java Lab (23CS304)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="High">High Priority (Urgent)</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Target Deadline</label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-slate-400">Description & Tasks</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Specific problem sets, textbook chapters, or record book tasks..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 resize-y"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs"
            >
              Save Goal
            </button>
          </div>
        </form>
      )}

      {/* Goals Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGoals.map((goal) => {
          const isHigh = goal.priority === 'High';
          const isMed = goal.priority === 'Medium';

          return (
            <div
              key={goal.id}
              className={`rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                goal.completed
                  ? 'bg-slate-900/40 border-slate-800/80 text-slate-500'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      isHigh
                        ? 'bg-rose-950/60 text-rose-300 border-rose-800'
                        : isMed
                        ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                        : 'bg-teal-950/60 text-teal-300 border-teal-800'
                    }`}
                  >
                    {goal.priority} Priority
                  </span>

                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {new Date(goal.deadline).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3
                    className={`text-sm font-semibold ${
                      goal.completed ? 'line-through text-slate-500' : 'text-slate-100'
                    }`}
                  >
                    {goal.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {goal.description}
                  </p>

                  <p className="text-[11px] text-teal-400/90 font-mono flex items-center gap-1 pt-1">
                    <BookOpen className="w-3 h-3 text-teal-500" />
                    <span>{goal.subject}</span>
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleToggle(goal.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition ${
                    goal.completed
                      ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/60'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {goal.completed ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Completed</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-3.5 h-3.5 text-slate-500" />
                      <span>Mark Complete</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onDeleteGoal(goal.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                  title="Delete goal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
