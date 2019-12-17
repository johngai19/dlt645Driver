'use strict';
/**

*@class Configuration - class to create,save and update all global data
*@constructor
*@param {string} configFile - the path and file name of config file
*@param {string} modelFile  - the path and file name of model file
*@auther weizy@126.com
*@version 1.0.0
*/
const logger=require('./logger'),
    errorLogger=logger.getLogger('trace');

class Configuration {

    constructor(configFile, modelFile) {
        try {
            this._config = require(configFile);
            this._driverInfo = this._config.driverInfo;
            this._reportInterval = this._config.reportInterval;
            this._model = require(modelFile);
            //this._meterList is an array of String format which need to be parsed to use
            this._meterList = this._buildDeviceList(this._config.meterList, this._model.properties);
            this._buildDeviceList.bind(this);
            this._getAllProperties.bind(this);
            this.getProperty.bind(this);
            this.setProperty.bind(this);
            this.updateProperty.bind(this);
            this.onlineDevice.bind(this);
            this.reportProperty.bind(this);
        } catch (error) {
            errorLogger.error('Error to init configuration:',error);
        }
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
     * @method _getAllProperties
     * @private
     * @returns {Array} propertyAlist- Array of String format with all properties
     */
    _getAllProperties(){
        try {
            let propertyList=[],
                properties=this._model.properties,
                proLength=properties.length;

            for (let i=0;i<proLength;i++){
                propertyList.push(properties[i]['identifier']);
            }
            return propertyList;
        } catch (error) {
            errorLogger.error('Error to get all properties:',error);
        }
    }
    /**
     * @method _buildDeviceList
     * @private
     * @param {JSON} devices  - device list from configuration file
     * @param {JSON} model - device value model properties (only the properties need to be pass in)
     * @returns {Array} devicelist - Array of JSON String format
     */
    _buildDeviceList(devices, model) {
        try {

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
        } catch (error) {
            errorLogger.error('Error to build device list:',error);
        }
    }
    /**
     * @method getProperty
     * @public
     * @param {JSON} msgString  - property request JSON string format
     * @returns {Array} resMsg - JArray of JSON  format
     * @example
     * let msg = JSON.stringify({
            "productKey": "a1CLH9cvgoK",
            "deviceName": "tstMeter",
            "properties": ["elecPf", "elecFh", "elecUa"]
        });
    *  resmsg = [{"identifier":"elecPf","type":"int","value":0},
            {"identifier":"elecFh","type":"int","value":0},
            {"identifier":"elecUa","type":"int","value":0}];

     */
    getProperty(msgString) {
        try {

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

                                resMsg.push(JSON.parse(JSON.stringify(resProperty)));
                                break;
                            }
                        }
                    }
                    break;
                }
            }
            return resMsg;
        } catch (error) {
            errorLogger.error('Error to get property:',error);
        }
    }
    /**
     * @method setProperty
     * @public
     * @param {JSON} msgString  - property request JSON string format
     * @returns {Array} resMsg - EMPTY JArray of JSON  format
     * @summary currently this property is not called, keep for the future
     * this method update this._meterList property values in class
     */
    setProperty(msgString) {
        try {

            let message = JSON.parse(msgString),
                productKey = message['productKey'],
                deviceName = message['deviceName'],
                properties = message['properties'], //this is in array JSON format
                meterList = this._meterList,
                propertiesLength = properties.length;

            for (let x = 0; x < meterList.length; x++) {
                let meter = JSON.parse(meterList[x]);

                if (meter['productKey'] === productKey && meter['deviceName'] === deviceName) {
                    let meterProperties = meter['properties'],
                        meterLength = meterProperties.length;

                    for (let i = 0; i < propertiesLength; i++) {
                        // let property=JSON.parse(properties[i]);
                        let property = properties[i];

                        for (let j = 0; j < meterLength; j++) {
                            if (meterProperties[j]['identifier'] === property['identifier']) {
                                Object.assign(meterProperties[j], property);
                                break;
                            }
                        }
                    }
                    meterList.splice(x, 1, JSON.stringify(meter));
                    break;
                }
            }

            return JSON.stringify({});
        } catch (error) {
            errorLogger.error('Error to set property:',error);
        }
    }

    /**
     * @method updateProperty
     * @public
     * @param {JSON} msgString  - property request JSON string format
     * @returns {Array} resMsg - EMPTY JArray of JSON  format
     * this method update this._meterList property values in class
     * this method is used to update property with meterSn property rather than productKey and deviceName
     * because when a dlt meter is used the response value only includes meterSn
     */
    updateProperty(msgString) {
        try {

            let message = JSON.parse(msgString),
                meterSn = message['meterSn'],
                properties = message['properties'], //this is in array JSON format
                meterList = this._meterList,
                propertiesLength = properties.length;

            for (let x = 0; x < meterList.length; x++) {
                let meter = JSON.parse(meterList[x]);

                if (meter['meterSn'] === meterSn) {
                    let meterProperties = meter['properties'],
                        meterLength = meterProperties.length;

                    for (let i = 0; i < propertiesLength; i++) {
                    // let property=JSON.parse(properties[i]);
                        let property = properties[i];

                        for (let j = 0; j < meterLength; j++) {
                            if (meterProperties[j]['identifier'] === property['identifier']) {
                                Object.assign(meterProperties[j], property);
                                break;
                            }
                        }
                    }
                    meterList.splice(x, 1, JSON.stringify(meter));
                    break;
                }
            }
            //infoLogger.info(this._meterList);
            return JSON.stringify({});
        } catch (error) {
            errorLogger.error('Error to update property:',error);
        }
    }

    /**
     * @method onlineDevice
     * @public
     * @returns {Array} resMsg - deviceName/productKey Array of JSON  format
     * this method update this._meterList property values in class
     * this method is used to update property with meterSn property rather than productKey and deviceName
     * because when a dlt meter is used the response value only includes meterSn
     */
    onlineDevice() {
        try {
            let meterList = this._meterList,
                resMsg = [];

            for (let x = 0; x < meterList.length; x++) {
                let meter = JSON.parse(meterList[x]),
                    resObj = {
                        'productKey': meter['productKey'],
                        'deviceName': meter['deviceName']
                    };

                resMsg.push(Object.assign({}, resObj));
            }
            return resMsg;

        } catch (error) {
            errorLogger.error('Error to set onlineDevice in configuration class:',error);
        }
    }
    /**
     * @method reportProperty
     * @public
     * @returns {Array} resList - deviceName/productKey Array of JSON  format
     * this method update this._meterList property values in class
     * this method is used to report all properties of all devices.
     */
    reportProperty(){
        try {

            // console.log(this.meterList);
            let resList=[],
                meterLength=this.meterList.length;

            for (let i=0;i<meterLength;i++){
                let resMsg={},
                    meter=JSON.parse(this._meterList[i]);

                resMsg['productKey']=meter['productKey'];
                resMsg['deviceName']=meter['deviceName'];
                resMsg['properties']=meter['properties'];
                resList.push(resMsg);
            }
            return resList;
        } catch (error) {
            errorLogger.error('Error to report Property in configuration class',error);
        }
    }

}
module.exports = Configuration;