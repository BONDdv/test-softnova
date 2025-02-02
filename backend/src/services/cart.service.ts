import { promises } from "dns";
import prisma from "../config/prisma";

export class CartService {


 
    async createCart() {
        const newCart = await prisma.cart.create({
            data: {
                isConfirmed: false,
            },
        });
        return newCart;
    }
    
    async addProductOnCartItem(cartId: number | null, items: { productId: number; quantity: number }[]) {
        if (!items || items.length === 0) {
            throw new Error("No items in the request payload");
        }
    
        let existingCart = cartId
            ? await prisma.cart.findUnique({ where: { id: cartId, isConfirmed: false } })
            : null;
    
        if (!existingCart) {
            existingCart = await this.createCart();
            cartId = existingCart.id;
        } else {
            cartId = existingCart.id; 
        }
    
        const productIds = items.map((item) => item.productId);
        const existingProducts = await prisma.product.findMany({
            where: { id: { in: productIds } },
        });
    
        if (existingProducts.length !== productIds.length) {
            throw new Error("Some products do not exist in the database");
        }
    
        const productOnCartItems = await prisma.productOnCartItem.findMany({
            where: {
                cartId,
                productId: { in: productIds },
            },
            include: {
                product:true
            }
        });
    
        for (const item of items) {
            const existingItem = productOnCartItems.find((p) => p.productId === item.productId);
    
            if (existingItem) {
                await prisma.productOnCartItem.update({
                    where: { id: existingItem.id },
                    data: { quantity: existingItem.quantity + item.quantity },
                });
            } else {
                await prisma.productOnCartItem.create({
                    data: {
                        cartId,
                        productId: item.productId,
                        quantity: item.quantity,
                    },
                });
            }
        }
    
        const totalPrice = await this.calculateTotal(cartId);
    
        await prisma.cart.update({
            where: { id: cartId },
            data: { totalPrice },
        });
    
        return {
            message: "Products added to ProductOnCartItem successfully",
            totalPrice,
            cartId, 
            items: productOnCartItems.map((item) => ({
                name:item.product.name,
                price:item.product.price
            }))
        };
    }

    
    
    async editProductOnCartItem( cartId: number, items: {productId: number, quantity: number}[]) {
        if(!items || items.length === 0) {
            throw new Error("No items in request payload")
        }


        const productIds = items.map(item => item.productId)
        const uniqueProductIds = new Set(productIds);

        if (productIds.length !== uniqueProductIds.size) {
            throw new Error("Duplicate productId in the request payload");
        }

        for (const item of items) {
            if (item.quantity < 0) {
                throw new Error(`Quantity must be greater than 0 for productId ${item.productId}`);
            }
        }
        
        const existingProducts = await prisma.product.findMany({
            where: {
                id: {
                    in: productIds,
                },
            },
        });

        if (existingProducts.length !== productIds.length) {
            throw new Error("Some products do not exist in the database");
        }

        const productOnCartItems = await prisma.productOnCartItem.findMany({
            where: {
                cartId,
                productId: {
                    in: productIds,
                },
            },
        });

        const updateItems = [];
        const deleteItems = [];

        for (const item of items) {
            const existingItem = productOnCartItems.find((productOnCartItem) => productOnCartItem.productId === item.productId);

            if(existingItem) {
                if(item.quantity > 0) {
                    const updatedCartItem = await prisma.productOnCartItem.update({
                        where: {id: existingItem.id},
                        data: {quantity: item.quantity}
                    });
                    updateItems.push(updatedCartItem)
                }else {
                    await prisma.productOnCartItem.delete({
                        where: {id: existingItem.id}
                    });
                    deleteItems.push(item.productId)
                }
            } 
        }

        const totalPrice = await this.calculateTotal(cartId);

        await prisma.cart.update({
            where: { id: cartId },
            data: { totalPrice },
        });
        

        return {
            message: "ProductOnCartItem update success",
            updateItems,
            deleteItems,
            totalPrice
        }
      };


      async confirmCart(cartId: number) {
        const productOnCartItems = await prisma.productOnCartItem.findMany({
            where: { cartId },
            include: {
                product: true,
            },
        });

        if(!productOnCartItems || productOnCartItems.length === 0) {
            throw new Error("No items to confirm in this cart");
        }

        for (const item of productOnCartItems) {
            await prisma.confirmedCartItem.create({
                data: {
                    cartId,
                    productId: item.productId,
                    quantity: item.quantity,
                },
            });
        }
        const totalPrice = await this.calculateTotal(cartId);

        await prisma.cart.update({
            where: { id: cartId },
            data: { 
                totalPrice,
                isConfirmed: true,
             },
        });

        await prisma.productOnCartItem.deleteMany({
            where: { cartId },
        });

        return {
            message: "Cart confirmed successfully",
            cartId,
            totalPrice,
        };

      }



    

    async getCartsWithItems() {
        const carts = await prisma.cart.findMany({
            where: {
                cartItem: { 
                    some: {},
                },
            },
            include: {
                cartItem: true,
            },
            orderBy: { createdAt: 'desc' }, 
        });
    
        return carts;
    }
   

    async calculateTotal(cartId: number): Promise<number> {
        try {
          const cartItems = await prisma.productOnCartItem.findMany({
            where: { cartId },
            include: {
              product: true, 
            },
          });

          if (cartItems.length === 0) {
            return 0;
        }

          const productIds = cartItems.map((item)=> item.productId);
          const uniqueProductIds = new Set(productIds);
          const countUniqueProductIds = uniqueProductIds.size
          let percentDiscountProduct = 1 ;
          switch (countUniqueProductIds) {
            case 1:
              percentDiscountProduct = 0;
              break;
            case 2:
              percentDiscountProduct = 0.1;
              break;
            case 3:
              percentDiscountProduct = 0.2;
              break;
            case 4:
              percentDiscountProduct = 0.3;
              break;
            case 5:
              percentDiscountProduct = 0.4;
              break;
            case 6:
              percentDiscountProduct = 0.5;
              break;
            case 7:
              percentDiscountProduct = 0.6;
              break;
          }


          const priceNoDiscount = cartItems.reduce((sum, item) => {
            return sum + (item.quantity * item.product.price);
          }, 0);
          
          const discountPrice =  percentDiscountProduct * (countUniqueProductIds * 100) ;

          const totalPrice = priceNoDiscount - discountPrice

          await prisma.cart.update({
            where: {id: cartId},
            data: {totalPrice},
          });
    
          return totalPrice;
        } catch (error) {
          console.error("Error calculating total price:", error);
          throw new Error("Could not calculate total price");
        }
      }

    
      
      
}
