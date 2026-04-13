"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { calculateBill } from "@/lib/calculate"

type Participant = {
  id: string
  name: string
}

type Share = {
  participantId: string
}

type Item = {
  id: string
  name: string
  price: number
  shares: Share[]
}

type Bill = {
  id: string
  participants: Participant[]
  items: Item[]
}

export default function ResultPage() {
  const params = useParams()
  const id = params.id as string

  const [bill, setBill] = useState<Bill | null>(null)
  const [result, setResult] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchBill = async () => {
      const res = await fetch(`/api/bill/${id}`)

      if (!res.ok) {
        console.error("Gagal fetch bill")
        return
      }

      const data: Bill = await res.json()

      setBill(data)

      // 🔥 FIX DI SINI
      const calc = calculateBill(data.items, data.participants)
      setResult(calc)
    }

    fetchBill()
  }, [id])

  if (!bill) return <div>Loading...</div>

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold mb-4">Hasil Split Bill</h1>

      {bill.participants.map((p) => (
        <div key={p.id} className="mb-2">
          {p.name}: Rp {Math.round(result[p.id] || 0)}
        </div>
      ))}
    </div>
  )
}