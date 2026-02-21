# Luxury AI Campaign Co-Creator

Expérience interactive de co-création de campagne luxe avec l'IA, pour une présentation à Sciences Po Paris.

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS**
- **Supabase** (Realtime)
- **Claude** (Anthropic) — texte
- **Higgsfield** — génération d'images
- **Vercel** — déploiement

## Installation

```bash
npm install
```

## Configuration

1. Copiez `.env.example` vers `.env.local`
2. **Important** : Sans variables d'environnement, le build utilise des placeholders. L'app ne fonctionnera qu'avec de vraies clés Supabase, Anthropic et Higgsfield.
3. Créez un projet Supabase et exécutez le schéma SQL dans `supabase/schema.sql`
4. Dans le dashboard Supabase > Database > Replication, activez Realtime pour : `sessions`, `brand_names`, `votes`
5. Renseignez les variables d'environnement :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY`
   - `HIGGSFIELD_API_KEY` (format `key:secret` si applicable)

## Lancement

```bash
npm run dev
```

- **Audience** : http://localhost:3000/audience
- **Présentateur** : http://localhost:3000/presenter

## Contrôles présentateur

- **→** : Phase suivante
- **←** : Phase précédente
- **R** : Reset (retour au standby)
- **F** : Plein écran

## Déploiement Vercel

1. `vercel deploy`
2. Configurez les variables d'environnement dans le dashboard Vercel
3. **Important** : Désactivez la protection de déploiement pour que l'audience puisse scanner le QR code sans se connecter à Vercel :
   - Project Settings → **Deployment Protection**
   - Mettez **Vercel Authentication** sur **Disabled** (ou ajoutez une exception pour votre domaine de production)
4. Générez un QR code pointant vers `https://votre-domaine.vercel.app/audience`
