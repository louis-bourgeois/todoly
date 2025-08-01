import { NextResponse } from 'next/server';
import { User } from '../../../../../../server/models/User.js';
import { connectDB } from '../../../../../../server/config/dbConfig.js';

export async function GET(req) {
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const user = await User.findOne({ clerkId: userId });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(req) {
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const { username, email, bio } = await req.json();
  const user = await User.findOneAndUpdate(
    { clerkId: userId },
    { username, email, bio },
    { new: true }
  );

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}