import fs from "fs/promises";
import { get } from "http";

class CartManager {
	constructor() {
		this.cart = [];
		this.path = "./json/carrito.json";
	}
	static id = 1;
	initialize = async () => {
		try {
			await fs.access(this.path);

			const productsCartParse = await this.getCartGeneral();
			if (productsCartParse.length !== 0) {
				const productsCartParse = await this.getCartGeneral();
				this.cart = productsCartParse;
				CartManager.id = Math.max(...this.cart.map((item) => item.id)) + 1;
			}
		} catch (err) {
			await this.createFile();
		}
	};

	getCartGeneral = async () => {
		try {
			const getCart = await fs.readFile(this.path, "utf-8");
			const getCartParse = JSON.parse(getCart);
			return getCartParse;
		} catch (err) {
			console.log(err.message);
		}
	};

	newOrder = async () => {
		try {
			const order = {
				id: CartManager.id++,
				products: [],
			};

			this.cart.push(order);
			await this.createFile();

			return order;
		} catch (err) {
			console.log(err.message);
		}
	};

	createFile = async () => {
		try {
			await fs.writeFile(this.path, JSON.stringify(this.cart, null, 2));
		} catch (err) {
			console.log(err.message);
		}
	};

	getOrderById = async (id) => {
		try {
			const readParse = await this.getCartGeneral();
			const getOrderById = readParse.find((item) => item.id === id);

			if (!getOrderById) {
				return undefined;
			}

			const products = getOrderById.products;
			return products;
		} catch (err) {
			console.log(err.message);
		}
	};

	addProductToCart = async (cid, pid) => {
		try {
			const order = this.cart.find((item) => item.id === cid);
			const exist = order.products.find((item) => item.id === pid);

			if (!exist) {
				order.products.push({ id: pid, quantity: 1 });
			} else {
				exist.quantity++;
			}

			await this.createFile();
		} catch (err) {
			console.log(err.message);
		}
	};
}

export default CartManager;
