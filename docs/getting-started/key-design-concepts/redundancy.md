---
title: Redundancy
sidebar_position: 5
draft: false
---
Ignition supports redundancy, in which two gateways share configuration, and only one is active at a given time. It is crucial that module developers consider early on in the development process how this affects their module. 

There are two main aspects that must be examined: configuration and runtime. 

Generally, only modules that operate in the Gateway scope need to be concerned with redundancy. Client and Designer modules will usually not need to know the state of the gateway they're connected to.

The specific aspects of dealing with redundancy will be highlighted as they arise in other sections. This is only intended to lay out the scope of what you, the developer, must keep in mind when designing a module.

## Configuration
For redundancy to work correctly, it is crucial that the two Gateway nodes have the same information in their configuration databases. Configuration is synchronized from the master to the backup node as quickly as possible, in the form of incremental updates. If an error occurs or a mis-match is detected, a full Gateway backup is sent from the master.

Anything that a module stores in the internal database must be sent across to the backup node. Conveniently, when using the [`PersistentRecord` system](/docs/programming-for-the-gateway/storing-data-with-persistantrecords.md), this is handled automatically. Other changes can be duplicated to the backup through the `RedundancyManager` in the Gateway. Using that system, any operation that would change the internal database is executed as a runnable and, on success, is sent across and executed on the backup.

## Runtime
The runtime considerations for redundancy come in two forms: runtime operation and runtime state. 

**Runtime operation** is how the module acts according to the current redundancy state. There are several aspects of redundancy that must be addressed, such as the meaning between **cold**, **warm** and **active**, and how historical data is treated. Your module can subscribe to updates about the current redundant state and respond accordingly. 

The second category of concern is **runtime state**. This is the current operating state of your module, and is the information that the module would need to begin running at the same level on the backup node, if failover should occur. In many cases, modules can just start up again and recreate this, but if not, it is possible to register handlers to send and receive this runtime state data across the redundant network. 

For example, in the alerting system in Ignition, alert messages are sent through the runtime state system, so that on failover the current states, including acknowledgements, are accurate. In this case, if the data was just recreated, it would not have the acknowledgement information, and would likely result in new notifications being sent.