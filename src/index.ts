import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import { MONGO_URI } from './config.json';

mongoose.Promise = global.Promise;
mongoose
  .connect(MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => console.log('SUCCESS: Database connection'))
  .catch((e) => console.log('ERROR: Database connection', e));

const app = express();

const server = http.createServer(app);
import io from './lib/io';
io(server);

const PORT = 4073;
server
  .listen(PORT)
  .on('listening', () => console.log(`Sever running on PORT ${PORT}`));
