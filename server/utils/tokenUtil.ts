import config from "../config";

const jwt = require("jsonwebtoken");
const tokenSecret = "amence.secret";

// 生成token
export function createJTWToken(address: string) {
  return jwt.sign({ address: address }, tokenSecret, { expiresIn: "10h" });
}

/**
 * 校验普通用户·
 * @param req
 * @param res
 * @param next
 */
export async function verifyUserToken(req, res, next) {
  try {
    const token = await verifyToken(req, res);
    if (!token) {
      return res.send({
        success: false,
        result: "token not exist,right now get token"
      });
    }
    if (!token.address) {
      return res.send({ success: false, result: "token parse token error" });
    }
    let userAddress = req.query.userAddress;

    if (!userAddress) {
      userAddress = req.body.userAddress;
    }
    if (!userAddress) {
      return res.send({ success: false, result: "address not found" });
    }
    if (userAddress !== token.address) {
      return res.send({ success: false, result: "address  error" });
    }
    next();
  } catch (error) {
    res.status(500).send();
    return;
  }
}

/**
 * 校验超级管理员
 * @param req
 * @param res
 * @param next
 */
export async function verifyAdminToken(req, res, next) {
  try {
    const token = await verifyToken(req, res);
    const superAdminArray = config.SUPER_ADMIN;
    let superAccount = config.SUPER_ADMIN_ACCOUNT[token.address];
    if (superAccount) return next();
    const containIndex = superAdminArray.indexOf(token.address);
    if (containIndex > -1) return next();
    // 检查数据库是否存在
    next();
  } catch (error) {
    res.status(500).send();
    return;
  }
}

/**
 * 检验 token合法
 * @param req
 * @param res
 * @param next
 */
async function verifyToken(req, res) {
  const authHeader = req.headers["authorization"];
  if (authHeader == undefined) {
    throw new Error("header error");
  }
  if (authHeader.split(" ")[0] != "Bearer") {
    throw new Error("header format error");
  }
  const token = jwt.verify(authHeader.split(" ")[1], tokenSecret);
  if (Date.now() >= token.exp * 1000) {
    throw new Error("auth error");
  }
  return token;
}
