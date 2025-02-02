
import { Request, Response, RequestHandler } from "express";
import { CartService } from "../services/cart.service";


const cartService = new CartService();

export const createCartForProduct: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const cartId = await cartService.createCart();

    res.status(201).json({
      message: "Create cart success",
      cartId: cartId.id
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create cart',
      error,
    });
  }
}

export const addProductToCartItem: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { cartId, items } = req.body;

        
        if (!Array.isArray(items)) {
            res.status(400).json({
                message: "Invalid payload. 'items' must be an array.",
            });
            return;
        }

        const cartItem = await cartService.addProductOnCartItem(cartId,items);

        res.status(201).json(cartItem);
    } catch (error) {
        console.error("Error in addProductToCartItem", error);
        res.status(500).json({ message: "Server Error" });
    }
};


export const editProductFromCart: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { cartId, items} = req.body;
    try {
        if (!cartId || !Array.isArray(items) || items.length === 0 || items.some(item => !item.productId || item.quantity === undefined || isNaN(item.quantity) || item.quantity < 0)) {
            res.status(400).json({ message: "cartId and items (with productId and quantity) are required" });
            return;
        }

        const edit = await cartService.editProductOnCartItem(cartId, items)

        res.status(200).json({edit})
        return;

    } catch (error) {
        console.error("Error in editProductOnCartItem:", error);
        res.status(500).json({ message: "Server Error" });
        return;

    }
}

export const confirmCart: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { cartId } = req.params;

  try {
    const result = await cartService.confirmCart(Number(cartId));
    res.status(200).json(result);
    return;
  } catch (error) {
    console.error("Error in confirmCart:", error);
    res.status(500).json({ message: "Server Error" });
    return;
  }
}

export const getHistoryCartTotal = async (req: Request, res: Response) => {
    try {
      
 
      const cartItemsDetails = await cartService.getCartsWithItems()
  
      res.status(200).json({
        cartItemsDetails 
      });
      return
    } catch (error) {
      console.error("Error in getCartTotal:", error);
      res.status(500).json({ message: "Server error" });
      return
    }
  };

