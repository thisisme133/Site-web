import { createClient } from '@supabase/supabase-js'

// Client Supabase pour le côté client (utilise la clé publique)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Client Supabase pour le serveur (utilise la clé service role)
// À utiliser uniquement dans les API routes
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Types pour TypeScript
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'admin' | 'client'
          nom: string | null
          prenom: string | null
          telephone: string | null
          adresse: string | null
          ville: string | null
          code_postal: string | null
          created_at: string
          updated_at: string
          last_login: string | null
        }
        Insert: {
          id?: string
          email: string
          role: 'admin' | 'client'
          nom?: string | null
          prenom?: string | null
          telephone?: string | null
          adresse?: string | null
          ville?: string | null
          code_postal?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string
          role?: 'admin' | 'client'
          nom?: string | null
          prenom?: string | null
          telephone?: string | null
          adresse?: string | null
          ville?: string | null
          code_postal?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
      }
      chiens: {
        Row: {
          id: string
          proprietaire_id: string | null
          nom: string
          race: string
          date_naissance: string | null
          age: string | null
          sexe: string | null
          poids: number | null
          couleur: string | null
          numero_puce: string | null
          numero_tatouage: string | null
          veterinaire_nom: string | null
          veterinaire_telephone: string | null
          veterinaire_adresse: string | null
          vaccins: any | null
          allergies: string[] | null
          traitements_en_cours: string[] | null
          antecedents_medicaux: string | null
          assurance_nom: string | null
          assurance_numero: string | null
          caractere: string[] | null
          sociabilite: any | null
          peurs: string[] | null
          regime_alimentaire: string | null
          besoins_specifiques: string | null
          notes: string | null
          statut: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          proprietaire_id?: string | null
          nom: string
          race: string
          date_naissance?: string | null
          age?: string | null
          sexe?: string | null
          poids?: number | null
          couleur?: string | null
          numero_puce?: string | null
          numero_tatouage?: string | null
          veterinaire_nom?: string | null
          veterinaire_telephone?: string | null
          veterinaire_adresse?: string | null
          vaccins?: any | null
          allergies?: string[] | null
          traitements_en_cours?: string[] | null
          antecedents_medicaux?: string | null
          assurance_nom?: string | null
          assurance_numero?: string | null
          caractere?: string[] | null
          sociabilite?: any | null
          peurs?: string[] | null
          regime_alimentaire?: string | null
          besoins_specifiques?: string | null
          notes?: string | null
          statut?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          proprietaire_id?: string | null
          nom?: string
          race?: string
          date_naissance?: string | null
          age?: string | null
          sexe?: string | null
          poids?: number | null
          couleur?: string | null
          numero_puce?: string | null
          numero_tatouage?: string | null
          veterinaire_nom?: string | null
          veterinaire_telephone?: string | null
          veterinaire_adresse?: string | null
          vaccins?: any | null
          allergies?: string[] | null
          traitements_en_cours?: string[] | null
          antecedents_medicaux?: string | null
          assurance_nom?: string | null
          assurance_numero?: string | null
          caractere?: string[] | null
          sociabilite?: any | null
          peurs?: string[] | null
          regime_alimentaire?: string | null
          besoins_specifiques?: string | null
          notes?: string | null
          statut?: string
          created_at?: string
          updated_at?: string
        }
      }
      visites: {
        Row: {
          id: string
          chien_id: string | null
          type: string
          date_debut: string
          date_fin: string | null
          duree: string | null
          notes: string | null
          observations: string | null
          montant: number | null
          statut: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          chien_id?: string | null
          type: string
          date_debut: string
          date_fin?: string | null
          duree?: string | null
          notes?: string | null
          observations?: string | null
          montant?: number | null
          statut?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          chien_id?: string | null
          type?: string
          date_debut?: string
          date_fin?: string | null
          duree?: string | null
          notes?: string | null
          observations?: string | null
          montant?: number | null
          statut?: string
          created_at?: string
          updated_at?: string
        }
      }
      factures: {
        Row: {
          id: string
          type: string
          numero_facture: string
          client_id: string | null
          client_nom: string
          client_adresse: string | null
          client_email: string | null
          client_siret: string | null
          date_emission: string
          date_echeance: string
          lignes: any
          montant_total: number
          statut: string
          moyen_paiement: string | null
          date_paiement: string | null
          notes: string | null
          pdf_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: string
          numero_facture: string
          client_id?: string | null
          client_nom: string
          client_adresse?: string | null
          client_email?: string | null
          client_siret?: string | null
          date_emission: string
          date_echeance: string
          lignes: any
          montant_total: number
          statut?: string
          moyen_paiement?: string | null
          date_paiement?: string | null
          notes?: string | null
          pdf_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: string
          numero_facture?: string
          client_id?: string | null
          client_nom?: string
          client_adresse?: string | null
          client_email?: string | null
          client_siret?: string | null
          date_emission?: string
          date_echeance?: string
          lignes?: any
          montant_total?: number
          statut?: string
          moyen_paiement?: string | null
          date_paiement?: string | null
          notes?: string | null
          pdf_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reservations: {
        Row: {
          id: string
          code: string
          type: string
          client_id: string | null
          client_nom: string
          client_prenom: string | null
          client_email: string
          client_telephone: string | null
          client_adresse: string | null
          client_ville: string | null
          animal_nom: string
          animal_race: string | null
          animal_age: string | null
          animal_sexe: string | null
          animal_poids: string | null
          date_debut: string | null
          date_fin: string | null
          visite_prealable: boolean
          service_type: string | null
          distance: number | null
          frais_deplacement: number | null
          form_data: any | null
          statut: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          type: string
          client_id?: string | null
          client_nom: string
          client_prenom?: string | null
          client_email: string
          client_telephone?: string | null
          client_adresse?: string | null
          client_ville?: string | null
          animal_nom: string
          animal_race?: string | null
          animal_age?: string | null
          animal_sexe?: string | null
          animal_poids?: string | null
          date_debut?: string | null
          date_fin?: string | null
          visite_prealable?: boolean
          service_type?: string | null
          distance?: number | null
          frais_deplacement?: number | null
          form_data?: any | null
          statut?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          type?: string
          client_id?: string | null
          client_nom?: string
          client_prenom?: string | null
          client_email?: string
          client_telephone?: string | null
          client_adresse?: string | null
          client_ville?: string | null
          animal_nom?: string
          animal_race?: string | null
          animal_age?: string | null
          animal_sexe?: string | null
          animal_poids?: string | null
          date_debut?: string | null
          date_fin?: string | null
          visite_prealable?: boolean
          service_type?: string | null
          distance?: number | null
          frais_deplacement?: number | null
          form_data?: any | null
          statut?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          reservation_id: string | null
          expediteur_type: string
          expediteur_id: string | null
          expediteur_nom: string
          contenu: string
          pieces_jointes: any | null
          lu: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          reservation_id?: string | null
          expediteur_type: string
          expediteur_id?: string | null
          expediteur_nom: string
          contenu: string
          pieces_jointes?: any | null
          lu?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          reservation_id?: string | null
          expediteur_type?: string
          expediteur_id?: string | null
          expediteur_nom?: string
          contenu?: string
          pieces_jointes?: any | null
          lu?: boolean
          created_at?: string
        }
      }
    }
  }
}
