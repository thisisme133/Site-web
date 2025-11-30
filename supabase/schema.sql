-- =====================================================
-- SCHEMA SUPABASE POUR LES PETITS BERGERS
-- =====================================================
-- Ce fichier contient le schéma complet de la database
-- À exécuter dans l'éditeur SQL de Supabase
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: users (Utilisateurs - Admin et Clients)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'client')),
  nom TEXT,
  prenom TEXT,
  telephone TEXT,
  adresse TEXT,
  ville TEXT,
  code_postal TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Index pour recherche rapide par email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- =====================================================
-- TABLE: otp_codes (Codes OTP pour authentification)
-- =====================================================
CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherche par email et code
CREATE INDEX IF NOT EXISTS idx_otp_email ON otp_codes(email);
CREATE INDEX IF NOT EXISTS idx_otp_user_id ON otp_codes(user_id);

-- =====================================================
-- TABLE: chiens (Fiches des chiens)
-- =====================================================
CREATE TABLE IF NOT EXISTS chiens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proprietaire_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Informations identité
  nom TEXT NOT NULL,
  race TEXT NOT NULL,
  date_naissance DATE,
  age TEXT,
  sexe TEXT CHECK (sexe IN ('male', 'femelle')),
  poids DECIMAL(5,2),
  couleur TEXT,
  numero_puce TEXT,
  numero_tatouage TEXT,

  -- Informations vétérinaire
  veterinaire_nom TEXT,
  veterinaire_telephone TEXT,
  veterinaire_adresse TEXT,

  -- Santé
  vaccins JSONB, -- [{nom: "Rage", date: "2024-01-15", expiration: "2025-01-15"}]
  allergies TEXT[],
  traitements_en_cours TEXT[],
  antecedents_medicaux TEXT,
  assurance_nom TEXT,
  assurance_numero TEXT,

  -- Comportement
  caractere TEXT[],
  sociabilite JSONB, -- {chiens: true, chats: false, enfants: true}
  peurs TEXT[],
  regime_alimentaire TEXT,
  besoins_specifiques TEXT,
  notes TEXT,

  -- Statut
  statut TEXT DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif')),

  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherche
CREATE INDEX IF NOT EXISTS idx_chiens_proprietaire ON chiens(proprietaire_id);
CREATE INDEX IF NOT EXISTS idx_chiens_nom ON chiens(nom);
CREATE INDEX IF NOT EXISTS idx_chiens_statut ON chiens(statut);

-- =====================================================
-- TABLE: visites (Historique des visites/gardes)
-- =====================================================
CREATE TABLE IF NOT EXISTS visites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chien_id UUID REFERENCES chiens(id) ON DELETE CASCADE,

  type TEXT NOT NULL CHECK (type IN ('garde', 'comportementaliste', 'visite_preventive', 'urgence')),
  date_debut TIMESTAMP WITH TIME ZONE NOT NULL,
  date_fin TIMESTAMP WITH TIME ZONE,
  duree TEXT, -- "3 heures", "2 jours", etc.

  notes TEXT,
  observations TEXT,

  montant DECIMAL(10,2),
  statut TEXT DEFAULT 'programmee' CHECK (statut IN ('programmee', 'en_cours', 'terminee', 'annulee')),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherche
CREATE INDEX IF NOT EXISTS idx_visites_chien ON visites(chien_id);
CREATE INDEX IF NOT EXISTS idx_visites_date ON visites(date_debut);
CREATE INDEX IF NOT EXISTS idx_visites_statut ON visites(statut);

-- =====================================================
-- TABLE: factures (Factures)
-- =====================================================
CREATE TABLE IF NOT EXISTS factures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  type TEXT NOT NULL CHECK (type IN ('garde', 'comportementaliste')),
  numero_facture TEXT UNIQUE NOT NULL,

  -- Client
  client_id UUID REFERENCES users(id) ON DELETE SET NULL,
  client_nom TEXT NOT NULL,
  client_adresse TEXT,
  client_email TEXT,
  client_siret TEXT,

  -- Dates
  date_emission DATE NOT NULL,
  date_echeance DATE NOT NULL,

  -- Lignes de facturation (stockées en JSON)
  lignes JSONB NOT NULL, -- [{description: "Garde 3 jours", quantite: 1, prix_unitaire: 90, total: 90}]

  -- Montants
  montant_total DECIMAL(10,2) NOT NULL,

  -- Statut paiement
  statut TEXT DEFAULT 'a_regler' CHECK (statut IN ('a_regler', 'payee', 'annulee')),
  moyen_paiement TEXT CHECK (moyen_paiement IN ('virement', 'cheque', 'especes', 'cb')),
  date_paiement DATE,

  -- Notes
  notes TEXT,

  -- PDF généré (URL du fichier dans Supabase Storage)
  pdf_url TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherche
CREATE INDEX IF NOT EXISTS idx_factures_client ON factures(client_id);
CREATE INDEX IF NOT EXISTS idx_factures_numero ON factures(numero_facture);
CREATE INDEX IF NOT EXISTS idx_factures_statut ON factures(statut);
CREATE INDEX IF NOT EXISTS idx_factures_date_emission ON factures(date_emission);

