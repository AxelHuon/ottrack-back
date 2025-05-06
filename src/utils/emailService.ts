import transporter from './emailConfig';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';

/**
 * Load Template
 * @param {string} templateName - Nom du fichier template HTML
 * @param {Record<string, string>} replacements - Les valeurs à remplacer dans le HTML
 * @returns {string} Le contenu du template rempli
 */
const loadTemplate = (
  templateName: string,
  replacements: Record<string, string>,
) => {
  const filePath = path.join(
    process.cwd(),
    'templates',
    `${templateName}.html`,
  );
  const templateSource = fs.readFileSync(filePath, 'utf-8');
  const template = handlebars.compile(templateSource);
  return template(replacements);
};

/**
 * Envoi d'un email avec ou sans template
 * @param {string} to - Adresse email du destinataire
 * @param {string} subject - Sujet de l'email
 * @param {string} templateName - Nom du template HTML
 * @param {string} replacements - Variables pour le template HTML
 */
export const sendEmail = async (
  to: string,
  subject: string,
  templateName: string,
  replacements: Record<string, string>,
) => {
  try {
    // Charger le template HTML avec les valeurs dynamiques
    const htmlContent = loadTemplate(templateName, replacements);

    // Créer l'email avec Nodemailer
    const mailOptions = {
      from: process.env.SMTP_USER, // Votre email de config
      to,
      subject,
      html: htmlContent, // Utilisation du template HTML compilé
    };

    // Envoyer l'email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès :', info.response);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
  }
};
