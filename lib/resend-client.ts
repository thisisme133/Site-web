import { Resend } from 'resend'

// Client Resend pour l'envoi d'emails
// À utiliser uniquement dans les API routes côté serveur
export const resend = new Resend(process.env.RESEND_API_KEY)

// Configuration de l'expéditeur
export const FROM_EMAIL = 'Les Petits Bergers <noreply@lespetitsbergers.fr>'

// Templates d'emails
export const emailTemplates = {
  // Email d'authentification avec code OTP
  authCode: (code: string) => ({
    subject: 'Votre code de connexion - Les Petits Bergers',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Code de connexion</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #f9f9f9;
              border-radius: 8px;
              padding: 30px;
              margin: 20px 0;
            }
            .code {
              background-color: #000091;
              color: white;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              text-align: center;
              padding: 20px;
              border-radius: 8px;
              margin: 30px 0;
            }
            .footer {
              font-size: 12px;
              color: #666;
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 style="color: #000091;">Les Petits Bergers</h1>
            <p>Bonjour,</p>
            <p>Voici votre code de connexion :</p>
            <div class="code">${code}</div>
            <p><strong>Ce code est valable pendant 10 minutes.</strong></p>
            <p>Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email.</p>
          </div>
          <div class="footer">
            <p>Les Petits Bergers - Garde et éducation canine</p>
            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
          </div>
        </body>
      </html>
    `,
  }),

  // Email de confirmation de réservation
  reservationConfirmation: (data: {
    clientNom: string
    animalNom: string
    type: string
    code: string
    dateDebut?: string
  }) => ({
    subject: `Confirmation de ${data.type === 'garde' ? 'garde' : 'rendez-vous'} - ${data.animalNom}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmation de réservation</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #f9f9f9;
              border-radius: 8px;
              padding: 30px;
              margin: 20px 0;
            }
            .info-box {
              background-color: white;
              border-left: 4px solid #000091;
              padding: 15px;
              margin: 20px 0;
            }
            .code {
              background-color: #000091;
              color: white;
              font-size: 24px;
              font-weight: bold;
              letter-spacing: 4px;
              text-align: center;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              background-color: #000091;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 4px;
              margin: 20px 0;
            }
            .footer {
              font-size: 12px;
              color: #666;
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 style="color: #000091;">Réservation confirmée ✓</h1>
            <p>Bonjour ${data.clientNom},</p>
            <p>Votre demande de ${data.type === 'garde' ? 'garde' : 'rendez-vous comportementaliste'} pour <strong>${data.animalNom}</strong> a bien été enregistrée.</p>

            <div class="info-box">
              <p><strong>Code de suivi de votre réservation :</strong></p>
              <div class="code">${data.code}</div>
              <p style="font-size: 14px; color: #666;">Conservez ce code pour suivre l'état de votre réservation et échanger avec nous.</p>
            </div>

            ${data.dateDebut ? `<p><strong>Date prévue :</strong> ${new Date(data.dateDebut).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>` : ''}

            <p>Je reviendrai vers vous très rapidement pour confirmer les détails et répondre à vos questions.</p>

            <a href="${process.env.NEXT_PUBLIC_APP_URL}/reservation?code=${data.code}" class="button">
              Suivre ma réservation
            </a>

            <p>À très bientôt,<br>L'équipe Les Petits Bergers</p>
          </div>
          <div class="footer">
            <p>Les Petits Bergers - Garde et éducation canine</p>
            <p>Pour toute question, répondez simplement à cet email.</p>
          </div>
        </body>
      </html>
    `,
  }),

  // Email de facture
  invoice: (data: {
    clientNom: string
    numeroFacture: string
    montant: number
    pdfUrl?: string
  }) => ({
    subject: `Facture ${data.numeroFacture} - Les Petits Bergers`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Facture</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #f9f9f9;
              border-radius: 8px;
              padding: 30px;
              margin: 20px 0;
            }
            .amount {
              background-color: #000091;
              color: white;
              font-size: 28px;
              font-weight: bold;
              text-align: center;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              background-color: #000091;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 4px;
              margin: 20px 0;
            }
            .footer {
              font-size: 12px;
              color: #666;
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 style="color: #000091;">Votre facture</h1>
            <p>Bonjour ${data.clientNom},</p>
            <p>Veuillez trouver ci-joint votre facture <strong>${data.numeroFacture}</strong>.</p>

            <div class="amount">
              Montant : ${data.montant.toFixed(2)} €
            </div>

            <p><strong>Modalités de paiement :</strong></p>
            <ul>
              <li>Virement bancaire</li>
              <li>Chèque</li>
              <li>Espèces</li>
              <li>Carte bancaire</li>
            </ul>

            ${data.pdfUrl ? `<a href="${data.pdfUrl}" class="button">Télécharger la facture PDF</a>` : ''}

            <p>Merci de votre confiance,<br>L'équipe Les Petits Bergers</p>
          </div>
          <div class="footer">
            <p>Les Petits Bergers - Garde et éducation canine</p>
            <p>Pour toute question, répondez simplement à cet email.</p>
          </div>
        </body>
      </html>
    `,
  }),
}
