import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response, NextFunction } from "express";
import httpProxy from "http-proxy";
import cors from "cors";

const app: Express = express();
const port = process.env.PORT || 3002; 
const apiProxy = httpProxy.createProxyServer();

app.use(cors());

// Redirige las peticiones para ms-usuario
app.all("/usuario", (req: Request, res: Response, next: NextFunction) => {
    req.url = req.url.replace('/usuario', ''); // Elimina el prefijo para la redirección
    apiProxy.web(req, res, { target: 'http://localhost:8080/query' }, function(e) {
        if (e) {
            console.error(e);
            next(e);
        }
    });
});

// Redirige las peticiones para ms-producto
app.all("/producto", (req: Request, res: Response, next: NextFunction) => {
    req.url = req.url.replace('/producto', ''); // Elimina el prefijo para la redirección
    apiProxy.web(req, res, { target: 'http://localhost:8081/query' }, function(e) {
        if (e) {
            console.error(e);
            next(e);
        }
    });
});

// Redirige las peticiones para ms-carrito
app.all("/carrito", (req: Request, res: Response, next: NextFunction) => {
    req.url = req.url.replace('/carrito', ''); // Elimina el prefijo para la redirección
    apiProxy.web(req, res, { target: 'http://localhost:8082/query' }, function(e) {
        if (e) {
            console.error(e);
            next(e);
        }
    }); 
});

// Redirige al ms-pago
app.all("/pago", (req: Request, res: Response, next: NextFunction) => {
    req.url = req.url.replace('/pago', ''); // Elimina el prefijo para la redirección
    apiProxy.web(req, res, { target: 'http://localhost:3001/create' }, function(e) {
        if (e) {
            console.error(e);
            next(e);
        }
    });
});

// Manejo de errores
app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack); 
    res.status(500).send('Something broke!'); 
});

app.listen(port, () => {
    console.log(`API Gateway is running at http://localhost:${port}`);
});
