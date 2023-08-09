import { Router } from "express";
import {
	deleteProductRouter,
	getProductByIdRouter,
	getProductsRouter,
	postProductRouter,
	putProductRouter,
} from "../controllers/productsRouterControllers.js";

const productsRouter = Router();

productsRouter.get("/", getProductsRouter);

productsRouter.get("/:id", getProductByIdRouter);

productsRouter.post("/", postProductRouter);

productsRouter.put("/:id", putProductRouter);

productsRouter.delete("/:id", deleteProductRouter);

export default productsRouter;
