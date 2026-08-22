import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const APP_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://julo.sn';

export async function sendOrderConfirmationEmail({ to, orderId, totalPrice, items }) {
    if (!resend) {
        console.warn('Resend API Key missing. Skipping email.');
        return { success: false, error: 'Email service not configured' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'JULO <commandes@julo.sn>',
            to: [to],
            bcc: ['contact@julo.sn'],
            subject: `Confirmation de votre commande JULO #${orderId.slice(-6).toUpperCase()}`,
            html: `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif, Arial; max-width: 600px; margin: auto; background: #FAF8F5; border: 1px solid #EAE6DF; padding: 30px; border-radius: 20px; color: #1C1B1F;">
          <h1 style="color: #1C1B1F; margin-top: 0; font-size: 24px;">Merci pour votre commande chez JULO !</h1>
          <p>Bonjour,</p>
          <p>Nous avons bien enregistré votre commande <strong>#${orderId.slice(-6).toUpperCase()}</strong>.</p>
          <hr style="border: none; border-top: 1px solid #EAE6DF; margin: 20px 0;">
          <h3 style="color: #1C1B1F; margin-bottom: 15px;">Articles commandés :</h3>
          <ul style="padding-left: 20px; line-height: 1.6;">
            ${items
                .map(
                    (item) => `
              <li><strong>${item.name}</strong> (x${item.quantity}) — ${item.price.toLocaleString('fr-SN')} FCFA</li>
            `
                )
                .join('')}
          </ul>
          <p style="font-size: 20px; font-weight: bold; color: #C59A63; margin-top: 20px;">Total : ${totalPrice.toLocaleString('fr-SN')} FCFA</p>
          <hr style="border: none; border-top: 1px solid #EAE6DF; margin: 25px 0;">
          <p style="font-size: 12px; color: #8C8275;">JULO — Smartphones, PC & High-Tech au Sénégal (Dakar & Touba). Service client : +221 75 446 90 97</p>
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
            from: 'JULO <contact@julo.sn>',
            to: [to],
            subject: `🎉 Le produit ${productName} est de retour en stock chez JULO !`,
            html: `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif, Arial; max-width: 600px; margin: auto; background: #FAF8F5; border: 1px solid #EAE6DF; padding: 30px; border-radius: 20px; text-align: center; color: #1C1B1F;">
          <h1 style="color: #1C1B1F;">Bonne nouvelle !</h1>
          <p>L'article que vous attendiez est à nouveau disponible chez <strong>JULO</strong>.</p>
          <div style="margin: 25px 0; background: #FFFFFF; border: 1px solid #EAE6DF; padding: 20px; border-radius: 20px;">
            <img src="${productImage}" alt="${productName}" style="width: 140px; height: 140px; object-fit: contain; margin-bottom: 15px;">
            <h2 style="margin: 0; color: #1C1B1F; font-size: 18px;">${productName}</h2>
            <p style="font-size: 20px; font-weight: bold; color: #C59A63; margin: 10px 0;">${productPrice.toLocaleString('fr-SN')} FCFA</p>
          </div>
          <a href="${productUrl}" style="display: inline-block; background: #1C1B1F; color: white; padding: 14px 28px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 13px; letter-spacing: 1px; margin-bottom: 20px;">COMMANDER MAINTENANT</a>
          <hr style="border: none; border-top: 1px solid #EAE6DF; margin: 20px 0;">
          <p style="font-size: 12px; color: #8C8275;">JULO — Boutique High-Tech & Smartphones au Sénégal.</p>
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
        subject = `🚚 Votre commande JULO #${orderId.slice(-6).toUpperCase()} est en route !`;
        messageHtml = `
        <h1 style="color: #1C1B1F;">Excellente nouvelle !</h1>
        <p>Bonjour ${name},</p>
        <p>Votre commande <strong>#${orderId.slice(-6).toUpperCase()}</strong> a été confiée à notre service de livraison. Notre livreur vous contactera directement avant son arrivée.</p>
        `;
    } else if (status === 'DELIVERED') {
        subject = `✅ Votre commande JULO #${orderId.slice(-6).toUpperCase()} a été livrée`;
        messageHtml = `
        <h1 style="color: #1C1B1F;">Commande livrée !</h1>
        <p>Bonjour ${name},</p>
        <p>Votre commande <strong>#${orderId.slice(-6).toUpperCase()}</strong> vous a été remise. Merci pour votre confiance envers JULO !</p>
        <div style="background-color: #FFFFFF; border: 1px solid #EAE6DF; padding: 20px; border-radius: 16px; margin-top: 20px;">
            <p style="margin-top: 0; font-weight: bold; color: #1C1B1F;">Partagez votre expérience</p>
            <p style="color: #8C8275; font-size: 13px;">Votre avis compte énormément pour notre équipe. Prenez 30 secondes pour évaluer votre expérience !</p>
            <a href="${APP_URL}/orders" style="display: inline-block; background: #C59A63; color: white; padding: 10px 20px; border-radius: 20px; text-decoration: none; font-weight: bold; margin-top: 10px; font-size: 12px;">LAISSER UN AVIS</a>
        </div>
        `;
    } else if (status === 'CANCELLED') {
        subject = `❌ Votre commande JULO #${orderId.slice(-6).toUpperCase()} a été annulée`;
        messageHtml = `
        <h1 style="color: #EF4444;">Commande annulée</h1>
        <p>Bonjour ${name},</p>
        <p>Votre commande <strong>#${orderId.slice(-6).toUpperCase()}</strong> a été annulée. En cas de question, contactez notre support WhatsApp au +221 75 446 90 97.</p>
        `;
    } else {
        return { success: false, error: 'Unrecognized status' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'JULO <commandes@julo.sn>',
            to: [to],
            subject: subject,
            html: `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif, Arial; max-width: 600px; margin: auto; background: #FAF8F5; border: 1px solid #EAE6DF; padding: 30px; border-radius: 20px; text-align: center; color: #1C1B1F;">
            ${messageHtml}
            <a href="${APP_URL}/orders" style="display: inline-block; background: #1C1B1F; color: white; padding: 14px 28px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 13px; margin: 25px 0;">VOIR MA COMMANDE</a>
            <hr style="border: none; border-top: 1px solid #EAE6DF; margin: 20px 0;">
            <p style="font-size: 12px; color: #8C8275;">JULO — Smartphones, PC & High-Tech au Sénégal.</p>
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

export async function sendAdminNewOrderAlert({ orderId, totalPrice, items, customer, address }) {
    if (!resend) return { success: false };

    try {
        const orderShortId = orderId.slice(-6).toUpperCase();
        const { data, error } = await resend.emails.send({
            from: 'JULO ALERTES <alertes@julo.sn>',
            to: ['contact@julo.sn'],
            subject: `🚨 NOUVELLE COMMANDE JULO #${orderShortId}`,
            html: `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif, Arial; max-width: 600px; margin: auto; border: 2px solid #C59A63; background: #FAF8F5; padding: 25px; border-radius: 20px; color: #1C1B1F;">
          <h1 style="color: #1C1B1F; margin-top: 0; font-size: 22px;">📦 Nouvelle commande reçue sur JULO !</h1>
          <p style="font-size: 14px;">Une commande vient d'être validée par un client.</p>
          
          <div style="background: #FFFFFF; border: 1px solid #EAE6DF; padding: 15px; border-radius: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0; font-size: 15px; color: #1C1B1F;">Coordonnées Client :</h3>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Nom :</strong> ${customer.name}</p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Téléphone :</strong> ${customer.phone}</p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Adresse :</strong> ${address?.street || ''}, ${address?.city || ''}</p>
          </div>

          <h3 style="font-size: 15px; color: #1C1B1F;">Détails des articles :</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            ${items
                .map(
                    (item) => `
              <tr style="border-bottom: 1px solid #EAE6DF;">
                <td style="padding: 8px 0;">${item.name} <strong>x${item.quantity}</strong></td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${item.price.toLocaleString('fr-SN')} F</td>
              </tr>
            `
                )
                .join('')}
          </table>
          
          <div style="text-align: right; margin-top: 20px;">
            <p style="font-size: 18px; font-weight: bold; color: #C59A63;">Total : ${totalPrice.toLocaleString('fr-SN')} FCFA</p>
          </div>

          <div style="margin-top: 25px; text-align: center;">
            <a href="${APP_URL}/admin/orders" style="display: inline-block; background: #1C1B1F; color: white; padding: 12px 25px; border-radius: 25px; text-decoration: none; font-weight: bold; font-size: 12px;">ACCÉDER AU DASHBOARD ADMIN</a>
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
