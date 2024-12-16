const { DateTime } = require('luxon');
const crypto = require('crypto');
const fs = require('fs')

const dateTime = (identifier) => {
  let dateTime;
  let timeStamp;
  if (identifier && typeof identifier === 'number') {
    dateTime = DateTime.now().setZone('Asia/Jakarta').minus({ days: identifier }).startOf('day');
    timeStamp = dateTime.toISO();
  } else {
    dateTime = DateTime.now().setZone('Asia/Jakarta');
    timeStamp = dateTime.toISO();
  }
  
  writeLocalData({ timeStamp: timeStamp });
  return timeStamp;
}

function generateToken(length) {
    const token = crypto.randomBytes(length).toString('base64')
    return token
}

// Fungsi untuk membaca data dari localData.json
function readLocalData() {
    try {
      const data = fs.readFileSync('localData.json', 'utf8');
      return JSON.parse(data); // Kembalikan data sebagai objek
    } catch (error) {
      // Jika file tidak ada, kembalikan objek kosong
      if (error.code === 'ENOENT') {
        return {};
      }
      throw error; // Lempar error jika masalah lain
    }
  }

// Fungsi untuk menulis data ke localData.json
function writeLocalData(newData) {
    try {
      const existingData = readLocalData(); // Baca data yang sudah ada
      const updatedData = { ...existingData, ...newData }; // Gabungkan dengan data baru
      fs.writeFileSync('localData.json', JSON.stringify(updatedData, null, 2));
      return true
    } catch (error) {
      console.error('Gagal menyimpan data dilokal:', error);
      return false
    }
  }

module.exports = {
    dateTime,
    generateToken,
    readLocalData,
    writeLocalData
}