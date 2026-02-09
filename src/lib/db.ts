import { promises as fs } from 'fs';
import path from 'path';
import { User, UserFormData } from '@/types/user';
import { nanoid } from 'nanoid';

function isServerlessEnvironment(): boolean {
  return process.env.NODE_ENV === 'production';
}

const DB_PATH = path.join(process.cwd(), 'server', 'db.json');

interface Database {
  users: User[];
}

let inMemoryDb: Database | null = null;

function initInMemoryDb(): Database {
  if (!inMemoryDb) {
    inMemoryDb = { users: [] };
  }
  return inMemoryDb;
}

async function ensureDatabaseFile(): Promise<Database> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data) as Database;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      const initialData: Database = { users: [] };
      await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
      await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    throw error;
  }
}

async function readDatabase(): Promise<Database> {
  if (isServerlessEnvironment()) {
    return initInMemoryDb();
  } else {
    try {
      return await ensureDatabaseFile();
    } catch (error: any) {
      console.warn('File-based storage failed, falling back to in-memory:', error.message);
      return initInMemoryDb();
    }
  }
}

async function writeDatabase(data: Database): Promise<void> {
  if (isServerlessEnvironment()) {
    inMemoryDb = data;
  } else {
    try {
      await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error: any) {
      console.warn('File write failed, using in-memory storage:', error.message);
      inMemoryDb = data;
    }
  }
}

export async function getAllUsers(): Promise<User[]> {
  const db = await readDatabase();
  return db.users;
}

export async function getUserById(id: string): Promise<User | null> {
  const db = await readDatabase();
  return db.users.find(user => user.id === id) || null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await readDatabase();
  return db.users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function createUser(userData: UserFormData): Promise<User> {
  const db = await readDatabase();
  
  const existingUser = await getUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('Email already exists');
  }
  
  const newUser: User = {
    id: nanoid(),
    ...userData,
  };
  db.users.push(newUser);
  await writeDatabase(db);
  return newUser;
}

export async function updateUser(id: string, userData: UserFormData): Promise<User | null> {
  const db = await readDatabase();
  const userIndex = db.users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return null;
  }
  
  const existingUser = await getUserByEmail(userData.email);
  if (existingUser && existingUser.id !== id) {
    throw new Error('Email already exists');
  }
  
  const updatedUser: User = {
    id,
    ...userData,
  };
  
  db.users[userIndex] = updatedUser;
  await writeDatabase(db);
  return updatedUser;
}

export async function deleteUser(id: string): Promise<boolean> {
  const db = await readDatabase();
  const userIndex = db.users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return false;
  }
  
  db.users.splice(userIndex, 1);
  await writeDatabase(db);
  return true;
}
