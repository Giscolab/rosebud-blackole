# Bibliothèque de Composants Rosie

Ce dossier contient des **composants Rosie pré-construits** que vous pouvez utiliser ou non, selon votre cas d'utilisation.
Ce sont des composants prêts pour la production, testés - mais utilisez-les uniquement s'ils correspondent à la demande spécifique.

## 🚨 Important : Toujours Lire Avant Utilisation

**Vous devez utiliser l'outil `read` pour charger le code source d'un composant AVANT de l'importer.**

Exemple de flux de travail :
```javascript
// 1. Utilisez d'abord l'outil read
read(file_path="/rosie/controls/rosieControls.js")

// 2. Importez ensuite après examen
import { PlayerController } from './rosie/controls/rosieControls.js';
```

---

## Composants Disponibles

### 🎮 rosieControls.js (Jeux 3D - Three.js)

**Chemin :** `/rosie/controls/rosieControls.js`  
**Exports :** `PlayerController`, `ThirdPersonCameraController`, `FirstPersonCameraController`

**Fonctionnalités :**
- Mouvement WASD avec direction relative à la caméra
- Saut, gravité, détection du sol
- Caméra en orbite troisième personne OU verrouillage pointeur première personne
- Contrôles mobiles automatiques (joystick virtuel + boutons)

**Utiliser pour :** Plateformers 3D, jeux d'exploration, jeux d'action  
**Ne pas utiliser pour :** Jeux 2D, jeux de course, jeux en vue du dessus

**Exemple rapide :**
```javascript
const controller = new PlayerController(playerMesh, {
  moveSpeed: 10,
  jumpForce: 15,
  groundLevel: 0
});

const camera = new ThirdPersonCameraController(
  camera, playerMesh, renderer.domElement, {
  distance: 7,
  height: 3
});

// Dans la boucle de jeu :
const rotation = camera.update();
controller.update(deltaTime, rotation);
```

---

### 📱 phaserMobileControls.js (Jeux 2D - Phaser)

**Chemin :** `/rosie/controls/phaserMobileControls.js`  
**Exports :** `VirtualJoystick`, `ActionButton`, `MobileControlsManager`

**Fonctionnalités :**
- Joystick virtuel pour le mouvement (position fixe, côté gauche)
- Boutons d'action avec retour visuel (sauter, tirer, etc.)
- Gestionnaire de contrôles mobiles avec gestion des zones sécurisées

**Utiliser pour :** Jeux mobiles 2D utilisant Phaser  
**Ne pas utiliser pour :** Jeux 3D, jeux uniquement sur ordinateur

**Exemple rapide :**
```javascript
import { MobileControlsManager } from './rosie/controls/phaserMobileControls.js';

// Dans GameScene - ajouter les contrôles
this.mobileControls = new MobileControlsManager(this);
this.mobileControls.addJoystick();
this.mobileControls.addButton({
  label: 'JUMP',
  onPress: () => this.player.jump()
});

// Dans update() - obtenir le mouvement
const move = this.mobileControls.getMovement();
this.player.setVelocityX(move.x * speed);
```

---

### 📱 rosieMobileControls.js (Interne)

**Chemin :** `/rosie/controls/rosieMobileControls.js`  
**Note :** Importé automatiquement par rosieControls.js - pas besoin d'importer séparément

---

## Règles d'Utilisation

✅ **À FAIRE :**
- Lire la source avec l'outil `read` avant utilisation
- Importer depuis le dossier rosie : `'./rosie/controls/...'`
- Utiliser uniquement les composants qui correspondent à la demande
- Utiliser phaserMobileControls.js pour les jeux mobiles 2D
- Utiliser rosieControls.js pour les jeux 3D

❌ **À NE PAS FAIRE :**
- Importer sans lire d'abord
- Recréer ces composants
- Utiliser les contrôles 3D pour les jeux 2D (ou vice versa)