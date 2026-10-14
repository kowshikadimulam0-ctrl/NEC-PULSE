import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI if key is present
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// POST /api/letter/generate
app.post('/api/letter/generate', async (req, res) => {
  try {
    const {
      category, // 'complaint' | 'feedback' | 'leave'
      subCategory,
      studentName,
      rollNumber,
      collegeName = 'Narasaraopeta Engineering College (Autonomous)',
      branch,
      yearSemester,
      section,
      recipientTitle,
      recipientDepartment,
      subject,
      contextDetails,
      customNotes,
      tone = 'Formal & Respectful',
      dateRange,
    } = req.body;

    if (!ai) {
      return res.status(200).json({
        success: true,
        source: 'local_engine',
        message: 'Generated using built-in institutional template engine.',
        letter: null,
      });
    }

    const prompt = `You are the Official Academic Letter Drafting Assistant for students of ${collegeName}.
Write a complete, highly formal, professionally formatted letter in accordance with academic administrative standards in higher education and autonomous engineering institutions.

Letter Category: ${category}
Type / Sub-type: ${subCategory || 'General Academic Request'}
Student Name: ${studentName || 'Student'}
Student Roll/ID: ${rollNumber || 'NEC/2026/XXXX'}
College: ${collegeName}
Branch & Specialization: ${branch || 'Computer Science & Engineering'}
Year & Semester: ${yearSemester || 'Year 2, Semester 3'}
Section: ${section || 'A'}
Target Recipient: ${recipientTitle || 'The Head of Department'} ${recipientDepartment ? `(${recipientDepartment})` : ''}
Specific Subject Request: ${subject || 'Formal Application'}
Date / Range: ${dateRange || 'Current Academic Session'}
Context Details: ${JSON.stringify(contextDetails || {})}
Custom Notes from Student: ${customNotes || 'None'}
Requested Tone: ${tone}

Formatting instructions:
1. Provide standard institutional letter layout:
   - Date at top right or left
   - "To" recipient block with full designation and department
   - "Through:" Proper Channel / Class Teacher / HOD if applicable
   - "Subject: [Clear, concise and official]"
   - "Respected Sir/Madam,"
   - 2 to 3 well-structured paragraphs:
     - Paragraph 1: Precise statement of who the student is (Name, Roll No, Branch, Section) and the exact purpose of the letter.
     - Paragraph 2: Core facts, reasoning, context, supporting medical/academic/event details, and assurance of responsibility.
     - Paragraph 3: Courteous request for approval/action, willingness to submit necessary proofs/remedy missed coursework, and expressions of gratitude.
   - Formal sign-off: "Yours faithfully" or "Yours respectfully"
   - Student Full Name, Roll No, Branch, Semester, and Section block
   - Enclosures line if applicable (e.g., Medical Certificate, Event Brochure, Parent Undertaking)
2. Ensure impeccable grammar, official administrative tone, respectful language, and no colloquialisms.
3. Do not include markdown code fence formatting like \`\`\` around the letter. Just return the pristine formatted letter text ready to be placed on letterhead.`;

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI response timed out')), 6000)
    );

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are a premier university registrar and academic drafting authority. You compose formal institutional letters for engineering college students.',
        temperature: 0.4,
      },
    });

    const response: any = await Promise.race([generatePromise, timeoutPromise]);
    const letterText = response?.text || '';
    return res.json({
      success: true,
      source: 'gemini_ai',
      letter: letterText,
    });
  } catch (error: any) {
    console.error('Gemini generate letter error:', error);
    
    // Provide robust institutional template fallback
    const {
      category = 'leave',
      subCategory = 'Academic Request',
      studentName = 'Student',
      rollNumber = '23471A0589',
      collegeName = 'Narasaraopeta Engineering College (Autonomous)',
      branch = 'Computer Science & Engineering',
      yearSemester = 'Year 2, Semester 3',
      section = 'B',
      recipientTitle = 'The Head of Department',
      recipientDepartment = 'Department of Computer Science & Engineering',
      subject = 'Formal Application',
      contextDetails = {},
      customNotes = '',
      dateRange = 'Upcoming Working Days',
    } = req.body;

    const refNum = `NEC/AUTO/${branch.substring(0, 3).toUpperCase()}/${new Date().getFullYear()}/REF-${Math.floor(1000 + Math.random() * 9000)}`;
    const curDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    let bodyText = '';
    if (category === 'leave') {
      bodyText = `I am submitting this formal application to request sanction of ${subCategory} for the duration from ${dateRange}. I am a bona fide student of ${collegeName}, enrolled in ${yearSemester}, Department of ${branch}, Section ${section}, bearing Roll Number ${rollNumber}.\n\nReason: ${contextDetails.reason || 'Unavoidable circumstances requiring temporary leave of absence.'}\n${customNotes ? `Additional Notes: ${customNotes}\n` : ''}\nI respectfully assure you that all missed laboratory practicals and coursework will be caught up immediately upon my return. I kindly request you to approve this leave and grant attendance credit accordingly.`;
    } else if (category === 'complaint') {
      bodyText = `I bring to your urgent notice a matter concerning campus facilities: ${subCategory}. I am a student of ${branch}, ${yearSemester}, Section ${section} (Roll Number: ${rollNumber}).\n\nGrievance Particulars: ${contextDetails.reason || 'Campus facility maintenance grievance requiring inspection.'}\nLocation: ${contextDetails.location || 'College Premises'}\n${customNotes ? `Specific Observations: ${customNotes}\n` : ''}\nI earnestly request the concerned department to inspect this situation and expedite the required repair to ensure student welfare.`;
    } else {
      bodyText = `I submit this respectful academic feedback regarding ${subCategory} in the Department of ${branch}.\n\nObservations: ${contextDetails.reason || 'Constructive student evaluation to support classroom learning and curriculum delivery.'}\n${customNotes ? `Student Remarks: ${customNotes}\n` : ''}\nWe sincerely appreciate the dedicated guidance of the faculty and submit these constructive observations in the spirit of academic excellence.`;
    }

    const fallbackLetter = `REF NO: ${refNum}
DATE: ${curDate}

TO:
${recipientTitle},
${recipientDepartment},
${collegeName},
Kotappakonda Road, Yellamanda (P.O), Narasaraopet, Palnadu Dist.,
Andhra Pradesh - 522601.

THROUGH: The Proper Channel / Academic Mentor / Class In-Charge

SUBJECT: ${subject.toUpperCase()}

Respected Sir/Madam,

${bodyText}

Thanking you in anticipation.

Yours faithfully,

(Signature of the Student)
Name: ${studentName}
Roll Number: ${rollNumber}
Branch: ${branch}
${yearSemester} (Section ${section})

---------------------------------------------------------------------------------
[FOR DEPARTMENT / MENTOR USE ONLY]
Recommendation: [  ] Approved & Forwarded    [  ] Under Review
Signature of Mentor: ___________________        Signature of HOD: ___________________`;

    return res.status(200).json({
      success: true,
      source: 'local_engine',
      error: error?.message,
      letter: fallbackLetter,
    });
  }
});

// POST /api/letter/enhance
app.post('/api/letter/enhance', async (req, res) => {
  try {
    const { originalContent, instruction = 'Enhance tone to be more formal, clear, and persuasive' } = req.body;

    if (!originalContent) {
      return res.status(400).json({ error: 'originalContent is required' });
    }

    if (!ai) {
      return res.status(200).json({
        success: true,
        source: 'local_engine',
        enhanced: originalContent,
      });
    }

    const prompt = `Review and refine the following official college letter.
Instruction: ${instruction}

Original Letter:
${originalContent}

Return the improved letter directly, maintaining proper formal formatting without markdown code fences.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.3,
      },
    });

    return res.json({
      success: true,
      source: 'gemini_ai',
      enhanced: response.text || originalContent,
    });
  } catch (error: any) {
    console.error('Gemini enhance letter error:', error);
    return res.status(200).json({
      success: true,
      source: 'fallback',
      enhanced: req.body.originalContent,
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
