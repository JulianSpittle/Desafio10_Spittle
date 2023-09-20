import express from "express";
import Handlebars from "handlebars";
import expressHandlebars from "express-handlebars";
import mongoose from 'mongoose';
import __dirname from "./utils.js";
import { Server } from "socket.io";
import ProductManager from "./dao/ProductManager.js";
import viewsRouter from "./routes/views.routes.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import chatRouter from "./routes/chat.router.js";
import { messageModel } from "./dao/models/message.model.js";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import sessionsRouter from "./routes/session.routes.js";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from "passport";
import initializePassport from "./config/passport.config.js";

const app = express();
const port = 8080;
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
app.use(session({
	secret: 'L8I0',
	resave: false,
	saveUninitialized: false,
	cookie: { secure: false },
	store: MongoStore.create({ 
	  mongoUrl: "mongodb+srv://julianspittle96:csbETVhM9g62GvIz@cluster0.wzsgzlg.mongodb.net/ecommerce?retryWrites=true&w=majority",
	  collectionName: 'sessions'
	})
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  initializePassport();

  app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/chat', chatRouter);
app.use("/api/sessions/", sessionsRouter);

const productManager = new ProductManager();

mongoose.connect("mongodb+srv://julianspittle96:csbETVhM9g62GvIz@cluster0.wzsgzlg.mongodb.net/ecommerce?retryWrites=true&w=majority");

mongoose.connection.on("connected", () => {
	console.log("Conectado a MongoDB");
  });
  
  mongoose.connection.on("error", (err) => {
	console.error("Error conectando a MongoDB:", err);
  });

socketServer.on("connection", async (socket) => {
	console.log("Nuevo cliente conectado");
	const listProducts = await productManager.getProducts({ limit: 10 }); 
	socket.emit("sendProducts", listProducts);
	//products
	socket.on("addProduct", async (product) => {
		try {
			await productManager.initialize();
			const exist = await productManager.getProducts();

			if (exist.some((item) => item.code === product.code)) {
				return socket.emit("error", { error: "El código ya existe" });
			}

			await productManager.addProduct(product);

			const listProducts = await productManager.getProducts();
			socket.emit("sendProducts", listProducts);
		} catch (err) {
			socket.emit("error", { error: err.message });
		}
	});
	socket.on("deleteProduct", async (id) => {
		try {
			await productManager.initialize();
			const exist = await productManager.getProductsById(id);
			if (!exist) {
				return socket.emit("error", { error: "El producto no existe" });
			}
			await productManager.deleteProduct(id);
			const listProducts = await productManager.getProducts();
			socket.emit("productosupdated", listProducts);
		} catch (err) {
			socket.emit("error", { error: err.message });
		}
	});
	//carts
	const listCarts = await cartsManager.getCarts();
	socket.emit("sendCarts", listCarts);

	//chats
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

