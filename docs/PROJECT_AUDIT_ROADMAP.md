# Audit projet & roadmap d'évolution

## 1) Vue d'ensemble (état actuel)

Le projet est une simulation WebGL Three.js organisée en modules simples et lisibles :

- `main.js` orchestre la scène, le cycle d'animation, les systèmes visuels et l'UI.
- `BlackHole.js` gère l'horizon des événements + un glow visuel.
- `AccretionDisk.js` gère la génération/animation particulaire du disque et ses garde-fous de rayons.
- `Starfield.js` gère l'arrière-plan stellaire.
- `CameraController.js` gère les contrôles souris/clavier de caméra.
- `UIController.js` gère la création du panneau et le binding des callbacks métier.

Le socle actuel est donc **fonctionnel pour une visualisation interactive** mais encore **peu industrialisé** (pas de tests, peu de garde-fous runtime, physiques simplifiées, dette UX/accessibilité).

---

## 2) Cartographie des dépendances (comment les fichiers sont branchés)

### Flux principal

1. `index.html` charge `main.js`.
2. `main.js` instancie la simulation et connecte tous les modules.
3. `UIController` publie des événements (`onMassChange`, `onInnerRadiusChange`, etc.) vers `main.js`.
4. `main.js` relaie ces événements vers `BlackHole`, `AccretionDisk`, `CameraController`.
5. La boucle `animate()` appelle `update()` de chaque composant à chaque frame.

### Couplages importants

- `AccretionDisk` dépend directement de `blackHole.radius` pour valider les rayons (`innerRadiusMargin`).
- `UIController` dépend des IDs HTML qu'il génère lui-même et suppose que ses callbacks existent.
- `CameraController` dépend fortement de `window` et `domElement` (pas d'abstraction pour tests).
- `config.js` contient des sections partiellement inutilisées aujourd'hui (`rayTracing`).

---

## 3) Constats techniques (ce qui est à corriger / compléter)

## A. Fonctionnalités manquantes ou incomplètes

1. **Ray tracing non implémenté** : la section `rayTracing` de `config.js` n'est pas consommée.
2. **Composants Rosie vides** : `rosie/controls/rosieControls.js` et `rosie/controls/rosieMobileControls.js` sont présents mais vides.
3. **Pas d'API presets** : impossible d'exporter/importer des configurations UI.
4. **Pas de gestion i18n** malgré un mix FR/EN dans code et UI.
5. **Pas de mode qualité/perf adaptatif** selon FPS.

## B. Dette qualité / robustesse

1. **Aucun test automatisé** (unitaires/intégration/e2e).
2. **Aucun nettoyage global des listeners** au démontage de l'app.
3. **Attribut `size` du starfield inutilisé** (écrit dans la géométrie mais non lu par `PointsMaterial`).
4. **Dépendance implicite aux constantes de géométrie** dans certains calculs visuels.

## C. UX / produit

1. **Accessibilité limitée** (pas d'ARIA, pas de navigation clavier complète du panneau).
2. **Aide scientifique limitée** (pas d'explications contextuelles des paramètres).
3. **Panneau UI dense** sans presets guidés (ex: "Sagittarius A*", "Stellar BH").

---

## 4) Roadmap proposée (priorisée)

## Phase 1 — Fiabilisation (court terme, 1-2 sprints)

- Ajouter une base de tests (`vitest` + tests unitaires sur `sanitizeRadii` et contrôleurs).
- Introduire une couche de validation runtime des config (bornes + cohérence).
- Ajouter cleanup `dispose()` global pour listeners/objets Three.js au `beforeunload`.
- Corriger les incohérences de wiring UI ↔ rendu (glow, intensité, états synchronisés).

## Phase 2 — Produit (2-4 sprints)

- Ajouter un système de presets (chargement/sauvegarde JSON).
- Ajouter un HUD minimal de performance (FPS + qualité active).
- Internationaliser l'UI (FR/EN).
- Ajouter un mode "guided tour" (scénarios caméra + explications).

## Phase 3 — Moteur visuel/physique (4+ sprints)

- Implémenter une approximation de lensing pilotée par `config.rayTracing`.
- Ajouter Doppler/beaming simplifié sur le disque.
- Introduire LOD dynamique (`particleCount` adaptatif selon FPS).

## Phase 4 — Legacy & nettoyage

- Décider du devenir de `rosie/` :
  - soit supprimer si hors scope,
  - soit compléter les composants documentés.
- Clarifier la doc (archive vs code actif) pour éviter la confusion.

---

## 5) Backlog concret pour "brancher les fichiers entre eux"

1. Connecter proprement `rendering.glowIntensity` à la fois au glow du trou noir **et** à l'opacité du disque.
2. Exposer une API `setGlowIntensity()` dans `BlackHole`.
3. Créer un module `SimulationState` central pour sérialiser/restaurer les sliders.
4. Ajouter `onDispose` dans `main.js` qui délègue à chaque contrôleur.
5. Introduire des événements typés (ou conventions strictes) entre UI et moteurs.

---

## 6) KPI de pilotage roadmap

- **Stabilité** : 0 erreurs console sur 10 min de simulation.
- **Perf** : >55 FPS sur preset "High" (machine cible définie).
- **Qualité** : couverture tests >70% sur logique non-rendu.
- **UX** : parcours "preset + réglage + reset" en <30s pour un nouvel utilisateur.

