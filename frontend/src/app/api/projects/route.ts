import { NextResponse } from "next/server";
import { getProjects, createProject } from "../../../lib/api/projects";

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json({ success: true, data: projects });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProject = await createProject(body);
    return NextResponse.json({ success: true, data: newProject }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
