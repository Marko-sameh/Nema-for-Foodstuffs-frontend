import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get('refreshToken')?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

    // Refresh tokens are cookie-only now: forward the cookie to the backend
    // and never read/write a refresh token from/to any response body.
    const res = await fetch(`${backendUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    if (!res.ok) {
      throw new Error('Refresh failed');
    }

    const data = await res.json();
    const newAccessToken = data.data?.accessToken ?? data.data?.token;

    const response = NextResponse.json({ accessToken: newAccessToken });

    // Forward the backend's rotated refresh-token cookie straight through.
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      response.headers.append('set-cookie', setCookie);
    }

    return response;
  } catch (error) {
    const response = NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    response.cookies.delete('refreshToken');
    return response;
  }
}
