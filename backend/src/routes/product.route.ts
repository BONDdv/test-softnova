import { Router } from "express";
import { addProduct, getAllProducts, removeProduct, searchProduct, updateProduct } from "../controllers/product.controller";

const router = Router();





/**
 * @swagger
 * paths:
 *   /api/product:
 *     get:
 *       summary: List all products
 *       tags: [Products]
 *       description: Get all products with pagination
 *       parameters:
 *         - in: query
 *           name: page
 *           required: false
 *           schema:
 *             type: integer
 *             default: 1
 *           description: Page number for pagination (starting from 1)
 *         - in: query
 *           name: limit
 *           required: false
 *           schema:
 *             type: integer
 *             default: 7
 *           description: Number of items per page
 *       responses:
 *         200:
 *           description: A list of products
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   products:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Product'
 *                   totalItems:
 *                     type: integer
 *                   totalPages:
 *                     type: integer
 *                   currentPage:
 *                     type: integer
 *         500:
 *           description: Server error
 */
router.get('/', getAllProducts);


/**
 * @swagger
 * paths:
 *   /api/product/search:
 *     get:
 *       summary: Search for products
 *       tags: [Products]
 *       description: Search products by name
 *       parameters:
 *         - in: query
 *           name: query
 *           required: true
 *           schema:
 *             type: string
 *           description: The search keyword for product names
 *       responses:
 *         200:
 *           description: A list of products matching the search criteria
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   products:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Product'
 *         400:
 *           description: Bad request (e.g., missing query parameter)
 *         500:
 *           description: Server error
 */
router.get('/search', searchProduct);


/**
 * @swagger
 * paths:
 *   /api/product:
 *     post:
 *       summary: Add a new product
 *       tags: [Products]
 *       description: Create a new product with name and price
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - name
 *                 - price
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of the product
 *                   example: "HarryPotter8"
 *                 price:
 *                   type: number
 *                   description: The price of the product
 *                   example: 1000
 *       responses:
 *         201:
 *           description: Product created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Success message
 *                     example: "Created new product"
 *                   product:
 *                     $ref: '#/components/schemas/Product'
 *         400:
 *           description: Bad request (e.g., missing or invalid fields)
 *         500:
 *           description: Server error
 */
router.post('/', addProduct);


/**
 * @swagger
 * paths:
 *   /api/product/{id}:
 *     put:
 *       summary: Update a product
 *       tags: [Products]
 *       description: Update the details of an existing product
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *           description: The unique identifier of the product to update
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The updated name of the product
 *                   example: "Updated Laptop"
 *                 price:
 *                   type: number
 *                   description: The updated price of the product
 *                   example: 1200
 *       responses:
 *         200:
 *           description: Product updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Success message
 *                     example: "Update product success"
 *                   product:
 *                     $ref: '#/components/schemas/Product'
 *         400:
 *           description: Bad request (e.g., invalid product ID or duplicate name)
 *         404:
 *           description: Product not found
 *         500:
 *           description: Server error
 */
router.put('/:id', updateProduct);


/**
 * @swagger
 * paths:
 *   /api/product/{id}:
 *     delete:
 *       summary: Delete a product
 *       tags: [Products]
 *       description: Delete a product by its ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *           description: The unique identifier of the product to delete
 *       responses:
 *         200:
 *           description: Product deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Success message
 *                     example: "Delete Product success"
 *         404:
 *           description: Product not found
 *         500:
 *           description: Server error
 */
router.delete('/:id', removeProduct);

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - price
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier of the product
 *         name:
 *           type: string
 *           description: The name of the product
 *         price:
 *           type: number
 *           description: The price of the product
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the product was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the product was last updated
 */


export default router;