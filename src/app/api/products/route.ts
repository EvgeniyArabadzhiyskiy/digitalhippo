import { NextResponse } from "next/server";

const handler = (req: Request) => {
    console.log("Hi Djon");
  return NextResponse.json({ message: "Hello" });
};

export { handler as GET };

// export function GET(req: Request) {
//   console.log("Hi Djon");

//   return NextResponse.json({ message: "Hello" });
// }
