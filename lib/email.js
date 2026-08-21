import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendOrderConfirmationEmail({ to, orderId, totalPrice, items }) {
    if (!resend) {
        console.warn('Resend API Key missing. Skipping email.');
        return { success: false, error: 'Email service not configured' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Global Air <noreply@globalairsn.com>',
            to: [to],
            bcc: ['contact@globalairsn.com'],
            subject: `Confirmation de votre commande #${orderId.slice(-6).toUpperCase()}`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h1 style="color: #2563eb;">Merci pour votre commande !</h1>
          <p>Bonjour,</p>
          <p>Nous avons bien reçu votre commande <strong>#${orderId.slice(-6).toUpperCase()}</strong>.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <h3>Résumé de la commande :</h3>
          <ul>
            ${items
                .map(
                    (item) => `
              <li>${item.name} (x${item.quantity}) - ${item.price.toLocaleString('fr-SN')} FCFA</li>
            `
                )
                .join('')}
          </ul>
          <p style="font-size: 18px; font-weight: bold;">Total : ${totalPrice.toLocaleString('fr-SN')} FCFA</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">Global Air - L'excellence pour votre foyer.</p>
        </div>
      `,
        });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Failed to send email:', error);
        return { success: false, error };
    }
}

export async function sendStockBackInStockEmail({
    to,
    productName,
    productUrl,
    productPrice,
    productImage,
}) {
    if (!resend) return { success: false };

    try {
        const { data, error } = await resend.emails.send({
            from: 'Global Air <noreply@globalairsn.com>',
            to: [to],
            subject: `ðŸŽ‰ Le produit ${productName} est de retour en stock !`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px; text-align: center;">
          <h1 style="color: #2563eb;">Bonne nouvelle !</h1>
          <p>L'article que vous attendiez est à nouveau disponible chez <strong>Global Air</strong>.</p>
          <div style="margin: 30px 0; background: #f9fafb; padding: 20px; border-radius: 20px;">
            <img src="${productImage}" alt="${productName}" style="width: 150px; height: 150px; object-fit: contain; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #111827;">${productName}</h2>
            <p style="font-size: 20px; font-weight: bold; color: #2563eb; margin: 10px 0;">${productPrice.toLocaleString('fr-SN')} FCFA</p>
          </div>
          <a href="${productUrl}" style="display: inline-block; background: #111827; color: white; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-bottom: 20px;">COMMANDER MAINTENANT</a>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">Faites vite, les stocks sont limités !</p>
        </div>
      `,
        });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Back in stock email error:', error);
        return { success: false };
    }
}

export async function sendOrderStatusEmail({ to, orderId, status, name }) {
    if (!resend) return { success: false };

    let subject = '';
    let messageHtml = '';

    if (status === 'SHIPPED') {
        subject = `🚚 Votre commande #${orderId.slice(-6).toUpperCase()} est en route !`;
        messageHtml = `
        <h1 style="color: #2563eb;">Excellente nouvelle !</h1>
        <p>Bonjour ${name},</p>
        <p>Votre commande <strong>#${orderId.slice(-6).toUpperCase()}</strong> vient d'être expédiée. Notre livreur vous contactera très prochainement au numéro que vous nous avez fourni.</p>
        `;
    } else if (status === 'DELIVERED') {
        subject = `✅ Votre commande #${orderId.slice(-6).toUpperCase()} a été livrée`;
        messageHtml = `
        <h1 style="color: #2563eb;">Commande livrée !</h1>
        <p>Bonjour ${name},</p>
        <p>Votre commande <strong>#${orderId.slice(-6).toUpperCase()}</strong> a été livrée avec succès. Merci pour votre confiance !</p>
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 12px; margin-top: 20px;">
            <p style="margin-top: 0; font-weight: bold; color: #166534;">Qu'avez-vous pensé de vos articles ?</p>
            <p style="color: #1d4ed8; font-size: 14px;">Votre avis compte énormément pour nous et pour les autres clients. Prenez 30 secondes pour partager votre expérience !</p>
            <a href="https://globalairsn.com/orders" style="display: inline-block; background: #3b82f6; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px;">â­ LAISSER UN AVIS</a>
        </div>
        `;
    } else if (status === 'CANCELLED') {
        subject = `âŒ Votre commande #${orderId.slice(-6).toUpperCase()} a été annulée`;
        messageHtml = `
        <h1 style="color: #ef4444;">Commande annulée</h1>
        <p>Bonjour ${name},</p>
        <p>Votre commande <strong>#${orderId.slice(-6).toUpperCase()}</strong> a été annulée. Si vous pensez qu'il s'agit d'une erreur, merci de nous contacter sur WhatsApp.</p>
        `;
    } else {
        return { success: false, error: 'Unrecognized status' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Global Air <noreply@globalairsn.com>',
            to: [to],
            subject: subject,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px; text-align: center;">
            ${messageHtml}
            <a href="https://globalairsn.com/orders" style="display: inline-block; background: #111827; color: white; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; margin: 20px 0;">VOIR MA COMMANDE</a>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">Global Air - L'excellence pour votre foyer.</p>
        </div>
      `,
        });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Order status email error:', error);
        return { success: false, error };
    }
}

/**
 * Alerte l'administrateur d'une nouvelle commande par email
 */
export async function sendAdminNewOrderAlert({ orderId, totalPrice, items, customer, address }) {
    if (!resend) return { success: false };

    try {
        const orderShortId = orderId.slice(-6).toUpperCase();
        const { data, error } = await resend.emails.send({
            from: 'Global Air ALERTE <alerts@globalairsn.com>',
            to: ['contact@globalairsn.com'],
            subject: `ðŸš¨ NOUVELLE COMMANDE #${orderShortId}`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 2px solid #2563eb; padding: 20px; border-radius: 15px;">
          <h1 style="color: #2563eb; margin-top: 0;">📦 Nouvelle commande reçue !</h1>
          <p style="font-size: 16px;">Une nouvelle commande vient d'être enregistrée sur le site.</p>
          
          <div style="background: #f9fafb; padding: 15px; border-radius: 10px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Informations Client :</h3>
            <p style="margin: 5px 0;"><strong>Nom :</strong> ${customer.name}</p>
            <p style="margin: 5px 0;"><strong>Téléphone :</strong> ${customer.phone}</p>
            <p style="margin: 5px 0;"><strong>Adresse :</strong> ${address.street}, ${address.city}</p>
          </div>

          <h3>Détails des articles :</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${items
                .map(
                    (item) => `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0;">${item.name} <strong>x${item.quantity}</strong></td>
                <td style="padding: 10px 0; text-align: right;">${item.price.toLocaleString('fr-SN')} F</td>
              </tr>
            `
                )
                .join('')}
          </table>
          
          <div style="text-align: right; margin-top: 20px;">
            <p style="font-size: 20px; font-weight: bold; color: #111827;">Total : ${totalPrice.toLocaleString('fr-SN')} FCFA</p>
          </div>

          <div style="margin-top: 30px; text-align: center;">
            <a href="https://globalairsn.com/admin/orders" style="display: inline-block; background: #2563eb; color: white; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold;">GÉRER LA COMMANDE</a>
          </div>
        </div>
      `,
        });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Admin alert email error:', error);
        return { success: false, error };
    }
}
