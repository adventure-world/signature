const config = {
  app: {},
  port: process.env.PORT || 9019,
  ipAddress: '0.0.0.0',
  redis: {
    port: 6579, // Redis port
    host: 'dagen-redis', // Redis host
    options: {},
    db: 0,
  },
  mongodb: {
    url: 'mongodb://dagen:dagen_password@127.0.0.1:27777/dagen',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
  },
  console: console,
  SUPER_ADMIN: ['1BikvsWbVmLC9R9inrtRLQ7j2qBpMJVUfT'],
  SUPER_ADMIN_ACCOUNT: {
    'xx': {
      userName: 'b3580d6136aa5666d36cc118e8d8d7683d358d094c2803ec57dc94856f9fb029',
      userPwd: '9a3e836af5072f9d9df6a6a4b91ea55143e7f4da095e422bfd57f0b4e7c3d00c',
    },
  },
  CORS_ORIGIN: { admin: '127.0.0.1:9019' },
  verifierPrivateKey: process.env.VERIFIER_PRIVATE_KEY,
  secret: 'xiuyawihdkjagheiugjcfabdsjhbfjhfgewkql;hreuihw21341244564',
}

export default config
