import express, { Request, Response } from 'express';
import cors from 'cors'; // Middleware para habilitar CORS
import asyncHandler from '../utils/async_handler'; // Middleware para manejar async/await
const WebpayPlus = require("transbank-sdk").WebpayPlus;

const router = express.Router();

// Middleware para habilitar CORS
router.use(cors({
    origin: 'http://localhost:3000', // Permitir solicitudes desde el frontend
    methods: ['GET', 'POST'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
}));

// --- RUTA: Crear una transacción ---
router.post('/create', asyncHandler(async (req: Request, res: Response) => {
    const { amount } = req.body;

    // Validar el campo "amount"
    if (!amount || typeof amount !== 'number') {
        return res.status(400).json({
            message: 'El campo "amount" es requerido y debe ser un número válido.',
        });
    }

    try {
        // Generar datos únicos para la transacción
        const buyOrder = `O-${Math.floor(Math.random() * 10000) + 1}`;
        const sessionId = `S-${Math.floor(Math.random() * 10000) + 1}`;
        const returnUrl = `${req.protocol}://${req.get('host')}/api/pagos/commit`;

        // Crear la transacción con Webpay Plus
        const createResponse = await (new WebpayPlus.Transaction()).create(
            buyOrder,
            sessionId,
            amount,
            returnUrl
        );

        // Construir la URL de pago
        const paymentUrl = `${createResponse.url}?token_ws=${createResponse.token}`;

        // Responder con los detalles de la transacción
        res.status(201).json({
            buyOrder,
            sessionId,
            amount,
            returnUrl,
            paymentUrl,
        });
    } catch (error) {
        console.error('Error al crear la transacción:', error);
        res.status(500).json({
            message: 'Ocurrió un error al intentar crear la transacción.',
        });
    }
}));

// --- RUTA: Confirmar una transacción (POST) ---
router.post('/commit', asyncHandler(async (req: Request, res: Response) => {
    const { token_ws } = req.body;

    // Validar el campo "token_ws"
    if (!token_ws) {
        return res.status(400).json({
            message: 'El campo "token_ws" es requerido.',
        });
    }

    try {
        // Confirmar la transacción con Webpay Plus
        const commitResponse = await (new WebpayPlus.Transaction()).commit(token_ws);

        // Responder con los detalles de la confirmación
        res.status(200).json({
            token: token_ws,
            commitResponse,
        });
    } catch (error) {
        console.error('Error al confirmar la transacción:', error);
        res.status(500).json({
            message: 'Ocurrió un error al intentar confirmar la transacción.',
        });
    }
}));

// --- RUTA: Confirmar una transacción (GET) ---
router.get('/commit', asyncHandler(async (req: Request, res: Response) => {
    const { token_ws } = req.query;

    // Validar el campo "token_ws"
    if (!token_ws) {
        return res.status(400).json({
            message: 'El parámetro "token_ws" es requerido.',
        });
    }

    try {
        // Confirmar la transacción con Webpay Plus
        const commitResponse = await (new WebpayPlus.Transaction()).commit(token_ws);

        // Responder con los detalles de la confirmación
        res.status(200).json({
            token: token_ws,
            commitResponse,
        });
    } catch (error) {
        console.error('Error al confirmar la transacción:', error);
        res.status(500).json({
            message: 'Ocurrió un error al intentar confirmar la transacción.',
        });
    }
}));

export default router;
