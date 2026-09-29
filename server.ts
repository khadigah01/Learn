import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { getSqliteDb, persistSqliteDb } from './src/server/sqliteDb';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support up to 50MB for uploading .sb3 Scratch files encoded as base64 data URLs
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Initialize SQLite database
  const sqlite = await getSqliteDb();
  console.log('[SQLite] Database initialized and tables ready.');

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      domain: 'LearnAcademy.dpdns.org',
      database: 'SQLite (sql.js)'
    });
  });

  // ==========================================
  // 1. PORTFOLIO ENDPOINTS (SQLite)
  // ==========================================

  // List portfolio projects
  app.get('/api/portfolio', (req, res) => {
    try {
      const studentId = req.query.studentId as string;
      let query = 'SELECT * FROM portfolio_projects ORDER BY created_at DESC';
      let params: any[] = [];

      if (studentId) {
        query = 'SELECT * FROM portfolio_projects WHERE student_id = ? ORDER BY created_at DESC';
        params = [studentId];
      }

      const stmt = sqlite.prepare(query);
      if (params.length > 0) stmt.bind(params);

      const projects: any[] = [];
      while (stmt.step()) {
        projects.push(stmt.getAsObject());
      }
      stmt.free();

      res.json({ success: true, projects });
    } catch (err: any) {
      console.error('[API Portfolio] Error listing projects:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Create or add a Scratch project to portfolio
  app.post('/api/portfolio', (req, res) => {
    try {
      const {
        studentId,
        studentName,
        title,
        description = '',
        projectType = 'scratch_link', // 'sb3' | 'scratch_link' | 'turbowarp_link'
        scratchUrl = '',
        scratchProjectId = '',
        sb3Data = null,
        sb3Filename = null,
        instructions = '',
        category = 'game'
      } = req.body;

      if (!studentId || !title) {
        return res.status(400).json({ success: false, error: 'studentId and title are required' });
      }

      const id = 'proj_' + Date.now() + Math.random().toString(36).substring(2, 7);
      const now = Date.now();

      // Extract project ID from URL if provided
      let finalProjectId = scratchProjectId;
      if (!finalProjectId && scratchUrl) {
        const match = scratchUrl.match(/projects\/(\d+)/);
        if (match && match[1]) {
          finalProjectId = match[1];
        }
      }

      sqlite.run(
        `INSERT INTO portfolio_projects (id, student_id, student_name, title, description, project_type, scratch_url, scratch_project_id, sb3_data, sb3_filename, instructions, category, likes, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          studentId,
          studentName || 'Student',
          title.trim(),
          description.trim(),
          projectType,
          scratchUrl.trim(),
          finalProjectId || '',
          sb3Data || null,
          sb3Filename || null,
          instructions.trim(),
          category,
          0,
          now
        ]
      );

      persistSqliteDb();

      res.status(201).json({
        success: true,
        project: {
          id,
          student_id: studentId,
          student_name: studentName,
          title,
          description,
          project_type: projectType,
          scratch_url: scratchUrl,
          scratch_project_id: finalProjectId,
          sb3_filename: sb3Filename,
          instructions,
          category,
          likes: 0,
          created_at: now
        }
      });
    } catch (err: any) {
      console.error('[API Portfolio] Error creating project:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Delete portfolio project
  app.delete('/api/portfolio/:id', (req, res) => {
    try {
      const { id } = req.params;
      sqlite.run('DELETE FROM portfolio_projects WHERE id = ?', [id]);
      persistSqliteDb();
      res.json({ success: true, deletedId: id });
    } catch (err: any) {
      console.error('[API Portfolio] Error deleting project:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Like portfolio project
  app.post('/api/portfolio/:id/like', (req, res) => {
    try {
      const { id } = req.params;
      sqlite.run('UPDATE portfolio_projects SET likes = likes + 1 WHERE id = ?', [id]);
      persistSqliteDb();

      const stmt = sqlite.prepare('SELECT likes FROM portfolio_projects WHERE id = ?');
      stmt.bind([id]);
      let likes = 0;
      if (stmt.step()) {
        likes = (stmt.getAsObject() as any).likes;
      }
      stmt.free();

      res.json({ success: true, likes });
    } catch (err: any) {
      console.error('[API Portfolio] Error liking project:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // 2. TEACHER QUIZZES ENDPOINTS (SQLite)
  // Teachers can create and assign quizzes about anything!
  // ==========================================

  // List all quizzes
  app.get('/api/quizzes', (_req, res) => {
    try {
      const stmt = sqlite.prepare('SELECT * FROM teacher_quizzes ORDER BY created_at DESC');
      const quizzes: any[] = [];
      while (stmt.step()) {
        const row = stmt.getAsObject() as any;
        try {
          row.questions = JSON.parse(row.questions_json);
        } catch {
          row.questions = [];
        }
        quizzes.push(row);
      }
      stmt.free();

      res.json({ success: true, quizzes });
    } catch (err: any) {
      console.error('[API Quizzes] Error listing quizzes:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Create a new teacher quiz about anything
  app.post('/api/quizzes', (req, res) => {
    try {
      const {
        teacherId,
        teacherName,
        title,
        description = '',
        subject,
        targetGroup = 'All',
        timeLimitMinutes = 10,
        questions = []
      } = req.body;

      if (!title || !subject || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Title, subject, and at least one question are required'
        });
      }

      const id = 'quiz_' + Date.now() + Math.random().toString(36).substring(2, 6);
      const now = Date.now();
      const questionsJson = JSON.stringify(questions);

      sqlite.run(
        `INSERT INTO teacher_quizzes (id, teacher_id, teacher_name, title, description, subject, target_group, time_limit_minutes, questions_json, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          teacherId || 'teacher_general',
          teacherName || 'Teacher',
          title.trim(),
          description.trim(),
          subject.trim(),
          targetGroup.trim() || 'All',
          Number(timeLimitMinutes) || 10,
          questionsJson,
          now
        ]
      );

      persistSqliteDb();

      res.status(201).json({
        success: true,
        quiz: {
          id,
          teacher_id: teacherId,
          teacher_name: teacherName,
          title,
          description,
          subject,
          target_group: targetGroup,
          time_limit_minutes: timeLimitMinutes,
          questions,
          created_at: now
        }
      });
    } catch (err: any) {
      console.error('[API Quizzes] Error creating quiz:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Delete quiz
  app.delete('/api/quizzes/:id', (req, res) => {
    try {
      const { id } = req.params;
      sqlite.run('DELETE FROM teacher_quizzes WHERE id = ?', [id]);
      sqlite.run('DELETE FROM quiz_submissions WHERE quiz_id = ?', [id]);
      persistSqliteDb();
      res.json({ success: true, deletedId: id });
    } catch (err: any) {
      console.error('[API Quizzes] Error deleting quiz:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Submit student quiz answers and record score in SQLite
  app.post('/api/quizzes/:id/submit', (req, res) => {
    try {
      const { id: quizId } = req.params;
      const { studentId, studentName, answers } = req.body; // answers: { [questionId: string]: number }

      const stmt = sqlite.prepare('SELECT * FROM teacher_quizzes WHERE id = ?');
      stmt.bind([quizId]);
      if (!stmt.step()) {
        stmt.free();
        return res.status(404).json({ success: false, error: 'Quiz not found' });
      }
      const quizRow = stmt.getAsObject() as any;
      stmt.free();

      const questions = JSON.parse(quizRow.questions_json);
      let earnedPoints = 0;
      let totalPoints = 0;

      questions.forEach((q: any) => {
        const pts = q.points || 10;
        totalPoints += pts;
        const selected = answers ? answers[q.id] : undefined;
        if (selected !== undefined && selected === q.correctIndex) {
          earnedPoints += pts;
        }
      });

      const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
      const submissionId = 'sub_' + Date.now() + Math.random().toString(36).substring(2, 6);
      const now = Date.now();

      sqlite.run(
        `INSERT INTO quiz_submissions (id, quiz_id, student_id, student_name, score, total_score, percentage, answers_json, submitted_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          submissionId,
          quizId,
          studentId || 'anonymous_student',
          studentName || 'Student',
          earnedPoints,
          totalPoints,
          percentage,
          JSON.stringify(answers || {}),
          now
        ]
      );

      persistSqliteDb();

      res.json({
        success: true,
        submission: {
          id: submissionId,
          quizId,
          score: earnedPoints,
          totalScore: totalPoints,
          percentage,
          submittedAt: now
        }
      });
    } catch (err: any) {
      console.error('[API Quizzes] Error submitting quiz:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Get submissions for a quiz (for teachers)
  app.get('/api/quizzes/:id/submissions', (req, res) => {
    try {
      const { id: quizId } = req.params;
      const stmt = sqlite.prepare('SELECT * FROM quiz_submissions WHERE quiz_id = ? ORDER BY submitted_at DESC');
      stmt.bind([quizId]);
      const submissions: any[] = [];
      while (stmt.step()) {
        const row = stmt.getAsObject() as any;
        try {
          row.answers = JSON.parse(row.answers_json);
        } catch {
          row.answers = {};
        }
        submissions.push(row);
      }
      stmt.free();

      res.json({ success: true, submissions });
    } catch (err: any) {
      console.error('[API Quizzes] Error getting submissions:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Get student's past submissions
  app.get('/api/quizzes/student/:studentId/submissions', (req, res) => {
    try {
      const { studentId } = req.params;
      const stmt = sqlite.prepare('SELECT * FROM quiz_submissions WHERE student_id = ? ORDER BY submitted_at DESC');
      stmt.bind([studentId]);
      const submissions: any[] = [];
      while (stmt.step()) {
        submissions.push(stmt.getAsObject());
      }
      stmt.free();

      res.json({ success: true, submissions });
    } catch (err: any) {
      console.error('[API Quizzes] Error getting student submissions:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // 3. CERTIFICATES ENDPOINTS (SQLite)
  // Teachers and Admins can award certificates to students!
  // ==========================================

  // List certificates
  app.get('/api/certificates', (req, res) => {
    try {
      const studentId = req.query.studentId as string;
      let query = 'SELECT * FROM certificates ORDER BY created_at DESC';
      let params: any[] = [];

      if (studentId) {
        query = 'SELECT * FROM certificates WHERE student_id = ? ORDER BY created_at DESC';
        params = [studentId];
      }

      const stmt = sqlite.prepare(query);
      if (params.length > 0) stmt.bind(params);

      const certificates: any[] = [];
      while (stmt.step()) {
        const row = stmt.getAsObject() as any;
        certificates.push({
          id: row.id,
          studentId: row.student_id,
          studentName: row.student_name,
          teacherId: row.teacher_id,
          teacherName: row.teacher_name,
          title: row.title,
          titleAr: row.title_ar,
          subject: row.subject,
          distinction: row.distinction,
          issueDate: row.issue_date,
          notes: row.notes,
          theme: row.theme || 'gold',
          createdAt: row.created_at
        });
      }
      stmt.free();

      res.json({ success: true, certificates });
    } catch (err: any) {
      console.error('[API Certificates] Error listing certificates:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Issue / Award a Certificate
  app.post('/api/certificates', (req, res) => {
    try {
      const {
        studentId,
        studentName,
        teacherId,
        teacherName,
        title,
        titleAr = '',
        subject = 'General',
        distinction = 'With Distinction',
        issueDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        notes = '',
        theme = 'gold'
      } = req.body;

      if (!studentId || !studentName || !title) {
        return res.status(400).json({ success: false, error: 'studentId, studentName, and title are required' });
      }

      const id = 'cert_' + Date.now() + Math.random().toString(36).substring(2, 6);
      const now = Date.now();

      sqlite.run(
        `INSERT INTO certificates (id, student_id, student_name, teacher_id, teacher_name, title, title_ar, subject, distinction, issue_date, notes, theme, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          studentId,
          studentName.trim(),
          teacherId || 'teacher_admin',
          teacherName || 'Instructor',
          title.trim(),
          titleAr.trim(),
          subject.trim(),
          distinction.trim(),
          issueDate.trim(),
          notes.trim(),
          theme,
          now
        ]
      );

      persistSqliteDb();

      res.status(201).json({
        success: true,
        certificate: {
          id,
          studentId,
          studentName,
          teacherId,
          teacherName,
          title,
          titleAr,
          subject,
          distinction,
          issueDate,
          notes,
          theme,
          createdAt: now
        }
      });
    } catch (err: any) {
      console.error('[API Certificates] Error issuing certificate:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Delete certificate
  app.delete('/api/certificates/:id', (req, res) => {
    try {
      const { id } = req.params;
      sqlite.run('DELETE FROM certificates WHERE id = ?', [id]);
      persistSqliteDb();
      res.json({ success: true, deletedId: id });
    } catch (err: any) {
      console.error('[API Certificates] Error deleting certificate:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // 4. Vite middleware vs static
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
    console.log(`Official Domain: LearnAcademy.dpdns.org`);
  });
}

startServer();
