'use strict';

module.exports = function (msgStr, config, cb) {

    let msg = JSON.parse(msgStr),
        version = msg.version ? msg.version : '1.0',
        message = msg.message ? msg.message : '',
        payload = msg.payload ? msg.payload : {},
        code = msg.code ? msg.code : 0,
        method = msg.method ? msg.method : '';

    const callRegDevice = function (regMethod) {
            let devices = config.onlineDevice(),
                devLength = devices.length,
                resList = [],
                resMsg = {
                    'version': '1.0',
                    'method': regMethod,
                    'messageId': regMethod === 'onlineDevice' ? 1 : 2,
                    'payload': {}
                };

            for (let i = 0; i < devLength; i++) {
                Object.assign(resMsg['payload'], devices[i]);
                resList.push(JSON.parse(JSON.stringify(resMsg)));
            }
            return resList;
        },
        callReportProperty = function () {
            let devices = config.reportProperty(),
                devLength = devices.length,
                resList = [],
                resMsg = {
                    'version': '1.0',
                    'method': 'reportProperty',
                    'messageId': 0,
                    'payload': {}
                };

            for (let i = 0; i < devLength; i++) {
                //Object.assign(resMsg['payload'], devices[i]);
                resMsg['payload'] = devices[i];
                resList.push(JSON.parse(JSON.stringify(resMsg)));
            }
            return resList;
        },
        callGetProperty = function () {
            let reqMsg = {},
                resProperties = [],
                resMsg = {};

            reqMsg['productKey'] = payload['productKey'];
            reqMsg['deviceName'] = payload['deviceName'];
            reqMsg['properties'] = payload['properties'];
            resProperties = config.getProperty(JSON.stringify(reqMsg));
            resMsg = { 'code': 0, 'messageId': 3, 'payload': { 'properties': resProperties } };

            return resMsg;
        },


        dispatch = function () {
            if ((code===0)&&(message==='Success')){
                let rest={};

                return cb(rest);
            }

            if (version === '1.0') {
                if (method) {
                    if (method === 'onlineDevice') {
                        let rest = callRegDevice('onlineDevice');

                        return cb(rest);

                    } else if (method === 'offlineDevice') {
                        let rest = callRegDevice('offlineDevice');

                        return cb(rest);

                    } else if (method === 'reportProperty') {
                        let rest = callReportProperty();

                        return cb(rest);

                    } else if (method === 'getProperty') {
                        let rest = callGetProperty();

                        return cb(rest);
                    } else if (method === 'setProperty') {
                        let rest = {
                            'code': 109003,
                            'message': 'failure, property readonly.'
                        };

                        return cb(rest);

                    } else if (method === 'callService') {
                        let rest = {
                            'code': 109005,
                            'message': 'The requested service does not exist.'
                        };

                        return cb(rest);
                    }
                    let rest={
                        'code':100000,
                        'message':'Unrecognized method.'
                    };

                    return cb(rest);

                }
            }
        };

    return dispatch();
};