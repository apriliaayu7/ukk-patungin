import { NextResponse } from "next/server";

const cleanNumber = (text: string) => {
  return parseInt(text.replace(/\D/g, ""), 10) || 0;
};

const extractItems = (text: string) => {
  const lines = text.split("\n");

  const items: { name: string; price: number }[] = [];

  for (const line of lines) {
    const match = line.match(/(.+?)\s+([0-9.]+)$/);

    if (!match) continue;

    const name = match[1].trim();
    const price = cleanNumber(match[2]);

    if (price < 100) continue;

    items.push({ name, price });
  }

  return items;
};

const extractTotal = (text: string) => {
  const match = text.match(/total\s*[:\-]?\s*([0-9.]+)/i);

  if (!match) return 0;

  return cleanNumber(match[1]);
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const ocrText = body.text;

    const items = extractItems(ocrText);
    const total = extractTotal(ocrText);

    return NextResponse.json({
      items,
      total,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "scan failed" },
      { status: 500 }
    );
  }
}