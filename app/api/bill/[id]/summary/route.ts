import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type Params = {
  id: string
}

export async function GET(
  req: Request,
  context: { params: Promise<Params> }
) {
  try {
    const { id } = await context.params

    console.log("SUMMARY BILL ID:", id)

    if (!id) {
      return NextResponse.json(
        { error: "Missing bill id" },
        { status: 400 }
      )
    }

    const bill = await prisma.bill.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            shares: {
              include: {
                participant: true,
              },
            },
          },
        },
        participants: true,
      },
    })

    if (!bill) {
      return NextResponse.json(
        { error: "Bill not found" },
        { status: 404 }
      )
    }

    const summary: Record<string, number> = {}

    for (const item of bill.items) {
      const shareCount = item.shares.length || 1
      const pricePerPerson = item.price / shareCount

      for (const share of item.shares) {
        const name = share.participant.name

        summary[name] = (summary[name] || 0) + pricePerPerson
      }
    }

    return NextResponse.json({
      billId: id,
      summary,
    })
  } catch (error: unknown) {
    // ✅ FIX: no any lagi
    const err = error as Error

    console.error("SUMMARY ERROR:", err.message)

    return NextResponse.json(
      {
        error: err.message || "Internal Server Error",
      },
      { status: 500 }
    )
  }
}