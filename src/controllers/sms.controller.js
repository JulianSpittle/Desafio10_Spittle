import twilio from 'twilio';
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SMS_NUMBER } from '../config/config.js';

const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const twilioSMSOptions = {
    body: "Esto es un mensaje SMS de prueba usando Twilio desde Coderhouse.",
    from: TWILIO_SMS_NUMBER,
    to: "+54 358 506 9301",
}

export const sendSMS = async (req, res) => {
    try {
        console.log("Enviando SMS using Twilio account.");
        console.log(twilioClient);
        const result = await twilioClient.messages.create(twilioSMSOptions);
        res.send({message: "Success!", payload: result});
    } catch (error) {
        console.error("Hubo un problema enviando el SMS usando Twilio.", error);
        res.status(500).send({error: error});
    }
}