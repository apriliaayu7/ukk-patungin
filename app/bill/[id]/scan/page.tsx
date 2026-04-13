"use client";

import React, { useState, ChangeEvent } from "react";
import { Scan, Upload, ArrowRight, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

import { Sidebar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";

type Item = {
  name: string;
  price: number;
};

export default function ScanPage() {
  const router = useRouter();
  const params = useParams();

  const id = params?.id as string;

  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ upload gambar
  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // ✅ parser OCR
  const parseText = (text: string): Item[] => {
    const lines = text.split("\n");
    const items: Item[] = [];

    const blacklist = [
      "subtotal","total","grand","tax","service","charge",
      "cash","change","pos","esb","pbi","pb1",
    ];

    for (const rawLine of lines) {
      const clean = rawLine.trim();
      const lower = clean.toLowerCase();

      if (!clean) continue;
      if (blacklist.some((b) => lower.includes(b))) continue;

      const match = clean.match(/^(\d+)\s+(.+)\s+(\d[\d.]*)$/);
      if (!match) continue;

      const name = match[2].trim();
      const price = parseInt(match[3].replace(/\./g, ""));

      if (isNaN(price)) continue;

      items.push({ name, price });
    }

    return items;
  };

  // ✅ scan
  const handleScan = async () => {
    if (!image) {
      alert("Upload gambar dulu");
      return;
    }

    if (!id) {
      alert("Bill ID tidak ditemukan");
      return;
    }

    setLoading(true);

    try {
      const Tesseract = (await import("tesseract.js")).default;

      const result = await Tesseract.recognize(image, "eng");
      const text = result.data.text;

      const items = parseText(text);

      if (items.length === 0) {
        alert("Item tidak terbaca");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/bill/add-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billId: id,
          items,
        }),
      });

      if (!res.ok) {
        alert("Gagal simpan");
        setLoading(false);
        return;
      }

      router.push(`/bill/${id}/assign`);
    } catch (err) {
      console.error(err);
      alert("Gagal scan");
    }

    setLoading(false);
  };

  return (
    <div className="flex">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
        {/* TOPBAR */}
        <TopBar />

        {/* CONTENT */}
        <main className="flex-1 p-6 md:p-12 flex justify-center">
          <div className="w-full max-w-2xl">

            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Scan Struk
            </h2>

            {/* CARD */}
            <div className="bg-white shadow rounded-xl p-6 md:p-8 space-y-6">

              {/* UPLOAD */}
              <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 md:p-10 cursor-pointer hover:bg-gray-50 transition">
                <Upload className="w-10 h-10 mb-2" />
                <span className="font-semibold text-center">
                  Upload Gambar Struk
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>

              {/* PREVIEW */}
              {image && (
                <div className="flex justify-center">
                  <img
                    src={image}
                    alt="preview"
                    className="w-48 md:w-64 rounded border"
                  />
                </div>
              )}

              {/* BUTTON */}
              <button
                onClick={handleScan}
                disabled={loading}
                className="w-full bg-blue-500 text-white py-4 rounded-full flex justify-center items-center gap-2 hover:scale-[1.02] active:scale-95 transition"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    Scan & Next <ArrowRight />
                  </>
                )}
              </button>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}