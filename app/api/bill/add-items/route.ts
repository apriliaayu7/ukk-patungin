import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// ✅ TYPE SAFE (tidak pakai any lagi)
type Item = {
  name: string
  price: number
  quantity?: number
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { billId, items } = body

    if (!billId || !Array.isArray(items)) {
      return NextResponse.json(
        { message: "Missing billId or items" },
        { status: 400 }
      )
    }

    const typedItems = items as Item[]

    const updatedBill = await prisma.bill.update({
      where: {
        id: billId,
      },
      data: {
        items: {
          create: typedItems.map((item) => ({
            name: item.name,
            price: item.price,
            // ❗ quantity DIHAPUS karena tidak ada di schema Prisma kamu
          })),
        },
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json(updatedBill)
  } catch (error: unknown) {
    console.error("ADD ITEMS ERROR:", error)

    const message =
      error instanceof Error ? error.message : "Internal Server Error"

    return NextResponse.json(
      { message },
      { status: 500 }
    )
  }
}