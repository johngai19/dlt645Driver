[English](README.md)|[中文](README-zh.md)

---
# Dlt645驱动说明

本项目是阿里云物联网边缘计算网关驱动，用于中国电力标准DLT645智能电表. 目前驱动仅支持Aliyun 物联网平台，符合阿里云边缘网关WebSocket协议。
可以通过串口连接并采集多个Dlt电表数据(同一串口下，暂不支持多串口)并转换为阿里云边缘网关WebSocket协议。使用前应先连接好Dlt电表与串口。(本地
调试工具开发中)。


## 阿里云物联网平台操作指南

边缘计算网关详细的WebSocket协议见阿里云官网SDK [linkedge-thing-access-websocket_client_sdk](https://github.com/aliyun/linkedge-thing-access-websocket_client_sdk/blob/master/protocol-design-description.md?spm=a2c4g.11186623.2.11.7afd760b9SsoxB&file=protocol-design-description.md) 。

目前仅支持 "onlineDevice","reportProperty" 和 "getProperty" 方法，更多方法待开发。

使用前需要在[阿里云物联网平台](https://help.aliyun.com/document_detail/73705.html?spm=a2c4g.11174283.2.11.3a8b1668L08yIP)新建产品和设备.新建产品参考模型见项目文件 [model.json](src/model.json). 

需要安装[阿里云边缘计算网关程序(https://help.aliyun.com/document_detail/102729.html?spm=a2c4g.11186623.6.560.18ab760b5ENITn), 并[部署WebSocket驱动](https://help.aliyun.com/document_detail/122583.html?spm=a2c4g.11186623.6.574.119c71b8bCk3oA).驱动目前仅在Unbuntu 18.04 平台下测试.

## 使用指南

1. 在[config.json](src/config.json), 文件内设置串口及dlt电表对应参数. 如果网关环境为linux **portName** 部分只需要填写 ttyS1 或者ttyUSB1 ，驱动可以自动解析为 /dev/ttyS1, windows下直接写COM1,COM2 (未测试验证).

2. 如果修改了阿里云边缘网关驱动默认参数 (ip地址或者端口), 在 [server.json](src/server.json) 文件修改相应内容。

3. 如果要增加更多的Dlt645电表参数(协议支持的), 更新 [model.json](src/model.json) 文件，并且修改[dltparser](src/dltparser.js) 参数以确保变量正确解析。目前还不支持块数据读写。

## 开发

使用Nodejs V8.16.2

欢迎Pull Request来修改和增加更多功能。

[开发文档](out/index.html) 包含了更多细节内容。

**待办事项**
- 更多DLT645属性参数支持
- 块读取功能支持
- 写参数、修改变量功能支持
- 阿里云边缘网关自动上报事件功能支持
- 阿里云边缘网关服务功能支持
- 虚拟串口测试程序
- WebSocket协议测试程序
- 本地Dlt驱动调试助手
- 本地网页化服务界面用于驱动调试及监控
