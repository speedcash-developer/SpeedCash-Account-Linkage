/**
 * API Signature Generation
 * Signature digunakan untuk proses autentikasi request yang di kirimkan ke QRIS MPM
 * 
 * Referensi:
 * API Documentation: https://qris-mpm-docs.speedcash.co.id/docs/payments/qris-mpm/Keamanan/signature-generation
 */

const crypto = require('crypto')
const fs = require('fs')
const CONFIG = require('../config/config')
const { writeLocalData } = require('../utils/utils')

const signatureAuth = (data) => {
    const stringToSign = data
    const privateKey = fs.readFileSync("./private_key.pem");
    const signer = crypto.createSign('RSA-SHA256')
    signer.update(stringToSign)
    const sign = signer.sign(privateKey, 'base64')
    writeLocalData({ signature_auth: sign });
    
    return sign
}

const signatureGeneration = (method, pathUrl, accessToken, requestBody, timeStamp) => {
    const body = typeof requestBody !== 'string' ? JSON.stringify(requestBody) : requestBody
    const clientSecret = CONFIG.CLIENT_SECRET

    const hexEncode = crypto.createHash('sha256').update(body).digest('hex').toLowerCase();
    
    let stringToSign = [method, pathUrl, accessToken, hexEncode, timeStamp];
    stringToSign = stringToSign.join(':');

    const hmacSignature = crypto.createHmac('sha512', clientSecret).update(stringToSign).digest('base64');
    return hmacSignature
}
const signatureRsaGeneration = (method, pathUrl, requestBody, timeStamp) => {
    const body = typeof requestBody === 'string' ? requestBody : JSON.stringify(requestBody);
    const hexEncode = crypto.createHash('sha256').update(body).digest('hex').toLowerCase();
    const stringToSign = [method, pathUrl, hexEncode, timeStamp].join(':');
    const privateKey = fs.readFileSync('./cb_private_key.pem', 'utf8');
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(stringToSign);
    return signer.sign(privateKey, 'base64');
};

const signatureRsaValidation = (method, url, requestBody, timestamp, receivedSignature) => {
    const bodyString = typeof requestBody === 'string' ? requestBody : JSON.stringify(requestBody);

    const hashedBody = crypto.createHash('sha256').update(bodyString).digest('hex').toLowerCase();
    const stringToSign = [method, url, hashedBody, timestamp].join(':');
    const publicKey = fs.readFileSync('./cb_public_key.pem', 'utf8');
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(stringToSign);
    return verify.verify(publicKey, receivedSignature, 'base64');
};


module.exports = {
    signatureAuth,
    signatureGeneration,
    signatureRsaGeneration,
    signatureRsaValidation
}