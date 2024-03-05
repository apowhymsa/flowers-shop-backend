import crypto from "crypto";
import * as process from "process";
import nodemailer from "nodemailer";
import express from "express";
import fs from "fs/promises";
import fss from "fs";
import ejs from "ejs";
import path from "path";
import { Attachment } from "nodemailer/lib/mailer";
import editorJsHtml from "editorjs-html";

export const random = () => crypto.randomBytes(128).toString("base64");
export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(process.env["SECRET_KEY"])
    .digest("hex");
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "clumbaeshop@gmail.com",
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

// Читаем содержимое EJS-шаблона
async function getEmailTemplate() {
  try {
    const filePath = path.join(__dirname, `hmtl.ejs`);
    console.log(filePath);
    const template = await fs.readFile(filePath, "utf-8");
    return template;
  } catch (error) {
    console.error("Error reading email template:", error);
    throw error;
  }
}

// req: express.Request, res: express.Response
export const startMailing = async (
  req: express.Request,
  res: express.Response
) => {
  const emailTemplate = await getEmailTemplate();

  const { htmlData, title } = req.body;

  if (!htmlData || !title) {
    return res.sendStatus(403);
  }

  const html = editorJsHtml().parse(htmlData);
  console.log("html", html);

  // Заполняем шаблон данными
  const renderedTemplate = ejs.render(emailTemplate, {
    username: "Anton",
    htmlContent: html.join(""),
  });
  const mailOptions = {
    from: "clumbaeshop@gmail.com",
    to: ["apowhymsa@gmail.com"],
    subject: title,
    html: renderedTemplate,
    attachments: [
      {
        filename: "clumba-logo.png",
        href: "http://localhost:3001/images/clumba-logo.png",
        cid: "unique-logo@nodemailer.com",
      },
      {
        filename: "icons8-instagram.png",
        href: "http://localhost:3001/images/icons8-instagram.png",
        cid: "unique-inst@nodemailer.com",
      },
      // {
      //   filename: "bottom-image-mail.png",
      //   href: "https://d9zyg9-3001.csb.app/images/bottom-image-mail.png",
      //   cid: "unique-bottom@nodemailer.com",
      // },
    ],
  };

  transporter
    .sendMail(mailOptions)
    .then((info) => {
      console.log("Email sent:", info.response);
      return res.sendStatus(200);
    })
    .catch((error) => {
      console.error("Error sending email:", error);
      return res.sendStatus(500);
    });
};
