import express from "express";
import handlebars from "express-handlebars";
import mongoose from 'mongoose';
import __dirname from "./utils.js";
import { Server } from "socket.io";
import ProductManager from "./dao/ProductManager.js";
import CartManager from './dao/CartManager.js';
import ChatManager from "./dao/ChatManager.js";
import viewsRouter from "./routes/views.routes.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import userRouter from './routes/users.router.js';
import chatRouter from "./routes/chat.router.js";

const app = express();
const port = 8080;
const httpServer = app.listen(port, () => {
	console.log(`Servidor corriendo en el puerto ${port}`);
});

app.engine('handlebars', handlebars.engine());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use("/", viewsRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/chats', chatRouter);

mongoose.connect("mongodb+srv://julianspittle96:csbETVhM9g62GvIz@cluster0.wzsgzlg.mongodb.net/ecommerce?retryWrites=true&w=majority");

export const io = new Server(httpServer);

const productManager = new ProductManager();
const cartsManager = new CartManager();
const chatManager = new ChatManager();
let messages = [];

io.on("connection", async (socket) => {
	console.log("Nuevo cliente conectado");
	const listProducts = await productManager.getProducts();
	io.emit("sendProducts", listProducts);
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
			io.emit("sendProducts", listProducts);
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
			io.emit("productosupdated", listProducts);
		} catch (err) {
			socket.emit("error", { error: err.message });
		}
	});
	//carts
	const listCarts = await cartsManager.getCarts();
	io.emit("sendCarts", listCarts);

	//chats
	const listChat = await chatManager.getMessages();
	io.emit("sendChats", listChat);
	//chatbox
	socket.on("message", data => { //escucha el evento "message" del cliente
		messages.push(data) //guarda el objeto en el arrray
		io.emit('messageLogs', messages) //reenvia el log actualizado al evento "messageLogs@ en el index.js
	})
});

