'use strict';
/**

*@class Configuration - class to create,save and update all global data
*@constructor
*@param {string} configFile - the path and file name of config file
*@param {string} modelFile  - the path and file name of model file
*@auther weizy@126.com
*@version 1.0.0
*/

class Configuration {

    constructor(configFile, modelFile) {
        this._config = require(configFile);
        this._driverInfo = this._config.driverInfo;
        this._reportInterval = this._config.reportInterval;
        this._model = require(modelFile);
        //this._meterList is an array of String format which need to be parsed to use
        this._meterList = this._buildDeviceList(this._config.meterList, this._model.properties);
        this._buildDeviceList.bind(this);
    }
    /**
     * @property driverInfo
     * @public
     * @returns this._driverInfo in JSON String format
     */
    get driverInfo() {
        return JSON.stringify(this._driverInfo);
    }

    /**
     * @property meterList
     * @public
     * @returns this._meterList in JSON String format
     */
    get meterList() {
        return this._meterList;
    }

    /**
    * @property reportInterval
    * @public
    * @returns this._reportInterval in number format
    */
    get reportInterval() {
        return this._reportInterval;
    }

    /**
     * @property _buildDeviceList
     * @private
     * @param {JSON} devices  - device list from configuration file
     * @param {JSON} model - device value model properties (only the properties need to be pass in)
     * @returns {Array} devicelist - Array of JSON String format
     */
    _buildDeviceList(devices, model) {

        let devicesLength = devices.length,
            modelLength = model.length,
            deviceList = [];

        for (let i = 0; i < devicesLength; i++) {
            let deviceModel = {};

            Object.assign(deviceModel, devices[i]);
            deviceModel.properties = [];
            for (let j = 0; j < modelLength; j++) {
                let property = {};

                property['identifier'] = model[j]['identifier'];
                property['type'] = model[j]['dataType']['type'];
                if (property['type'] === 'int') {
                    property['value'] = 0;
                } else if (property.type === 'text') {
                    property['value'] = '';
                } else {
                    property['value'] = 0;
                }
                deviceModel.properties.push(JSON.parse(JSON.stringify(property)));
            }
            deviceList.push(JSON.stringify(deviceModel));
        }
        return deviceList;
    }
    /**
     * @property getProperty
     * @public
     * @param {JSON} msgString  - property request JSON string format
     * @returns {Array} resMsg - JArray of JSON string format
     * @example
     * let msg = JSON.stringify({
            "productKey": "a1CLH9cvgoK",
            "deviceName": "tstMeter",
            "properties": ["elecPf", "elecFh", "elecUa"]
        });
    *  resmsg = ['{"identifier":"elecPf","type":"int","value":0}',
            '{"identifier":"elecFh","type":"int","value":0}',
            '{"identifier":"elecUa","type":"int","value":0}'];

     */
    getProperty(msgString) {

        let message = JSON.parse(msgString),
            productKey = message['productKey'],
            deviceName = message['deviceName'],
            properties = message['properties'],
            meterList = this._meterList,
            propertiesLength = properties.length,
            resMsg = [];

        for (let x = 0; x < meterList.length; x++) {
            let meter = JSON.parse(meterList[x]);

            if (meter['productKey'] === productKey && meter['deviceName'] === deviceName) {
                let meterProperties = meter['properties'],
                    meterLength = meterProperties.length;

                for (let i = 0; i < propertiesLength; i++) {
                    for (let j = 0; j < meterLength; j++) {
                        if (meterProperties[j]['identifier'] === properties[i]) {
                            let resProperty = Object.assign({}, meterProperties[j]);

                            resMsg.push(JSON.stringify(resProperty));
                            break;
                        }
                    }
                }
                break;
            }
        }
        return resMsg;
    }

    setProperty(msgString) {
        let message = JSON.parse(msgString),
            productKey = message['productKey'],
            deviceName = message['deviceName'],
            properties = message['properties'], //this is still in array string format
            meterList = this._meterList,
            propertiesLength = properties.length;

        for (let x = 0; x < meterList.length; x++) {
            let meter = JSON.parse(meterList[x]);

            if (meter['productKey'] === productKey && meter['deviceName'] === deviceName) {
                let meterProperties = meter['properties'],
                    meterLength = meterProperties.length;

                for (let i = 0; i < propertiesLength; i++) {
                    let property=JSON.parse(properties[i]);

                    for (let j = 0; j < meterLength; j++) {
                        if (meterProperties[j]['identifier'] === property['identifier']) {
                            Object.assign(meterProperties[j],property);
                            break;
                        }
                    }
                }
                meterList.splice(x,1,JSON.stringify(meter));
                break;
            }
        }

        return JSON.stringify({});
    }
}
module.exports = Configuration;