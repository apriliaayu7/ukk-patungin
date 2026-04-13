import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { itemId, participantIds } = body;

    // hapus dulu biar tidak double
    await prisma.itemShare.deleteMany({
      where: { itemId },
    });

    // insert baru
    await prisma.itemShare.createMany({
      data: participantIds.map((pid: string) => ({
        itemId,
        participantId: pid,
      })),
    });

    return Response.json({ success: true });
  } catch (err) {
    return new Response("Error saving share", { status: 500 });
  }
}