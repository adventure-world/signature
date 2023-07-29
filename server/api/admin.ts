import config from '../config'
import * as ethers from 'ethers'
import { Wallet } from 'ethers'
import { query } from 'express-validator'
const console = config.console

const asyncHandler = require('express-async-handler')

export const serverSignature = () => [
  query('privateKey').isString(),
  query('address').isString(),
  asyncHandler(async (req, res) => {
    const privateKey = req.query.privateKey ?? '635c0f9e9fa5c88778a0c6b837cbcc39480eaac3e7a04549c985139ddd53c288'
    const address = req.query.address ?? '0x23BCF3B718127AeDCae9ad691BcEB03238cae8b3'
    const signer = new Wallet(privateKey)
    const amount = 100
    // const timeout = Math.floor(Date.now() + (5 * 60) / 1000)
    const timeout = 5
    const nonce = 1
    const orderNo = 'order'
    const messageHash = ethers.utils.solidityKeccak256(
      ['address', 'uint256', 'uint256', 'uint256', 'string'],
      [address, amount, timeout, nonce, orderNo],
    )
    const messageBytes = ethers.utils.arrayify(messageHash)
    const signature = await signer.signMessage(messageBytes)
    res.send({ success: true, result: signature })
  }),
]

export const verifySignature = () => [
  query('signature').isString(),
  asyncHandler(async (req, res) => {
    const signature = req.query.signature
    const address = '0x23BCF3B718127AeDCae9ad691BcEB03238cae8b3'

    const amount = 100
    // const timeout = Math.floor(Date.now() + (5 * 60) / 1000)
    const timeout = 5
    const nonce = 1
    const orderNo = 'order'
    const messageHash = ethers.utils.solidityKeccak256(
      ['address', 'uint256', 'uint256', 'uint256', 'string'],
      [address, amount, timeout, nonce, orderNo],
    )
    const messageBytes = ethers.utils.arrayify(messageHash)
    const recoveredAddress = ethers.utils.verifyMessage(messageBytes, signature)
    res.send({ success: true, result: { recoveredAddress, verify: recoveredAddress === '0xF03438c619977995A7b526DbA1b6b2a1Fe870168' } })
  }),
]
