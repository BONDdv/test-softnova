import swaggerJSDoc from 'swagger-jsdoc';

// การตั้งค่าพื้นฐานของ Swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Product and Cart API',
    version: '1.0.0',
    description: 'API สำหรับการจัดการสินค้าและตะกร้าสินค้า',
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 8010}`,
    },
  ],
};

// ตัวเลือกการตั้งค่า Swagger
const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'], // Path ไปที่ไฟล์ route
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
