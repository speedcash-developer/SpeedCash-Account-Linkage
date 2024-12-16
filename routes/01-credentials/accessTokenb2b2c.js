/**
 * API Token B2B
 * access token yang berfungsi sebagai autentikasi saat ingin mengakses API yang lain.
 * 
 * Referensi:
 * API Documentation: https://qris-mpm-docs.speedcash.co.id/docs/payments/qris-mpm/Keamanan/Token%20B2B
 */

const fs = require('fs')
const sender = require('../../service/sender')
const { generateToken, dateTime, writeLocalData } = require('../../utils/utils')
const CONFIG = require('../../config/config')


  const path = "/access-token/b2b2c";
  const data = JSON.parse(fs.readFileSync('localData.json', 'utf8'));

  // headers
  const clientKey = CONFIG.CLIENT_ID;
  const externalId = generateToken(15);
  const timeStamp = data.timeStamp;
  const channelId = CONFIG.CHANNEL_ID;

  // body
  const body = {
    grantType: "refresh_token",
    refreshToken: "74d63fbe-cd3e-4816-85b4-483fa5a563a3",
  };

  let headers = {};
  headers["X-EXTERNAL-ID"] = externalId;
  headers["X-CLIENT-KEY"] = clientKey;
  headers["X-TIMESTAMP"] = timeStamp;
  headers["X-SIGNATURE"] = data.signature_auth;
  headers["X-CHANNEL-ID"] = channelId;

  sender.post(path, body, headers).then((response) => {
    writeLocalData({ token_b2b2c: response.accessToken });
    console.log('response:', response);
    //handle logic
  });