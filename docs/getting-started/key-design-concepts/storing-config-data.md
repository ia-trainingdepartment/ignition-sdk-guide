---
title: Storing Configuration Data
sidebar_position: 2
---
There are several ways to store configuration data (as opposed to process data) in Ignition, depending on what the data represents and how it is used. The majority of data will be stored in the **Ignition Internal Database**, an embedded database that is managed by the platform, though in special cases it is necessary to store data directly to disk.

## The Internal Database
Nearly all configuration data is stored in the internal database. This database is automatically replicated through the redundancy system, and provides a host of benefits over traditional file based storage.

Furthermore, there are several helpful abstractions built on this system that make it very easy to perform common tasks like store and retrieve settings, project resources, etc. 
Ultimately, it is very unlikely that you will ever interact directly with the internal database though a SQL connection.

### The PersistentRecord ORM system
Ignition includes a simple, but highly functional, ORM (object-relation-management) system, making it very easy to store and retrieve data. This system manages the creation and maintenance of tables, while still providing a high level of advanced accessibility. The `PersistentRecord` system is most often used directly for storing module configuration data and other information that is global to the server, that is, not part of a project.

### The ProjectResource system
Project data is handled through the project management system (`ProjectManager` in the Gateway context), which in turn uses the `PersistentRecord` system mentioned above. The project management system makes it trivial for a module to store and retrieve any type of data required for operation, as long as it makes sense that the data should be local to a project. It's important to remember that a system may have multiple projects running at once, and a project might be cloned and run multiple times. The project management system also provides facilities for resource change history, multi-staged resource lifecycles (staged vs. published resources), and the option to protect resources from modification once deployed such as the runtime lock feature.


## Disk Based Storage
It is occasionally necessary to store data directly to the Gateway's hard drive. This is possible by creating files and folders under the Gateway directory, but it's important to realize that the data in these files will not be included in project exports, database backups, or transferred to redundant nodes. However, it is these traits exactly that may make storing directly to disk attractive.

Currently there are only a few pieces of Ignition that store data in this way: 
* Redundancy settings
* Alert state cache
* Several drivers' tag data caches


In general, you will want to store data under `GatewayContext.getHome()`, which is the home data directory for Ignition. However, if the data is temporary and only pertains to the current running session (in other words, should be cleared on gateway restart), you can store to `GatewayContext.getTempDir()`.