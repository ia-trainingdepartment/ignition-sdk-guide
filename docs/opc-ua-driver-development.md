---
title: OPC UA Driver Development
sidebar_position: 3
---

The OPC UA server provided by Ignition is in itself modular and supports extension through the Device API system. With the API, you can create new drivers that pull data from any source, and expose it through OPC UA, without having to worry about the details of the OPC UA specification. Any compliant OPC UA client will then be able to consume the provided data. 

Developing a driver can be somewhat involved, but there are a variety of useful base classes that cover some common scenarios. See the [OPC UA device example](https://github.com/inductiveautomation/ignition-sdk-examples/tree/master/opc-ua-device) for more details. 

## Development Guide

### Define the Driver’s Settings

By extending the PersistentRecord class, you can define any configurable properties your driver needs to present to the user, as well as a few pieces of metadata that are displayed in the Ignition Gateway when editing or creating a new device. 

### Define a Device Type

The DeviceType class is one of the base extension point type classes from which all drivers must extend. Defining a device type will allow you to create new device instances, as well as bridge the gap between the Gateway and your driver’s settings.

### Create a Gateway Module Hook

It's recommended to utilize the partial implementation of a driver's GatewayModuleHook in the [AbstractDeviceModuleHook](https://github.com/inductiveautomation/ignition-sdk-examples/blob/master/opc-ua-device/opc-ua-device-gateway/src/main/java/com/inductiveautomation/ignition/examples/tagdriver/ModuleHook.java). This class takes care of all the details for registering and unregistering. Subclasses only need to provide a `List<DeviceType>` to register. 

Creating a Gateway Module Hook will also allow you to register your driver with the Driver Manager, and enforce licensing and API version compatibility.

### Implement the DeviceInterface

All OPC-UA drivers must implement the Device interface. This interface defines the basic functionality any driver must provide, such as reading, writing, browsing, subscription management, and life cycle/state management. 
