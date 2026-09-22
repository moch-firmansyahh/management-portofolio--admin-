import { NextResponse } from "next/server";
import { updateMessageStatus, deleteMessage } from "../../../../lib/api/messages";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    await updateMessageStatus(id, !!body.read);
    return NextResponse.json({ success: true, message: "Status pesan berhasil diperbarui." });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteMessage(id);
    return NextResponse.json({ success: true, message: "Pesan berhasil dihapus." });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
