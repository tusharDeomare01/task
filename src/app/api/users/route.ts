import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, createUser } from '@/lib/db';
import { userSchema } from '@/lib/schema';

// GET /api/users - Get all users
export async function GET() {
  try {
    const users = await getAllUsers();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validationResult = userSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }
    
    try {
      const newUser = await createUser(validationResult.data);
      return NextResponse.json(newUser, { status: 201 });
    } catch (error: any) {
      if (error.message === 'Email already exists') {
        return NextResponse.json(
          { error: 'Email already exists', message: 'A user with this email address already exists' },
          { status: 409 }
        );
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: error.message === 'Email already exists' ? 409 : 500 }
    );
  }
}
