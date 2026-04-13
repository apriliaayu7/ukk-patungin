"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { Check, ArrowRight } from "lucide-react"

type Participant = {
  id: string
  name: string
}

type Item = {
  id: string
  name: string
  price: number
}

type Bill = {
  id: string
  name: string
  items: Item[]
  participants: Participant[]
}

export default function AssignPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [bill, setBill] = useState<Bill | null>(null)

  // 🔥 itemId -> participantIds
  const [selected, setSelected] = useState<Record<string, string[]>>({})

  const [loading, setLoading] = useState(false)

  // ✅ FETCH BILL (TETAP SAMA)
  useEffect(() => {
    if (!id) return

    const load = async () => {
      try {
        const res = await axios.get(`/api/bill/${id}`)
        setBill(res.data)
      } catch (err) {
        console.error(err)
      }
    }

    load()
  }, [id])

  // ✅ TOGGLE (LOGIC LAMA)
  const toggleParticipant = (itemId: string, participantId: string) => {
    setSelected(prev => {
      const current = prev[itemId] ?? []

      return {
        ...prev,
        [itemId]: current.includes(participantId)
          ? current.filter(id => id !== participantId)
          : [...current, participantId],
      }
    })
  }

  // ✅ FORMAT RUPIAH
  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID").format(value)

  // ✅ SAVE (TETAP API LAMA)
  const handleSave = async () => {
    if (loading) return
    setLoading(true)

    try {
      const payload = Object.entries(selected).map(
        ([itemId, participantIds]) => ({
          itemId,
          participantIds,
        })
      )

      await axios.post("/api/item-share/bulk", {
        data: payload,
      })

      router.push(`/bill/${id}/summary`)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!bill) return <p>Loading...</p>

  const subtotal = bill.items.reduce((sum, i) => sum + i.price, 0)

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">{bill.name}</h2>

      {/* 🔥 ITEMS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bill.items.map(item => {
          const selectedIds = selected[item.id] ?? []

          return (
            <div key={item.id} className="border p-4 rounded-xl shadow-sm">
              <h3 className="font-bold text-lg">{item.name}</h3>
              <p className="text-gray-500">
                Rp {formatRupiah(item.price)}
              </p>

              {/* 🔥 PARTICIPANTS (UI BARU) */}
              <div className="flex flex-wrap gap-2 mt-4">
                {bill.participants.map(p => {
                  const active = selectedIds.includes(p.id)

                  return (
                    <button
                      key={p.id}
                      onClick={() => toggleParticipant(item.id, p.id)}
                      className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                        active
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {p.name}
                      {active && <Check size={12} />}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* 🔥 SUMMARY */}
      <div className="mt-10 border-t pt-6">
        <p className="text-gray-600">
          Subtotal: Rp {formatRupiah(subtotal)}
        </p>

        {/* ❌ TAX DIHAPUS karena DB kamu ga ada */}
        
        <h3 className="font-bold text-xl mt-2">
          Total: Rp {formatRupiah(subtotal)}
        </h3>

        <button
          onClick={handleSave}
          disabled={loading}
          className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-full flex items-center gap-2"
        >
          {loading ? "Saving..." : "Next"}
          <ArrowRight />
        </button>
      </div>
    </div>
  )
}