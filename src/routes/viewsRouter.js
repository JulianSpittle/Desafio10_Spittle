import { Router } from "express";
import ProductManager from "../manager/productManager.js";

const productManager = new ProductManager();

const productsRouterHandle = Router();

productsRouterHandle.get("/", async (req, res) => {
	try {
		const products = await productManager.getProductsGeneral();
		res.render("pages/home", { products, isHome: true });
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
});

productsRouterHandle.get("/realtimeproducts", async (req, res) => {
	try {
		res.render("pages/realtimeproducts", { isRealtimeProducts: true });
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
});

export default productsRouterHandle;
