export type DatabaseConfig = {
  url: string;
};

export type Config = {
  database: DatabaseConfig;
  secretKey: string;
  nats: string[];
};
