const superagent = require('superagent');
const CONFIG = require('../config/config')

const request = {
    get: async(path, headers = {}) => {
        try {
            const res = await superagent
                .get(CONFIG.BASE_URL + path)
                .set(headers);
            return res.body;
        } catch (err) {
            const errorResponse = err.response && err.response.body ? err.response.body : {};
            return {
                responseCode: errorResponse.responseCode || err.status || 500,
                responseMessage: errorResponse.responseMessage || err.message,
                addititonalInfo: errorResponse.data || null
            };
        }
    },
    
    post: async(path, body, headers = {}) => {
        try {
            const res = await superagent
                .post(CONFIG.BASE_URL + path)
                .set(headers)
                .send(body);
            return res.body;
        } catch (err) {
            const errorResponse = err.response && err.response.body ? err.response.body : {};
            return {
                responseCode: errorResponse.responseCode || err.status || 500,
                responseMessage: errorResponse.responseMessage || err.message,
                addititonalInfo: errorResponse.data || null
            };
        }
    },
    
    postCallback: async(path, body, headers = {}) => {
        try {
            const res = await superagent
                .post(CONFIG.YOUR_URL + path)
                .set(headers)
                .send(body);
            return res.body;
        } catch (err) {
            const errorResponse = err.response && err.response.body ? err.response.body : {};
            return {
                responseCode: errorResponse.responseCode || err.status || 500,
                responseMessage: errorResponse.responseMessage || err.message,
                addititonalInfo: errorResponse.data || null
            };
        }
    },
    postFormData: async(path, fields = {}, files = [], headers = {}) => {
        try {
            const req = superagent
                .post(CONFIG.BASE_URL + path)
                .set(headers);
            
            Object.entries(fields).forEach(([key, value]) => {
                req.field(key, value);
            });


            files.forEach(file => {
                req.attach(file.fieldName, file.path);
            });
            
            const res = await req;
            return res.body;
        }   catch (err) {
            const errorResponse = err.response && err.response.body ? err.response.body : {};
            return {
                    responseCode: errorResponse.responseCode || err.status || 500,
                    responseMessage: errorResponse.responseMessage || err.message,
                    addititonalInfo: errorResponse.data || null
            };
        }
    },
};
module.exports = request;