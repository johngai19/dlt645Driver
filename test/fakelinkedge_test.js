const chai = require('chai');
const chaiAsPromise = require('chai-as-promised');
const sinon = require('sinon');
const Event = require('events').EventEmitter;
const sinonChai = require('sinon-chai');
const expect = chai.use(chaiAsPromise).use(sinonChai).expect;


describe('Fake Linkedge test', () => {
    it('should return basic data value', () => {
        let {
            RESULT_SUCCESS,
            RESULT_FAILURE,
        } = require('../lib/fakelinkedge');
        expect(RESULT_SUCCESS).to.eql(0);
        expect(RESULT_FAILURE).to.eql(-1);
    });

    it('should resolve when Config.get() is called', () => {
        let {
            Config
        } = require('../lib/fakelinkedge');

        return expect(Config.get()).to.be.eventually.fulfilled;
    });

    it('should set correct thinginfo and device name after Config.get()', () => {
        let {
            Config
        } = require('../lib/fakelinkedge');

        Config.get()
            .then((config) => {
                // Get the device information from config, which contains product key, device
                // name, etc. of the device.
                const thingInfos = config.getThingInfos();
                const portName = config.getDriverInfo().json.portName;
                thingInfos.forEach((thingInfo) => {
                    //const thermometer = new Thermometer(thingInfo.custom.MeterSN, portName);//thingInfo.Config.custom.MeterSN);
                    // The Thing format is just right for connector config, pass it directly.
                    //const connector = new Connector(thingInfo, thermometer);
                    //connector.connect();
                    //console.log(thingInfo);
                    //console.log(portName);

                });
                expect(portName).to.be.eql('/dev/ttyS4');
                expect(thingInfos[0].custom.meterSn).to.be.eql('firstMeter');
            });

        return expect(Config.get()).to.be.eventually.fulfilled;
    });

    it('should create ThingAccessClient and Resolve Correct', () => {
        let {
            Config,
            ThingAccessClient
        } = require('../lib/fakelinkedge');
        Config.get()
            .then((config) => {
                const thingInfos = config.getThingInfos();
                const client = new ThingAccessClient(thingInfos[0], {
                    setProperties: (() => { }),
                    getProperties: (() => { }),
                    callService: (() => { }),
                });
                expect(client).to.be.instanceOf(ThingAccessClient);
                return expect(client.reportProperties({foo:'bar'})).to.be.eventually.eql({foo:'bar'});
            });
    });
});