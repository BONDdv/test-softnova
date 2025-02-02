import { ProductService } from '../src/services/product.service';
import prisma from '../src/config/prisma';


jest.mock('../src/config/prisma', () => ({
  product: {
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('ProductService', () => {
  let productService: ProductService;

  beforeEach(() => {
    productService = new ProductService();
  });

  afterEach(() => {
    jest.clearAllMocks();  
  });

  it('should return products with pagination', async () => {
    const mockProducts = [{ id: 1, name: 'Product 1', price: 100 }];
    const mockTotalItems = 10;

    (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
    (prisma.product.count as jest.Mock).mockResolvedValue(mockTotalItems);

    const result = await productService.getAllProduct(1, 5, "");

    expect(prisma.product.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 5,
      where: {
        name: {
          contains: "",
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    expect(prisma.product.count).toHaveBeenCalled();
    expect(result).toEqual({
      products: mockProducts,
      totalItems: mockTotalItems,
      totalPages: 2,
      currentPage: 1,
    });
  });

  it('should create a new product', async () => {
    const newProduct = { name: 'Product 1', price: 100 };
    const mockCreatedProduct = { id: 1, ...newProduct };

    (prisma.product.create as jest.Mock).mockResolvedValue(mockCreatedProduct);

    const result = await productService.createProduct(newProduct);

    expect(prisma.product.create).toHaveBeenCalledWith({ data: newProduct });
    expect(result).toEqual(mockCreatedProduct);
  });

  it('should update an existing product', async () => {
    const productId = 1;
    const updatedData = { name: 'Updated Product', price: 150 };
    const mockUpdatedProduct = { id: productId, ...updatedData };

    (prisma.product.update as jest.Mock).mockResolvedValue(mockUpdatedProduct);

    const result = await productService.editProduct(productId, updatedData);

    expect(prisma.product.update).toHaveBeenCalledWith({
      where: { id: productId },
      data: updatedData,
    });
    expect(result).toEqual(mockUpdatedProduct);
  });

  it('should delete a product', async () => {
    const productId = 1;

    (prisma.product.delete as jest.Mock).mockResolvedValue({ id: productId });

    await productService.deleteProduct(productId);

    expect(prisma.product.delete).toHaveBeenCalledWith({
      where: { id: productId },
    });
  });

  it('should search for products by name', async () => {
    const searchQuery = 'Product';
    const mockSearchedProducts = [{ id: 1, name: 'Product 1', price: 100 }];

    (prisma.product.findMany as jest.Mock).mockResolvedValue(mockSearchedProducts);

    const result = await productService.filterProduct(searchQuery);

    expect(prisma.product.findMany).toHaveBeenCalledWith({
      where: {
        name: {
          contains: searchQuery,
        },
      },
    });
    expect(result).toEqual(mockSearchedProducts);
  });
});
