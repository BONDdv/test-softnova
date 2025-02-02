import prisma from "../config/prisma";

export class ProductService {
  async getAllProduct(page: number, limit: number, query: string) {
      const products = await prisma.product.findMany({
      skip: (page-1) * limit,
      take: limit,
      where: {
        name: {
          contains: query,
        }
      },
      orderBy: {
        name: "asc",
    },
    });

    const totalItems = await prisma.product.count({
      where: {
        name: {
          contains: query
        }
      }
    });

    return {
      products,
      totalItems,
      totalPages: Math.ceil(totalItems/limit),
      currentPage: page,
    }

  }
  async createProduct(data: { name: string; price: number; }) {
    return prisma.product.create({
      data
    });
  }

  async editProduct( id:number ,data: {name?: string; price?: number}) {
    return prisma.product.update({
      where : {id},
      data
    })
  }

  async deleteProduct( id: number) {
    return prisma.product.delete({
      where: {id}
    })
  }

  async filterProduct(search: string) {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });
    return products;
  }



}