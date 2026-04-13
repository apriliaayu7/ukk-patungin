import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const data: {
      itemId: string;
      participantIds: string[];
    }[] = body.data;

    // 🔥 HAPUS SEMUA SHARE LAMA
    await prisma.itemShare.deleteMany({
      where: {
        itemId: {
          in: data.map((d) => d.itemId),
        },
      },
    });

    // 🔥 CREATE BARU
    const createData = data.flatMap((d) =>
      d.participantIds.map((pid) => ({
        itemId: d.itemId,
        participantId: pid,
      }))
    );

    await prisma.itemShare.createMany({
      data: createData,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed save share" }, { status: 500 });
  }
}