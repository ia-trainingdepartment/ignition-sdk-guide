---
title: Edit Tags
---
This code example is intended to be run within Gateway scope, and assumes that the `GatewayContext` object is available. To run from a Designer or client, [see this guide to create an RPC object](/docs/programming-for-the-designer-client).

```js
private void editTag() throws Exception {
    IgnitionGateway context = IgnitionGateway.get();
    GatewayTagManager tagManager = context.getTagManager();
    TagProvider provider = tagManager.getTagProvider("default");  // Change tag provider name here as needed
 
    TagPath memoryTag0 = TagPathParser.parse("MemoryTag0");
 
    // MemoryTag0 will be the first item in the returned list. We get back a TagConfigurationModel
    // that we can modify and send back. Note that if MemoryTag0 doesn't actually exist, the TagConfigurationModel's
    // TagObjectType will be TagObjectType.Unknown.
    List<TagConfigurationModel> configs = provider.getTagConfigsAsync(Arrays.asList(memoryTag0), false, true).get(30, TimeUnit.SECONDS);
    TagConfigurationModel tagConfig = configs.get(0);
    if(TagObjectType.Unknown == tagConfig.getType()) {
        throw new Exception("MemoryTag0 edit configuration not found");
    }
 
    // Add some documentation to the tag
    tagConfig.set(WellKnownTagProps.Documentation, "Some documentation for MemoryTag0");
 
    // And now save the tag. Use the MergeOverwrite collision policy to merge in the documentation property but
    // keep other tag properties intact.
    List<QualityCode> results = provider.saveTagConfigsAsync(Arrays.asList(tagConfig), CollisionPolicy.MergeOverwrite).get(30, TimeUnit.SECONDS);
 
    for (int i = 0; i < results.size(); i++) {
        QualityCode result = results.get(i);
        if (result.isNotGood()) {
            throw new Exception(String.format("Edit tag operation returned bad result '%s'", result.toString()));
        }
    }
}
```