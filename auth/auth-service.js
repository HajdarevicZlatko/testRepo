require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateHTML = require('../email/generate-html');
const User = require('../models/User');
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
  return newUser;
}

module.exports = registerUser;
