const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

// Configure CORS pour permettre les requêtes depuis http://localhost:4200
app.use(cors({
  origin: 'http://localhost:4200'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurez votre transporteur d'email
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'younex6283@gmail.com',
    pass: 'doss131O'
  }
});

// Route pour envoyer les emails
app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: 'younex6283@gmail.com',
    subject: 'Formulaire de Contact',
    text: `Nom: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Erreur lors de l\'envoi de l\'email.');
    }
    res.status(200).send('Email envoyé avec succès.');
  });
});

app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});


// // server.js
// const express = require('express');
// const nodemailer = require('nodemailer');
// const bodyParser = require('body-parser');

// const app = express();
// const port = 3001; // Utilisez un port différent de celui de json-server

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Configurez votre transporteur d'email
// const transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: 'younex6283@gmail.com', // Votre adresse email
//     pass: 'doss1310'   // Votre mot de passe email
//   }
// });

// // Route pour envoyer les emails
// app.post('/send-email', (req, res) => {
//   const { name, email, message } = req.body;

//   const mailOptions = {
//     from: email,
//     to: 'younex6283@gmail.com', // L'adresse email à laquelle vous voulez envoyer les messages
//     subject: 'Formulaire de Contact',
//     text: `Nom: ${name}\nEmail: ${email}\nMessage: ${message}`
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return res.status(500).send('Erreur lors de l\'envoi de l\'email.');
//     }
//     res.status(200).send('Email envoyé avec succès.');
//   });
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });
