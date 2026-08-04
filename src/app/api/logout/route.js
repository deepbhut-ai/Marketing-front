import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete('mk_refresh');
  res.cookies.delete('mk_session');
  res.cookies.delete('mk_role');
  return res;
}