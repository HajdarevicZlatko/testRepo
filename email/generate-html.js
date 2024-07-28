/**
 * Funkcija koja generiše HTML sadržaj za email poruku.
 * @param {string} template - Template string sa placeholder-ima.
 * @param {Object} replacements - Objekat sa vrednostima za zamenu placeholder-a.
 * @returns {string} - HTML sadržaj sa izvršenim zamenama.
 */
function generateHTML(template, replacements) {
    return template.replace(/{{(.*?)}}/g, (match, p1) => replacements[p1.trim()]);
  }
  
  module.exports = generateHTML;
  