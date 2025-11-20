interface config {
  port: number;
  environment: string;
  database: { url: string; directUrl: string };
  jwt: { secret: string; expiresIn: string };
}

export default (): config => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  environment: process.env.NODE_ENV ?? 'development',
  database: {
    url: 'DATABASE_URL',
    directUrl: 'DIRECT_URL',
  },
  jwt: {
    secret: 'JWT_SECRET',
    expiresIn: '1h',
  },
});
