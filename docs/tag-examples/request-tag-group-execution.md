---
title: Request Tag Group Execution
---
This code example is intended to be run within Gateway scope, and assumes that the `GatewayContext` object is available. To run from a Designer or client, [see this guide to create an RPC object](/docs/programming-for-the-designer-client).

```js
private void triggerTagGroupExecution() {
    IgnitionGateway context = IgnitionGateway.get();
    GatewayTagManager tagManager = context.getTagManager();
    TagProvider provider = tagManager.getTagProvider("default");  // Change tag provider name here as needed
 
    // Requests an extra execution of the Default tag group
    if(provider instanceof ProviderContext) {
        TagGroupManager groupManager = ((ProviderContext) provider).getTagGroupManager();
        groupManager.requestExecution("Default");
    }
}
```