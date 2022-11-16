import http from 'http';
import { app } from './app.js';
import * as dotenv from 'dotenv';
dotenv.config();
import { CustomError } from './interfaces/error.js';
// ! Importación del módulo del CLI de Inquirer
// import { askSettings } from './utils/cli/cli.js';

// ! Aqui se mete para que funcione el CLI de Inquirer
// await askSettings().then(() => {

// });

const port = process.env.PORT || 3300;
const server = http.createServer(app);
server.on('listening', () => {
    const addr = server.address();
    if (addr === null) return;
    let bind: string;
    if (typeof addr === 'string') {
        bind = 'pipe ' + addr;
    } else {
        bind =
            addr.address === '::'
                ? `${process.env.URL}${addr?.port}`
                : `port ${addr?.port}`;
    }
    console.log(`Listening on ${bind}`);
});

server.on('error', (error: CustomError, response: http.ServerResponse) => {
    response.statusCode = error.statusCode;
    response.statusMessage = error.statusMessage;
    response.write(error.message);
    response.end();
});

server.listen(port);
