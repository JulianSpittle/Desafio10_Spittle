import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//para usar con postman
import productsRouter from "./routes/productsRouter.js";
import cartRouter from "./routes/cartRouter.js";
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
//para usar con handlebars
import viewsRouter from "./routes/viewsRouter.js";
app.use("/", viewsRouter);

const httpServer = app.listen(port, () => {
	console.log(`Servidor corriendo en el puerto ${port}`);
});

export const socketServer = new Server(httpServer);

import ProductManager from "./manager/productManager.js";
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
});
