import nodemailer from "nodemailer";
import { EMAIL_PASS, EMAIL_USER } from "../config/config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

const mailOptions = {
  from: "Coder Test " + EMAIL_USER,
  to: EMAIL_USER,
  subject: "Correo de prueba Coderhouse Programacion Backend.",
  html: "<div><h1>Esto es un Test de envio de correos con Nodemailer!</h1></div>",
  attachments: [],
};

const mailOptionsWithAttachments = {
  from: "Coder Test " + EMAIL_USER,
  to: EMAIL_USER,
  subject: "Correo de prueba Coderhouse Programacion Backend.",
  html: `<div>
              <h1>Esto es un Test de envio de correos con Nodemailer!</h1>
              <p>Ahora usando imagenes: </p>
              <img src="cid:meme"/>
          </div>`,
  attachments: [
    {
      filename: "Meme de Programacion",
      // path: __dirname + "/public/images/meme.png",
      cid: "meme",
    },
  ],
};

export const sendEmail = (req, res) => {
  try {
    let result = transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(400).send({ message: "Error", payload: error });
      }
      console.log("Message sent: %s", info.messageId);
      res.send({ message: "Success!", payload: info });
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({
        error: error,
        message: "No se pudo enviar el email desde:" + config.gmailAccount,
      });
  }
};

export const sendEmailWithAttachments = (req, res) => {
  try {
    let result = transporter.sendMail(
      mailOptionsWithAttachments,
      (error, info) => {
        if (error) {
          console.log(error);
          res.status(400).send({ message: "Error", payload: error });
        }
        console.log("Message sent: %s", info.messageId);
        res.send({ message: "Success!", payload: info });
      }
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({
        error: error,
        message: "No se pudo enviar el email desde:" + config.gmailAccount,
      });
  }
};

