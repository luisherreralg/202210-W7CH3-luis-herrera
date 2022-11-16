import fs from 'fs/promises';
import mongoose, { Model, model, Mongoose, Schema } from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import { Thing, Things } from '../interfaces/thing.js';
import { Data, id } from './data.js';

const thingSchema = new Schema({
    title: String,
    id: String,
});
const Thing = model('Thing', thingSchema, 'Things');
export class ThingFileData implements Data<Thing> {
    dataFileURL: string;
    constructor() {
        this.dataFileURL = 'src/data/things.json';
    }

    async getAll(): Promise<Thing[]> {
        // return fs
        //     .readFile(this.dataFileURL, 'utf-8')
        //     .then((data) => JSON.parse(data).things as Thing[]);
        const uri = `mongodb+srv://${process.env.USER}:${process.env.PW}@${process.env.CLUSTER}/ThingsCollection?retryWrites=true&w=majority`;

        const conector = await mongoose.connect(uri);
        const data = await Thing.find({});
        conector.disconnect();
        return data as Thing[];
    }

    async get(id: id): Promise<Thing> {
        const uri = `mongodb+srv://${process.env.USER}:${process.env.PW}@${process.env.CLUSTER}/ThingsCollection?retryWrites=true&w=majority`;

        const conector = await mongoose.connect(uri);
        const data = await Thing.find({
            _id: id,
        });
        conector.disconnect();
        return data[0] as Thing;
    }

    async post(newThing: Partial<Thing>): Promise<Thing> {
        const uri = `mongodb+srv://${process.env.USER}:${process.env.PW}@${process.env.CLUSTER}/ThingsCollection?retryWrites=true&w=majority`;

        const conector = await mongoose.connect(uri);
        const data = await Thing.create(newThing);
        conector.disconnect();
        return data as Thing;
    }

    async patch(id: id): Promise<Thing> {
        const uri = `mongodb+srv://${process.env.USER}:${process.env.PW}@${process.env.CLUSTER}/ThingsCollection?retryWrites=true&w=majority`;

        const conector = await mongoose.connect(uri);
        const data = await Thing.findByIdAndUpdate(id, {
            title: 'No sé hacer patch',
        });
        conector.disconnect();
        return data as Thing;
    }

    async delete(id: id): Promise<void> {
        const uri = `mongodb+srv://${process.env.USER}:${process.env.PW}@${process.env.CLUSTER}/ThingsCollection?retryWrites=true&w=majority`;

        const conector = await mongoose.connect(uri);
        await Thing.deleteOne({
            _id: id,
        });
        conector.disconnect();
    }
}
