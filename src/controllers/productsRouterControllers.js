import ProductManager from "../manager/productManager.js";
import { socketServer } from "../app.js";

export const getProductsRouter = async (req, res) => {
	const { limit } = req.query;

	try {
		const products = new ProductManager();
		await products.initialize();

		const getProducts = await products.getProductsGeneral();
		if (limit > 0 && limit < getProducts.length) {
			const limitProducts = getProducts.slice(0, limit);
			return res.status(200).send(limitProducts);
		}
		res.status(200).send(getProducts);
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
};

export const getProductByIdRouter = async (req, res) => {
	try {
		const { id } = req.params;
		const products = new ProductManager();
		await products.initialize();

		const getProductById = await products.getProductsById(parseInt(id));
		if (!getProductById) {
			return res.status(404).send({ error: "product not found" });
		}
		res.status(200).send(getProductById);
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
};

export const postProductRouter = async (req, res) => {
	try {
		const { title, description, code, price, stock, category, thumbnail } = req.body;
		const products = new ProductManager();
		await products.initialize();

		const exist = await products.getProductsGeneral();

		if (exist.some((item) => item.code === code)) {
			return res.status(400).send({ error: "El código ya existe" });
		}

		if (!title || !description || !code || !price || !stock || !category) {
			return res.status(400).send({ error: "Falta completar datos" });
		}

		if (thumbnail && !Array.isArray(thumbnail)) {
			return res.send({ error: "El campo de imágenes debe ser un array" });
		}

		if ((thumbnail && thumbnail.length === 0) || thumbnail === "") {
			return res.send({ error: "Falta ingresar una o más imágenes" });
		}

		const newProduct = {
			title,
			description,
			code,
			price,
			stock,
			category,
			thumbnail,
		};

		newProduct.status = true;

		await products.addProduct(newProduct);
		socketServer.emit("productosupdated", await products.getProductsGeneral());
		res.status(200).send(newProduct);
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
};

export const putProductRouter = async (req, res) => {
	try {
		const { id } = req.params;
		const { title, description, code, price, stock, category, thumbnail } = req.body;
		const products = new ProductManager();
		await products.initialize();

		const getProductById = await products.getProductsById(parseInt(id));

		if (!getProductById) {
			return res.status(404).send({ error: "product not found" });
		}

		if (!title || !description || !code || !price || !stock || !category) {
			return res.status(400).send({ error: "Faltan completar datos" });
		}

		const updateProduct = {
			title,
			description,
			code,
			price,
			stock,
			category,
			thumbnail,
		};

		updateProduct.status = true;

		const updatedProduct = await products.updateProduct(parseInt(id), updateProduct);

		res.status(200).send(updatedProduct);
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
};

export const deleteProductRouter = async (req, res) => {
	try {
		const { id } = req.params;
		const products = new ProductManager();
		await products.initialize();

		const getProductById = await products.getProductsById(parseInt(id));

		if (!getProductById) {
			return res.status(404).send({ error: "product not found" });
		}

		await products.deleteProduct(parseInt(id));

		res.status(200).send({ success: "Producto eliminado", getProductById });
		socketServer.emit("productosupdated", await products.getProductsGeneral());
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
};
