export type LetterCategory = 'complaint' | 'feedback' | 'leave';

export interface StudentProfile {
  fullName: string;
  email: string;
  studentId: string; // Roll number e.g. 23471A0501
  collegeName: string;
  degree: string;
  branch: string;
  year: number;
  semester: number;
  section: string;
  phone: string;
  isLoggedIn: boolean;
}

export interface SubjectItem {
  id: string;
  code: string;
  name: string;
  shortName: string;
  faculty: string;
  credits: number;
  type: 'Theory' | 'Practical' | 'Mandatory';
  room: string;
  notes: string;
  syllabusHighlights: string[];
}

export interface TimetableSlot {
  id: string;
  periodNumber: number;
  startTime: string; // e.g. "09:10 AM"
  endTime: string;   // e.g. "10:10 AM"
  subjectCode: string;
  subjectName: string;
  faculty: string;
  room: string;
  isBreak?: boolean;
  breakLabel?: string;
  notes?: string;
}

export interface DaySchedule {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  slots: TimetableSlot[];
}

export interface StudyGoal {
  id: string;
  title: string;
  description: string;
  subject: string;
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  createdAt: string;
}

export interface BagItem {
  id: string;
  name: string;
  category: 'Textbook' | 'Lab Record' | 'Notebook' | 'Mandatory' | 'Tool';
  linkedSubject?: string;
  requiredForDay?: string; // e.g. "All" or "Monday"
  packed: boolean;
}

export interface ReminderConfig {
  nightBeforeTime: string; // "21:00"
  nightBeforeEnabled: boolean;
  morningTime: string;     // "08:50"
  morningEnabled: boolean;
  bedtime: string;         // "22:00"
  collegeStartTime: string;// "09:10"
  soundEnabled: boolean;
  browserPermission: 'default' | 'granted' | 'denied';
}

export interface LetterFormData {
  category: LetterCategory;
  subType: string;
  recipientTitle: string;
  recipientDepartment: string;
  subjectLine: string;
  urgency: 'Normal' | 'Urgent' | 'High Priority';
  tone: 'Formal & Respectful' | 'Firm & Objective' | 'Concise & Academic';
  dateRange: string;
  reason: string;
  customNotes: string;
  enclosures: string;
  
  // Specific category fields
  complaintNature?: string;
  locationOrFacility?: string;
  previousAttemptsToResolve?: string;
  
  teacherName?: string;
  courseName?: string;
  feedbackTopic?: string;
  feedbackRating?: string;
  
  leaveType?: 'Medical' | 'On-Duty (OD)' | 'Emergency Personal' | 'Hostel Outing' | 'Fee Extension';
  leaveStartDate?: string;
  leaveEndDate?: string;
  totalDays?: number;
  medicalDoctorOrEventOrg?: string;
  parentContact?: string;
}
