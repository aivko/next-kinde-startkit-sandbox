import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import { postHandler, getHandler, patchHandler } from "./index";

const initKindeServerSession = async () => {
  const { getUser, isAuthenticated } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    return new Response("Unauthorized", { status: 401 });
  }

  return await getUser();
}

export async function GET() {
  const user:any = await initKindeServerSession();
  const data = await getHandler({ id: user.id });

  return NextResponse.json({ data });
}

export async function POST() {
  const user:any = await initKindeServerSession();
  const data = await postHandler({
    id: user.id,
    req: NextRequest,
  });

  return NextResponse.json({ data });
}

export async function PATCH(req:any) {
  const user:any = await initKindeServerSession();
  const payload = await req.json();

  const data = await patchHandler({
    id: user.id,
    data: payload,
  });

  return NextResponse.json({ data });
}
