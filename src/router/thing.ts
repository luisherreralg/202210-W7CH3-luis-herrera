import { Router } from 'express';
import { ThingController } from '../controllers/things.js';
import { ThingFileData } from '../data/things.mongo.data.js';

export const thingRouter = Router();

const controller = new ThingController(new ThingFileData());

thingRouter.get('/', controller.getAll.bind(controller));
thingRouter.get('/get/:id', controller.get.bind(controller));
thingRouter.post('/post', controller.post.bind(controller));
thingRouter.patch('/patch/:id', controller.patch.bind(controller));
thingRouter.delete('/delete/:id', controller.delete.bind(controller));
