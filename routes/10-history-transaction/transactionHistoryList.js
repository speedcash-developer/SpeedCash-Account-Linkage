/**
 * Transaction History List
 * 
 * 
 * Referensi:
 * API Documentation:
 */

const fs = require('fs')
const { signatureGeneration } = require('../../auth/signature')
const sender = require('../../service/sender')
const { generateToken, dateTime } = require('../../utils/utils')
const CONFIG = require('../../config/config')
const { DateTime } = require('luxon')


const path = "/v1.0/transaction-history-list";
const httpMethod = 'POST'
const data = JSON.parse(fs.readFileSync('localData.json', 'utf8'));
const accessToken = data.token_b2b2c

const body = {
  partnerReferenceNo: "2020102900000000000001",
  fromDateTime: dateTime(5),
  toDateTime: dateTime(),
  // pageSize: "10",
  // pageNumber: "2",
  additionalInfo: {
    deviceId: "12345679237",
    merchantId: "1212738"
  },
};

// headers
const clientKey = CONFIG.CLIENT_ID;
const externalId = generateToken(15);
const timeStamp = dateTime();
const channelId = CONFIG.CHANNEL_ID;
const signature = signatureGeneration(httpMethod, path, accessToken, body, timeStamp);

let headers = {};
headers['Authorization'] = 'Bearer ' + data.token_b2b;
headers['authorization-customer'] = 'Bearer ' + data.token_b2b2c,
headers["x-timestamp"] = timeStamp;
headers["x-signature"] = signature;
headers["x-partner-id"] = clientKey;
headers["channel-id"] = channelId;
headers["x-external-id"] = externalId;

  sender.post(path, body, headers).then((response) => {
    console.log('response:', response);
    //handle logic
  });