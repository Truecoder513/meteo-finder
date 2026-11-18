# Météo Bénin

Service web qui affiche la **météo actuelle** et les **prévisions sur 7 jours** de n'importe quelle localité du **Bénin** : villes, communes et villages.

- Recherche d'une localité par son nom, avec suggestions pendant la frappe.
- Bouton « Utiliser ma position » (géolocalisation, avec demande d'autorisation).
- Carte OpenStreetMap centrée sur la localité.
- Une page par localité, indexable par les moteurs de recherche (`/meteo/cotonou-2394819`).
- **Bénin uniquement** : aucune localité ni position d'un autre pays n'est acceptée.

Données : [Open-Meteo](https://open-meteo.com/) (geocoding + prévisions, sans clé d'API). Carte : © [OpenStreetMap](https://www.openstreetmap.org/copyright).

---

## Démarrer le projet

### Prérequis

| Outil | Version |
|---|---|
| Node.js | **≥ 20.9** (exigé par Next.js 16) — testé avec 22.x |
| pnpm | 10.x (version fixée dans `package.json` → `packageManager`) |

### Installation

```bash
# 1. Installer les dépendances
pnpm install

# 2. Créer la configuration locale à partir de l'exemple
cp .env.example .env.local

# 3. Lancer le serveur de développement
pnpm dev
```

Ouvrir <http://localhost:3000>.

> La géolocalisation du navigateur ne fonctionne qu'en **HTTPS** ou sur **localhost**.

### Scripts

| Commande | Rôle |
|---|---|
| `pnpm dev` | Serveur de développement (Turbopack) |
| `pnpm build` | Build de production (pré-rend les grandes villes) |
| `pnpm start` | Sert le build de production |
| `pnpm lint` | ESLint |

> Le build appelle l'API Open-Meteo pour pré-rendre les pages des grandes villes : il faut donc une connexion Internet.

---

## Variables d'environnement

Toute la configuration est dans `.env.local`, qui n'est pas commité. Le modèle documenté est [`.env.example`](.env.example), qui lui est commité.

| Variable | Rôle | Valeur par défaut (exemple) |
|---|---|---|
| `NEXT_PUBLIC_GEOCODING_API_URL` | API de recherche de localités | `https://geocoding-api.open-meteo.com/v1` |
| `NEXT_PUBLIC_FORECAST_API_URL` | API de prévisions | `https://api.open-meteo.com/v1/forecast` |
| `NEXT_PUBLIC_OSM_TILE_URL` | Modèle d'URL des tuiles de carte | `https://tile.openstreetmap.org/{z}/{x}/{y}.png` |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site (URL canoniques, SEO) | `http://localhost:3000` |

**Pourquoi le préfixe `NEXT_PUBLIC_` ?** La recherche s'exécute dans le navigateur, et la carte aussi. Ces valeurs doivent donc être incluses dans le code envoyé au client. Conséquences :

- elles sont **publiques** : n'y mettez jamais de secret ;
- elles sont **figées au moment du `pnpm build`** : il faut rebuilder après chaque modification.

### Validation

Les variables sont lues et validées à un seul endroit : [`src/lib/env.ts`](src/lib/env.ts). Le reste du code importe l'objet `env`, typé, au lieu de lire `process.env` directement.

Chaque variable est vérifiée au démarrage (`pnpm dev`) et au build :

1. **présence** : une variable absente ou vide déclenche une erreur ;
2. **format** : la valeur doit être une URL valide ;
3. **protocole** : `http` ou `https` uniquement ;
4. **modèle de tuiles** : `NEXT_PUBLIC_OSM_TILE_URL` doit contenir `{z}`, `{x}` et `{y}`.

Le `/` final éventuel est retiré automatiquement. En cas de problème, le build s'arrête avec un message explicite au lieu d'échouer plus tard sur une erreur réseau difficile à comprendre :

```
Error: [env] NEXT_PUBLIC_OSM_TILE_URL doit contenir {z}, {x}, {y} : "https://tile.openstreetmap.org/tiles.png"
Error: [env] NEXT_PUBLIC_FORECAST_API_URL n'est pas une URL valide : "pas-une-url"
```

---

## Pourquoi Next.js

Le besoin principal est le **référencement** : quelqu'un qui cherche « météo Parakou » sur Google doit tomber sur la page Parakou du site. Une application React classique (SPA) envoie une page vide que le navigateur remplit ensuite, ce qui est peu fiable pour les moteurs de recherche. Next.js règle ce problème :

- **Le HTML arrive complet.** Le serveur génère chaque page localité avec le nom, la température et les prévisions déjà présents dans le HTML. Les robots indexent le vrai contenu.
- **Les grandes villes sont pré-rendues.** `generateStaticParams` génère Cotonou, Porto-Novo, Parakou, etc. au build. Ces pages sont servies instantanément.
- **Le rendu partiel (Partial Prerendering / Cache Components).** Les autres localités sont rendues à la demande. La structure de la page part tout de suite, avec des squelettes, et les données météo arrivent en streaming.
- **Le cache des données.** `"use cache"` avec `cacheLife` garde les localités 1 jour et les prévisions 1 heure. Les pages restent rapides et on reste dans les limites d'usage d'Open-Meteo.
- **Les métadonnées SEO intégrées.** Les titres et descriptions par localité passent par `generateMetadata`, et les URL canoniques par `alternates`. La page « ma position », propre à chaque visiteur, est en `noindex`.
- **Des URL lisibles et stables.** Elles prennent la forme `/meteo/<nom>-<identifiant>`.
- **Un seul projet pour le serveur et le client.** Le même module de services sert aux pages rendues côté serveur et à la recherche côté navigateur.

---

## Pourquoi l'accessibilité (objectif WCAG 2.2 niveau AA)

Un service météo est une **information pratique utile à tout le monde** : sortir ou non, prévoir la pluie, se protéger de la chaleur. Il doit être utilisable par tous, y compris :

- les personnes **malvoyantes** qui utilisent un lecteur d'écran ou un zoom ;
- les personnes qui naviguent **au clavier uniquement** ;
- les personnes sensibles aux **animations** ;
- les utilisateurs sur **mobile**, en plein soleil (d'où l'importance des contrastes), avec une connexion lente.

L'accessibilité améliore aussi le **SEO**, grâce à une structure sémantique, des titres hiérarchisés et des textes alternatifs. C'est enfin une exigence fréquente des marchés publics et des services d'intérêt général.

### Mesures en place

| Critère WCAG | Mise en œuvre |
|---|---|
| 1.4.3 Contraste du texte (≥ 4.5:1) | Thème blanc et sobre, palette vérifiée : texte `#0a0a0a` (19.8:1), texte secondaire `#525252` (7.8:1), liens `#166534` (7.1:1), erreurs `#b91c1c` (6.5:1) |
| 1.4.11 Contraste des composants (≥ 3:1) | Contour renforcé du champ de recherche et des boutons |
| 2.1.1 Clavier | Suggestions navigables avec ↑ ↓ Entrée Échap. La carte Leaflet est utilisable au clavier |
| 2.4.1 Contourner des blocs | Lien « Aller au contenu » en premier élément |
| 2.4.7 Focus visible | Contour de focus de 3 px sur tous les éléments interactifs |
| 1.1.1 Contenu non textuel | Icônes météo avec libellé, carte doublée des coordonnées et d'un lien OpenStreetMap |
| 1.3.1 Information et relations | Titres hiérarchisés, listes, fil d'Ariane (`nav` + `aria-current`), libellés « Minimum » / « Maximum » lus par les lecteurs d'écran |
| 4.1.2 Nom, rôle, valeur | Recherche selon le motif ARIA *combobox* (`listbox`, `option`, `aria-activedescendant`) |
| 4.1.3 Messages d'état | Annonces `aria-live` : « 3 localités trouvées », « Recherche en cours… », chargements, erreurs |
| 2.5.8 Taille des cibles | Cibles d'au moins 44 px de haut |
| 2.3.3 Animations | Animations désactivées si `prefers-reduced-motion` est activé |
| 3.1.1 Langue de la page | `lang="fr"` |
| Gestion du focus | Le focus est déplacé vers le panneau d'autorisation ou d'erreur de géolocalisation quand il apparaît |

---

## Fonctionnement

### Recherche (debounce)

- La recherche démarre à partir de **2 caractères**.
- Elle n'envoie **pas une requête par touche** : le hook [`useDebouncer`](src/app/hooks/useDebouncer.ts) attend que l'utilisateur ait arrêté de taper pendant 400 ms.
- Si une nouvelle saisie arrive pendant une requête, celle-ci est **annulée** (`AbortController`).
- Pendant le chargement, la liste affiche un **squelette**.

### Erreurs (API injoignable ou en erreur)

Une erreur de l'API ou du réseau n'affiche **jamais une page blanche ni un message technique**. L'utilisateur voit un message clair accompagné d'un bouton **« Réessayer »** (composant [`ErrorState`](src/components/ErrorState.tsx)).

| Où | Comportement |
|---|---|
| Recherche | Encadré « Recherche impossible » sous le champ avec « Réessayer ». Il reste visible pour être atteignable au clavier |
| Pages localité et « ma position » | [`src/app/meteo/error.tsx`](src/app/meteo/error.tsx) : l'en-tête et la recherche restent affichés, avec « Réessayer » et « Retour à l'accueil » |
| Reste du site | [`src/app/error.tsx`](src/app/error.tsx), et en dernier recours [`global-error.tsx`](src/app/global-error.tsx) |
| Pages pré-rendues (grandes villes) | Si l'API tombe, la dernière version valide reste affichée |

Les requêtes sont abandonnées après **10 secondes** pour ne pas laisser un chargement infini. Le détail technique de l'erreur n'est écrit que dans les journaux du serveur.

> Le build pré-rend les grandes villes : si Open-Meteo est indisponible **pendant le build**, celui-ci échoue. Il suffit de relancer le build.

### Vigilance pluie

Un jour est signalé **« Vigilance pluie »** si le **cumul de pluie prévu atteint 20 mm** ou si la **probabilité de pluie atteint 80 %**. La règle et ses seuils sont dans [`src/lib/rain-vigilance.ts`](src/lib/rain-vigilance.ts).

Le signalement doit être bien visible et ne pas reposer uniquement sur la couleur :

- un **encadré rouge** au-dessus des prévisions liste les jours concernés et rappelle les seuils ;
- la ligne du jour est **bordée de rouge** et porte un badge avec une icône et le texte « Vigilance pluie » ;
- les contrastes sont AA (texte rouge sur fond rosé 6:1, texte blanc sur badge rouge 6.5:1).

### Restriction au Bénin (plusieurs niveaux de contrôle)

1. La recherche envoie `countryCode=BJ` à l'API.
2. Les résultats sont filtrés une seconde fois sur `country_code === "BJ"`.
3. Une page localité dont l'identifiant n'est pas béninois affiche « Localité introuvable ».
4. Une position hors du territoire est refusée, côté navigateur puis côté serveur.

### Géolocalisation

1. L'état de la permission est vérifié sans ouvrir de fenêtre (API Permissions).
2. Si l'accès n'a jamais été demandé, un panneau explique à quoi sert la position (ni enregistrée ni partagée). Le bouton **Autoriser** déclenche ensuite la demande du navigateur.
3. Chaque cas a un message : refus (avec la marche à suivre pour réactiver l'accès), position introuvable, connexion non sécurisée, hors Bénin.
4. Côté serveur, les coordonnées sont arrondies à environ 1 km, pour protéger la vie privée et mutualiser le cache.

---

## Architecture

```
src/
├── app/
│   ├── hooks/            # Hooks React (useDebouncer, useGeolocation)
│   ├── services/         # TOUTES les requêtes HTTP (fetch natif)
│   │   ├── index.ts      #   searchLocalites, getLocalite, getForecast
│   │   └── cached.ts     #   versions mises en cache côté serveur ("use cache")
│   ├── meteo/
│   │   ├── [slug]/       # Page d'une localité (+ loading, not-found)
│   │   └── position/     # Page « ma position »
│   ├── layout.tsx        # Mise en page globale, métadonnées
│   └── page.tsx          # Accueil
├── components/           # Composants d'interface (recherche, carte, prévisions…)
│   ├── map/              #   Carte Leaflet / OpenStreetMap (chargée côté client)
│   └── skeletons/        #   Squelettes de chargement
├── lib/                  # Utilitaires : env, Bénin (limites, grandes villes), slug, codes météo
└── types/                # Types des réponses des APIs Open-Meteo
```

Règles du projet :

- **Aucune requête n'est définie dans un composant** : elles passent toutes par `src/app/services`.
- Les types des réponses d'API sont dans `src/types`.
- La configuration passe par `.env.local`, validé dans `src/lib/env.ts`.
- Pas de données fictives : uniquement des données réelles d'Open-Meteo.

## Stack

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS 4 · Leaflet / react-leaflet · Open-Meteo · OpenStreetMap
