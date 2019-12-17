'use strict';
const SerialPort = require('serialport'),
    bufToCmd = require('./dltparser').bufToCmd,
    cmdToBuf = require('./dltparser').cmdToBuf;
const ConcatParser = require('./concatparser');
const logger = require('./logger'),
    errorLogger = logger.getLogger('debug');

/**
*@class DltDriver - class to fetch value from serialPort and update configuration value
*@constructor
*@param {Object} Configuration -
*@auther weizy@126.com
*@version 1.0.0
*/
class DltDriver {
    constructor(configuration) {
        // this._config=JSON.parse(configuration);
        this._portName = '';
        this._portSet = {};
        this._updateInterval = 0;
        this._initPort(configuration);
        this._port = new SerialPort(this._portName, this._portSet, (err) => {
            if (err !== null) {
                errorLogger.error('port open error:', err);
            }
        });
        this._concat = new ConcatParser({ 'boundary': [0x16] });
        this._parser = this._port.pipe(this._concat);
        this._meterList = configuration.meterList;
        this._meterListLength = this._meterList.length;

        //here calls parser to concat data and update relative value in configuration class
        this._parser.on('data', (data) => {
            let cmd = bufToCmd(data);

            if (cmd) {
                this._updateValue(cmd, configuration);
            }

        });
        this._yld = this._fetchValue();
        this._fetchInterval = setInterval(() => {
            if (this._meterListLength > 0) {
                let buf = this._yld.next().value;

                if (buf.length > 1) {
                    this._port.write(buf, (err) => {
                        if (err) {
                            errorLogger.error('fetch meter list error: ', err);
                        }
                    });
                }

            }
        }, this._updateInterval);

        this._initPort.bind(this);
        this._updateValue.bind(this);
        this._fetchValue.bind(this);
        this.closePort.bind(this);
    }

    /**
 * @method _initPort
 * @private
 * @summary update port value of dltdriver from configuration file
 */
    _initPort(config) {
        try {

            let driverInfo = JSON.parse(config['driverInfo']);

            if (driverInfo) {
                let rawPortName = driverInfo['portName'];

                this._portName = rawPortName.replace('tty', '/dev/tty');
                this._updateInterval = driverInfo['updateInterval'];
                this._portSet['baudRate'] = driverInfo['baudRate'];
                this._portSet['dataBits'] = driverInfo['dataBits'];
                this._portSet['parity'] = driverInfo['parity'];
                this._portSet['stopBits'] = driverInfo['stopBits'];
                this._portSet['autoOpen'] = driverInfo['autoOpen'];

            }
        } catch (error) {
            errorLogger.error('Error to init port in dltDriver:',error);
        }
    }
    /**
 * @method _updateValue - to update meterlist value in configuration
 * @private
 * @param {Object} cmd - a custom formed object,see parser
 * @param {Object} configuration -see configuration file
 * @summary translate from cmd to configuration format and call configuration to update
 */
    _updateValue(cmd, configuration) {
        if (cmd !== {} && cmd['sn'] && cmd['data'] && cmd['data']['propertyName'] !== 'errCode') {

            let msg = {},
                property = {},
                data = cmd['data'];

            msg['meterSn'] = cmd['sn'];
            msg['properties'] = [];
            property['identifier'] = data['propertyName'];
            property['value'] = data['value'];
            msg['properties'].push(property);
            configuration.updateProperty(JSON.stringify(msg));
        }

    }
    /**
 * @method *_fetchValue - yield function to feed driver
 * @private
 * @summary yield all properties from meterList and generate command for driver to call port and send
 */
    *_fetchValue() {
        const cmd = {
                'sn': '0000000000',
                'cmd': '11',
                'data': {
                    'status': true,
                    'propertyName': 'elecUa',
                    'value': 0
                }
            },
            meterList = [];

        for (let i = 0; i < this._meterListLength; i++) {
            meterList.push(JSON.parse(this._meterList[i]));
        }
        let index = 0;

        while (true) {
            let meter = meterList[index],
                properties = meter['properties'],
                propLength = properties.length;

            cmd['sn'] = meter['meterSn'];
            cmd['cmd'] = '11';


            for (let i = 0; i < propLength; i++) {
                let property = properties[i];

                cmd['data']['propertyName'] = property['identifier'];
                cmd['data']['status'] = true;
                cmd['data']['value'] = 0;
                yield cmdToBuf(cmd);
            }
            index++;
            if (index >= this._meterList.length) {
                index = 0;
            }
        }

    }
    /**
 * @method closePort
 * @public
 * @summary close the port
 */
    closePort(){
        this._port.close();
    }
}

module.exports = DltDriver;
