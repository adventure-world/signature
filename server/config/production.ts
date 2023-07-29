// 缺省的配置文件
import defaultConfig from "./default";

const path = require('path')

// 重载配置文件
const config = Object.assign({}, defaultConfig, {
  mode: 'production',
  frontFolder: path.join(__dirname, '../spa'),
  ipAddress: '0.0.0.0',
  console: require('tracer').dailyfile({
    format: '{{timestamp}} <{{title}}> {{path}}:{{line}} ({{method}}) {{message}}',
    level: 'info',
    inspectOpt: {
      showHidden: true, // the object's non-enumerable properties will be shown too
      depth: null,
    },
    root: './logs',
    maxLogFiles: 10,
    allLogsFileName: `log`,
  }),
  redis: {
    port: 6379, // Redis port
    host: 'dagen-redis', // Redis host
    db: 0,
  },
  mongodb: {
    url: 'mongodb://dagen:dagen_password@dagen-db,dagen-db-rs1,dagen-db-rs2/dagen?replicaSet=dbrs',
  },
  UPLOAD_PATH: '/home/deploy/images/',
  DOMAIN: 'https://dagen.io/static/image/',
  CORS_ORIGIN: { admin: 'https://dagen.io/' },
  verifierPrivateKey: process.env.VERIFIER_PRIVATE_KEY,
})

export default config
