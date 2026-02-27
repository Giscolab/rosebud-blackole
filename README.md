# Black Hole + Accretion Disk Simulation

Simulation WebGL temps réel d’un trou noir (horizon des événements) et d’un disque d’accrétion, construite avec **Three.js** et des modules JavaScript natifs.

## Objectif du projet

Ce repo sert à visualiser de manière interactive :
- un **trou noir** central (horizon + glow),
- un **disque d’accrétion** de particules en rotation,
- un **champ d’étoiles** de fond,
- des **contrôles UI/caméra** pour explorer la scène et ajuster les paramètres.

> Le rendu privilégie une visualisation pédagogique et artistique, avec des simplifications physiques assumées.

## Structure des modules

### Entrées principales

- `index.html` : bootstrap de la page et chargement de `main.js`.
- `main.js` : classe `BlackHoleSimulation`, initialise la scène, instancie les systèmes et pilote la boucle d’animation.
- `config.js` : configuration centralisée (black hole, disque, caméra, rendu, ray tracing simplifié) + palette de couleurs du disque.

### Classes / composants

- `BlackHole.js` (`BlackHole`) : création de l’horizon des événements, glow, influence gravitationnelle simplifiée.
- `AccretionDisk.js` (`AccretionDisk`) : génération des particules, animation orbitale, gestion des rayons et garde-fous de cohérence.
- `Starfield.js` (`Starfield`) : génération/animation du fond stellaire.
- `CameraController.js` (`CameraController`) : orbite souris, zoom, déplacement clavier, auto-rotation.
- `UIController.js` (`UIController`) : panneau de contrôle (rayon horizon, rayons disque, rotation, distance caméra, glow), synchronisé avec l’état simulation.

### Dossier annexe

- `rosie/` : composants hérités (hors cœur de la simulation actuelle).

## Lancement local stable (Vite + HTTP requis)

Le projet utilise des modules ES (`type="module"`) et doit tourner via un **serveur HTTP local**. Un serveur Vite explicite est fourni avec une config CORS dédiée (`vite.config.js` > `server.cors`).

### Installation

```bash
npm install
```

### Démarrage dev

```bash
npm run dev
```

URL imposée : `http://localhost:5173`

### Build de production (optionnel)

```bash
npm run build
npm run preview
```

Preview local : `http://localhost:4173`

### Pourquoi pas `file://` ?

Le projet bloque explicitement l’exécution via `file://` (voir `main.js`) pour éviter les erreurs de résolution de modules/CORS. Utilisez toujours `http://localhost`.

## En-têtes CORS à prévoir côté reverse proxy (production)

Si vous servez le front derrière un reverse proxy (Nginx, Traefik, Apache, etc.), exposez explicitement les en-têtes suivants pour les assets/modules :

- `Access-Control-Allow-Origin: https://votre-domaine-front.example`
- `Access-Control-Allow-Methods: GET, HEAD, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

Notes :
- Évitez `*` si vous utilisez des cookies/credentials.
- Répondez correctement aux requêtes `OPTIONS` (preflight) avec un code `204`/`200`.
- Gardez les origines autorisées alignées avec vos domaines réels (prod, staging).

## Dépannage CORS

- Vérifier l’URL : utilisez `http://localhost:5173` (pas `file://`).
- Vérifier le serveur : lancez `npm run dev` et observez les erreurs dans la console navigateur.
- Vérifier le proxy : confirmez la présence des en-têtes `Access-Control-Allow-*` sur les ressources JS/CSS.
- Vérifier l’origine des imports : la dépendance `three` est installée localement via npm (plus de dépendance CDN par défaut).
- En cas de preflight bloqué : autoriser `OPTIONS` côté proxy + méthodes/headers attendus.

## Fonctionnalités actuelles

- Rendu temps réel Three.js (trou noir + disque + étoiles).
- Paramètres interactifs via UI :
  - rayon de l’horizon,
  - rayon interne/externe du disque,
  - vitesse de rotation,
  - distance caméra,
  - intensité du glow.
- Contrôles caméra : souris (orbite/zoom), clavier (WASD/flèches, Q/E), auto-rotate.
- Garde-fous sur la géométrie du disque pour éviter les configurations invalides (inner/outer radius).
- Coloration du disque par gradient de température simplifié.

## Limites connues

- Modèle physique simplifié : ce n’est pas un solveur GR complet (orbites, transfert radiatif, lentille gravitationnelle réaliste).
- Pas de pipeline scientifique (unités physiques calibrées, validation sur données observées, export de métriques).
- Nécessite une installation locale des dépendances npm (`three`, `vite`).
- UI non internationalisée et non orientée accessibilité avancée (lecteurs d’écran, navigation complète clavier, etc.).
- Optimisations GPU/CPU limitées pour des densités de particules très élevées.

## Roadmap

### 1) Physics
- Raffiner la dynamique orbitale (vitesse locale, précession, pertes d’énergie).
- Améliorer la modélisation visuelle relativiste (lensing, doppler/beaming, redshift).
- Ajouter des presets astrophysiques (Stellar-mass, SMBH, etc.).

### 2) Performance
- Réduire le coût CPU des updates particulaires (buffer updates, stratégies GPU-driven).
- LOD / qualité adaptative selon FPS.
- Profiling systématique + budget perf par module.

### 3) UX
- Presets de caméra et scénarios guidés.
- Aide contextuelle et infobulles scientifiques.
- Meilleure accessibilité (contrastes, focus, raccourcis, labels ARIA).

### 4) Intégrations externes
- Bundle outillage front (Vite/ESBuild) avec versions figées.
- API d’export/import des presets de simulation.
- Intégration éventuelle de datasets/références scientifiques externes.

## Archive documentation Rosie

La documentation Rosie précédente a été retirée du README principal car non pertinente au cœur du repo.

- Archive conservée ici : `docs/ROSIE_ARCHIVE.md`
