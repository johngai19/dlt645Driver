'use strict';
const Meter = require('./lib/meter');
const {
    RESULT_SUCCESS,
    RESULT_FAILURE,
    ThingAccessClient,
    Config,
    //} = require('linkedge-thing-access-sdk');
} = require('./lib/fakelinkedge');

class Connector {
    constructor(config, meter) {
        this.config = config;
        this.meter = meter;
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
            // const temperature = this.meter.temperature;
            // const Uab = this.meter.Uab;
            // const Ia = this.meter.Ia;
            // const MeterSN=this.meter.MeterSN;
            // const portName=this.meter.portName;
            // Publish the temperature as a property to Link IoT Edge.
            this._client.reportProperties({})//'temperature': temperature, 'Uab': Uab,'Ia':Ia ,'MeterSN':MeterSN,'portName':portName});
            // Fire a high_temperature event if the temperature is greater then 40.
            /*if (temperature > 40) {
              this._client.reportEvent('high_temperature', { 'temperature': temperature });
            }*/
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
        if (properties.hasOwnProperty('portName')) {
          this.meter.portName=properties.portName;
          return {
            code: RESULT_SUCCESS,
            message: 'success',
            params: {
              portName:this.meter.portName
            }
          };
        }*/
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
        /*
        if (keys.includes('temperature')&&keys.includes('Uab')&&keys.includes('Ia')) {
          return {
            code: RESULT_SUCCESS,
            message: 'success',
            params: {
              temperature: this.meter.temperature,
              Uab: this.meter.Uab,
              Ia: this.meter.Ia,
              MeterSN:this.meter.MeterSN,
              portName:this.meter.portName
            }
          };
        }*/
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


Config.get()
    .then((config) => {
        // Get the device information from config, which contains product key, device
        // name, etc. of the device.
        const thingInfos = config.getThingInfos();
        const portName = config.getDriverInfo().json.portName;
        thingInfos.forEach((thingInfo) => {
            //FIXME change meter back
            const meter = new Meter();
            //const meter = new Meter(thingInfo.custom.MeterSN, portName);//thingInfo.Config.custom.MeterSN);
            // The Thing format is just right for connector config, pass it directly.
            const connector = new Connector(thingInfo, meter);
            connector.connect();
            console.log(thingInfo);
            console.log(portName);
        });
    });

module.exports.handler = function (event, context, callback) {
    console.log(event);
    console.log(context);
    callback(null);
};

exports.Connector = Connector;