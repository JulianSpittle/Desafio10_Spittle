import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: Array,
    id: Number
});

export const cartModel = mongoose.model("carts", cartSchema);