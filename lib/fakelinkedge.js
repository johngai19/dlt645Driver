
const configString = JSON.stringify({
    'deviceList': [{
        "productKey": "firstProduct",
        "deviceName": "firstDevice",
        "custom": JSON.stringify({
            "meterSn": "firstMeter"
        })
    },
    {
        "productKey": "secondeProduct",
        "deviceName": "secondDevice",
        "custom": JSON.stringify({
            "meterSn": "secondMeter"
        })
    }],
    'config': {
        "json": {
            "ip": "127.0.0.1",
            "portName": "/dev/ttyS4"
        }
    }
})

class FakeConfig {
    static get() {
        return new Promise((resolve) => {
            resolve(new FakeConfig(configString));
        })
    }

    constructor(string = configString) {

        let config = JSON.parse(string);
        const devices = config['deviceList'];
        this.thingInfos = devices.map(device => ThingInfo.from(device));
        this.driverInfor = config['config'];

        this.getThingInfos.bind(this);
        this.getDriverInfo.bind(this);
    }
    getThingInfos() {
        return this.thingInfos;
    }
    getDriverInfo() {
        return this.driverInfor;
    }

}

class ThingInfo {
    /**
     * Construct a new ThingInfo instance.
     *
     * @param productKey {String} the product key
     * @param deviceName {String} the device name
     * @param custom {Object} the associated custom config
     *
     * @private
     */
    constructor({
        productKey,
        deviceName,
        custom,
    } = {}) {
        /**
         * The product key.
         *
         * @type {String}
         */
        this.productKey = productKey;
        /**
         * The device name.
         *
         * @type {String}
         */
        this.deviceName = deviceName;
        /**
         * The associated custom config.
         *
         * @type {Object}
         */
        this.custom = undefined;
        if (custom) {
            try {
                this.custom = JSON.parse(custom);
            } catch (err) {
                console.warn(`Not JSON string: ${custom}`);
                this.custom = undefined;
            }
        }
    }

    static from(config) {
        if (!config.productKey) {
            throw new Error(`Can't find required "productKey".`);
        }
        if (!config.deviceName) {
            throw new Error(`Can't find required "deviceName".`);
        }
        return new ThingInfo(config);
    }
}

//FIXME

class FakeThingAccessClient {

    constructor(config, callbacks) {
        if (!callbacks || !callbacks.getProperties || !callbacks.setProperties
            || !callbacks.callService) {
            throw new Error('Illegal callbacks');
        }
        if (!config || !config.productKey || (!config.deviceName && !config.localName)) {
            throw new Error('Illegal config');
        }
    }


    setup() {
        return new Promise((resolve) => {
            resolve(true);
        });
    }


    registerAndOnline() {
        return new Promise((resolve) => {
            resolve(this.setup());
        });
    }

    reportEvent(eventName, args) {
        return new Promise((resolve) => {
            resolve(eventName);
        });
    }


    reportProperties(properties) {
        return new Promise((resolve) => {
            resolve(properties);
          });
    }


    online() {
        return new Promise((resolve) => {
            resolve(this.setup());
        });
    }


    offline() {
        return new Promise((resolve) => {
            resolve(this.setup());
        });
    }


    getTsl() {
        return new Promise((resolve) => {
            resolve(this.setup());
        });
    }


    getTslConfig() {
        return new Promise((resolve) => {
            resolve(this.setup());
        });
    }


    getTslExtInfo() {
        return new Promise((resolve) => {
            resolve(this.setup());
        });
    }


    cleanup() {
        return new Promise((resolve) => {
            resolve(this.setup());
        });
    }


    unregister() {
        return new Promise((resolve) => {
            resolve(this.setup());
        });
    }
}


module.exports = {
    RESULT_SUCCESS: 0,
    RESULT_FAILURE: -1,
    ThingAccessClient: FakeThingAccessClient,
    Config: FakeConfig,
}