-- =====================================================
-- TABLE: reservations (Réservations de garde/comportementaliste)
-- =====================================================
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  code TEXT UNIQUE NOT NULL, -- Code de suivi (ex: "ABCD1234")
  type TEXT NOT NULL CHECK (type IN ('garde', 'comportementaliste')),

  -- Informations client
  client_id UUID REFERENCES users(id) ON DELETE SET NULL,
  client_nom TEXT NOT NULL,
  client_prenom TEXT,
  client_email TEXT NOT NULL,
  client_telephone TEXT,
  client_adresse TEXT,
  client_ville TEXT,

  -- Informations animal
  animal_nom TEXT NOT NULL,
  animal_race TEXT,
  animal_age TEXT,
  animal_sexe TEXT,
  animal_poids TEXT,

  -- Informations réservation
  date_debut DATE,
  date_fin DATE,
  visite_prealable BOOLEAN DEFAULT FALSE,

  -- Spécifique comportementaliste
  service_type TEXT, -- "consultation", "education", "forfait"
  distance DECIMAL(10,2),
  frais_deplacement DECIMAL(10,2),

  -- Données formulaire (JSONB pour flexibilité)
  form_data JSONB,

  statut TEXT DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'confirmee', 'en_cours', 'terminee', 'annulee')),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherche
CREATE INDEX IF NOT EXISTS idx_reservations_code ON reservations(code);
CREATE INDEX IF NOT EXISTS idx_reservations_client ON reservations(client_id);
CREATE INDEX IF NOT EXISTS idx_reservations_email ON reservations(client_email);
CREATE INDEX IF NOT EXISTS idx_reservations_statut ON reservations(statut);

-- =====================================================
-- TABLE: messages (Messagerie)
-- =====================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  conversation_id TEXT NOT NULL, -- ID de la conversation (ex: "client-123-reservation-456")
  reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,

  expediteur_type TEXT NOT NULL CHECK (expediteur_type IN ('admin', 'client')),
  expediteur_id UUID REFERENCES users(id) ON DELETE SET NULL,
  expediteur_nom TEXT NOT NULL,

  contenu TEXT NOT NULL,

  -- Pièces jointes
  pieces_jointes JSONB, -- [{nom: "photo.jpg", url: "...", taille: 12345, type: "image/jpeg"}]

  lu BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherche
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_reservation ON messages(reservation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);

-- =====================================================
-- TABLE: audit_log_rgpd (Log des suppressions RGPD)
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_log_rgpd (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  user_id UUID, -- ID de l'utilisateur supprimé (pas de FK car l'utilisateur est supprimé)
  user_email TEXT,
  user_nom TEXT,
  user_prenom TEXT,

  donnees_supprimees JSONB, -- Résumé des données supprimées

  supprime_par UUID REFERENCES users(id), -- Admin qui a effectué la suppression
  raison TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour audit
CREATE INDEX IF NOT EXISTS idx_audit_rgpd_created ON audit_log_rgpd(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_rgpd_email ON audit_log_rgpd(user_email);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chiens ENABLE ROW LEVEL SECURITY;
ALTER TABLE visites ENABLE ROW LEVEL SECURITY;
ALTER TABLE factures ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log_rgpd ENABLE ROW LEVEL SECURITY;

-- Policies pour users (admin peut tout voir, client peut voir son profil)
CREATE POLICY "Admin can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Admin can update all users" ON users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (id = auth.uid());

-- Policies pour chiens (admin peut tout, client peut voir ses chiens)
CREATE POLICY "Admin can view all chiens" ON chiens
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Clients can view own chiens" ON chiens
  FOR SELECT USING (proprietaire_id = auth.uid());

CREATE POLICY "Admin can manage all chiens" ON chiens
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policies pour messages (admin peut tout, client peut voir ses messages)
CREATE POLICY "Admin can view all messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Clients can view own messages" ON messages
  FOR SELECT USING (expediteur_id = auth.uid());

CREATE POLICY "Everyone can insert messages" ON messages
  FOR INSERT WITH CHECK (true);

-- Policies pour réservations
CREATE POLICY "Admin can view all reservations" ON reservations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Clients can view own reservations" ON reservations
  FOR SELECT USING (client_id = auth.uid());

-- Policies pour factures
CREATE POLICY "Admin can manage all factures" ON factures
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Clients can view own factures" ON factures
  FOR SELECT USING (client_id = auth.uid());

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chiens_updated_at BEFORE UPDATE ON chiens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visites_updated_at BEFORE UPDATE ON visites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_factures_updated_at BEFORE UPDATE ON factures
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================
-- À créer manuellement dans l'interface Supabase Storage:
-- 1. "avatars" - pour les photos de profil
-- 2. "chiens" - pour les photos de chiens
-- 3. "factures" - pour les PDFs de factures
-- 4. "messages" - pour les pièces jointes de la messagerie

-- =====================================================
-- DONNÉES INITIALES
-- =====================================================

-- Créer un compte admin par défaut
-- IMPORTANT: À supprimer après avoir créé votre vrai compte admin
INSERT INTO users (email, role, nom, prenom, telephone)
VALUES ('admin@lespetitsbergers.fr', 'admin', 'Admin', 'Les Petits Bergers', '06 00 00 00 00')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- FIN DU SCHEMA
-- =====================================================
