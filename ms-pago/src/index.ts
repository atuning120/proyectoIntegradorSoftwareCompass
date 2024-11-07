import express from 'express';
import pagosRoutes from './routes/pagos';
import { connectToDatabase } from './database/connection';

const app = express();
app.use(express.json());

const PORT = 3001;


app.use('/api/pagos', pagosRoutes);

async function startServer() {
    try {
        await connectToDatabase(); 
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error al iniciar el servidor:", error);
    }
}

startServer();