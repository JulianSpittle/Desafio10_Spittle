import express from "express";
import ProductManager from "../dao/ProductManager.js";
import CartManager from "../dao/CartManager.js"

const router = express.Router();
const PM = new ProductManager();
const CM = new CartManager();

router.get("/", async (req, res) => {
    const products = await PM.getProducts(req.query);
    res.render("home", { products });
});

router.get("/products", async (req, res) => {
    const products = await PM.getProducts(req.query);
    res.render("products", {products});
  });

router.get("/products/:pid", async (req, res) => {
  const pid = req.params.pid;
  const product = await PM.getProductById(pid);
  if (product) {
    res.render("productDetail", { product });
  } else {
    res.status(404).send({ status: "error", message: "Product not found." });
  }
});

router.get("/carts/:cid", async (req, res) => {
    const cid = req.params.cid;
    const cart = await CM.getCart(cid);
  
    if (cart) {
      console.log(JSON.stringify(cart, null, 4));
      res.render("cart", { products: cart.products });
    } else {
      res.status(400).send({
        status: "error",
        message: "Error! No se encuentra el ID de Carrito!",
      });
    }
  });

router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts");
});

router.get("/chat", (req, res) => {
    res.render("chat");
});

export default router;