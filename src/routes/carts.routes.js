import { Router } from "express";
import CartManager from "../dao/cartManager.js";
import cartControllers from "../controllers/cartControllers.js";
import { authorization, passportCall } from "../../utils.js";

const cartsRouter = Router();
const CM = new CartManager();

cartsRouter.post("/", cartControllers.createCart.bind(cartControllers));

cartsRouter.get("/:cid", cartControllers.getCart.bind(cartControllers));

cartsRouter.post("/:cid/products/:pid", passportCall('jwt'), authorization(['user']), cartControllers.addProductToCart.bind(cartControllers));

cartsRouter.put("/:cid/products/:pid", cartControllers.updateQuantityProductFromCart.bind(cartControllers));

cartsRouter.put("/:cid", cartControllers.updateCart.bind(cartControllers));

cartsRouter.delete("/:cid/products/:pid", cartControllers.deleteProductFromCart.bind(cartControllers));

cartsRouter.delete("/:cid", cartControllers.deleteProductsFromCart.bind(cartControllers));

cartsRouter.post("/:cid/purchase", (req, res, next) => {
    console.log('Ruta de compra accedida');
    next();
  }, passportCall("jwt"), cartControllers.createPurchaseTicket.bind(cartControllers));


export default cartsRouter;