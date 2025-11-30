// Coole (51320) coordinates
export const COOLE_COORDINATES = {
  lat: 48.7833,
  lon: 4.4167,
}

// Calculate distance between two points using Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

// Calculate travel cost (0.5€/km beyond 20km from Coole)
export function calculateTravelCost(distanceKm: number): number {
  if (distanceKm <= 20) return 0
  return Math.round((distanceKm - 20) * 0.5 * 100) / 100
}

// Generate unique reservation code
export function generateReservationCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Reservation type
export interface Reservation {
  code: string
  type: "garde" | "comportementaliste"
  nom: string
  email: string
  telephone: string
  ville: string
  animalNom: string
  createdAt: string
  status: "pending" | "confirmed" | "cancelled"
  messages: Message[]
}

export interface Message {
  id: string
  content: string
  sender: "client" | "admin"
  createdAt: string
  read: boolean
}
