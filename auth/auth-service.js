require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mailgun = require('mailgun-js');
const generateHTML = require('../email/generate-html');
const User = require('../models/User');

// Konfigurišite Mailgun
const mg = mailgun({ 
  apiKey: process.env.MAILGUN_API_KEY, 
  domain: process.env.MAILGUN_DOMAIN 
});

// Primer email template-a
const emailTemplate = `
  <h1>Dobrodošli, {{ name }}!</h1>
  <p>Molimo vas da verifikujete vaš email klikom na sledeći link:</p>
  <a href="{{ verificationLink }}">Verifikuj email</a>
`;

/**
 * Funkcija za kreiranje novog korisnika i slanje verifikacionog emaila.
 * @param {Object} userData - Podaci o korisniku.
 * @returns {Object} - Kreirani korisnički nalog.
 */
async function registerUser(userData) {
  const { name, email, password } = userData;
  
  // Provera da li korisnik već postoji
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Korisnik sa datim email-om već postoji.');
  }

  // Kreiranje novog korisnika
  const newUser = new User({ name, email, password });
  await newUser.save();

  // Generisanje verifikacionog tokena
 /* const verificationToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const verificationLink = `${process.env.BASE_URL}/verify-email?token=${verificationToken}`;

  // Generisanje HTML sadržaja email-a
  const emailHTML = generateHTML(emailTemplate, { name, verificationLink });

  // Definisanje podataka za email
  const data = {
    from: 'Your App <noreply@yourdomain.com>',
    to: email,
    subject: 'Verifikacija emaila',
    html: emailHTML,
  };

  // Slanje email-a
  await mg.messages().send(data);
*/
  return newUser;
}

module.exports = registerUser;
