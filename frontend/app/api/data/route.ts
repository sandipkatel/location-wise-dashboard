import { NextResponse } from "next/server";

// This would typically fetch from a database
// For now, it shares the global data from upload route
export async function GET() {
  try {
    const response = await fetch("http://localhost:3000/api/upload");
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
