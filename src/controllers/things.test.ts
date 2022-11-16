import { NextFunction, Request, Response } from 'express';
import { ThingFileData } from '../data/things.file.data';
import { ThingController } from './things';

describe('Given TaskController', () => {
    const model = new ThingFileData();
    const taskController = new ThingController(model);
    const req = {};
    const resp = {
        json: jest.fn(),
        end: jest.fn(),
    };
    const next = jest.fn();

    test('Then ... getAll', async () => {
        await taskController.getAll(
            req as Request,
            resp as unknown as Response,
            next as NextFunction
        );

        expect(resp.json).toHaveBeenCalled();
        // expect(resp.end).toHaveBeenCalled();
    });
});
