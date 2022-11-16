import fs from 'fs/promises';
import mongoose, { Model, model, Mongoose, Schema } from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import { Thing, Things } from '../interfaces/thing.js';
import { Data, id } from './data.js';
const uri = `mongodb+srv://${process.env.USER}:${process.env.PW}@${process.env.CLUSTER}/?retryWrites=true&w=majority`;

export class ThingFileData implements Data<Thing> {
    url: string;
    thingSchema: Schema<Thing>;
    dataFileURL: string;

    constructor() {
        this.url = `mongodb+srv://${process.env.USER}:${process.env.PW}@${process.env.CLUSTER}/ThingsCollection?retryWrites=true&w=majority`;
        this.thingSchema = new Schema({
            title: String,
            id: Number,
        });
        this.dataFileURL = 'src/data/things.json';
    }

    async getAll(): Promise<Thing[]> {
        // return fs
        //     .readFile(this.dataFileURL, 'utf-8')
        //     .then((data) => JSON.parse(data).things as Thing[]);
        const Thing = this.#createModel(this.thingSchema);
        const conector = await mongoose.connect(uri);
        const data = await Thing.find({});
        conector.disconnect();
        return data;
    }

    async get(id: id): Promise<Thing> {
        return fs.readFile(this.dataFileURL, 'utf-8').then((data) => {
            const aData = JSON.parse(data).things as Thing[];
            const index = aData.findIndex((item) => item.id === id);
            if (index === -1) throw new Error('Not found id');
            return aData[index];
        });
    }

    async post(newThing: Partial<Thing>): Promise<Thing> {
        const aData = await this.getAll();
        const finalThing = { ...(newThing as Thing), id: this.#createID() };
        aData.push(finalThing);
        await this.#saveData({ things: aData });
        return finalThing;
    }

    async patch(id: id, updateThing: Partial<Thing>): Promise<Thing> {
        const aData = await this.getAll();
        const index = aData.findIndex((item) => item.id === id);
        if (!index) throw new Error('Not found id');
        aData[index] = {
            ...aData[index],
            ...updateThing,
        };
        await this.#saveData({ things: aData });
        return aData[index];
    }

    async delete(id: id): Promise<void> {
        const aData = await this.getAll();
        const index = aData.findIndex((item) => item.id === id);
        if (!index) throw new Error('Not found id');
        await this.#saveData({
            things: aData.filter((item) => item.id !== id),
        });
    }

    #createID() {
        return Math.trunc(Math.random() * 1_000_000_000);
    }

    #saveData(data: Things) {
        return fs.writeFile(this.dataFileURL, JSON.stringify(data));
    }

    #createModel(Scheme: Schema<Thing>) {
        return model('Thing', Scheme, 'things');
    }
}
