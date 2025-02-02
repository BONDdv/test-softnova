import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import productRoute from './routes/product.route';
import cartRoute from './routes/cart.route';
import swaggerUi from 'swagger-ui-express';  
import swaggerSpec from './config/swagger';

dotenv.config();

const app = express();
const port = process.env.PORT || 8010;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/product' , productRoute);
app.use('/api/cart' , cartRoute);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})