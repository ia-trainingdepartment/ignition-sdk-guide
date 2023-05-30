---
title: OPC UA Driver Development
sidebar_position: 8
---
The OPC UA server provided by Ignition is modular and supports extension through the Device API system. With the API, you can create new drivers that pull data from any source and expose it through OPC UA. Any compliant OPC UA client will then be able to consume the provided data.

Developing a driver can be somewhat involved, but there are a variety of useful base classes that cover some common scenarios. See the [OPC UA device example](https://github.com/inductiveautomation/ignition-sdk-examples/tree/master/opc-ua-device) for more details. 

## Development Guide

### Define the Driver’s Settings

By extending the PersistentRecord class, you can define any configurable properties your driver needs to present to the user, as well as a few pieces of metadata that are displayed in the Ignition Gateway when editing or creating a new device. For reference, some example device settings are encapsulated in [ExampleDeviceSettings](https://github.com/inductiveautomation/ignition-sdk-examples/blob/master/opc-ua-device/opc-ua-device-gateway/src/main/java/com/inductiveautomation/ignition/examples/tagdriver/configuration/settings/ExampleDeviceSettings.java). You can create as many settings as you want, and once created, you can then query the record from the other class to use these settings in meaningful ways for your driver. 

Note that the [valueSimulator](https://github.com/inductiveautomation/ignition-sdk-examples/blob/master/opc-ua-device/opc-ua-device-gateway/src/main/java/com/inductiveautomation/ignition/examples/tagdriver/configuration/ValueSimulator.java) is specific to the provided device example as a way to prove out how updates and communication between the OPC UA server and a driver should function. Your device will have a set of classes to get returns and therefore does not need a simulator. 

### Define a Device Type

The DeviceType class is one of the base extension point type classes from which all drivers must extend. Defining a device type will allow you to create new device instances, as well as bridge the gap between the Gateway and your driver’s settings.

A user override to consider implementing is `getStatus`, which tells the connection what state it should be in. Required state is determined by the developer based on module requirements.


### Create a Gateway Module Hook

It's recommended to utilize the partial implementation of a driver's GatewayModuleHook in the [AbstractDeviceModuleHook](https://github.com/inductiveautomation/ignition-sdk-examples/blob/master/opc-ua-device/opc-ua-device-gateway/src/main/java/com/inductiveautomation/ignition/examples/tagdriver/ModuleHook.java). This class takes care of all the details for registering and unregistering. Subclasses only need to provide a `List<DeviceType>` to register. 

Creating a Gateway Module hook will also allow you to register your driver with the Driver Manager, and enforce licensing and API version compatibility. It’s recommended to add licensing checks to ensure your driver will not run if not licensed and set up license management here as well. 

Further ModuleHook considerations include `mountRouteHandlers` and `isMakerEditionCompatible`. If there are additional pages you want populated on the Gateway for expansion or increased customization to your driver, like an Addressing page, `mountRouteHandlers` ensures that these are installed when your module is installed. If you are using Maker Edition, `isMakerEditionCompatible` will allow your driver to start up on Maker Edition. 


### Implement the DeviceInterface

All OPC-UA drivers must implement the Device interface. This interface defines the basic functionality any driver must provide. Reading and writing apply to most all drivers as core functionality. How your interface is defined for these functions depends on your driver protocol and PLC optimization.  

Other functionality like browsing, subscription management, and life cycle/state management and further dependent on PLC support. For example, some devices require users to manually input requests instead of allowing browsing capabilities. Browsing in this context refers to sending device requests.

If you are looking to implement subscription management, be mindful that the `SubscriptionModel` needs to be overridden by the developer to work properly. The typical setup has the OPC UA server telling a driver when a tag has been added and is now subscribing at a one second rate. The override in the code enables the module to react through the override to all tag changes provided by the OPC UA server instead. The `SubscriptionModel` setup for the [example device](https://github.com/inductiveautomation/ignition-sdk-examples/blob/master/opc-ua-device/opc-ua-device-gateway/src/main/java/com/inductiveautomation/ignition/examples/tagdriver/ExampleDevice.java) defines how the tags are subscribed, when they update, and the nodes that need to be updated and refreshed.

### Adding Nodes to the OPC UA Server

The concept of adding a node to the OPC UA server means it is now exposed and browsable. If nodes are not added to the OPC UA server, they will not be recognized by Ignition. The process of how to add nodes is shown in the example device code below:
  
    private void addDynamicNodes(UaFolderNode rootNode) {
        String name = "dynamic";
        UaFolderNode folder = new UaFolderNode(
            getNodeContext(),
            deviceContext.nodeId(name),
            deviceContext.qualifiedName(name),
            new LocalizedText(name)
        );
        getNodeManager().addNode(folder);

        // addOrganizes is just a helper method to an OPC UA "Organizes" references to a folder node
        rootNode.addOrganizes(folder);

        for (int i = 0; i < settings.getTagCount(); i++) {
            String formattedName = String.format("%s%d", name, i);
            UaVariableNode node = UaVariableNode.builder(getNodeContext())
                .setNodeId(deviceContext.nodeId(String.format("%s/node%d", formattedName, i)))
                .setBrowseName(deviceContext.qualifiedName(formattedName))
                .setDisplayName(new LocalizedText(formattedName))
                .setDataType(BuiltinDataType.UInt32.getNodeId())
                .setTypeDefinition(Identifiers.BaseDataVariableType)
                .setAccessLevel(AccessLevel.READ_ONLY)
                .setUserAccessLevel(AccessLevel.READ_ONLY)
                .build();

            // just tells our simulator to keep track of this node
            simulator.addTrackedValue(formattedName, i);

            // an AttributeFilter is used so that when this node is asked for its value, it will call out to the
            // simulator
            node.getFilterChain().addLast(AttributeFilters.getValue(
                getAttributeContext ->
                    simulator.getTrackedValue(formattedName))
            );

            getNodeManager().addNode(node);
            folder.addOrganizes(node);
        }
    }

