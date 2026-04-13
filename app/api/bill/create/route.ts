import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

type RequestBody = {
  name: string
  userId: string
  participants: string[]
}

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json()

    console.log("BODY MASUK:", body) // 🔥 DEBUG

    const { name, userId, participants } = body

    // validasi
    if (!name || !userId) {
      return NextResponse.json(
        { error: "Name atau userId kosong" },
        { status: 400 }
      )
    }

    const cleanParticipants = participants.filter(
      (p) => p.trim() !== ""
    )

    if (cleanParticipants.length === 0) {
      return NextResponse.json(
        { error: "Participants kosong" },
        { status: 400 }
      )
    }

    const bill = await prisma.bill.create({
      data: {
        name,
        userId,
        participants: {
          create: cleanParticipants.map((p) => ({
            name: p,
          })),
        },
      },
      include: {
        participants: true,
      },
    })

    console.log("BILL BERHASIL:", bill) // 🔥 DEBUG

    return NextResponse.json(bill)
  } catch (error) {
    console.error("ERROR CREATE BILL:", error)

    return NextResponse.json(
      { error: "Server error", detail: String(error) },
      { status: 500 }
    )
  }
}