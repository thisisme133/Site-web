import { jsPDF } from "jspdf"

export interface FactureLigne {
  description: string
  quantite: number
  prix_unitaire: number
}

export interface FactureRecordForPdf {
  numero_facture: string
  client_nom: string
  client_adresse?: string | null
  client_email?: string | null
  client_siret?: string | null
  date_emission: string
  date_echeance: string
  lignes: FactureLigne[]
  montant_total: number
  type: string
  statut?: string | null
  moyen_paiement?: string | null
  notes?: string | null
}

const dsfrPrimary = "#000091"
const dsfrGrey = "#e5e5f4"

export function generateFacturePdfBuffer(facture: FactureRecordForPdf): Buffer {
  const doc = new jsPDF({ unit: "pt" })

  const addHeader = () => {
    doc.setFillColor(dsfrPrimary)
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 72, "F")
    doc.setTextColor("#ffffff")
    doc.setFontSize(20)
    doc.text("Les Petits Bergers", 40, 42)
    doc.setFontSize(12)
    doc.text("Facture officielle", 40, 60)
  }

  const addMeta = () => {
    doc.setTextColor("#000")
    doc.setFontSize(16)
    doc.text(`Facture n° ${facture.numero_facture}`, 40, 110)
    doc.setFontSize(11)
    doc.text(`Émise le : ${formatDate(facture.date_emission)}`, 40, 130)
    doc.text(`À régler pour le : ${formatDate(facture.date_echeance)}`, 40, 146)
    if (facture.statut) {
      const badgeX = 400
      const badgeY = 118
      doc.setFillColor(dsfrGrey)
      doc.roundedRect(badgeX, badgeY, 160, 26, 6, 6, "F")
      doc.setTextColor(dsfrPrimary)
      doc.setFontSize(12)
      doc.text(`Statut : ${facture.statut === "payee" ? "Payée" : "À régler"}`, badgeX + 12, badgeY + 17)
      doc.setTextColor("#000")
    }
  }

  const addClient = () => {
    doc.setFontSize(14)
    doc.text("Client", 40, 186)
    doc.setFontSize(11)
    doc.setFillColor(dsfrGrey)
    doc.roundedRect(40, 196, doc.internal.pageSize.getWidth() - 80, 70, 8, 8, "F")
    doc.setTextColor("#000")
    const lines = [
      facture.client_nom,
      facture.client_adresse,
      facture.client_email,
      facture.client_siret ? `SIRET : ${facture.client_siret}` : undefined,
    ].filter(Boolean) as string[]
    lines.forEach((line, idx) => {
      doc.text(line, 56, 220 + idx * 16)
    })
  }

  const addTable = () => {
    let startY = 290
    doc.setFontSize(12)
    doc.text("Détail des prestations", 40, startY)
    startY += 12

    doc.setFillColor(dsfrPrimary)
    doc.setTextColor("#ffffff")
    doc.rect(40, startY, doc.internal.pageSize.getWidth() - 80, 28, "F")
    doc.text("Description", 50, startY + 18)
    doc.text("Qté", 340, startY + 18)
    doc.text("PU", 400, startY + 18)
    doc.text("Total", 480, startY + 18)

    doc.setTextColor("#000")
    let currentY = startY + 38
    facture.lignes.forEach((ligne) => {
      const total = (ligne.quantite * ligne.prix_unitaire).toFixed(2)
      doc.setFillColor(dsfrGrey)
      doc.roundedRect(40, currentY - 12, doc.internal.pageSize.getWidth() - 80, 26, 6, 6, "F")
      doc.text(ligne.description, 50, currentY + 4)
      doc.text(String(ligne.quantite), 350, currentY + 4)
      doc.text(`${ligne.prix_unitaire.toFixed(2)} €`, 410, currentY + 4)
      doc.text(`${total} €`, 490, currentY + 4)
      currentY += 32
    })

    currentY += 10
    doc.setFontSize(13)
    doc.text("Total à payer", 400, currentY)
    doc.setFillColor(dsfrPrimary)
    doc.setTextColor("#ffffff")
    doc.roundedRect(480, currentY - 18, 80, 28, 6, 6, "F")
    doc.text(`${facture.montant_total.toFixed(2)} €`, 520, currentY)
    doc.setTextColor("#000")

    if (facture.notes) {
      currentY += 40
      doc.setFontSize(12)
      doc.text("Notes", 40, currentY)
      doc.setFontSize(11)
      const splitNotes = doc.splitTextToSize(facture.notes, doc.internal.pageSize.getWidth() - 80)
      doc.text(splitNotes, 40, currentY + 16)
    }
  }

  addHeader()
  addMeta()
  addClient()
  addTable()

  const buffer = Buffer.from(doc.output("arraybuffer"))
  return buffer
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return dateStr
  }
}
