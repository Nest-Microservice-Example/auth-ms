import { Config } from './config.type';

export default (): Config => ({
  nats: process.env.NATS_SERVERS.split(','),
  secretKey: process.env.SECRET_KEY,
  database: {
    url: process.env.DATABASE_URL,
  },
});
