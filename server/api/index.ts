import config from "../config";
import {serverSignature, verifySignature} from "./admin";

const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  let origin = config.CORS_ORIGIN.admin;
  if (origin === "*") origin = req.headers.origin;
  res.set({
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": true, //允许后端发送cookie
    "Access-Control-Allow-Headers":
      "Origin, Content-Type, Content-Length, Authorization, Accept, X-Requested-With, x-dagen-admin-cookie, sessionId, Access-Control-Allow-Headers, sentry-trace", //设置请求头格式和类型
    "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS", //允许支持的请求方式
    "Content-Type": "application/json; charset=utf-8" //默认与允许的文本格式json和编码格式
  });
  next();
});


router.get("/signature", ...serverSignature());
router.get("/verify", ...verifySignature());


export default router;
