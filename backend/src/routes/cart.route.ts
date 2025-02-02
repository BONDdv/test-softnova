import { Router } from "express";
import { addProductToCartItem, confirmCart, createCartForProduct, editProductFromCart, getHistoryCartTotal } from "../controllers/cart.controller";



const router = Router();



/**
 * @swagger
 * /createCart:
 *   post:
 *     summary: Create a new shopping cart
 *     tags: [Cart]
 *     description: Creates a new cart for the user and returns the cart ID.
 *     responses:
 *       201:
 *         description: Cart created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Create cart success
 *                 cartId:
 *                   type: string
 *                   example: "12345"
 *       500:
 *         description: Failed to create cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to create cart
 *                 error:
 *                   type: string
 *                   example: "Error details here"
 */
router.post('/createCart', createCartForProduct);


/**
 * @swagger
 * /addToCart:
 *   post:
 *     summary: Add products to the shopping cart
 *     tags: [Cart]
 *     description: Adds specified products to an existing cart or creates a new cart if none exists.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartId:
 *                 type: integer
 *                 description: The ID of the cart to add items to. If not provided, a new cart is created.
 *                 example: 12345
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       description: The ID of the product to add to the cart.
 *                       example: 6789
 *                     quantity:
 *                       type: integer
 *                       description: The quantity of the product to add to the cart.
 *                       example: 2
 *     responses:
 *       201:
 *         description: Products added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Products added to ProductOnCartItem successfully
 *                 totalPrice:
 *                   type: number
 *                   example: 250.75
 *                 cartId:
 *                   type: integer
 *                   example: 12345
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Product Name"
 *                       price:
 *                         type: number
 *                         example: 50.25
 *       400:
 *         description: Invalid payload or missing items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid payload. 'items' must be an array."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server Error
 */ 
router.post('/addToCart', addProductToCartItem);


/**
 * @swagger
 * paths:
 *   /api/cart/edit:
 *     put:
 *       summary: Edit products in cart
 *       tags: [Cart]
 *       description: Update the quantity of products in the cart. If quantity is 0, product will be removed from the cart.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cartId:
 *                   type: integer
 *                   description: The unique ID of the cart
 *                   example: 123
 *                 items:
 *                   type: array
 *                   description: A list of items to update in the cart
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: integer
 *                         description: The product ID to update
 *                         example: 6
 *                       quantity:
 *                         type: integer
 *                         description: The new quantity of the product in the cart. If quantity is 0, the product will be removed.
 *                         example: 2
 *       responses:
 *         200:
 *           description: Cart updated successfully with the new quantity of products
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "ProductOnCartItem update success"
 *                   updateItems:
 *                     type: array
 *                     description: List of updated items
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         cartId:
 *                           type: integer
 *                           example: 123
 *                         productId:
 *                           type: integer
 *                           example: 6
 *                         quantity:
 *                           type: integer
 *                           example: 2
 *                   deleteItems:
 *                     type: array
 *                     description: List of productIds that were removed from the cart
 *                     items:
 *                       type: integer
 *                       example: 6
 *                   totalPrice:
 *                     type: number
 *                     example: 150.00
 *         400:
 *           description: Invalid input or bad request
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "cartId and items (with productId and quantity) are required"
 *         404:
 *           description: Cart not found
 *         500:
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Server Error"
 */
router.put('/edit', editProductFromCart)

/**
 * @swagger
 * paths:
 *   /api/cart/confirm/{cartId}:
 *     post:
 *       summary: Confirm the cart and finalize the purchase
 *       tags: [Cart]
 *       description: Confirms the cart by moving all items to confirmed items and updating the cart's total price.
 *       parameters:
 *         - in: path
 *           name: cartId
 *           required: true
 *           description: The unique ID of the cart to confirm
 *           schema:
 *             type: integer
 *             example: 123
 *       responses:
 *         200:
 *           description: Cart confirmed successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Cart confirmed successfully"
 *                   cartId:
 *                     type: integer
 *                     example: 123
 *                   totalPrice:
 *                     type: number
 *                     example: 200.00
 *         400:
 *           description: No items in the cart to confirm
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "No items to confirm in this cart"
 *         404:
 *           description: Cart not found
 *         500:
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Server Error"
 */
router.post('/confirm/:cartId', confirmCart)


/**
 * @swagger
 * paths:
 *   /api/cart/getHistoryCart:
 *     get:
 *       summary: Retrieve the history of carts with items
 *       tags: [Cart]
 *       description: Fetches a list of carts that have items with details about each cart and its associated items.
 *       responses:
 *         200:
 *           description: A list of carts with their associated items
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   cartItemsDetails:
 *                     type: array
 *                     description: A list of cart details with associated items
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           description: The unique ID of the cart
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           description: The creation date and time of the cart
 *                         totalPrice:
 *                           type: number
 *                           format: float
 *                           description: The total price of the items in the cart
 *                         cartItem:
 *                           type: array
 *                           description: A list of items in the cart
 *                           items:
 *                             type: object
 *                             properties:
 *                               productId:
 *                                 type: integer
 *                                 description: The ID of the product in the cart
 *                               quantity:
 *                                 type: integer
 *                                 description: The quantity of the product in the cart
 *         500:
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Server error"
 */
router.get("/getHistoryCart", getHistoryCartTotal);





export default router;