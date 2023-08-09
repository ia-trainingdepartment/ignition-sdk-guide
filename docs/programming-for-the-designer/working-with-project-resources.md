---
title: Working With Project Resources
sidebar_position: 1
---

## Project Resource - Common
As a general pattern, your actual definition of a resource class should ideally be stored in a common scope, so that it can be serialized and deserialzed on the Gateway and in the Designer. You should also define a `ResourceType` that can be reused in dependent scopes. The `ResourceType` is a tuple of your module's ID and a unique ID for the actual resource type.

<!---
Code Example/Snippets
--->

## Project Resource - Designer
In the Designer scope, you will register your resource orkspace and a project browser node. It is generally recommended to subclass [`TabbedResourceWorkspace`](/docs/programming-for-the-designer/building-a-workspace.md#tabbed-resource-workspace) to give end users the most familiar editing paradigm. `TabbedResourceWorkspace` will automatically create instances of your `ResourceEditor` subclass and manage bookkeeping for you.

<!---
Code Example/Snippets
--->

## Project Resource - Gateway
On the Gateway, we register a new `ProjectLifecycleFactory` that will automatically handle the bookeeping for restarting out long-lived Gateway class whenever the project or project resources change.

<!---
Code Example/Snippets
--->