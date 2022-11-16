import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { CustomError } from './interfaces/error.js';
import { thingRouter } from './router/thing.js';

export const app = express();
app.disable('x-powered-by');
const corsOptions = {
    origin: '*',
};

app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
const template = `
    <body style='align'>
        <h1>API REST</h1>
        <h2>Endpoints</h2>
        <ul>
            <li><p>/things</p></li>
            <li><p>/things/get/id</p></li>
            <li><p>/things/post</p></li>
            <li><p>/things/patch/id</p></li>
            <li><p>/things/delete/id</p></li>
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
