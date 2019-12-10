/*
 * Copyright (c) 2018 Alibaba Group Holding Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

//adf 

const {
  RESULT_SUCCESS,
  RESULT_FAILURE,
  ThingAccessClient,
  Config,
} = require('linkedge-thing-access-sdk');

/**
 * A dummy DltMeter whose temperature is always 41 and read-only.
 */
const DltMeter=require('./src/dltmeter');
const DltDriver=require('./src/dltdriver');
/**
 * The class combines ThingAccessClient and the thing that connects to Link IoT Edge.
 */
class Connector {
  constructor(config, dltMeter) {
    this.config = config;
    this.dltMeter = dltMeter;
    this._client = new ThingAccessClient(config, {
      setProperties: this._setProperties.bind(this),
      getProperties: this._getProperties.bind(this),
      callService: this._callService.bind(this),
    });
  }

  /**
   * Connects to Link IoT Edge and publishes properties and events to it.
   */
  connect() {
    return this._client.registerAndOnline()
      .then(() => {
        return new Promise(() => {
          // Publish properties and events to Link IoT Edge.
          this._publish();
        });
      })
      .catch(err => {
        console.log(err);
        return this._client.cleanup();
      })
      .catch(err => {
        console.log(err);
      });
  }

  /**
   * Disconnects from Link IoT Edge and stops publishing properties and events to it.
   */
  disconnect() {
    if (this._clearInterval) {
      this._clearInterval();
    }
    return this._client.cleanup()
      .catch(err => {
        console.log(err);
      });
  }

  _publish() {
    if (this._clearInterval) {
      this._clearInterval();
    }
    const timeout = setInterval(() => {
    const dltData =object.assign({} ,this.dltMeter.dltData);

      // Publish the temperature as a property to Link IoT Edge.
      //this._client.reportProperties({ 'temperature': temperature, 'Uab': Uab,'Ia':Ia ,'meterSn':meterSn,'portName':portName});
      this._client.reportProperties(dltData);
      // Fire a high_temperature event if the temperature is greater then 40.
      /*
      if (temperature > 40) {
        this._client.reportEvent('high_temperature', { 'temperature': temperature });
      }
      */
    }, 2000);
    this._clearInterval = () => {
      clearInterval(timeout);
      this._clearInterval = undefined;
    };
    return this._clearInterval;
  }

  _setProperties(properties) {
    // Usually, in this callback we should set properties to the physical thing and
    // return the result. Here we just return a failed result since the properties
    // are read-only.
    console.log('Set properties %s to thing %s-%s', JSON.stringify(properties),
      this.config.productKey, this.config.deviceName);
    // Return an object representing the result in the following form or the promise
    // wrapper of the object.
    /*
    // if (properties.hasOwnProperty('portName')) {
    //   this.dltMeter.portName=properties.portName;
    //   return {
    //     code: RESULT_SUCCESS,
    //     message: 'success',
    //     params: {
    //       portName:this.dltMeter.portName
    //     }
    //   };
    // }
    */
    return {
      code: RESULT_FAILURE,
      message: 'failure',
    };
  }

  _getProperties(keys) {
    // Usually, in this callback we should get properties from the physical thing and
    // return the result. Here we return the simulated properties.
    console.log('Get properties %s from thing %s-%s', JSON.stringify(keys),
      this.config.productKey, this.config.deviceName);
    // Return an object representing the result in the following form or the promise
    // wrapper of the object.
    const dltData =object.assign({} ,this.dltMeter.dltData);
    if(keys){
      const repProp={};
      for(let i =0;i<keys.length;i++){
        if(dltData.hasOwnProperty(keys[i])){
          repProp[keys[i]]=dltData[keys[i]];
        }
      }
      return {
        code: RESULT_SUCCESS,
        message: 'success',
        params:repProp,
      };
    }
    return {
      code: RESULT_FAILURE,
      message: 'The requested properties does not exist.',
    }
  }

  _callService(name, args) {
    // Usually, in this callback we should call services on the physical thing and
    // return the result. Here we just return a failed result since no service
    // provided by the thing.
    console.log('Call service %s with %s on thing %s-%s', JSON.stringify(name),
      JSON.stringify(args), this.config.productKey, this.config.deviceName);
    // Return an object representing the result in the following form or the promise
    // wrapper of the object
    return new Promise((resolve) => {
      resolve({
        code: RESULT_FAILURE,
        message: 'The requested service does not exist.',
      })
    });
  }
}

// Get the config which is auto-generated when devices are bound to this driver.
Config.get()
  .then((config) => {
    // Get the device information from config, which contains product key, device
    // name, etc. of the device.
    const thingInfos = config.getThingInfos();
    const driveInfo=config.getDriverInfo().json;
    const dltdriver=new DltDriver(portPath =driveInfo.portPath, updateInt=driveInfo.updateInt);
    thingInfos.forEach((thingInfo) => {
      const dltMeter = new DltMeter(meterSn=thingInfo.custom.meterSn, updateInt=thingInfo.custom.updateInt);//thingInfo.Config.custom.meterSn);
      // The Thing format is just right for connector config, pass it directly.
      const connector = new Connector(thingInfo, dltMeter);
      connector.connect();
    });
  });

module.exports.handler = function (event, context, callback) {
  console.log(event);
  console.log(context);
  callback(null);
};