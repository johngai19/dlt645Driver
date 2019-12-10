#!/usr/bin/env node
var WebSocketClient = require('websocket').client;

var client = new WebSocketClient();
let conInterval = 5000;
client.on('connectFailed', function (error) {
    console.log('Connect Error: ' + error.toString());
    conInterval += conInterval;
    console.log(conInterval);
    setTimeout(() => {
        client.connect('ws://127.0.0.1:17682/');
    }, conInterval);
});

client.on('connect', function (connection) {
    conInterval = 5000;
    console.log(conInterval);
    console.log('WebSocket Client Connected');
    connection.on('error', function (error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function () {
        console.log('echo-protocol Connection Closed');
        conInterval += conInterval;
        console.log(conInterval);
        setTimeout(() => {
            client.connect('ws://127.0.0.1:17682/');
        }, conInterval);
    });

    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });

    function sendNumber() {
        if (connection.connected) {

            //var number = Math.round(Math.random() * 0xFFFFFF);
            //connection.sendUTF(number.toString());
            connection.sendUTF(reportOnline()),
                setTimeout(() => {
                    connection.sendUTF(reportProperty())
                }, 1000);
        }
    }
    sendNumber();

    function reportOnline() {
        return JSON.stringify({
            "version": "1.0",
            "method": "onlineDevice",
            "messageId": 1,
            "payload": {
                "productKey": "a1CLH9cvgoK",
                "deviceName": "testDltMeter"
            }
        });
    }

    function reportProperty() {
        return JSON.stringify({
            "version": "1.0",
            "method": "reportProperty",
            "messageId": 0,
            "payload": {
                "productKey": "a1CLH9cvgoK",
                "deviceName": "testDltMeter",
                "properties": [
                    {
                        "identifier": "elecUa",
                        "type": "int",
                        "value": 2211
                    },
                    {
                        "identifier": "elecPf",
                        "type": "int",
                        "value": 900
                    },
                    {
                        "identifier": "meterSn",
                        "type": "text",
                        "value": "ssd2221"
                    },
                    {
                        "identifier": "errCode",
                        "type": "int",
                        "value": 0
                    },
                    {
                        "identifier": "elecCb",
                        "type": "int",
                        "value": 800
                    }
                ]
            }
        });
    }
});

client.connect('ws://127.0.0.1:17681/');