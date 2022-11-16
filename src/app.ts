import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { CustomError } from './interfaces/error.js';
import { thingRouter } from './router/thing.js';

export const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
const template = `
    <body>
        <h1>API REST</h1>
        <h2>Endpoints</h2>
        <ul>
            <li>/things</li>
            <li>/things/:id</li>
        </ul>
    </body>
    `;

app.get('/', (_req, res) => {
    res.send(template).end();
});

app.use('/things', thingRouter);

app.use(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (error: CustomError, _req: Request, resp: Response, next: NextFunction) => {
        console.log(
            error.name,
            error.statusCode,
            error.statusMessage,
            error.message
        );
        let status = error.statusCode || 500;
        if (error.name === 'ValidationError') {
            status = 406;
        }
        const result = {
            status: status,
            type: error.name,
            error: error.message,
        };
        resp.status(status).json(result).end();
    }
);
