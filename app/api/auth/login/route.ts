import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

type Body = {
  email: string
  password: string
}

export async function POST(req: Request) {
  try {
    const { email, password }: Body = await req.json()

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // 🔥 PENTING: return ID juga
    return NextResponse.json({
      id: user.id,
      email: user.email,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}