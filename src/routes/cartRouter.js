import CartManager from "../manager/cartManager.js";
import ProductManager from "../manager/productManager.js";
import { Router } from "express";

const productsRouter = Router();

productsRouter.post("/", async (req, res) => {
	try {
		const cart = new CartManager();
		await cart.initialize();

		const addProduct = await cart.newOrder();
		res.status(200).send(addProduct);
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
});

//lo agregue unicamente para que no tire error en la principal del get
productsRouter.get("/", async (req, res) => {
	try {
		const cart = new CartManager();
		await cart.initialize();
		const getCart = await cart.getCartGeneral();
		res.status(200).send(getCart);
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
});

productsRouter.get("/:cid", async (req, res) => {
	const { cid } = req.params;
	try {
		if (!cid) {
			return res.status(400).send({ error: "id is not a number" });
		}

		const cart = new CartManager();
		await cart.initialize();

		const getOrderById = await cart.getOrderById(parseInt(cid));

		if (!getOrderById) {
			return res.status(404).send({ error: "cart not found" });
		}

		res.status(200).send({ cart: getOrderById });
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
});

productsRouter.post("/:cid/products/:pid", async (req, res) => {
	try {
		const cart = new CartManager();
		const productManager = new ProductManager();
		const { cid, pid } = req.params;
		await cart.initialize();

		await productManager.initialize();

		const getOrderById = await cart.getOrderById(parseInt(cid));
		if (!getOrderById) {
			return res.status(404).send({ error: "cart not found" });
		}

		const getProductById = await productManager.getProductsById(parseInt(pid));
		if (!getProductById) {
			return res.status(404).send({ error: "product not found" });
		}

		await cart.addProductToCart(parseInt(cid), parseInt(pid));

		res.status(200).send({ message: "product added to cart", product: getProductById });
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
});

export default productsRouter;
