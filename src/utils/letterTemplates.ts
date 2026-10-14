import { LetterCategory, LetterFormData, StudentProfile } from '../types';

export interface PredefinedTemplateOption {
  id: string;
  category: LetterCategory;
  title: string;
  subType: string;
  recipientTitle: string;
  recipientDepartment: string;
  subjectDefault: string;
  reasonDefault: string;
  customNotesDefault: string;
  enclosuresDefault: string;
}

export const LETTER_TEMPLATE_OPTIONS: PredefinedTemplateOption[] = [
  // 1. COMPLAINT BOX
  {
    id: 'comp-hostel',
    category: 'complaint',
    title: 'Hostel & Mess Sanitation / Food Quality Grievance',
    subType: 'Hostel & Mess Facility',
    recipientTitle: 'The Chief Warden & Dean of Student Affairs',
    recipientDepartment: 'Hostel Administration & Student Welfare',
    subjectDefault: 'Urgent Grievance regarding drinking water filter maintenance and mess hygiene in Kaveri Hostel',
    reasonDefault: 'Over the past week, the reverse osmosis (RO) water purifier on the second floor of Block-B has been malfunctioning with low pressure and unusual turbidity. Additionally, students have noted inconsistent food temperature and hygiene in the evening dining session, impacting general well-being during study hours.',
    customNotesDefault: 'Requesting immediate servicing of the water purification unit and a surprise inspection of the mess preparation area.',
    enclosuresDefault: 'Signatures petition from 45 resident hostellers of Block-B, Kaveri Hostel.',
  },
  {
    id: 'comp-lab',
    category: 'complaint',
    title: 'Computer Lab System & Network Connectivity Disruption',
    subType: 'Laboratory & Infrastructure',
    recipientTitle: 'The Head of Department & Lab In-charge',
    recipientDepartment: 'Department of Computer Science & Engineering',
    subjectDefault: 'Complaint regarding defective terminals and high latency in Computer Lab 3 (Turing Hall)',
    reasonDefault: 'During the recent Data Structures Laboratory practicals, 8 out of 35 systems experienced random kernel reboots and intermittent local network timeouts when executing compilation scripts. This caused loss of student code progress and delayed weekly evaluations.',
    customNotesDefault: 'Kindly arrange an emergency technical inspection of terminal IDs LAB3-SYS-12 through 20 and update the GCC/Java SDK runtimes.',
    enclosuresDefault: 'List of affected terminal serial numbers and student roll numbers.',
  },
  {
    id: 'comp-transport',
    category: 'complaint',
    title: 'College Bus Route Schedule & Overcrowding',
    subType: 'Transport & Commute',
    recipientTitle: 'The Transport Officer',
    recipientDepartment: 'Central Campus Transport Wing',
    subjectDefault: 'Representation regarding overcrowding and 15-minute delayed arrival of Bus Route No. 14 (Guntur-NEC)',
    reasonDefault: 'Route No. 14 has frequently been arriving at the campus gate past 9:15 AM due to route rescheduling, resulting in students missing the morning attendance biometric cutoff and the first 15 minutes of Period 1.',
    customNotesDefault: 'Propose dispatching the bus 15 minutes earlier from the origin stop or adding an auxiliary bus during peak morning hours.',
    enclosuresDefault: 'Attendance log extract showing late entry logs for the preceding five working days.',
  },
  {
    id: 'comp-classroom',
    category: 'complaint',
    title: 'Classroom Projector & Audio-Visual Maintenance',
    subType: 'Classroom Facilities',
    recipientTitle: 'The Academic Facilities Coordinator',
    recipientDepartment: 'Campus Infrastructure & Maintenance Cell',
    subjectDefault: 'Request for immediate bulb replacement and HDMI audio repair for ceiling projector in Hall AB-302',
    reasonDefault: 'The overhead ceiling projector in Room AB-302 displays severe color flickering and dim lumen output, making code demonstrations and algorithmic diagrams nearly illegible from the rear benches.',
    customNotesDefault: 'Replacement prior to next Tuesday’s interactive seminar would greatly benefit the entire class of 64 students.',
    enclosuresDefault: 'Photograph of the projection display distortion.',
  },

  // 2. TEACHER'S FEEDBACK
  {
    id: 'feed-pace',
    category: 'feedback',
    title: 'Constructive Feedback on Lecture Pace & Practice Problems',
    subType: 'Curriculum & Pedagogy',
    recipientTitle: 'The Course Faculty / Head of Department',
    recipientDepartment: 'Department of Computer Science & Engineering',
    subjectDefault: 'Constructive academic feedback regarding pace of algorithmic analysis in Data Structures (23CS301)',
    reasonDefault: 'The conceptual lectures delivered on Tree Traversals and Binary Heaps have been rich and thorough. However, the theoretical derivations move quite rapidly. Many students would benefit tremendously if 15 minutes of each Friday period were dedicated to solving live benchmark problems and code dry-runs on the board.',
    customNotesDefault: 'We sincerely appreciate your deep domain knowledge and hope this pedagogical adjustment will empower the entire batch during mid-semester tests.',
    enclosuresDefault: 'Consolidated topic suggestions compiled from Class 2nd Year CSE Section-B.',
  },
  {
    id: 'feed-lab',
    category: 'feedback',
    title: 'Lab Session Practical Mentorship & Debugging Guidance',
    subType: 'Laboratory Guidance',
    recipientTitle: 'The Laboratory Course Coordinator',
    recipientDepartment: 'Software Engineering Laboratory Section',
    subjectDefault: 'Feedback and request for additional guided debugging walk-throughs in Java Programming Laboratory',
    reasonDefault: 'While the weekly lab manuals provide clear problem statements, complex concurrency problems such as Thread deadlocks and socket programming require more initial demonstration before individual system coding commences.',
    customNotesDefault: 'A short 10-minute whiteboard walkthrough before students begin individual terminal programming would enhance lab output and execution confidence.',
    enclosuresDefault: 'Sample lab exercise questions where students encountered maximum runtime errors.',
  },
  {
    id: 'feed-appreciation',
    category: 'feedback',
    title: 'Formal Letter of Academic Appreciation & Mentorship Gratitude',
    subType: 'Academic Commendation',
    recipientTitle: 'The Respected Professor & Head of Department',
    recipientDepartment: 'Department of Basic Sciences & Humanities (BS&H)',
    subjectDefault: 'Formal appreciation for exemplary pedagogical support and extra tutorial sessions in Discrete Mathematics',
    reasonDefault: 'On behalf of the students of Year 2 Semester 3, we express our profound gratitude for conducting evening doubt clearing sessions and simplifying abstract proof techniques in combinatorics and recurrence relations.',
    customNotesDefault: 'The extra notes and personalized guidance have significantly improved class understanding and midterm scores across our section.',
    enclosuresDefault: 'Endorsement and vote of thanks from all class student representatives.',
  },

  // 3. VARIOUS TYPES OF LEAVE LETTERS
  {
    id: 'leave-medical',
    category: 'leave',
    title: 'Medical Leave Application with Physician Certificate',
    subType: 'Medical Leave',
    recipientTitle: 'The Head of Department',
    recipientDepartment: 'Department of Computer Science & Engineering',
    subjectDefault: 'Application for 4 days Medical Leave on grounds of viral illness and medical recuperation',
    reasonDefault: 'I have been diagnosed with acute viral bronchitis and severe pyrexia. The consulting medical practitioner has advised strict bed rest and isolation from October 15, 2026 to October 18, 2026 to facilitate recovery and prevent contagion.',
    customNotesDefault: 'I assure you that I will consult my peers to complete all missed laboratory experiments and lecture notes immediately upon resuming classes.',
    enclosuresDefault: 'Medical Practitioner’s Prescription, Clinical Lab Blood Report, and Fitness Undertaking upon joining.',
  },
  {
    id: 'leave-od',
    category: 'leave',
    title: 'On-Duty (OD) Leave for Smart India Hackathon / Inter-College Event',
    subType: 'On-Duty (OD) Leave',
    recipientTitle: 'The Principal & Head of Department',
    recipientDepartment: 'Through: Academic Class Teacher / Mentor',
    subjectDefault: 'Request for grant of 3 days On-Duty (OD) attendance for participating in National Smart India Hackathon Grand Finale',
    reasonDefault: 'Our team "PulseInnovators" representing Narasaraopeta Engineering College has been shortlisted for the Grand Finale of the National Smart India Hackathon to be held at IIT Hyderabad from October 22 to October 24, 2026. Participation requires official travel and on-site hardware testing.',
    customNotesDefault: 'We request that academic attendance for the mentioned dates be marked as On-Duty (OD) in college administrative records.',
    enclosuresDefault: 'Official Hackathon Shortlist Confirmation Email, Identity Badges, and Team Faculty Mentor Recommendation.',
  },
  {
    id: 'leave-emergency',
    category: 'leave',
    title: 'Emergency Family Bereavement / Personal Leave',
    subType: 'Emergency Leave',
    recipientTitle: 'The Head of Department',
    recipientDepartment: 'Department of Computer Science & Engineering',
    subjectDefault: 'Application for emergency leave of absence due to urgent family contingency',
    reasonDefault: 'Due to an unforeseen medical emergency in my immediate family requiring my presence in my hometown, I am unable to attend regular lectures and lab sessions from October 16 to October 17, 2026.',
    customNotesDefault: 'My parent/guardian has formally consented to this absence and can be reached for verbal verification if required.',
    enclosuresDefault: 'Signed letter from parent/guardian and copy of father’s contact verification.',
  },
  {
    id: 'leave-hostel',
    category: 'leave',
    title: 'Hostel Weekend Gate Pass & Night-Out Permission',
    subType: 'Hostel Outing / Gate Pass',
    recipientTitle: 'The Chief Hostel Warden',
    recipientDepartment: 'Narasaraopeta Engineering College Hostels',
    subjectDefault: 'Application for weekend night-out permission and gate exit clearance',
    reasonDefault: 'I wish to travel to my hometown for the upcoming weekend to attend a mandatory family function. I request permission to depart the hostel premises on Friday at 5:00 PM and will return strictly before Sunday 7:30 PM.',
    customNotesDefault: 'I undertake full personal responsibility for my transit and agree to adhere strictly to all campus curfew and safety protocols.',
    enclosuresDefault: 'Parent consent SMS / telephonic confirmation record and Outpass slip.',
  },
  {
    id: 'leave-fee',
    category: 'leave',
    title: 'Tuition Fee Installment Extension / Exam Hall Ticket Release',
    subType: 'Fee Payment Extension',
    recipientTitle: 'The Principal & Administrative Officer',
    recipientDepartment: 'Through: Dean of Student Affairs & Accounts Cell',
    subjectDefault: 'Request for temporary 15-day extension for Semester 3 tuition fee balance and provisional hall ticket issuance',
    reasonDefault: 'Owing to a delay in the disbursement of our agricultural credit scheme and pending state educational scholarship credit, my family requires a brief grace period of 15 days to settle the remaining balance of the Semester 3 tuition fees.',
    customNotesDefault: 'I pledge that the outstanding amount shall be cleared in full before November 5, 2026. In the interim, I kindly request provisional clearance for attending the upcoming midterm assessments.',
    enclosuresDefault: 'Undertaking signed by student and parent, along with scholarship portal application receipt.',
  },
];

