import express from 'express';
const router = express.Router();
import POOL from '../database/connect.js';

router.get('/:user_id', async function (req, res, next) {
  try {
    const user_id = req.params.user_id;
    const cart = await POOL.QUERY`SELECT * FROM carts WHERE user_id = ${user_id}`;
    const detailed_products = await POOL.QUERY`SELECT * from detailed_products`;
    const detailed_products_option_properties =
      await POOL.QUERY`SELECT * from detailed_products_option_properties`;
    const products = await POOL.QUERY`SELECT * FROM products`;
    const option_properties = await POOL.QUERY`SELECT * FROM option_properties`;
    res.json({
      user_id: user_id,
      cart: cart,
      detailed_products: detailed_products,
      option_properties: option_properties,
      detailed_products_option_properties: detailed_products_option_properties,
      products: products,
    });
  } catch (error) {
    next(error);
  }
});

export default router;