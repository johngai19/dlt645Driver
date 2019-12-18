[English](README.md)|[中文](README-zh.md)

----

# dlt645Driver

This is a dlt645 Chinese intelligent power meter driver for Aliyun Iot Edge Gateway driver using WebSocket protocal. The driver is currently works well on Aliyun Iot Platform, you need to setup Aliyun Enviroment, connect Dlt meter on the serialport of linkedge gateway before using it.

## Operation Guide on Aliyun Iot Platform

See Aliyun [linkedge-thing-access-websocket_client_sdk](https://github.com/aliyun/linkedge-thing-access-websocket_client_sdk/blob/master/protocol-design-description.md?spm=a2c4g.11186623.2.11.7afd760b9SsoxB&file=protocol-design-description.md) for the protocal details to connect device with Aliyun Linkedge Gateway.

Currently the Driver only support "onlineDevice","reportProperty" and "getProperty" methods, the rest methods are to be updated.

First of all,you need to create a DLT product and devices on [aliyun Iot platform](https://help.aliyun.com/document_detail/73705.html?spm=a2c4g.11174283.2.11.3a8b1668L08yIP).See [model.json](src/model.json) for detailed product properties. 

To use this driver you need to install an Aliyun Linkedge Gate way following [Official Instruction](https://help.aliyun.com/document_detail/102729.html?spm=a2c4g.11186623.6.560.18ab760b5ENITn), and [deploy a WebSocket driver](https://help.aliyun.com/document_detail/122583.html?spm=a2c4g.11186623.6.574.119c71b8bCk3oA).Currently the driver is tested only under Unbuntu 18.04 platform.

## To Use

1. In [config.json](src/config.json), setup the serialport information as well as the dlt meters. If you are using linux **portName** field just fill like ttyS1 or ttyUSB1 the driver will parse it to /dev/ttyS1, otherwise in windows just use COM1,COM2 (not testified).

2. If you have changed default aliyun WebSocket server (ip address and port number), update [server.json](src/server.json) file. Currently TLS support is not available.

3. If you want to support more DLT 645 properties, update the [model.json](src/model.json)  file, please be sure to modify the propertyCode in [dltparser](src/dltparser.js) too so as the driver can parse relative property properly.

## To develop

Use Nodejs V8.16.2

Pull request is welcome to add more features.

See [docs](out/index.html) for development information.

**Todo List**
- More Dlt645 properties support
- Dlt645 Block property support
- Write property and modify dlt parameter function support
- Aliyun Linkedge setProperty,reportEvent function support
- Aliyun Linkedge callService function support
- Mock serialport function for test
- Mock WebSocket server for test
- Local Dlt 645 debugger
- Local Web debug interface





