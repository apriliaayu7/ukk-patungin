import { toPng } from "html-to-image"

export async function exportPNG(element: HTMLElement) {
  const dataUrl = await toPng(element)

  const link = document.createElement("a")
  link.download = "bill.png"
  link.href = dataUrl
  link.click()
}