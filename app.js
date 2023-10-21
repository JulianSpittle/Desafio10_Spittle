import express from "express";
import Handlebars from "handlebars";
import expressHandlebars from "express-handlebars";
import mongoose from 'mongoose';
import __dirname from "./utils.js";
import { Server } from "socket.io";
import ProductManager from "./src/dao/ProductManager.js";
import viewsRouter from "./src/routes/views.routes.js";
import productsRouter from "./src/routes/products.routes.js";
import cartsRouter from "./src/routes/carts.routes.js";
import { messageModel } from "./src/models/message.model.js";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import sessionsRouter from "./src/routes/session.routes.js";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from "passport";
import initializePassport from "./src/config/passport.config.js";
import cookieParser from "cookie-parser";
import { SECRET_KEY_SESSION, PORT } from "./src/config/config.js";
import cors from "cors";
import DBManager from './src/mongo/ds.js';
import emailRouter from "./src/routes/email.routes.js";
import smsRouter from "./src/routes/sms.routes.js";
require('dotenv').config();
            

const app = express();
const port = process.env.PORT || 8080;

const httpServer = app.listen(port, () => {
	console.log(`Servidor corriendo en el puerto ${port}`);
});
export const socketServer = new Server(httpServer);

app.set("socketServer", socketServer);

app.engine(
	"handlebars",
	expressHandlebars.engine({
	  handlebars: allowInsecurePrototypeAccess(Handlebars),
	})
  );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use('/email', emailRouter);
app.use('/sms', smsRouter);
app.use(
	session({
	  secret: process.env.SECRET_KEY_SESSION,
	  resave: false,
	  saveUninitialized: true,
	  cookie: { 
		secure: false,  
	  },
	  store: MongoStore.create({
		mongoUrl: process.env.MONGODB_CNX_STR,
		collectionName: "sessions"
	  }),
	})
  );
  app.use(cookieParser());

  app.use(passport.initialize());
  app.use(passport.session());
  initializePassport();
  
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use('/api/carts', cartsRouter);
app.use("/api/sessions/", sessionsRouter);


const PM = new ProductManager();

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
	console.log("Conectado a MongoDB");
  });
  
  mongoose.connection.on("error", (err) => {
	console.error("Error conectando a MongoDB:", err);
  });

  socketServer.on("connection", async (socket) => {
	console.log("Un cliente se ha conectado");
  
	const allProducts = await PM.getProducts();
  socket.emit("initial_products", allProducts.payload);
  
  
	const previousMessages = await messageModel.find().sort({ timestamp: 1 });
	socket.emit("previous messages", previousMessages);
  
	socket.on("message", (data) => {
	  console.log("Mensaje recibido del cliente:", data);
	});
  
	socket.on("socket_individual", (data) => {
	  console.log("Evento 'socket_individual' recibido:", data);
	});
  
	socket.on("chat message", async (message) => {
	  console.log("Received message object:", JSON.stringify(message, null, 2));
  
	  const newMessage = new messageModel({
		user: message.user,
		message: message.text,
		timestamp: new Date(),
	  });
	  await newMessage.save();
  
	  socketServer.emit("chat message", {
		user: message.user,
		message: message.text,
	  });
	});
  });
  

