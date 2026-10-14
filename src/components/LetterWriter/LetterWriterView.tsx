import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Copy,
  Printer,
  Sparkles,
  RefreshCw,
  Check,
  AlertCircle,
  MessageSquareWarning,
  GraduationCap,
  CalendarDays,
  Edit3,
  SlidersHorizontal,
  ChevronDown,
  Building,
  User,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { LetterCategory, LetterFormData, StudentProfile } from '../../types';
import {
  LETTER_TEMPLATE_OPTIONS,
  PredefinedTemplateOption,
  generateLocalInstitutionalLetter,
} from '../../utils/letterTemplates';
import { playReminderChime } from '../../utils/notificationAudio';

interface LetterWriterProps {
  profile: StudentProfile;
}

export const LetterWriterView: React.FC<LetterWriterProps> = ({ profile }) => {
  // Category selection: 1) Complaint Box, 2) Teacher's Feedback, 3) Various Types of Leave Letters
  const [selectedCategory, setSelectedCategory] = useState<LetterCategory>('leave');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('leave-medical');

  // Form State
  const [formData, setFormData] = useState<LetterFormData>({
    category: 'leave',
    subType: 'Medical Leave',
    recipientTitle: 'The Head of Department',
    recipientDepartment: 'Department of Computer Science & Engineering',
    subjectLine: 'Application for 4 days Medical Leave on grounds of viral illness and recuperation',
    urgency: 'Normal',
    tone: 'Formal & Respectful',
    dateRange: 'October 15, 2026 to October 18, 2026',
    reason:
      'I have been diagnosed with acute viral bronchitis and severe pyrexia. The consulting medical practitioner has advised strict bed rest and isolation from October 15, 2026 to October 18, 2026 to facilitate recovery and prevent contagion.',
    customNotes:
      'I assure you that I will consult my peers to complete all missed laboratory experiments and lecture notes immediately upon resuming classes.',
    enclosures: 'Medical Practitioner’s Prescription, Clinical Lab Blood Report, and Fitness Undertaking upon joining.',

    // Category specifics
    leaveType: 'Medical',
    leaveStartDate: '2026-10-15',
    leaveEndDate: '2026-10-18',
    totalDays: 4,
    medicalDoctorOrEventOrg: 'Dr. R. K. Varma, MBBS (General Physician, City Clinic)',
    parentContact: '+91 94401 23456',

    complaintNature: '',
    locationOrFacility: '',
    previousAttemptsToResolve: '',

    teacherName: '',
    courseName: '',
    feedbackTopic: '',
    feedbackRating: '4 - Very Good with Suggestions',
  });

  // Generated letter output text & canvas editable mode
  const [letterOutput, setLetterOutput] = useState<string>('');
  const [isEditingCanvas, setIsEditingCanvas] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [aiSourceBadge, setAiSourceBadge] = useState<'gemini_ai' | 'local_engine' | 'custom'>('local_engine');
  const [refNumber, setRefNumber] = useState<string>('');

  // Print ref
  const letterPrintRef = useRef<HTMLDivElement>(null);

  // Initialize reference number on mount
  useEffect(() => {
    setRefNumber(
      `NEC/AUTO/${profile.branch.substring(0, 3).toUpperCase()}/${new Date().getFullYear()}/REF-${Math.floor(
        1000 + Math.random() * 9000
      )}`
    );
  }, [profile.branch]);

  // Sync category change with matching templates
  const handleCategoryChange = (category: LetterCategory) => {
    setSelectedCategory(category);
    const available = LETTER_TEMPLATE_OPTIONS.filter((t) => t.category === category);
    if (available.length > 0) {
      applyTemplate(available[0]);
    }
  };

  const applyTemplate = (tpl: PredefinedTemplateOption) => {
    setSelectedTemplateId(tpl.id);
    setSelectedCategory(tpl.category);

    const updated: LetterFormData = {
      ...formData,
      category: tpl.category,
      subType: tpl.subType,
      recipientTitle: tpl.recipientTitle,
      recipientDepartment: tpl.recipientDepartment,
      subjectLine: tpl.subjectDefault,
      reason: tpl.reasonDefault,
      customNotes: tpl.customNotesDefault,
      enclosures: tpl.enclosuresDefault,
    };

    if (tpl.category === 'leave') {
      if (tpl.id === 'leave-medical') {
        updated.leaveType = 'Medical';
        updated.leaveStartDate = '2026-10-15';
        updated.leaveEndDate = '2026-10-18';
        updated.dateRange = 'October 15, 2026 to October 18, 2026';
        updated.totalDays = 4;
        updated.medicalDoctorOrEventOrg = 'Dr. R. K. Varma, MBBS (General Physician)';
      } else if (tpl.id === 'leave-od') {
        updated.leaveType = 'On-Duty (OD)';
        updated.leaveStartDate = '2026-10-22';
        updated.leaveEndDate = '2026-10-24';
        updated.dateRange = 'October 22, 2026 to October 24, 2026';
        updated.totalDays = 3;
        updated.medicalDoctorOrEventOrg = 'Smart India Hackathon 2026 / IIT Hyderabad Organizing Committee';
      } else if (tpl.id === 'leave-emergency') {
        updated.leaveType = 'Emergency Personal';
        updated.leaveStartDate = '2026-10-16';
        updated.leaveEndDate = '2026-10-17';
        updated.dateRange = 'October 16, 2026 to October 17, 2026';
        updated.totalDays = 2;
      }
    } else if (tpl.category === 'complaint') {
      if (tpl.id === 'comp-hostel') {
        updated.complaintNature = 'Drinking Water Quality & Mess Food Hygiene';
        updated.locationOrFacility = 'Kaveri Hostel Block-B (2nd Floor RO Plant)';
        updated.previousAttemptsToResolve = 'Verbally reported to assistant warden 2 days ago';
      } else if (tpl.id === 'comp-lab') {
        updated.complaintNature = 'Hardware / Network Crash during Lab Exam';
        updated.locationOrFacility = 'Computer Lab 3 (Turing Hall, Systems 12-20)';
        updated.previousAttemptsToResolve = 'Notified lab assistant during Monday lab period';
      } else if (tpl.id === 'comp-transport') {
        updated.complaintNature = 'Bus Delay & Overcrowding';
        updated.locationOrFacility = 'College Bus Route No. 14 (Guntur route)';
      }
    } else if (tpl.category === 'feedback') {
      if (tpl.id === 'feed-pace') {
        updated.teacherName = 'Dr. K. Srinivas Rao, Professor (CSE)';
        updated.courseName = 'Data Structures & Algorithms (23CS301)';
        updated.feedbackTopic = 'Lecture Speed & Inclusion of Practical Coding Exercises';
      } else if (tpl.id === 'feed-lab') {
        updated.teacherName = 'Mrs. P. Lakshmi, Assoc. Professor';
        updated.courseName = 'Java Programming Laboratory (23CS304)';
        updated.feedbackTopic = 'Step-by-step Whiteboard Debugging before Lab Starts';
      } else if (tpl.id === 'feed-appreciation') {
        updated.teacherName = 'Dr. M. Venkateswarlu, Dept of BS&H';
        updated.courseName = 'Discrete Mathematical Structures (23BS301)';
        updated.feedbackTopic = 'Special Evening Doubt Sessions Recognition';
      }
    }

    setFormData(updated);
    const local = generateLocalInstitutionalLetter(updated, profile);
    setLetterOutput(local);
    setAiSourceBadge('local_engine');
  };

  // Generate initial letter on mount
  useEffect(() => {
    const initialText = generateLocalInstitutionalLetter(formData, profile);
    setLetterOutput(initialText);
  }, []);

  // Update dates if leave range changes
  const handleDateChange = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    let days = 1;
    if (!isNaN(s.getTime()) && !isNaN(e.getTime())) {
      const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      days = diff > 0 ? diff : 1;
    }
    const formattedRange = `${start || 'Start Date'} to ${end || 'End Date'} (${days} ${days === 1 ? 'day' : 'days'})`;
    const updated = {
      ...formData,
      leaveStartDate: start,
      leaveEndDate: end,
      totalDays: days,
      dateRange: formattedRange,
    };
    setFormData(updated);
    setLetterOutput(generateLocalInstitutionalLetter(updated, profile));
  };

  // Generate with AI (calls /api/letter/generate)
  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setGenerationStep('Connecting to Academic Registrar Engine...');

    try {
      setTimeout(() => {
        setGenerationStep('Formatting institutional letterhead & reference code...');
      }, 600);

      setTimeout(() => {
        setGenerationStep('Applying formal tone & academic administrative protocols...');
      }, 1200);

      const res = await fetch('/api/letter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: formData.category,
          subCategory: formData.subType,
          studentName: profile.fullName,
          rollNumber: profile.studentId,
          collegeName: profile.collegeName,
          branch: profile.branch,
          yearSemester: `Year ${profile.year}, Semester ${profile.semester}`,
          section: profile.section,
          recipientTitle: formData.recipientTitle,
          recipientDepartment: formData.recipientDepartment,
          subject: formData.subjectLine,
          contextDetails: {
            reason: formData.reason,
            urgency: formData.urgency,
            enclosures: formData.enclosures,
            leaveType: formData.leaveType,
            dateRange: formData.dateRange,
            doctorOrEvent: formData.medicalDoctorOrEventOrg,
            parentContact: formData.parentContact,
            complaintNature: formData.complaintNature,
            location: formData.locationOrFacility,
            teacherName: formData.teacherName,
            courseName: formData.courseName,
          },
          customNotes: formData.customNotes,
          tone: formData.tone,
          dateRange: formData.dateRange,
        }),
      });

      const data = await res.json();
      if (data.letter && data.letter.trim().length > 50) {
        setLetterOutput(data.letter);
        setAiSourceBadge('gemini_ai');
      } else {
        // High-quality deterministic institutional generator
        const local = generateLocalInstitutionalLetter(formData, profile);
        setLetterOutput(local);
        setAiSourceBadge('local_engine');
      }
      playReminderChime('success');
    } catch (err) {
      console.error('Error generating letter:', err);
      const local = generateLocalInstitutionalLetter(formData, profile);
      setLetterOutput(local);
      setAiSourceBadge('local_engine');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // AI Polish / Enhance
  const handleEnhanceAI = async () => {
    if (!letterOutput.trim()) return;
    setIsGenerating(true);
    setGenerationStep('Polishing vocabulary and ensuring administrative precision...');

    try {
      const res = await fetch('/api/letter/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalContent: letterOutput,
          instruction: `Refine this official letter for ${profile.collegeName}. Enhance grammatical precision, professional phrasing, and ensure all formal sections remain intact. Requested tone: ${formData.tone}`,
        }),
      });
      const data = await res.json();
      if (data.enhanced) {
        setLetterOutput(data.enhanced);
        setAiSourceBadge('gemini_ai');
      }
      playReminderChime('success');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(letterOutput);
      setCopied(true);
      playReminderChime('gentle');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Clipboard write error', err);
    }
  };

  // Print / PDF download trigger
  const handlePrint = () => {
    window.print();
  };

  // Filter templates for current category
  const currentTemplates = LETTER_TEMPLATE_OPTIONS.filter((t) => t.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Category Navigation Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <FileText className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-white tracking-tight">
                  AI Official Letter Writing Assistant
                </h2>
                <p className="text-xs text-slate-400">
                  Compose university-grade letters with formal letterheads, ref codes, and academic protocols
                </p>
              </div>
            </div>
          </div>

          {/* 3 Categories Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl">
            <button
              onClick={() => handleCategoryChange('leave')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === 'leave'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-900/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Leave Letters</span>
            </button>

            <button
              onClick={() => handleCategoryChange('complaint')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === 'complaint'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-900/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <MessageSquareWarning className="w-3.5 h-3.5" />
              <span>Complaint Box</span>
            </button>

            <button
              onClick={() => handleCategoryChange('feedback')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === 'feedback'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Teacher's Feedback</span>
            </button>
          </div>
        </div>

        {/* Template Quick Selection Carousel / Chips */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-thin">
          <span className="text-slate-400 font-medium whitespace-nowrap flex items-center gap-1 pl-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Quick Presets:
          </span>
          {currentTemplates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => applyTemplate(tpl)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg border text-xs transition ${
                selectedTemplateId === tpl.id
                  ? 'bg-slate-800 text-teal-300 border-teal-500/40 shadow-sm'
                  : 'bg-slate-950/50 text-slate-400 border-slate-800 hover:text-slate-300 hover:border-slate-700'
              }`}
            >
              {tpl.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Input Controls on Left, Preview Canvas on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Context-Specific Input Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-semibold text-white">Context Input Controls</h3>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {formData.subType}
              </span>
            </div>

            {/* Student Details Auto-Filled Indicator */}
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <User className="w-3.5 h-3.5 text-teal-400" />
                <span className="font-medium">{profile.fullName}</span>
                <span className="text-slate-500">({profile.studentId})</span>
              </div>
              <span className="text-[11px] text-teal-400/90 font-mono">
                {profile.branch.split(' ')[0]} • Sem {profile.semester}
              </span>
            </div>

            {/* Recipient Targeting */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Addressing To (Recipient Designation)</label>
              <input
                type="text"
                value={formData.recipientTitle}
                onChange={(e) => setFormData({ ...formData, recipientTitle: e.target.value })}
                placeholder="e.g. The Head of Department / The Principal"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Department / Cell</label>
              <input
                type="text"
                value={formData.recipientDepartment}
                onChange={(e) => setFormData({ ...formData, recipientDepartment: e.target.value })}
                placeholder="e.g. Department of Computer Science & Engineering"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
              />
            </div>

            {/* Subject Line */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Formal Subject Line</label>
              <input
                type="text"
                value={formData.subjectLine}
                onChange={(e) => setFormData({ ...formData, subjectLine: e.target.value })}
                placeholder="Subject of the letter"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
              />
            </div>

            {/* --- CATEGORY SPECIFIC INPUTS --- */}

            {/* 1. LEAVE SPECIFICS */}
            {selectedCategory === 'leave' && (
              <div className="p-3 rounded-xl bg-teal-950/20 border border-teal-500/20 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-300">
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>Leave Schedule & Details</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">Start Date</label>
                    <input
                      type="date"
                      value={formData.leaveStartDate || ''}
                      onChange={(e) => handleDateChange(e.target.value, formData.leaveEndDate || e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-teal-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">End Date</label>
                    <input
                      type="date"
                      value={formData.leaveEndDate || ''}
                      onChange={(e) => handleDateChange(formData.leaveStartDate || e.target.value, e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">Total Working Days</label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={formData.totalDays || 1}
                      onChange={(e) => setFormData({ ...formData, totalDays: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">Leave Type</label>
                    <select
                      value={formData.leaveType || 'Medical'}
                      onChange={(e) => setFormData({ ...formData, leaveType: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                    >
                      <option value="Medical">Medical Leave</option>
                      <option value="On-Duty (OD)">On-Duty (OD) Event</option>
                      <option value="Emergency Personal">Emergency Personal</option>
                      <option value="Hostel Outing">Hostel Night Outpass</option>
                      <option value="Fee Extension">Fee Extension Request</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Doctor / Organization / Event Authority</label>
                  <input
                    type="text"
                    value={formData.medicalDoctorOrEventOrg || ''}
                    onChange={(e) => setFormData({ ...formData, medicalDoctorOrEventOrg: e.target.value })}
                    placeholder="e.g. Dr. R. K. Varma / Smart India Hackathon Team"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Parent / Guardian Phone</label>
                  <input
                    type="tel"
                    value={formData.parentContact || ''}
                    onChange={(e) => setFormData({ ...formData, parentContact: e.target.value })}
                    placeholder="+91 94401 XXXXX"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-600"
                  />
                </div>
              </div>
            )}

            {/* 2. COMPLAINT SPECIFICS */}
            {selectedCategory === 'complaint' && (
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-300">
                  <MessageSquareWarning className="w-3.5 h-3.5" />
                  <span>Grievance Particulars</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Specific Location / Terminal / Facility</label>
                  <input
                    type="text"
                    value={formData.locationOrFacility || ''}
                    onChange={(e) => setFormData({ ...formData, locationOrFacility: e.target.value })}
                    placeholder="e.g. Kaveri Hostel Block-B / Lab 3 / Bus 14"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">Urgency Level</label>
                    <select
                      value={formData.urgency}
                      onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                    >
                      <option value="Normal">Normal Review</option>
                      <option value="Urgent">Urgent Attention</option>
                      <option value="High Priority">High Priority (Immediate)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">Previous Escalations</label>
                    <input
                      type="text"
                      value={formData.previousAttemptsToResolve || ''}
                      onChange={(e) => setFormData({ ...formData, previousAttemptsToResolve: e.target.value })}
                      placeholder="e.g. Verbally notified warden"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. TEACHER FEEDBACK SPECIFICS */}
            {selectedCategory === 'feedback' && (
              <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Pedagogy & Faculty Context</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">Faculty Name</label>
                    <input
                      type="text"
                      value={formData.teacherName || ''}
                      onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                      placeholder="e.g. Dr. K. Srinivas Rao"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">Course & Code</label>
                    <input
                      type="text"
                      value={formData.courseName || ''}
                      onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                      placeholder="e.g. Data Structures (23CS301)"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Feedback Orientation</label>
                  <select
                    value={formData.feedbackRating || '4 - Constructive Suggestion'}
                    onChange={(e) => setFormData({ ...formData, feedbackRating: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                  >
                    <option value="Appreciation">Formal Academic Commendation / Appreciation</option>
                    <option value="Pacing">Pacing & Derivations Explanation Request</option>
                    <option value="Doubt Clearing">Request for Remedial / Doubt Clearing Session</option>
                    <option value="Lab Guidance">Practical Code Debugging Assistance in Labs</option>
                  </select>
                </div>
              </div>
            )}

            {/* Core Reason Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Core Grounds & Explanation</label>
              <textarea
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Explain the detailed situation or request..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition resize-y"
              />
            </div>

            {/* Optional Custom Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>Custom Notes / Specific Requests</span>
                <span className="text-[10px] text-slate-500 font-normal">Optional</span>
              </label>
              <textarea
                rows={2}
                value={formData.customNotes}
                onChange={(e) => setFormData({ ...formData, customNotes: e.target.value })}
                placeholder="Any special remarks, undertakings, or specific requirements..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition resize-y"
              />
            </div>

            {/* Enclosures / Attachments */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Enclosures / Attached Documents</label>
              <input
                type="text"
                value={formData.enclosures}
                onChange={(e) => setFormData({ ...formData, enclosures: e.target.value })}
                placeholder="e.g. Doctor's Certificate, Hackathon brochure, Parent letter"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Tone Selector & Action Buttons */}
            <div className="pt-2 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Tone & Demeanor:</span>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value as any })}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-teal-300 focus:outline-none"
                >
                  <option value="Formal & Respectful">Formal & Respectful</option>
                  <option value="Firm & Objective">Firm & Objective</option>
                  <option value="Concise & Academic">Concise & Academic</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-semibold text-xs tracking-wide shadow-lg shadow-teal-950/50 disabled:opacity-50 transition active:scale-[0.98]"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Drafting Letter...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      <span>Generate Letter with AI</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleEnhanceAI}
                  disabled={isGenerating || !letterOutput}
                  title="Enhance phrasing, formality, and vocabulary"
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition disabled:opacity-40"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">AI Polish</span>
                </button>
              </div>

              {isGenerating && generationStep && (
                <div className="p-2 rounded-lg bg-slate-950 border border-teal-500/30 text-xs text-teal-300 flex items-center gap-2 animate-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                  <span>{generationStep}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Output Area / Dedicated Preview Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Canvas Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-teal-400" />
                Official Document Preview
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase tracking-wider ${
                  aiSourceBadge === 'gemini_ai'
                    ? 'bg-teal-950 text-teal-300 border border-teal-800'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {aiSourceBadge === 'gemini_ai' ? 'Gemini AI Formatted' : 'Institutional Format'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsEditingCanvas(!isEditingCanvas)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition ${
                  isEditingCanvas
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title="Edit text directly on the canvas"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isEditingCanvas ? 'Lock Canvas' : 'Direct Edit'}</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
                title="Copy entire letter text to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium shadow-md shadow-teal-950/40 transition"
                title="Download as PDF or Print Formal Document"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download as PDF</span>
              </button>
            </div>
          </div>

          {/* Authentic Document Canvas Sheet (Letterhead Paper Layout) */}
          <div
            id="printable-letter"
            ref={letterPrintRef}
            className="w-full bg-white text-slate-900 rounded-2xl p-6 sm:p-10 shadow-2xl border border-slate-200 transition-all font-serif min-h-[640px] relative select-text"
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              lineHeight: '1.65',
            }}
          >
            {/* Watermark / Subtle Insignia */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none overflow-hidden">
              <span className="text-8xl font-black font-sans uppercase tracking-widest text-slate-900 transform -rotate-45">
                NEC PULSE
              </span>
            </div>

            {/* Formal College Letterhead Header */}
            <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center space-y-1">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" />
                <span className="text-[10px] tracking-widest uppercase font-sans font-bold text-slate-600">
                  Established 1998 • Autonomous Institution
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" />
              </div>

              <h1
                className="text-lg sm:text-xl font-bold uppercase tracking-tight text-slate-950 font-sans"
                style={{ fontFamily: "'Cinzel', 'Plus Jakarta Sans', serif" }}
              >
                {profile.collegeName || 'Narasaraopeta Engineering College (Autonomous)'}
              </h1>

              <p className="text-[11px] font-sans text-slate-600 max-w-xl mx-auto leading-relaxed">
                Approved by AICTE, New Delhi • Accredited by NBA (CSE, ECE, EEE, MECH) & NAAC with 'A+' Grade
                <br />
                Permanently Affiliated to JNTUK, Kakinada • ISO 9001:2015 Certified Institution
                <br />
                Kotappakonda Road, Yellamanda (P.O), Narasaraopet, Palnadu Dist., Andhra Pradesh – 522601
              </p>

              <div className="pt-2 flex items-center justify-between text-[11px] font-sans text-slate-700 font-semibold border-t border-slate-200 mt-2">
                <span>DEPARTMENT OF {profile.branch.toUpperCase()}</span>
                <span className="font-mono text-[10px] text-slate-600">AUTONOMOUS DRAFTING CELL</span>
              </div>
            </div>

            {/* Letter Content Display (Editable or Pristine Formatted View) */}
            {isEditingCanvas ? (
              <textarea
                value={letterOutput}
                onChange={(e) => {
                  setLetterOutput(e.target.value);
                  setAiSourceBadge('custom');
                }}
                className="w-full h-[520px] p-3 text-sm text-slate-900 font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed resize-y"
              />
            ) : (
              <div className="whitespace-pre-line text-sm text-slate-800 leading-relaxed selection:bg-teal-200">
                {letterOutput || generateLocalInstitutionalLetter(formData, profile)}
              </div>
            )}

            {/* Institutional Seal & Signatures Footer */}
            <div className="mt-8 pt-6 border-t border-slate-300 grid grid-cols-2 gap-4 text-xs font-sans text-slate-700">
              <div>
                <p className="font-semibold text-slate-900">Student Undertaking:</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  I hereby solemnly affirm that the statements recorded herein are true and verified.
                </p>
                <div className="mt-6 border-t border-dashed border-slate-400 w-44 pt-1 text-[11px]">
                  Signature of {profile.fullName}
                </div>
              </div>

              <div className="text-right flex flex-col items-end">
                <p className="font-semibold text-slate-900">Official Action / Endorsement:</p>
                <p className="text-[11px] text-slate-600 mt-0.5">Approved by Head of Department / Mentor</p>
                <div className="mt-6 border-t border-dashed border-slate-400 w-48 pt-1 text-[11px] text-center">
                  Authorized Signatory & Seal
                </div>
              </div>
            </div>

            {/* Security Code Stamp */}
            <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-teal-600" />
                Verified Digital Academic Draft
              </span>
              <span>Doc Ref: {refNumber}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
