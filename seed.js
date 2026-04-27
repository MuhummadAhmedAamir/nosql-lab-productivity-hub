// seed.js
// =============================================================================
//  Seed the database with realistic test data.
//  Run with: npm run seed
//
//  Required minimum:
//    - 2 users
//    - 4 projects (split across the users)
//    - 5 tasks (with embedded subtasks and tags arrays)
//    - 5 notes (some attached to projects, some standalone)
//
//  Use the bcrypt module to hash passwords before inserting users.
//  Use ObjectId references for relationships (projectId, ownerId).
// =============================================================================

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connect } = require('./db/connection');

(async () => {
  const db = await connect();

  // OPTIONAL: clear existing data so re-seeding is idempotent
  // await db.collection('users').deleteMany({});
  // await db.collection('projects').deleteMany({});
  // await db.collection('tasks').deleteMany({});
  // await db.collection('notes').deleteMany({});

  // =============================================================================
  //  TODO: Insert your seed data below.
  //
  //  Hints:
  //    - Hash passwords:   const hash = await bcrypt.hash('password123', 10);
  //    - Capture inserted ids:
  //        const u = await db.collection('users').insertOne({ ... });
  //        const userId = u.insertedId;
  //    - Use those ids when inserting projects/tasks/notes.
  //    - Demonstrate schema flexibility: include at least one optional field
  //      on SOME documents but not all (e.g. dueDate on some tasks only).
  //
  //  Sample task shape:
  //    {
  //      ownerId: <ObjectId>,
  //      projectId: <ObjectId>,
  //      title: "Write report introduction",
  //      status: "todo",
  //      priority: 3,
  //      tags: ["writing", "urgent"],
  //      subtasks: [
  //        { title: "Outline sections", done: true },
  //        { title: "Draft", done: false }
  //      ],
  //      createdAt: new Date()
  //    }
  // =============================================================================
  
  const hash1 = await bcrypt.hash('password123', 10);
  const hash2 = await bcrypt.hash('password12', 10);

  const users = await db.collection('users').insertMany([
    {
      email: "ahmed@gmail.com",
      passwordHash: hash1,
      name: "Ahmed",
      createdAt: new Date()
    },
    {
      email: "aamir@gmail.com",
      passwordHash: hash2,
      name: "Aamir",
      createdAt: new Date()
    }
  ])
  const userIds = Object.values(users.insertedIds);

  const projects = await db.collection('projects').insertMany([
    { ownerId: userIds[0], name: 'Work Project', archived: false, createdAt: new Date() },
    { ownerId: userIds[0], name: 'Side Project', archived: false, createdAt: new Date() },
    { ownerId: userIds[1], name: 'Home Renovation', archived: false, createdAt: new Date() },
    { ownerId: userIds[1], name: 'Fitness Goals', archived: true, createdAt: new Date() }
  ]);
  const projectIds = Object.values(projects.insertedIds);

  await db.collection('tasks').insertMany([
  {
    ownerId: userIds[0],
    projectId: projectIds[0],
    title: 'Setup Environment',
    status: 'todo',
    priority: 1,
    tags: ['infra', 'setup'],
    subtasks: [{ title: 'Install Docker', done: true }, { title: 'Configure Mongo', done: false }],
    dueDate: new Date(), // Flexible field
    createdAt: new Date()
  },
  {
    ownerId: userIds[0],
    projectId: projectIds[0],
    title: 'Code Review',
    status: 'in-progress',
    priority: 2,
    tags: ['review'],
    subtasks: [],
    createdAt: new Date() // No dueDate here (Flexible)
  },
    {
    ownerId: userIds[1],
    projectId: projectIds[3],
    title: 'Code Review',
    status: 'in-progress',
    priority: 2,
    tags: ['review'],
    subtasks: [],
    dueDate: new Date(),
    createdAt: new Date() 
  },
    {
    ownerId: userIds[1],
    projectId: projectIds[1],
    title: 'Code Review',
    status: 'in-progress',
    priority: 2,
    tags: ['review'],
    subtasks: [],
    createdAt: new Date() // No dueDate here (Flexible)
  },
    {
    ownerId: userIds[0],
    projectId: projectIds[2],
    title: 'Code Review',
    status: 'in-progress',
    priority: 2,
    tags: ['review'],
    subtasks: [],
    createdAt: new Date() // No dueDate here (Flexible)
  },
  ]);

  await db.collection('notes').insertMany([
  { ownerId: userIds[0], projectId: projectIds[1], title: 'Meeting Notes', body: 'Project kickoff', tags: ['work'], pinned: true, createdAt: new Date() },
  { ownerId: userIds[1], title: 'Shopping List', body: 'Paint, brushes', tags: ['home'], createdAt: new Date() },
  { ownerId: userIds[0], projectId: projectIds[0],title: 'Meeting Notes', body: 'Project kickoff', tags: ['work'], pinned: true, createdAt: new Date() },
  { ownerId: userIds[1], title: 'Shopping List', body: 'Paint, brushes', tags: ['home'], createdAt: new Date() },
  { ownerId: userIds[0], title: 'Meeting Notes', body: 'Project kickoff', tags: ['work'], pinned: true, createdAt: new Date() },
  { ownerId: userIds[1], projectId: projectIds[2],title: 'Shopping List', body: 'Paint, brushes', tags: ['home'], createdAt: new Date() }
]);


  process.exit(0);
})();
