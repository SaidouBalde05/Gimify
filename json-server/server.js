const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Configuration du stockage pour Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/audio-files'); // Dossier où les fichiers seront enregistrés
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Génération d'un nom unique
  }
});

const upload = multer({ storage: storage });

// Route pour télécharger un fichier audio
app.post('/audio-files', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Aucun fichier n\'a été téléchargé.');
  }
  // Retourne l'URL du fichier téléchargé
  res.status(200).json({ url: `http://localhost:4000/uploads/audio-files/${req.file.filename}` });
});

// Servir les fichiers statiques
app.use('/uploads', express.static('uploads'));

// Démarre le serveur sur le port 4000
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Serveur Express démarré sur le port ${PORT}`);
});
