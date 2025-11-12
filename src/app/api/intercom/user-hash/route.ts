import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import envConfig from 'src/config/env-config';

export const POST = async (request: NextRequest) => {
  try {
    const { user_id } = await request.json();

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 },
      );
    }

    const secret = envConfig.INTERCOM_SECRET_KEY;
    if (!secret) {
      return NextResponse.json(
        { error: 'Authentication service unavailable' },
        { status: 500 },
      );
    }

    const token = jwt.sign({ user_id }, secret, { expiresIn: '1h' });

    return NextResponse.json({ user_hash: token });
  } catch (error) {
    console.error('Error generating Intercom user hash:', error);
    return NextResponse.json(
      { error: 'Failed to generate user hash' },
      { status: 500 },
    );
  }
};
