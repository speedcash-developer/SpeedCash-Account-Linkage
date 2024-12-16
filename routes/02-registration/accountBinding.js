/**
 * API Token B2B
 * access token yang berfungsi sebagai autentikasi saat ingin mengakses API yang lain.
 * 
 * Referensi:
 * API Documentation: https://qris-mpm-docs.speedcash.co.id/docs/payments/qris-mpm/Keamanan/Token%20B2B
 */

const fs = require('fs')
const { signatureGeneration } = require('../../auth/signature')
const sender = require('../../service/sender')
const { generateToken, dateTime } = require('../../utils/utils')
const CONFIG = require('../../config/config')


const path = "/v1.0/registration-account-binding";
const httpMethod = 'POST'
const data = JSON.parse(fs.readFileSync('localData.json', 'utf8'));
const accessTokenb2b = data.token_b2b

// body
const body = {
    msisdn: "089601014551",
    merchantId: "1212738",
    additionalInfo: {
        callbackUrl: "https://esmeralda-api-devel.speedcash.co.id/callback/sc/binding",
        deviceId: "android-20013adf6cdd8123f"
    }
};

// headers
const clientKey = CONFIG.CLIENT_ID;
const externalId = generateToken(15);
const timeStamp = dateTime();
const channelId = CONFIG.CHANNEL_ID;
const signature = signatureGeneration(httpMethod, path, accessTokenb2b, body, timeStamp);

let headers = {};
headers['Authorization'] = 'Bearer ' + accessTokenb2b;
headers["x-timestamp"] = timeStamp;
headers["x-signature"] = signature;
headers["x-partner-id"] = clientKey;
headers["channel-id"] = channelId;
headers["x-external-id"] = externalId;

  sender.post(path, body, headers).then((response) => {
    console.log('response:', response);
    //handle logic
  });