import { promises as fs } from 'fs';
import path from 'path';
import { User, UserFormData } from '@/types/user';
import { nanoid } from 'nanoid';

const isServerless = process.env.NODE_ENV === 'production';
const DB_PATH = isServerless
  ? path.join('/tmp', 'db.json')
  : path.join(process.cwd(), 'server', 'db.json');

interface Database {
  users: User[];
}

async function ensureDatabase(): Promise<Database> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data) as Database;
  } catch (error: any) {
    // if (error.code === 'ENOENT') {
    //   const initialData: Database = { users: [] };
    //   await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    //   await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
    //   return initialData;
    // }
    throw error;
  }
}

async function readDatabase(): Promise<Database> {
  return await ensureDatabase();
}

async function writeDatabase(data: Database): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getAllUsers(): Promise<User[]> {
  const db = await readDatabase();
  return db.users;
}

export async function getUserById(id: string): Promise<User | null> {
  const db = await readDatabase();
  return db.users.find(user => user.id === id) || null;
}

export async function createUser(userData: UserFormData): Promise<User> {
  const db = await readDatabase();
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
