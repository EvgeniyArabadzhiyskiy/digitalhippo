import { NextResponse } from "next/server";

export function DELETE(req: Request, res: any) {
  const id = res.params.id
  // const { id } = params;
  console.log("DELETE  id:", id);

  return NextResponse.json({ message: id });
}
