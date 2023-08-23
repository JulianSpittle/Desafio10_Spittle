import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.routes.js";
import { Server } from "socket.io";
import ProductManager from "./dao/ProductManager.js";
import ChatManager from "./dao/ChatManager.js";
import mongoose from 'mongoose';
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import userRouter from './routes/users.router.js';

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use("/api/users", userRouter);
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use("/api/products", productsRouter);
app.use("/api/cart", cartsRouter);
app.use("/", viewsRouter);

mongoose.connect ("mongodb+srv://julianspittle96:csbETVhM9g62GvIz@cluster0.wzsgzlg.mongodb.net/?retryWrites=true&w=majority");



const httpServer = app.listen(port, () => {
	console.log(`Servidor corriendo en el puerto ${port}`);
});

export const socketServer = new Server(httpServer);

const productManager = new ProductManager();

socketServer.on("connection", async (socket) => {
	console.log("Nuevo cliente conectado");
	const listProducts = await productManager.getProductsGeneral();
	socketServer.emit("sendProducts", listProducts);

	socket.on("addProduct", async (product) => {
		try {
			await productManager.initialize();
			const exist = await productManager.getProductsGeneral();

			if (exist.some((item) => item.code === product.code)) {
				return socket.emit("error", { error: "El código ya existe" });
			}

			await productManager.addProduct(product);

			const listProducts = await productManager.getProductsGeneral();
			socketServer.emit("sendProducts", listProducts);
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
			const listProducts = await productManager.getProductsGeneral();
			socketServer.emit("productosupdated", listProducts);
		} catch (err) {
			socket.emit("error", { error: err.message });
		}
	});
	socket.on("newMessage", async (data) => {
        CM.createMessage(data);
        const messages = await CM.getMessages();
        socket.emit("messages", messages);
    });
});

const CM = new ChatManager();