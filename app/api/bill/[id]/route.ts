import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ FIX NEXT.JS TERBARU (params adalah Promise)
    const { id } = await context.params

    console.log("PARAMS ID:", id)

    // optional safety check
    if (!id) {
      return NextResponse.json(
        { error: "Missing id" },
        { status: 400 }
      )
    }

    // ambil data bill + relasi
    const bill = await prisma.bill.findUnique({
      where: { id },
      include: {
        items: true,
        participants: true,
      },
    })

    // kalau tidak ketemu
    if (!bill) {
      return NextResponse.json(
        { message: "Bill not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(bill)
  } catch (error: any) {
    console.error("🔥 GET BILL ERROR:", error)

    return NextResponse.json(
      {
        error: error?.message || "Internal Server Error",
      },
      { status: 500 }
    )
  }
}