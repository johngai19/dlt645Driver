#!/usr/bin/env node
'use strict';
const path = require('path');
const logger = require('./logger'),
    errorLogger = logger.getLogger('fatal');


try {
    const DltDriver = require('./dltdriver'),
        wsParser = require('./wsParser');
    const Configuration = require('./configuration'),
        WebSocketClient = require('websocket').client,
        configFile = path.join(__dirname, 'config.json'),
        modelFile = path.join(__dirname, 'model.json'),
        serverFile = path.join(__dirname, 'server.json');
    const server = require(serverFile),
        client = new WebSocketClient(),
        configuration = new Configuration(configFile, modelFile),
        dltDriver = new DltDriver(configuration);

    //reconnect cycle to keep client alive
    let conInterval = 20000;

    //Keep trying to make client keep alive
    client.on('connectFailed', function (error) {
        errorLogger.error('Connect Error: ' + error);
        //console.log(error);
        conInterval += conInterval;
        setTimeout(() => {
            client.connect(server['server']);
        }, conInterval);
    });

    //Report online and all properties, and reply all websocked request
    client.on('connect', function (connection) {
        let ml = configuration.meterList.length,
            rp = configuration.reportInterval,
            reqMsg = '',
            rpIntel = ml * rp * 50;

        conInterval = 20000;

        //console.log('WebSocket Client Connected');
        const sendWebSocket = (message) => {
            setTimeout(() => {
                wsParser(message, configuration, (resMsg) => {
                    if (resMsg && resMsg !== {}) {
                        if (resMsg.length > 0) {
                            let msgLen = resMsg.length;

                            for (let i = 0; i < msgLen; i++) {
                                if (resMsg[i]['code']!==100000){
                                    let strMsg = JSON.stringify(resMsg[i]);

                                    setTimeout(() => {
                                        //console.log('send websocket,' + strMsg);
                                        connection.sendUTF(strMsg, (err) => {
                                            errorLogger.error('send websocket arrayerror,' + err);
                                        });

                                    }, 2000);
                                }


                            }
                        } else if (resMsg['code']!==100000){
                            let strMsg = JSON.stringify(resMsg);

                            //console.log('send websocket,' + strMsg);
                            connection.sendUTF(strMsg, (err) => {
                                errorLogger.error('send websocket error,' + err);
                            });
                        }
                    }
                });
            }, 2000);
        };

        connection.on('error', function (error) {
            errorLogger.error('Connection Error: ' + error);
        });

        //automated reconnect
        connection.on('close', function () {
            errorLogger.error('Remote Connection Closed');
            conInterval += conInterval;
            setTimeout(() => {
                client.connect(server['server']);
            }, conInterval);
        });
        connection.on('message', function (message) {
            if (message.type === 'utf8') {
                let msg = message.utf8Data;

                sendWebSocket(msg);
            }
        });

        reqMsg = JSON.stringify({
            'method': 'onlineDevice'
        });

        sendWebSocket(reqMsg);
        reqMsg = JSON.stringify({
            'method': 'reportProperty'
        });
        setInterval(() => {
            sendWebSocket(reqMsg);
        }, rpIntel);
    });
    client.connect(server['server']);
    //system exit process
    process.on('uncaughtException', (e) => {
        errorLogger.error('Unexpected System error:', e);
        dltDriver.closePort();
        process.exit(1000);
    });
    process.on('exit', () => {
        errorLogger.error('system exit, bye bye');
    });
    process.on('SIGINT', () => {
        dltDriver.closePort();
        errorLogger.error('system is closing by order, port closed');
        process.exit(1000);
    });

} catch (error) {
    errorLogger.fatal('System Error:', error);
    process.exit(1);
}