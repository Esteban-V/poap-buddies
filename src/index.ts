import { config } from 'dotenv';
import CustomClient from './types/CustomClient';

config();

const client = new CustomClient();
client.start();

export { client };
