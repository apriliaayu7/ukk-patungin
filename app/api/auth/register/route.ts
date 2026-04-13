import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

type Body = {
  email: string
  password: string
}

export async function POST(req: Request) {
  try {
    const { email, password }: Body = await req.json()

    const user = await prisma.user.create({
      data: {
        email,
        password,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal register" },
      { status: 500 }
    )
  }
}