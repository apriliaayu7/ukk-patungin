import { prisma } from "@/lib/prisma";

type CreateBillBody = {
  name: string;
  participants: string[];
};

export async function POST(req: Request) {
  try {
    const body: CreateBillBody = await req.json();

    const { name, participants } = body;

    if (!name || !participants || participants.length === 0) {
      return Response.json(
        { error: "Missing name or participants" },
        { status: 400 }
      );
    }

    // 🔥 HARDCODE USER DULU (biar ga error relation)
    const userId = "temp-user-id";

    const bill = await prisma.bill.create({
      data: {
        name,
        userId,
        participants: {
          create: participants.map((p: string) => ({
            name: p,
          })),
        },
      },
      include: {
        participants: true,
        items: true,
      },
    });

    return Response.json(bill);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}