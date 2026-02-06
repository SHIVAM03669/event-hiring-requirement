import { NextRequest, NextResponse } from "next/server";
import { getAll, create } from "@/lib/db";

export async function GET(request: NextRequest) {
  const hireType = request.nextUrl.searchParams.get("hireType") || undefined;
  const data = await getAll(hireType);
  return NextResponse.json({ success: true, data });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const required = [
      "eventName",
      "eventType",
      "startDate",
      "location",
      "hireType",
      "contactName",
      "contactEmail",
    ];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    if (!["planner", "performer", "crew"].includes(body.hireType)) {
      return NextResponse.json(
        { success: false, error: "Invalid hireType" },
        { status: 400 }
      );
    }

    const requirement = await create(body);
    return NextResponse.json({ success: true, data: requirement }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}
