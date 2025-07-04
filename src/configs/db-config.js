import 'dotenv/config';

const DBconfig = {
  user: process.env.DB_USER ?? '',
  host: process.env.DB_HOST ?? '',
  database: process.env.DB_DATABASE ?? '',
  password: process.env.DB_PASSWORD ?? '',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
};

export default DBconfig;
