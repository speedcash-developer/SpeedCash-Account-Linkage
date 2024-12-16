/**
 * API Token B2B
 * access token yang berfungsi sebagai autentikasi saat ingin mengakses API yang lain.
 * 
 * Referensi:
 * API Documentation: https://qris-mpm-docs.speedcash.co.id/docs/payments/qris-mpm/Keamanan/Token%20B2B
 */

const fs = require('fs')
const { signatureAuth } = require('../../auth/signature')
const sender = require('../../service/sender')
const { generateToken, dateTime, writeLocalData } = require('../../utils/utils')
const CONFIG = require('../../config/config')

const path = "/access-token/b2b";

// headers
const data = JSON.parse(fs.readFileSync('localData.json', 'utf8'));
const clientKey = CONFIG.CLIENT_ID;
const externalId = generateToken(15);
const timeStamp = dateTime();
const channelId = CONFIG.CHANNEL_ID;
const signature = signatureAuth(`${clientKey}|${timeStamp}`);

// body
const body = {
  grantType: "client_credentials",
};

let headers = {};
headers["X-EXTERNAL-ID"] = externalId;
headers["X-CLIENT-KEY"] = clientKey;
headers["X-TIMESTAMP"] = timeStamp;
headers["X-SIGNATURE"] = signature;
headers["X-CHANNEL-ID"] = channelId;

sender.post(path, body, headers).then((response) => {
  console.log('response:', response);

  // handle logic
  writeLocalData({ token_b2b: response.accessToken });
});