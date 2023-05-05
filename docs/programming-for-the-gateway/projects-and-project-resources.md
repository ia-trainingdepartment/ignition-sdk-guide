---
title: Projects and Project Resources
sidebar_position: 3
---

Beyond system-wide configuration data, the most common data used by modules is project-based resource data. Project resources are usually created through the Designer and are identified by their **resource type** and **module id**. When a module defines a new project resource, it will define the resource type. 

Most commonly, modules will want to load specific types of resources at a time. This can be accomplished with the `Project.getResourcesOfType()` function.

Once the project resource is retrieved, the data can be accessed through `ProjectResource. getData()`.
When deserializing, it is important to use the deserializer created by `GatewayContext.createDeserializer()`. Do not create your own XMLDeserializer.

Modules can add a `ProjectListener` to the `ProjectManager` in order to be notified when a project is added, removed, or modified.

It's important to realize that the Project class serves a variety of purposes. It can be a fully loaded project, but can also represent a subset of a project, or simply the structure, without resource data actually present.