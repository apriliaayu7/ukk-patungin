type Participant = {
  id: string
  name: string
}

type Item = {
  id: string
  name: string
  price: number
  shares: {
    participantId: string
  }[]
}

export function calculateBill(
  items: Item[],
  participants: Participant[]
) {
  const result: Record<string, number> = {}

  // init
  participants.forEach((p) => {
    result[p.id] = 0
  })

  items.forEach((item) => {
    const splitCount = item.shares.length
    if (splitCount === 0) return

    const pricePerPerson = item.price / splitCount

    item.shares.forEach((share) => {
      result[share.participantId] += pricePerPerson
    })
  })

  return result
}