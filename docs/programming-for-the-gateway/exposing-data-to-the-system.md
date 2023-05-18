---
title: Exposing Data to the System
sidebar_position: 3
---
Many modules, in one way or another, generate data that should be exposed to the rest of the system. In fact, in many cases, this is the very purpose of the module: to communicate with some device or source, and expose the data. In other cases, you might have statistical or diagnostic information you want to make available. In all cases, you likely want to allow the user to take advantage of standard platform features like alerting, history, etc.

## Exposing Data Through OPC-UA
Benefits:
* Data can be consumed by any OPC-UA client, not just Ignition.
* Data can be used in various ways through the system, and multiple times. For example, multiple SQLTags can be made that each address the same data point, but with different configurations (alerting, for instance).
* Better support for manual-read operations. Most parts of Ignition allow the selection of Subscribed or Read mode for OPC data, giving drivers additional power to only read on-demand.
* As a driver, you can expose settings and configuration for your "device". 

Negatives:
* In order to use the data, the user will have to add a device, browse, and (most commonly) drag the tags into SQLTags. Depending on the data, this workflow may not be desirable.
* The user will be able to create multiple instances of the driver, which may not be desirable. 
* To expose data through OPC-UA, you will write a driver against the Driver API (a sub API of the module SDK). To get started, see the section OPC-UA Driver Development. 

## Exposing Data Through SQLTags

Benefits:
* Generally easier than writing a driver
* Data will be displayed under a custom tag provider name, directly in the SQLTags browser. The user will not be required to import tags.
* Easily take advantage of core SQLTag features like alerting and history. 

Negatives:
* Users will not be able to create multiple instances of the tags. 
* The data cannot be used externally, through OPC or External SQLTags*

**NOTE:** Both of the situations listed under Negative may be possible with 3rd party modules.

There are two ways to expose data through SQLTags: write your own TagProvider and register it with the SQLTags system, or use the SimpleTagProvider helper class.

## The SimpleTagProvider

The SimpleTagProvider is a helper class that is designed to let you expose data through SQLTags with as little difficulty as possible. Its simplicity allows you to expose data extremely quickly, while still allowing a fair amount of flexibility and power. It wraps up the process of creating a custom provider that supports all core SQLTags features (alerting, scaling, history, etc), without requiring any tedious code on your part.
 
**NOTE:** The features of the SimpleTagProvider are documented in more detail in the JavaDocs for the class, and on the related classes, such as TagEditingFlags. 

### Getting Started

Creating a custom provider with the SimpleTagProvider is as easy as instantiating the class and calling startup(). After that, you can call updateValue() to implicitly create a tag, and set its value. Any time you want the value to change, just call updateValue again:

```JSON
SimpleTagProvider provider = new SimpleTagProvider("MyProvider"); //gatewayContext will come from the scope that we're in- for example, from the startup function of our module
```

```JSON
provider.startup(gatewayContext);
//This will create the tag,and set the value to the current time. provider.updateValue("StartupTime", new Date(),DataQuality.GOOD_DATA);
```

That's it! In the Designer, you'll now find a new provider called "MyProvider" (under the "All Providers" folder), with the tag and startup time value. At this point, however, the tag will not be editable, and the user will not be allowed to alert, historize, etc.

### Setting Tag Capabilities

The range of features that the tags in the SimpleTagProvider are allowed to use is configurable by the module writer. By calling configureTagType(), you can define a new "type" of tag, and specify what features it supports. Then, you can associate the tags with that type by calling configureTag ().
This example will enable all of the standard features on our "StartupTime" tag:

```JSON
ExtendedTagType ourType = new CustomTagType(0); provider.configureTagType(ourType, TagEditingFlags.STANDARD_STATUS, null);
provider.configureTag("StartupTime", DataType.DateTime, ourType);
```

### Handling Tag Writes
Tags defined through the simple tag provider can support writing, as well, through the WriteHandler mechanism. The module registers a hander for each tag path that it wants to support writing, and the handler is called when a write is requested. The same handler can be used for multiple paths, as the path will be passed in with the event:

```JSON
provider.updateValue("ResetSystem",0, DataQuality.GOOD_DATA); provider.registerWriteHandler("ResetSystem", new WriteHandler() {
    @Override
    public Quality write(TagPath target, Object value) {

    ...execute write/do stuff... 

    return DataQuality.GOOD_DATA;
    }
});
```

## Exposing Gateway Status Data

The Gateway status tags (that appear under System/Gateway in the SQLTags system) are driven by a system based on the SimpleTagProvider, hosted in the SQLTagsManager. Thus, any module can add additional status tags to the system. To do this, simply get the GatewaySystemTags provider with SQLTagsManager.getSystemTags(), and use the techniques outlined above.
