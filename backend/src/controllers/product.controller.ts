import { Request, Response } from "express";
import prisma from "../config/prisma";
import { ProductService } from "../services/product.service";

const productService = new ProductService();


export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 7;
        const query = req.query.query ? String(req.query.query) : "";
        const {products, totalItems, totalPages, currentPage} = await productService.getAllProduct(page,limit,query);
        res.status(200).json({
            products,
            totalItems,
            totalPages,
            currentPage
        })
        return;
    } catch (error) {
        console.log("Error in get all product", error);
        res.status(500).json({ message: "Server error" });
        return;
    }
};
export const addProduct = async (req: Request, res: Response) => {
    try {
        const { name, price } = req.body;
        if (!name || typeof price !== 'number' || price <= 0) {
             res.status(400).json({ message: "Should to fill all data" });
             return ;
        }

        const existingProduct = await prisma.product.findFirst({
            where: { name }
        });

        if (existingProduct) {
            res.status(400).json({ message: "Product already exists" });
            return ;
        }
       

        const newProduct = await productService.createProduct({
              name, 
              price 
        });

            res.status(201).json({
            message: "Created new product",
            product: newProduct
        });
        return;

    } catch (error) {
        console.log("Error in create product", error);
        res.status(500).json({ message: "Server error" });
        return;
    }
};

export const updateProduct = async (req: Request, res: Response)  => {
    const { id } = req.params;
    const { name, price } = req.body;

    try {
        const existingProduct = await prisma.product.findUnique({
            where: { id: Number(id) }
        });

        if (!existingProduct) {
            res.status(400).json({ message: "Product not found" });
            return ;
        }
        if(existingProduct.name !== name) {
            const productSameName = await prisma.product.findFirst({
                where: { name }
            });
            if(productSameName) {
                res.status(400).json({ message: "Product name already exist"})
                return ;
            }
        }

        const updateProduct = await productService.editProduct(Number(id), {name, price})

            res.status(200).json({
            message: "Up date product success",
            product: updateProduct,
        });
        return;
    } catch (error) {
        console.log("Error in updateProduct", error);
        res.status(500).json({ message: "Server Error"});
        return;
    }
}

export const removeProduct = async (req: Request, res: Response)  => {
    const {id} = req.params;

    try {

        await productService.deleteProduct(Number(id));

        res.status(200).json({message: "Delete Product success"});
        return;
    } catch (error) {
        console.log("Error in removeProduct", error);
        res.status(500).json({ message: "Server Error"});
        return;
    }
}

export const searchProduct = async (req: Request, res: Response) => {
    const {query} = req.query;

    try {
        const searchProduct = await productService.filterProduct(String(query))
        res.status(200).json({products: searchProduct});
        return;
        
    } catch (error) {
        console.log("Error in searchProduct", error);
        res.status(500).json({ message: "Server error"});
        return
    }
}

