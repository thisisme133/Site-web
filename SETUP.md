# 🚀 Guide de Configuration - Les Petits Bergers

Ce guide vous accompagne pour configurer complètement l'application avec Supabase et Resend.

## 📋 Prérequis

- Node.js 18+ installé
- Un compte GitHub
- Un compte Vercel (pour le déploiement)

## 🗄️ Étape 1 : Configuration de Supabase

### 1.1 Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte gratuit ou connectez-vous
3. Cliquez sur "New Project"
4. Remplissez les informations :
   - **Name** : `les-petits-bergers` (ou autre nom)
   - **Database Password** : Choisissez un mot de passe fort (NOTEZ-LE !)
   - **Region** : `Europe (Paris)` ou proche de vous
   - **Pricing Plan** : Free tier (gratuit)
5. Cliquez sur "Create new project"
6. Attendez 2-3 minutes que le projet soit créé

### 1.2 Créer les tables de la database

1. Dans votre projet Supabase, allez dans **SQL Editor** (icône dans le menu de gauche)
2. Cliquez sur "New query"
3. Ouvrez le fichier `/supabase/schema.sql` de ce projet
4. **COPIEZ TOUT LE CONTENU** du fichier
5. **COLLEZ-LE** dans l'éditeur SQL de Supabase
6. Cliquez sur **"Run"** en bas à droite
7. Vous devriez voir "Success. No rows returned" - C'est normal ! ✅

### 1.3 Créer les buckets de stockage

1. Dans Supabase, allez dans **Storage** (icône dans le menu)
2. Cliquez sur "Create a new bucket"
3. Créez ces 4 buckets (UN PAR UN) :
   - **Nom** : `chiens` → **Public** : ✅ Oui → Create bucket
   - **Nom** : `factures` → **Public** : ✅ Oui → Create bucket
   - **Nom** : `messages` → **Public** : ✅ Oui → Create bucket
   - **Nom** : `avatars` → **Public** : ✅ Oui → Create bucket

### 1.4 Récupérer les clés API

1. Dans Supabase, allez dans **Project Settings** ⚙️ (icône en bas à gauche)
2. Cliquez sur **API** dans le menu de gauche
3. Vous verrez deux sections importantes :

**Project URL** :
```
https://abcdefghijk.supabase.co
```
→ COPIEZ cette URL

**Project API keys** :
- **anon public** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
  → COPIEZ cette clé
- **service_role** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
  → COPIEZ cette clé (⚠️ SECRET - Ne jamais partager !)

## 📧 Étape 2 : Configuration de Resend

### 2.1 Créer un compte Resend

