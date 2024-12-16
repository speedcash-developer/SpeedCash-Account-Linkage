/**
 * API Qris Status
 * access token yang berfungsi untuk mengecek status qris.
 * 
 * Referensi:
 * API Documentation: https://qris-mpm-docs.speedcash.co.id/docs/payments/qris-mpm/Keamanan/Token%20B2B
 */

const fs = require('fs')
const { signatureGeneration } = require('../../auth/signature')
const sender = require('../../service/sender')
const { generateToken, dateTime } = require('../../utils/utils')
const CONFIG = require('../../config/config')


  const path = "v1.0/qr/qr-mpm-status";
  const httpMethod = 'POST'
  const data = JSON.parse(fs.readFileSync('localData.json', 'utf8'));
  const accessTokenb2b = data.token_b2b
  const accessTokenb2b2c = data.token_b2b2c

// body
const body = data.bodyPaymentTransferBank;
data.bodyPaymentTransferBank.additionalInfo.centralId = '123654'

// headers
const clientKey = CONFIG.CLIENT_ID;
const externalId = generateToken(15);
const timeStamp = dateTime();
const channelId = CONFIG.CHANNEL_ID;
const signature = signatureGeneration(httpMethod, path, accessTokenb2b, body, timeStamp);

let headers = {};
headers['Authorization'] = 'Bearer ' + accessTokenb2b;
headers['authorization-customer'] = 'Bearer ' + accessTokenb2b;
headers["x-timestamp"] = timeStamp;
headers["x-signature"] = signature;
headers["x-partner-id"] = clientKey;
headers["channel-id"] = channelId;
headers["x-external-id"] = externalId;

sender.post(path, body, headers).then((response) => {
  console.log('response:', response);

    // handle logic
});