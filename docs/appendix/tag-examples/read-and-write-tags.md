---
title: Read and Write Tags
---
This code example is intended to be run within Gateway scope, and assumes that the `GatewayContext` object is available. To run from a Designer or client, [see this guide to create an RPC object](/docs/programming-for-the-designer).

```js
private void writeReadTagValue() throws Exception {
    IgnitionGateway context = IgnitionGateway.get();
    GatewayTagManager tagManager = context.getTagManager();
    TagProvider provider = tagManager.getTagProvider("default");  // Change tag provider name here as needed
 
    TagPath memoryTag0 = TagPathParser.parse("MemoryTag0");
    QualifiedValue newQv = new BasicQualifiedValue(43);
 
    // Write out a new value. Note that we are using SecurityContext.emptyContext(), as we are not working with
    // user roles or security zones in this example.
    List<QualityCode> results = provider.writeAsync(Arrays.asList(memoryTag0), Arrays.asList(newQv), SecurityContext.emptyContext()).get(30, TimeUnit.SECONDS);
 
    QualityCode qc = results.get(0);
    if(qc.isNotGood()) {
        throw new Exception(String.format("Write tag value operation returned bad result '%s'", qc.toString()));
    }
 
    // Read the updated value
    List<QualifiedValue> values = provider.readAsync(Arrays.asList(memoryTag0), SecurityContext.emptyContext())
        .get(30, TimeUnit.SECONDS);
    QualifiedValue qv = values.get(0);
    if(qv.getQuality().isNotGood()) {
        throw new Exception(String.format("MemoryTag0 cannot be read, quality=" + qv.getQuality().toString()));
    } else {
        String qvValue = qv.getValue() != null ? qv.getValue().toString(): "null";
        // logger.infof("MemoryTag0 value='%s'", qvValue);
    }
}
 
private void writeReadTagProperty() throws Exception {
    IgnitionGateway context = IgnitionGateway.get();
    GatewayTagManager tagManager = context.getTagManager();
    TagProvider provider = tagManager.getTagProvider("default");  // Change tag provider name here as needed
 
    TagPath memoryTag1Doc = TagPathParser.parse("LevelOne_FolderA/MemoryTag1." + WellKnownTagProps.Documentation.getName());
    QualifiedValue newQv = new BasicQualifiedValue("Updated documentation for MemoryTag1");
 
    // Write out the tag property. Note that we are using SecurityContext.emptyContext(), as we are not working with
    // user roles or security zones in this example.
    List<QualityCode> results = provider.writeAsync(Arrays.asList(memoryTag1Doc), Arrays.asList(newQv), SecurityContext.emptyContext()).get(30, TimeUnit.SECONDS);
 
    QualityCode qc = results.get(0);
    if (qc.isNotGood()) {
        throw new Exception(String.format("Write tag property operation returned bad result '%s'", qc.toString()));
    }
 
    // Read the tag property.
    List<QualifiedValue> values = provider.readAsync(Arrays.asList(memoryTag1Doc), SecurityContext.emptyContext())
        .get(30, TimeUnit.SECONDS);
    QualifiedValue qv = values.get(0);
    if (qv.getQuality().isNotGood()) {
        throw new Exception(String.format("MemoryTag1.documentation cannot be read, quality=" + qv.getQuality().toString()));
    } else {
        String qvValue = qv.getValue() != null ? qv.getValue().toString(): "null";
        // logger.infof("MemoryTag1 documentation='%s'", qvValue);
    }
}
 
private void writeReadUdtParameter() throws Exception {
    IgnitionGateway context = IgnitionGateway.get();
    GatewayTagManager tagManager = context.getTagManager();
    TagProvider provider = tagManager.getTagProvider("default");  // Change tag provider name here as needed
 
    TagPath udtParam = TagPathParser.parse("BasicUDT_OverrideInstance0/parameters/MyParam");
    QualifiedValue newQv = new BasicQualifiedValue("Updated param for Basic UDT override instance");
 
    // Write out the udt parameter. Note that we are using SecurityContext.emptyContext(), as we are not working with
    // user roles or security zones in this example.
    List<QualityCode> results = provider.writeAsync(Arrays.asList(udtParam), Arrays.asList(newQv), SecurityContext.emptyContext()).get(30, TimeUnit.SECONDS);
 
    QualityCode qc = results.get(0);
    if (qc.isNotGood()) {
        throw new Exception(String.format("Write udt parameter operation returned bad result '%s'", qc.toString()));
    }
 
    List<QualifiedValue> values = provider.readAsync(Arrays.asList(udtParam), SecurityContext.emptyContext())
        .get(30, TimeUnit.SECONDS);
    QualifiedValue qv = values.get(0);
    if (qv.getQuality().isNotGood()) {
        throw new Exception(String.format("BasicUDT_OverrideInstance0/MyParam cannot be read, quality=" + qv.getQuality().toString()));
    } else {
        String qvValue = qv.getValue() != null ? qv.getValue().toString() : "null";
        // logger.infof("BasicUDT_OverrideInstance0 MyParam ='%s'", qvValue);
    }
}
```