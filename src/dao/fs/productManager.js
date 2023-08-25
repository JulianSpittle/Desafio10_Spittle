import fs from "fs/promises";

class ProductManager {
	constructor() {
		this.products = [];
		this.path = "./json/productos.json";
	}

	static id = 1;

	//recorre los productos que existen en el json para evitar subidas duplicadas
	initialize = async () => {
		try {
			await fs.access(this.path);

			const productParse = await this.getProducts();

			if (productParse.length !== 0) {
				const productsParse = await this.getProducts();
				this.products = productsParse;
				ProductManager.id = Math.max(...this.products.map((item) => item.id)) + 1;
			} else {
				await this.createFile();
			}
		} catch (err) {
			// Si el archivo no existe, lo creo con un array vacío
			await this.createFile();
		}
	};

	addProduct = async (product) => {
		try {
			const codeExists = this.products.some((item) => item.code === product.code);
			if (codeExists) {
				return true;
			}

			product.id = ProductManager.id++;
			this.products.push(product);

			await this.createFile();
		} catch (err) {
			console.log(err.message);
		}
	};

	createFile = async () => {
		try {
			await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
		} catch (err) {
			console.log(err.message);
		}
	};

	getProducts = async () => {
		try {
			const getProducts = await fs.readFile(this.path, "utf-8");
			const getProductsParse = JSON.parse(getProducts);
			return getProductsParse;
		} catch (err) {
			console.log(err.message);
		}
	};

	deleteProduct = async (id) => {
		try {
			const readParse = await this.getProducts();
			const deleteProduct = readParse.filter((item) => item.id !== id);
			await fs.writeFile(this.path, JSON.stringify(deleteProduct, null, 2));
		} catch (err) {
			console.log(err.message);
		}
	};

	updateProduct = async (id, product) => {
		try {
			const index = this.products.findIndex((item) => item.id === id);
			if (index === -1) {
				return console.log("no se encontró el producto");
			}
			this.products[index] = product;
			product.id = id;
			await this.createFile();
			return this.products[index];
		} catch (err) {
			console.log(err.message);
		}
	};

	getProductsById = async (id) => {
		try {
			const product = await this.products.find((item) => item.id === id);
			if (!product) {
				return console.log("no se encontró el producto");
			}
			return product;
		} catch (err) {
			console.log(err.message);
		}
	};
}

export default ProductManager;
