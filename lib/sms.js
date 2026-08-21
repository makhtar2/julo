/**
 * Service d'envoi de SMS pour Global Air
 * Vous pouvez intégrer ici votre fournisseur (Twilio, Infobip, PayTech, etc.)
 */

export async function sendSMS({ to, message }) {
    // Nettoyage du numéro de téléphone (doit commencer par 221 pour le Sénégal)
    let phoneNumber = to.replace(/\s+/g, '').replace(/\+/g, '');
    if (!phoneNumber.startsWith('221')) {
        phoneNumber = `221${phoneNumber.replace(/^0/, '')}`;
    }

    console.log(`[SMS] Envoi à ${phoneNumber} : ${message}`);

    // EXEMPLE D'INTÉGRATION (Générique)
    /*
    try {
        const response = await fetch('https://api.votre-fournisseur.com/sms/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.SMS_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: phoneNumber,
                from: 'Global Air',
                text: message
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur SMS:', error);
        return { error };
    }
    */

    return { success: true, simulated: true };
}
