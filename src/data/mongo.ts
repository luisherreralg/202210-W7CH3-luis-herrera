import mongoose, { model, Schema } from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const uri = `mongodb+srv://${process.env.USER}:${process.env.PW}@${process.env.CLUSTER}/ThingsCollection?retryWrites=true&w=majority`;

const thingSchema = new Schema({
    title: String,
});

const Thing = model('Thing', thingSchema, 'Things');

(async () => {
    const conector = await mongoose.connect(uri);

    // await Thing.create({
    //     title: 'Test',
    // });

    const data = await Thing.find({});
    conector.disconnect();
    console.log(data);
})();
