---
title: Create Tags
---
This code example is intended to be run within Gateway scope, and assumes that the `GatewayContext` object is available. To run from a Designer or client, [see this guide to create an RPC object](/docs/programming-for-the-designer-client).

```js
private void createTags() throws Exception {
    IgnitionGateway context = IgnitionGateway.get();
    GatewayTagManager tagManager = context.getTagManager();
    TagProvider provider = tagManager.getTagProvider("default");  // Change tag provider name here as needed
 
    List<TagConfiguration> newTagConfigs = new ArrayList<>();
 
    // Create a folder
    TagPath levelOneFolderA = TagPathParser.parse("LevelOne_FolderA");
    TagConfiguration tagConfig = BasicTagConfiguration.createNew(levelOneFolderA);
    tagConfig.setType(TagObjectType.Folder);
    newTagConfigs.add(tagConfig);
 
    // Create a simple memory tag
    TagPath memoryTag0 = TagPathParser.parse("MemoryTag0");
    tagConfig = BasicTagConfiguration.createNew(memoryTag0);
    tagConfig.setType(TagObjectType.AtomicTag);
    tagConfig.set(WellKnownTagProps.ValueSource, WellKnownTagProps.MEMORY_TAG_TYPE);
    tagConfig.set(WellKnownTagProps.DataType, DataType.Int4);
    tagConfig.set(WellKnownTagProps.Value, new BasicQualifiedValue(42));
    newTagConfigs.add(tagConfig);
 
    // Create a more complex memory tag, put it under LevelOne_FolderA
    TagPath memoryTag1 = TagPathParser.parse("LevelOne_FolderA/MemoryTag1");
    tagConfig = BasicTagConfiguration.createNew(memoryTag1);
    tagConfig.setType(TagObjectType.AtomicTag);
    tagConfig.set(WellKnownTagProps.ValueSource, WellKnownTagProps.MEMORY_TAG_TYPE);
    tagConfig.set(WellKnownTagProps.DataType, DataType.Int4);
    tagConfig.set(WellKnownTagProps.Value, new BasicQualifiedValue(1));
    tagConfig.set(WellKnownTagProps.Documentation, "This is MemoryTag1");
    tagConfig.set(WellKnownTagProps.Tooltip, "MemoryTag1 tooltip");
 
    // Alarm configuration
    AlarmConfiguration alarmConfig = new BasicAlarmConfiguration();
 
    AlarmDefinition alarmOneDefinition = new BasicAlarmDefinition();
    alarmOneDefinition.setName("HighValue");
    alarmOneDefinition.set(AlarmModeProperties.Mode, AlarmMode.AboveValue);
    alarmOneDefinition.set(AlarmModeProperties.SetpointA, 5.0d);
    alarmConfig.add(alarmOneDefinition);
 
    AlarmDefinition alarmTwoDefinition = new BasicAlarmDefinition();
    alarmTwoDefinition.setName("LowValue");
    alarmTwoDefinition.set(AlarmModeProperties.Mode, AlarmMode.BelowValue);
    alarmTwoDefinition.set(AlarmModeProperties.SetpointA, 1.0d);
    alarmConfig.add(alarmTwoDefinition);
    tagConfig.set(WellKnownTagProps.Alarms, alarmConfig);
 
    // Tag permissions
    Map<ZoneRole, Boolean> permissionsMap = new HashMap<>();
    TagPermissionsModel.ZoneRole zoneRole = new TagPermissionsModel.ZoneRole();
    zoneRole.setRole("Administrator");
    zoneRole.setZone("default");
    permissionsMap.put(zoneRole, true);
    BasicTagPermissions permissions = new BasicTagPermissions(permissionsMap);
    tagConfig.set(WellKnownTagProps.PermissionModel, permissions);
 
    // Tag event scripts
    TagEventScripts scripts = new BasicTagEventScripts();
    scripts.set("onValueChange", "print 'Hello World'");
    tagConfig.set(WellKnownTagProps.EventScripts, scripts);
 
    // Some custom tag properties
    Property<String> strProp = new BasicProperty<>("customStr", String.class);
    tagConfig.set(strProp, "Hello world");
 
    Property<Integer> intProp = new BasicProperty<>("customInt", Integer.class);
    tagConfig.set(intProp, 42);
 
    Property<Double> doubleProp = new BasicProperty<>("customDbl", Double.class);
    tagConfig.set(doubleProp, 3.1415d);
    newTagConfigs.add(tagConfig);
 
    // Create an expression tag
    TagPath expressionTag0 = TagPathParser.parse("ExpressionTag0");
    tagConfig = BasicTagConfiguration.createNew(expressionTag0);
    tagConfig.setType(TagObjectType.AtomicTag);
    tagConfig.set(WellKnownTagProps.DataType, DataType.DateTime);
    tagConfig.set(WellKnownTagProps.FormatString, "yyyy-MM-dd h:mm:ss aa");
    tagConfig.set(WellKnownTagProps.ValueSource, ExpressionTypeProperties.TAG_TYPE);
    tagConfig.set(ExpressionTypeProperties.Expression, "now(1000)");
 
    // Create a query tag
    TagPath queryTag0 = TagPathParser.parse("QueryTag0");
    tagConfig = BasicTagConfiguration.createNew(queryTag0);
    tagConfig.setType(TagObjectType.AtomicTag);
    tagConfig.set(WellKnownTagProps.DataType, DataType.DateTime);
    tagConfig.set(WellKnownTagProps.FormatString, "yyyy-MM-dd h:mm:ss aa");
    tagConfig.set(WellKnownTagProps.ValueSource, DBTagTypeProperties.TAG_TYPE);
    tagConfig.set(WellKnownTagProps.ExecutionMode, TagExecutionMode.TagGroupRate);  // Tag group will control the tag's execution
    tagConfig.set(DBTagTypeProperties.QueryType, SQLQueryType.Select);
    tagConfig.set(DBTagTypeProperties.QueryDatasource, "my_datasource");
    tagConfig.set(DBTagTypeProperties.Query, "select now()");
 
    // Create an OPC tag
    TagPath opcTag0 = TagPathParser.parse("OpcTag0");
    tagConfig = BasicTagConfiguration.createNew(opcTag0);
    tagConfig.setType(TagObjectType.AtomicTag);
    tagConfig.set(WellKnownTagProps.DataType, DataType.Float4);
    tagConfig.set(WellKnownTagProps.ValueSource, OpcTagTypeProperties.TAG_TYPE);
    tagConfig.set(OpcTagTypeProperties.OPCServer, "Ignition OPC UA Server");
    tagConfig.set(OpcTagTypeProperties.OPCItemPath, "ns=1;s=[GenericSimulator]_Meta:Writeable/WriteableFloat1");
 
    // Create simple UDT definition and add a memory tag
    TagPath tinyUdtDef = TagPathParser.parse("_types_/TinyUdtDef");
    tagConfig = BasicTagConfiguration.createNew(tinyUdtDef);
    tagConfig.setType(TagObjectType.UdtType);
    newTagConfigs.add(tagConfig);
 
    TagPath udtDefMember = TagPathParser.parse("_types_/TinyUdtDef/MemoryTagMember");
    tagConfig = BasicTagConfiguration.createNew(udtDefMember);
    tagConfig.setType(TagObjectType.AtomicTag);
    tagConfig.set(WellKnownTagProps.DataType, DataType.Int4);
    tagConfig.set(WellKnownTagProps.Value, new BasicQualifiedValue(1));
    newTagConfigs.add(tagConfig);
 
    // Create simple UDT instance
    TagPath udtInstance = TagPathParser.parse("TinyUdt_Instance");
    tagConfig = BasicTagConfiguration.createNew(udtInstance);
    tagConfig.setType(TagObjectType.UdtInstance);
    tagConfig.set(WellKnownTagProps.TypeId, "TinyUdtDef");
    newTagConfigs.add(tagConfig);
 
    CompletableFuture<List<QualityCode>> future =
        provider.saveTagConfigsAsync(newTagConfigs, CollisionPolicy.Abort);
 
    List<QualityCode> results = future.get(30, TimeUnit.SECONDS);
 
    for (int i = 0; i < results.size(); i++) {
        QualityCode result = results.get(i);
        if (result.isNotGood()) {
            throw new Exception(String.format("Add tag operation returned bad result for tag '%s'", newTagConfigs.get(i).getName()));
        }
    }
 
    newTagConfigs.clear();
 
    // Create another simple UDT instance and override the value of MemoryTagMember. Note how the udt definition
    // must first be created in the previous call. We supply the full path of a udt member and only provide the
    // properties that should be overridden.
    TagPath udtOverrideInstance = TagPathParser.parse("TinyUdt_OverrideInstance");
    tagConfig = BasicTagConfiguration.createNew(udtOverrideInstance);
    tagConfig.setType(TagObjectType.UdtInstance);
    tagConfig.set(WellKnownTagProps.TypeId, "TinyUdtDef");
    newTagConfigs.add(tagConfig);
 
    TagPath udtOverrideMember = TagPathParser.parse("TinyUdt_OverrideInstance/MemoryTagMember");
    tagConfig = BasicTagConfiguration.createNew(udtOverrideMember);
    tagConfig.set(WellKnownTagProps.Value, new BasicQualifiedValue(2));
    newTagConfigs.add(tagConfig);
 
    future =
        provider.saveTagConfigsAsync(newTagConfigs, CollisionPolicy.Abort);
 
    future.get(30, TimeUnit.SECONDS);
 
    for (int i = 0; i < results.size(); i++) {
        QualityCode result = results.get(i);
        if (result.isNotGood()) {
            throw new Exception(String.format("Add tag operation returned bad result for tag '%s'", newTagConfigs.get(i).getName()));
        }
    }
}
```
