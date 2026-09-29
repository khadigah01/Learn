import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';

let dbInstance: Database | null = null;
const DB_FILE = path.join(process.cwd(), 'learn.sqlite');

export async function getSqliteDb(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  const SQL = await initSqlJs();
  if (fs.existsSync(DB_FILE)) {
    try {
      const fileBuffer = fs.readFileSync(DB_FILE);
      dbInstance = new SQL.Database(fileBuffer);
    } catch (err) {
      console.warn('[SQLite] Failed to load existing db file, creating fresh database:', err);
      dbInstance = new SQL.Database();
    }
  } else {
    dbInstance = new SQL.Database();
  }

  // Create tables
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS portfolio_projects (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      student_name TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      project_type TEXT NOT NULL,
      scratch_url TEXT,
      scratch_project_id TEXT,
      sb3_data TEXT,
      sb3_filename TEXT,
      instructions TEXT,
      category TEXT DEFAULT 'game',
      likes INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS teacher_quizzes (
      id TEXT PRIMARY KEY,
      teacher_id TEXT NOT NULL,
      teacher_name TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      subject TEXT NOT NULL,
      target_group TEXT DEFAULT 'All',
      time_limit_minutes INTEGER DEFAULT 10,
      questions_json TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS quiz_submissions (
      id TEXT PRIMARY KEY,
      quiz_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      student_name TEXT NOT NULL,
      score INTEGER NOT NULL,
      total_score INTEGER NOT NULL,
      percentage INTEGER NOT NULL,
      answers_json TEXT NOT NULL,
      submitted_at INTEGER NOT NULL
    );
  `);

  // Seed default data if empty
  seedDefaults(dbInstance);
  persistSqliteDb();

  return dbInstance;
}

export function persistSqliteDb(): void {
  if (!dbInstance) return;
  try {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    console.error('[SQLite] Error persisting database to disk:', err);
  }
}

function seedDefaults(db: Database) {
  // Check if portfolio has projects
  const projCount = db.exec('SELECT COUNT(*) as cnt FROM portfolio_projects');
  const count = projCount[0]?.values[0]?.[0] as number;
  if (!count || count === 0) {
    console.log('[SQLite] Seeding sample portfolio Scratch projects...');
    const now = Date.now();
    const sampleProjects = [
      {
        id: 'proj_sample_1',
        student_id: 'user_tariq',
        student_name: 'Tariq Al-Mansoor',
        title: 'Space Blaster 3000',
        description: 'Exciting arcade retro space shooter with laser powerups, meteor dodging, and boss battles!',
        project_type: 'turbowarp_link',
        scratch_url: 'https://scratch.mit.edu/projects/10128407/',
        scratch_project_id: '10128407',
        sb3_data: null,
        sb3_filename: null,
        instructions: 'Use Arrow Keys or WASD to fly the spaceship. Press SPACEBAR to fire plasma lasers. Dodge asteroids!',
        category: 'game',
        likes: 18,
        created_at: now - 86400000 * 2
      },
      {
        id: 'proj_sample_2',
        student_id: 'user_maya',
        student_name: 'Maya Nour',
        title: 'Geometry Dash & Gravity Inverter',
        description: 'Rhythm platformer with jumping blocks, gravity pads, and colorful animated particle effects.',
        project_type: 'scratch_link',
        scratch_url: 'https://scratch.mit.edu/projects/60917032/',
        scratch_project_id: '60917032',
        sb3_data: null,
        sb3_filename: null,
        instructions: 'Click or tap SPACE to jump over spikes and obstacles. Timing is everything!',
        category: 'game',
        likes: 24,
        created_at: now - 86400000 * 5
      },
      {
        id: 'proj_sample_3',
        student_id: 'user_kareem',
        student_name: 'Kareem Tarek',
        title: 'Interactive Piano & Drum Synthesizer',
        description: 'Play realistic piano chords, violin sounds, and electronic beats using Scratch sound instruments.',
        project_type: 'scratch_link',
        scratch_url: 'https://scratch.mit.edu/projects/104/',
        scratch_project_id: '104',
        sb3_data: null,
        sb3_filename: null,
        instructions: 'Keys 1 through 8 play musical octaves. Press D for drum beat and S to stop audio.',
        category: 'animation',
        likes: 14,
        created_at: now - 86400000 * 10
      }
    ];

    for (const p of sampleProjects) {
      db.run(
        `INSERT INTO portfolio_projects (id, student_id, student_name, title, description, project_type, scratch_url, scratch_project_id, sb3_data, sb3_filename, instructions, category, likes, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.id,
          p.student_id,
          p.student_name,
          p.title,
          p.description,
          p.project_type,
          p.scratch_url,
          p.scratch_project_id,
          p.sb3_data,
          p.sb3_filename,
          p.instructions,
          p.category,
          p.likes,
          p.created_at
        ]
      );
    }
  }

  // Check if quizzes exist
  const quizCount = db.exec('SELECT COUNT(*) as cnt FROM teacher_quizzes');
  const qCount = quizCount[0]?.values[0]?.[0] as number;
  if (!qCount || qCount === 0) {
    console.log('[SQLite] Seeding sample teacher quizzes...');
    const now = Date.now();
    const sampleQuizzes = [
      {
        id: 'quiz_scratch_101',
        teacher_id: 'teacher_1',
        teacher_name: 'Mr. Ahmed (Computer Science)',
        title: 'Scratch 3.0 Logic, Coordinates & Events',
        description: 'Assess fundamental understanding of Scratch stage coordinates, forever loops, sensing blocks, and message broadcasting.',
        subject: 'Scratch Coding',
        target_group: 'All',
        time_limit_minutes: 10,
        questions_json: JSON.stringify([
          {
            id: 'q1',
            question: 'What are the (X, Y) coordinates of the exact center of the Scratch stage?',
            options: ['(X: 100, Y: 100)', '(X: 0, Y: 0)', '(X: 240, Y: 180)', '(X: -240, Y: -180)'],
            correctIndex: 1,
            explanation: 'In Scratch, the center of the coordinate grid is at X: 0 and Y: 0.',
            points: 20
          },
          {
            id: 'q2',
            question: 'Which block executes code repeatedly without ever stopping on its own?',
            options: ['repeat (10)', 'wait (1) secs', 'forever', 'if <touching mouse?> then'],
            correctIndex: 2,
            explanation: 'The "forever" C-block repeats whatever is inside continuously until the red Stop sign is pressed.',
            points: 20
          },
          {
            id: 'q3',
            question: 'How do different sprites send signals to trigger actions in each other?',
            options: ['Broadcast message and When I receive message', 'Change X by 10', 'Say Hello for 2 seconds', 'Switch costume to sprite2'],
            correctIndex: 0,
            explanation: 'Broadcast blocks allow events to communicate asynchronously between different sprites and the stage.',
            points: 20
          },
          {
            id: 'q4',
            question: 'Which block category contains "touching color?", "key space pressed?", and "distance to mouse-pointer"?',
            options: ['Motion', 'Sensing', 'Looks', 'Sound'],
            correctIndex: 1,
            explanation: 'The light blue Sensing palette contains condition blocks that test user inputs and collisions.',
            points: 20
          },
          {
            id: 'q5',
            question: 'What file format is used when you save a project directly to your computer from Scratch 3.0?',
            options: ['.sb3', '.scratch', '.exe', '.zip'],
            correctIndex: 0,
            explanation: 'Scratch 3.0 saves files with the .sb3 extension (which is a zipped JSON + asset container).',
            points: 20
          }
        ]),
        created_at: now - 86400000 * 3
      },
      {
        id: 'quiz_math_speed',
        teacher_id: 'teacher_2',
        teacher_name: 'Ms. Layla (Mathematics)',
        title: 'Speed Mental Arithmetic & Algebraic Logic',
        description: 'Test your quick thinking, order of operations (PEMDAS), and multi-step word problem solving.',
        subject: 'Mathematics',
        target_group: 'Math Group A',
        time_limit_minutes: 8,
        questions_json: JSON.stringify([
          {
            id: 'qm1',
            question: 'What is the value of: 8 + 4 * 3 - 6 / 2 ?',
            options: ['17', '18', '21', '14'],
            correctIndex: 0,
            explanation: 'Order of operations: 4*3=12, 6/2=3, so 8 + 12 - 3 = 17.',
            points: 25
          },
          {
            id: 'qm2',
            question: 'If 3x + 15 = 45, what is x?',
            options: ['5', '10', '15', '12'],
            correctIndex: 1,
            explanation: '3x = 45 - 15 = 30, so x = 30 / 3 = 10.',
            points: 25
          },
          {
            id: 'qm3',
            question: 'What is the perimeter of a rectangle with length 14 cm and width 8 cm?',
            options: ['44 cm', '112 cm', '22 cm', '56 cm'],
            correctIndex: 0,
            explanation: 'Perimeter = 2 * (length + width) = 2 * (14 + 8) = 2 * 22 = 44 cm.',
            points: 25
          },
          {
            id: 'qm4',
            question: 'What is 15% of 240?',
            options: ['32', '36', '40', '24'],
            correctIndex: 1,
            explanation: '10% of 240 is 24, 5% is 12, 24 + 12 = 36.',
            points: 25
          }
        ]),
        created_at: now - 86400000 * 2
      }
    ];

    for (const q of sampleQuizzes) {
      db.run(
        `INSERT INTO teacher_quizzes (id, teacher_id, teacher_name, title, description, subject, target_group, time_limit_minutes, questions_json, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          q.id,
          q.teacher_id,
          q.teacher_name,
          q.title,
          q.description,
          q.subject,
          q.target_group,
          q.time_limit_minutes,
          q.questions_json,
          q.created_at
        ]
      );
    }
  }
}
