---
title: Request Tag Group Execution
---


```js
// This code example is Gateway scoped and assumes the `GatewayContext` object is available.
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