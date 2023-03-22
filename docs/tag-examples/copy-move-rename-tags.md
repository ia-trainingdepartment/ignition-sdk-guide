---
title: Copy, Move, and Rename Tags
---
This code example is intended to be run within Gateway scope, and assumes that the `GatewayContext` object is available. To run from a Designer or client, [see this guide to create an RPC object](/docs/programming-for-the-designer).

```js
private void copyMoveRenameTag() throws Exception {
    IgnitionGateway context = IgnitionGateway.get();
    GatewayTagManager tagManager = context.getTagManager();
 
    // We are going thru the GatewayTagManager rather than a specific tag provider, so we must add the provider name
    // to the front of the path.
    TagPath memoryTag1 = TagPathParser.parse("[default]LevelOne_FolderA/MemoryTag1");
    TagPath destination = TagPathParser.parse("[default]LevelOne_FolderA");
 
    // Make a copy of LevelOne_FolderA/MemoryTag1
    List<QualityCode> results = tagManager.moveTagsAsync(Arrays.asList(memoryTag1), destination, true, CollisionPolicy.Rename).get(30, TimeUnit.SECONDS);
 
    QualityCode qc = results.get(0);
    if (qc.isNotGood()) {
        throw new Exception(String.format("Copy operation returned bad result '%s'", qc.toString()));
    }
 
    // Now move the newly copied tag to the root
    TagPath memoryTag2 = TagPathParser.parse("[default]LevelOne_FolderA/MemoryTag2");
    destination = TagPathParser.parse("[default]");
 
    results = tagManager.moveTagsAsync(Arrays.asList(memoryTag2), destination, false, CollisionPolicy.Abort).get(30, TimeUnit.SECONDS);
    qc = results.get(0);
    if (qc.isNotGood()) {
        throw new Exception(String.format("Move operation returned bad result '%s'", qc.toString()));
    }
 
    // Finally, rename MemoryTag2 to RootMemoryTag1
    memoryTag2 = TagPathParser.parse("[default]MemoryTag2");
    results = tagManager.renameTag(memoryTag2, "RootMemoryTag1", CollisionPolicy.Abort)
        .get(30, TimeUnit.SECONDS);
 
    qc = results.get(0);
    if (qc.isNotGood()) {
        throw new Exception(String.format("Rename operation returned bad result '%s'", qc.toString()));
    }
}
```