1. Allez sur [resend.com](https://resend.com)
2. Créez un compte gratuit (cliquez sur "Start Building")
3. Confirmez votre email

### 2.2 Configurer votre domaine (OPTIONNEL - recommandé pour production)

**Pour le développement, vous pouvez SAUTER cette étape et utiliser le domaine de test de Resend.**

Pour la production :
1. Dans Resend, allez dans **Domains**
2. Cliquez sur "Add Domain"
3. Entrez votre domaine : `lespetitsbergers.fr`
4. Suivez les instructions pour ajouter les enregistrements DNS (TXT, MX, etc.)
5. Attendez la vérification (quelques minutes à quelques heures)

### 2.3 Récupérer la clé API

1. Dans Resend, allez dans **API Keys**
2. Cliquez sur "Create API Key"
3. **Name** : `Les Petits Bergers - Production`
4. **Permission** : `Sending access` (Full access)
5. Cliquez sur "Add"
6. **COPIEZ LA CLÉ IMMÉDIATEMENT** (elle ne sera plus visible !)
   ```
   re_123456789abcdefghijk
   ```

## 🔐 Étape 3 : Configuration des Variables d'Environnement

### 3.1 Configuration locale (.env.local)

1. Ouvrez le fichier `.env.local` à la racine du projet
2. Remplacez les valeurs par celles que vous avez copiées :

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Resend Configuration
RESEND_API_KEY=re_123456789abcdefghijk
RESEND_FROM_EMAIL=Les Petits Bergers <onboarding@resend.dev>

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_EMAIL=votre-email@example.com
```

3. **Changez `ADMIN_EMAIL`** par votre vraie adresse email (celle que vous utiliserez pour vous connecter en admin)

ℹ️ **Astuce locale :** `RESEND_FROM_EMAIL` est configuré par défaut sur l'adresse de test `onboarding@resend.dev` afin de permettre l'envoi d'emails en développement sans domaine vérifié. En production, remplacez-la par une adresse de votre domaine validé dans Resend.

### 3.2 Configuration Vercel (pour le déploiement)

Vous configurerez ces variables dans Vercel lors de l'étape 5.

## 📦 Étape 4 : Installer et Tester Localement

### 4.1 Installer les dépendances

```bash
npm install
```

### 4.2 Lancer le serveur de développement

```bash
npm run dev
```

L'application devrait démarrer sur http://localhost:3000

### 4.3 Tester la connexion

1. Ouvrez http://localhost:3000/admin dans votre navigateur
2. Vous devriez voir la page admin (vide pour l'instant)
3. Vérifiez la console du navigateur (F12) - il ne devrait pas y avoir d'erreurs Supabase

### 4.4 Créer votre compte admin

1. Dans Supabase, allez dans **Table Editor**
2. Cliquez sur la table `users`
3. Cliquez sur "Insert" → "Insert row"
4. Remplissez :
   - **email** : votre-email@example.com (le même que dans ADMIN_EMAIL)
   - **role** : `admin`
   - **nom** : Votre nom
   - **prenom** : Votre prénom
5. Cliquez sur "Save"

Vous pouvez maintenant vous connecter avec votre email !

## 🚀 Étape 5 : Déploiement sur Vercel

### 5.1 Push sur GitHub

```bash
git add .
git commit -m "Configuration Supabase et Resend"
git push origin claude/fix-database-charts-018dXNtN4YfL4TaQtHNZqfkk
```

### 5.2 Déployer sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec GitHub
3. Cliquez sur "Add New..." → "Project"
4. Importez votre repository `Site-web`
5. **IMPORTANT** : Avant de déployer, configurez les variables d'environnement :
   - Cliquez sur "Environment Variables"
   - Ajoutez une par une :
     - `NEXT_PUBLIC_SUPABASE_URL` = votre URL Supabase
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = votre clé publique Supabase
     - `SUPABASE_SERVICE_ROLE_KEY` = votre clé service role Supabase
     - `RESEND_API_KEY` = votre clé API Resend
     - `NEXT_PUBLIC_APP_URL` = https://votre-domaine.vercel.app
     - `ADMIN_EMAIL` = votre email admin
6. Cliquez sur "Deploy"
7. Attendez 2-3 minutes

### 5.3 Mettre à jour l'URL de l'application

1. Une fois déployé, copiez l'URL de votre app (ex: `https://site-web-abc123.vercel.app`)
2. Retournez dans les **Environment Variables** de Vercel
3. Modifiez `NEXT_PUBLIC_APP_URL` avec votre vraie URL
4. Redéployez (Vercel le fera automatiquement)

### 5.4 Configurer un domaine personnalisé (OPTIONNEL)

1. Dans Vercel, allez dans **Settings** → **Domains**
2. Ajoutez votre domaine : `lespetitsbergers.fr`
3. Suivez les instructions pour pointer votre DNS vers Vercel
4. Attendez la propagation DNS (quelques minutes à quelques heures)

## ✅ Vérification Finale

### Checklist de test :

- [ ] ✅ Je peux accéder à l'application
- [ ] ✅ Je peux me connecter avec mon email admin (code reçu par email)
- [ ] ✅ Le dashboard affiche les statistiques
- [ ] ✅ Je peux ajouter un chien
- [ ] ✅ Je peux créer une facture
- [ ] ✅ Je peux envoyer une facture par email
- [ ] ✅ Les formulaires de réservation fonctionnent
- [ ] ✅ La messagerie fonctionne
- [ ] ✅ Je peux uploader des pièces jointes
- [ ] ✅ La suppression RGPD fonctionne

## 🆘 Dépannage

### Erreur : "Invalid API key" (Supabase)

- Vérifiez que vous avez bien copié les bonnes clés depuis Supabase → Settings → API
- Vérifiez qu'il n'y a pas d'espaces avant/après les clés dans `.env.local`
- Redémarrez le serveur de développement (`npm run dev`)

### Erreur : "Failed to send email" (Resend)

- Vérifiez que votre clé API Resend est correcte
- En développement, Resend a une limite de 100 emails/jour (gratuit)
- Vérifiez que `FROM_EMAIL` dans `lib/resend-client.ts` correspond à votre domaine vérifié

### Erreur : "Row Level Security"

- Vérifiez que les policies RLS sont bien créées (elles sont dans `schema.sql`)
- Si besoin, allez dans Supabase → Authentication → Policies et vérifiez

### Les charts ne s'affichent pas

- Ouvrez la console du navigateur (F12)
- Vérifiez qu'il n'y a pas d'erreur CORS
- Vérifiez que l'API `/api/stats` retourne des données

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs Vercel (Deployments → View Function Logs)
2. Vérifiez les logs Supabase (Logs → API Logs)
3. Vérifiez la console du navigateur (F12)

## 🎉 C'est Terminé !

Votre application est maintenant complètement fonctionnelle avec :
- ✅ Base de données Supabase
- ✅ Authentification par email + code OTP
- ✅ Envoi d'emails via Resend
- ✅ Stockage de fichiers
- ✅ Toutes les fonctionnalités CRUD
- ✅ Conformité RGPD

Bon développement ! 🐕
