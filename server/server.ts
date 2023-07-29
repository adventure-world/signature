import cors from "cors";
import Redis from "ioredis";
import admin from "./api";
import config from "./config";

const console = config.console;

const express = require("express");
const argv = require("yargs").argv;

const bodyParser = require("body-parser");

const cookieParser = require("cookie-parser");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
// const redisClient = new Redis(config.redis);
const imagePath = process.env.IMAGE_PATH;
// const redisStore = new RedisStore({ client: redisClient });
const app = express();

app.use(cookieParser());
// app.use(
//   session({
//     secret: "dagen-admin",
//     resave: false,
//     saveUninitialized: false,
//     store: redisStore,
//     cookie: { httpOnly: true, secure: false, maxAge: 1000 * 60 * 30 }
//   })
// );

app.use(bodyParser.json({ limit: "1mb" })); // for parsing application/json
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
// app.use(function(req, res, next) {
//   const sessionID = req.headers["x-dagen-admin-cookie"];
//   if (sessionID) {
//     return redisStore.get(sessionID, function(err, session) {
//       req.session = Object.assign(req.session || {}, session || {});
//       next();
//     });
//   }
//   next();
// });

app.use("/", express.static("dist/spa"));
app.use("/static/image", express.static(imagePath ? String(imagePath) : "images"));

app.set("trust proxy", true); // 获取代理ip组
app.use(function(req, res, next) {
  console.info(
    ">",
    "x-forwarded-for=" + req.header("x-forwarded-for"),
    "ips= " + JSON.stringify(req.ips),
    "remote Address=" + req.connection.remoteAddress,
    "ip=" + req.ip,
    Date.now(),
    req.originalUrl,
    req.method,
    req.body
  );
  next();
});

if (!process.env.NODE_ENV) {
  // 本地环境需要配置才能访问
  app.use((req, res, next) => {
    res.set({
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": req.headers.origin || "*",
      "Access-Control-Allow-Headers":
        "Origin, Content-Type, Content-Length, Authorization, Accept, X-Requested-With, x-dagen-admin-cookie, sessionId, Access-Control-Allow-Headers, sentry-trace", //设置请求头格式和类型
      "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS"
    });
    next();
  });
} else {
  app.use(cors());
}

app.use("/admin", admin);


//捕捉所有的未处理异常，返回JSON格式
function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.mapped) {
    res.status(400).send({ success: false, error: err.mapped() });
  } else if (!err.status) {
    res.status(500).send({ success: false, error: err.message });
  } else {
    next(err);
  }
}

app.use(errorHandler);

// 来自命令行的端口优先，然后是配置文件里指定的端口，最后缺省启动3000端口
const port = argv.port || config.port;

// 程序启动
const server = app.listen(port, config.ipAddress, function onListening() {
  console.info("Listening on " + config.ipAddress + ":" + port);
});

export default server;
