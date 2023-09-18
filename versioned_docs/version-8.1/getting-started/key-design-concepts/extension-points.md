---
title: Extension Points
sidebar_position: 4
---
The Extension Point system is a single, unified interface for extending various parts of the Ignition platform. Modules can provide new implementations of various abstract concepts with extension points. The Extension Point system is closely tied to the persistence and web interface system, reducing the amount of work required to expose and store configuration data.

## Current Extension Point Types
The following systems expose themselves as extension points, meaning that modules can provide new implementations of them:
* User Schedules
* Alarm Notification
* Audit logging
* Email providers
* OPC connections
* Tag history providers
* Tag providers
* User sources
* OPC UA module device

To get started building an extension point implementation, see [Extending Ignition with Extension Points](/docs/programming-for-the-gateway/extending-ignition-with-extension-points.md).