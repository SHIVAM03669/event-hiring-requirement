import { NextRequest, NextResponse } from "next/server";
import { getById } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const requirement = await getById(id);
  if (!requirement) {
    return NextResponse.json(
      { success: false, error: "Not found" },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, data: requirement });
}