export function generateLocalInstitutionalLetter(
  formData: LetterFormData,
  profile: StudentProfile
): string {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const refNumber = `NEC/AUTO/${profile.branch.substring(0, 3).toUpperCase()}/${new Date().getFullYear()}/REF-${Math.floor(1000 + Math.random() * 9000)}`;

  const recipientTitle = formData.recipientTitle || 'The Head of Department';
  const recipientDept = formData.recipientDepartment ? `${formData.recipientDepartment},\n` : '';
  const college = profile.collegeName || 'Narasaraopeta Engineering College (Autonomous)';

  let bodyIntro = '';
  let bodyCore = '';
  let bodyConclusion = '';

  if (formData.category === 'leave') {
    const leaveTypeStr = formData.leaveType || formData.subType || 'Leave of Absence';
    const datesStr = formData.dateRange || 'the upcoming academic days';
    
    bodyIntro = `I am writing to formally request approval for ${leaveTypeStr} covering the duration from ${datesStr}. I am a bona fide student of ${college}, currently pursuing Year ${profile.year}, Semester ${profile.semester} in the Department of ${profile.branch}, Section ${profile.section}, bearing Roll Number ${profile.studentId}.`;
    
    bodyCore = formData.reason || `Due to unavoidable circumstances requiring my absence, I am unable to be physically present on campus for the scheduled lecture and laboratory hours. ${formData.customNotes ? `Additional Context: ${formData.customNotes}` : ''}`;
    
    bodyConclusion = `I assure you that I have consulted with my class representatives and subject peers to ensure all lecture notes, lab observation books, and assigned homework will be completed promptly upon my resumption. I respectfully pray that this absence be sanctioned, and where applicable, that the required attendance concessions or On-Duty (OD) credits be accorded in the institutional records.`;
  } else if (formData.category === 'complaint') {
    const nature = formData.subType || 'Campus Facility Grievance';
    
    bodyIntro = `I am submitting this formal institutional representation to bring an urgent matter to your esteemed notice regarding ${nature}. I am currently enrolled as a student of ${profile.branch}, Year ${profile.year}, Semester ${profile.semester}, Section ${profile.section} (Roll No: ${profile.studentId}) at ${college}.`;
    
    bodyCore = formData.reason || `The current situation has created notable inconvenience and disruption to students' academic concentration and daily campus routine. ${formData.customNotes ? `Specific Observations: ${formData.customNotes}` : ''}`;
    
    bodyConclusion = `Considering the high standards of discipline, infrastructure, and student welfare maintained by Narasaraopeta Engineering College, I earnestly request your office to look into this issue at your earliest convenience and dispatch the concerned maintenance or administrative personnel to implement a prompt, lasting remedy.`;
  } else {
    // Teacher's feedback
    const topic = formData.subType || 'Course Pedagogy & Guidance';
    
    bodyIntro = `I submit this formal academic communication to provide respectful, constructive feedback regarding ${topic}. I am a student of ${profile.branch}, Year ${profile.year}, Semester ${profile.semester}, Section ${profile.section} (Roll No: ${profile.studentId}) attending regular class sessions under your academic oversight.`;
    
    bodyCore = formData.reason || `Our batch holds the highest regard for the rigorous curriculum and dedicated guidance provided by the faculty. ${formData.customNotes ? `Student Observations: ${formData.customNotes}` : ''}`;
    
    bodyConclusion = `We place immense value on your continued mentorship and pedagogical excellence. It is our collective conviction that these constructive reflections will assist in further enhancing the instructional delivery and student learning outcomes for our entire class. Thank you for your continued patience and guidance.`;
  }

  const enclosuresText = formData.enclosures
    ? `\n\nEnclosures:\n1. ${formData.enclosures}\n2. Copy of Student Identity Card (${profile.studentId})`
    : `\n\nEnclosures:\n1. Copy of Student Identity Card (${profile.studentId})`;

  return `REF NO: ${refNumber}
DATE: ${currentDate}

TO:
${recipientTitle},
${recipientDept}${college},
Kotappakonda Road, Yellamanda (P.O), Narasaraopet, Palnadu Dist.,
Andhra Pradesh - 522601.

THROUGH: The Proper Channel / Class In-Charge / Academic Mentor

SUBJECT: ${formData.subjectLine.toUpperCase()}

Respected Sir/Madam,

${bodyIntro}

${bodyCore}

${bodyConclusion}

Thanking you in anticipation.

Yours faithfully,

(Signature of the Student)
Name: ${profile.fullName}
Roll Number: ${profile.studentId}
Branch: ${profile.branch}
Year / Semester: Year ${profile.year}, Semester ${profile.semester} (Section ${profile.section})
Contact Number: ${profile.phone}
Email: ${profile.email}${enclosuresText}

---------------------------------------------------------------------------------
[FOR OFFICE / DEPARTMENT USE ONLY]

Recommendation of Class Teacher / Mentor:
[  ] Recommended & Forwarded        [  ] Not Recommended        Remarks: ___________________

Signature of Mentor: ___________________               Signature of HOD: ___________________
Date: ____ / ____ / 2026`;
}
