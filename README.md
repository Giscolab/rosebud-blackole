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

- `index.html` : bootstrap de la page, import map Three.js, chargement de `main.js`.
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

## Lancement local (HTTP requis)

Le projet utilise des modules ES (`type="module"`) et une import map : il faut le lancer via un **serveur HTTP local**.

### Option A — Python

```bash
python3 -m http.server 8000
```

Puis ouvrir : `http://localhost:8000`

### Option B — Node (serve)

```bash
npx serve .
```

Puis ouvrir l’URL affichée par `serve`.

### Pourquoi pas `file://` ?

Un chargement direct (`file://.../index.html`) casse généralement la résolution des modules/imports et certaines règles CORS du navigateur.

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
- Dépendance CDN pour Three.js (pas de build locké/offline par défaut).
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
