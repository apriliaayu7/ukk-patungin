"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleRegister = async () => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      alert("Register gagal")
      return
    }

    alert("Berhasil daftar!")

    router.push("/login")
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="border p-6 w-80">
        <h1 className="text-xl font-bold mb-4 text-center">
          Register
        </h1>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full mb-4"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="bg-green-500 text-white w-full py-2"
        >
          Daftar
        </button>
      </div>
    </div>
  )
}