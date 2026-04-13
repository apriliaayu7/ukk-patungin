"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { Check, ArrowRight, Users, Info } from "lucide-react"

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
  const [selected, setSelected] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(false)

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

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID").format(value)

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

  if (!bill) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading bill...
      </div>
    )
  }

  const subtotal = bill.items.reduce((sum, i) => sum + i.price, 0)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      
      {/* HEADER */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Bill</span>
          <span>/</span>
          <span className="text-black font-semibold">Assign Items</span>
        </div>

        <h1 className="text-4xl font-black mt-2">
          Assign Items
        </h1>

        <p className="text-gray-500 mt-2 flex items-center gap-2">
          <Info size={16} />
          Pilih siapa yang makan apa
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT - ITEMS */}
        <div className="lg:col-span-8 space-y-6">

          {bill.items.map(item => {
            const selectedIds = selected[item.id] ?? []

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 shadow-sm border"
              >

                {/* ITEM HEADER */}
                <div className="flex justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">
                      {item.name}
                    </h3>
                    <p className="text-gray-500">
                      Rp {formatRupiah(item.price)}
                    </p>
                  </div>

                  <div className="text-xs px-3 py-1 rounded-full bg-gray-100">
                    {selectedIds.length === 0
                      ? "Unassigned"
                      : `${selectedIds.length} person`}
                  </div>
                </div>

                {/* PARTICIPANTS */}
                <div className="flex flex-wrap gap-3">
                  {bill.participants.map(p => {
                    const active = selectedIds.includes(p.id)

                    return (
                      <button
                        key={p.id}
                        onClick={() =>
                          toggleParticipant(item.id, p.id)
                        }
                        className={`
                          flex items-center gap-2 px-4 py-2 rounded-full text-sm
                          transition-all border
                          ${
                            active
                              ? "bg-black text-white"
                              : "bg-white hover:bg-gray-100"
                          }
                        `}
                      >
                        <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-[10px]">
                          {p.name[0]}
                        </div>
                        {p.name}
                        {active && <Check size={14} />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* RIGHT - SUMMARY */}
        <div className="lg:col-span-4 space-y-6">

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="font-bold text-xl mb-6">
              Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>Rp {formatRupiah(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Total</span>
                <span className="font-bold">
                  Rp {formatRupiah(subtotal)}
                </span>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={loading}
              className="mt-6 w-full bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2"
            >
              {loading ? "Saving..." : "Next"}
              <ArrowRight size={16} />
            </button>
          </div>

          {/* HINT CARD */}
          <div className="bg-blue-50 p-5 rounded-2xl text-sm text-blue-600">
            💡 Tip: Pastikan semua item sudah di-assign sebelum lanjut
          </div>

        </div>
      </div>
    </div>
  )
}