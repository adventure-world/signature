// 缺省的配置文件
import defaultConfig from "./default";

const path = require('path')

// 重载配置文件
const config = Object.assign({}, defaultConfig, {
  mode: 'development',
  ipAddress: '0.0.0.0',
  port: process.env.PORT || 9019,
  frontFolder: path.join(__dirname, '../../dist/spa'),
  console: require('tracer').colorConsole({
    format: '{{timestamp}} <{{title}}> {{path}}:{{line}} ({{method}}) {{message}}',
    level: 'log',
    inspectOpt: {
      showHidden: true, // the object's non-enumerable properties will be shown too
      depth: null,
    },
    transport: /* istanbul ignore next */ function (data) {
      console.log(data.output)
    },
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
  DOMAIN: 'https://demo.dagen.io/static/image/',
  CORS_ORIGIN: { admin: 'https://demo.dagen.io' },
})

export default config
