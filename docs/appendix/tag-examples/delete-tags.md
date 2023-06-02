---
title: Delete Tags
---

```js
// This code example is Gateway scoped and assumes the `GatewayContext` object is available.
private void deleteTags() throws Exception {
    IgnitionGateway context = IgnitionGateway.get();
    GatewayTagManager tagManager = context.getTagManager();
    TagProvider provider = tagManager.getTagProvider("default");  // Change tag provider name here as needed
 
    List<TagPath> toDelete = new ArrayList<>();
    TagPath levelOne_FolderA = TagPathParser.parse("LevelOne_FolderA");
    toDelete.add(levelOne_FolderA);
    TagPath tinyUdtOverrideInstance = TagPathParser.parse("TinyUdt_OverrideInstance");
    toDelete.add(tinyUdtOverrideInstance);
 
    List<QualityCode> results = provider.removeTagConfigsAsync(toDelete)
        .get(30, TimeUnit.SECONDS);
 
    for (int i = 0; i < results.size(); i++) {
        QualityCode result = results.get(i);
        if (result.isNotGood()) {
            TagPath tagPath = toDelete.get(i);
            throw new Exception(String.format("Delete tag operation for tag '%s' returned bad result '%s'",
                tagPath.toStringFull(), result.toString()));
        }
    }
}
```