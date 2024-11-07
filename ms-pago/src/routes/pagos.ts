import express, { Request, Response } from 'express';
import asyncHandler from '../utils/async_handler';
const WebpayPlus = require("transbank-sdk").WebpayPlus;

const router = express.Router();

// Endpoint para crear una transacción
router.post('/create', asyncHandler(async (req: Request, res: Response) => {
    try {
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).send('El monto es requerido');
        }

        let buyOrder = "O-" + Math.floor(Math.random() * 10000) + 1;
        let sessionId = "S-" + Math.floor(Math.random() * 10000) + 1;
        let returnUrl = req.protocol + "://" + req.get("host") + "/api/pagos/commit";

        const createResponse = await (new WebpayPlus.Transaction()).create(
            buyOrder,
            sessionId,
            amount,
            returnUrl
        );


        const token = createResponse.token
        const url = createResponse.url
        const paymentUrl = `${url}?token_ws=${token}`

        res.json({
            buyOrder,
            sessionId,
            amount,
            returnUrl,
            paymentUrl
        });
    } catch (error) {
        console.error('Error al crear la transacción:', error);
        res.status(500).send('Error al crear la transacción');
    }
}));

// Endpoint para confirmar una transacción
router.post('/commit', asyncHandler(async (req: Request, res: Response) => {
    try {
        let { token_ws } = req.body;

        if (!token_ws) {
            return res.status(400).send('El token_ws es requerido');
        }

        const commitResponse = await (new WebpayPlus.Transaction()).commit(token_ws);

        res.json({
            token: token_ws,
            commitResponse,
        });
    } catch (error) {
        console.error('Error al confirmar la transacción:', error);
        res.status(500).send('Error al confirmar la transacción');
    }
}));

router.get('/commit', asyncHandler(async (req: Request, res: Response) => {
    try {
        let { token_ws } = req.query;

        if (!token_ws) {
            return res.status(400).send('El token_ws es requerido');
        }

        const commitResponse = await (new WebpayPlus.Transaction()).commit(token_ws);

        res.json({
            token: token_ws,
            commitResponse,
        });
    } catch (error) {
        console.error('Error al confirmar la transacción:', error);
        res.status(500).send('Error al confirmar la transacción');
    }
}));

export default router;