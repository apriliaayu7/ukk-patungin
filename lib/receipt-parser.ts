export type ParsedItem = {
  name: string;
  price: number;
};

export function parseReceipt(text: string): ParsedItem[] {
  const lines = text.split("\n");

  const items: ParsedItem[] = [];
  const seen = new Set<string>(); // 🔥 anti duplicate

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) continue;

    const lower = line.toLowerCase();

    // ❌ skip semua non-item
    if (
      !line.includes("Rp") ||
      lower.includes("subtotal") ||
      lower.includes("total") ||
      lower.includes("grand") ||
      lower.includes("pbi") ||
      lower.includes("pos") ||
      lower.includes("esb")
    ) {
      continue;
    }

    const match = line.match(/(.+?)\s*-\s*Rp\s*([\d.,]+)/i);
    if (!match) continue;

    const name = match[1].trim();
    const priceRaw = match[2].replace(/[^\d]/g, "");

    let price = parseInt(priceRaw);
    if (isNaN(price)) continue;

    // 🔥 FIX RIBUAN
    if (price < 100) {
      price = price * 1000;
    }

    // 🔥 KEY UNTUK CEK DUPLIKAT
    const key = `${name}-${price}`;

    if (seen.has(key)) continue; // skip duplicate
    seen.add(key);

    items.push({ name, price });
  }

  return items;
}