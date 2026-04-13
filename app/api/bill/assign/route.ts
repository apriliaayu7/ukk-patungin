import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

type Body = {
  itemId: string
  participantIds: string[]
}

export async function POST(req: Request) {
  try {
    const { itemId, participantIds }: Body = await req.json()

    // hapus lama
    await prisma.itemShare.deleteMany({
      where: { itemId },
    })

    // buat baru
    const data = participantIds.map((pid) => ({
      itemId,
      participantId: pid,
    }))

    await prisma.itemShare.createMany({
      data,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("ASSIGN ERROR:", error)

    return NextResponse.json(
      { error: "Gagal assign" },
      { status: 500 }
    )
  }
}