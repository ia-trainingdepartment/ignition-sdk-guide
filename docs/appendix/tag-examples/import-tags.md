---
title: Import Tags
---
This code example is intended to be run within Gateway scope, and assumes that the `GatewayContext` object is available. To run from a Designer or client, [see this guide to create an RPC object](/docs/programming-for-the-designer).

```js
private void importTags() throws Exception {
    IgnitionGateway context = IgnitionGateway.get();
    GatewayTagManager tagManager = context.getTagManager();
    TagProvider provider = tagManager.getTagProvider("default");  // Change tag provider name here as needed
 
    // Note that it is normally better to import tag json from a File object. We are using Strings here to keep
    // the example simple.
    String basicUdtDef = getUdtDefImport();
    String udtInstances = getUdtInstancesImport();
 
    // Import the definition first
    TagPath importPath = TagPathParser.parse("_types_");
    // Using the Ignore collision policy here to make sure we don't accidentally overwrite existing tags.
    List<QualityCode> results = provider.importTagsAsync(importPath, basicUdtDef, "json", CollisionPolicy.Ignore).get(30, TimeUnit.SECONDS);
 
    for (int i = 0; i < results.size(); i++) {
        QualityCode result = results.get(i);
        if (result.isNotGood()) {
            throw new Exception(String.format("Add tag operation returned bad result '%s'", result.toString()));
        }
    }
 
    // Then import the instances. Note that if the UDT definitions and instances are in the same tag json import file, then we
    // don't need to perform two separate imports.
    importPath = TagPathParser.parse("");
    results = provider.importTagsAsync(importPath, udtInstances, "json", CollisionPolicy.Ignore)
        .get(30, TimeUnit.SECONDS);
 
    for (int i = 0; i < results.size(); i++) {
        QualityCode result = results.get(i);
        if (result.isNotGood()) {
            throw new Exception(String.format("Add tag operation returned bad result '%s'", result.toString()));
        }
    }
}
 
private String getUdtDefImport() {
    return "{\n"
        + "  \"dataType\": \"Int4\",\n"
        + "  \"name\": \"BasicUDTDef\",\n"
        + "  \"value\": 0,\n"
        + "  \"parameters\": {\n"
        + "    \"MyParam\": \"paramval\",\n"
        + "    \"MyIntegerParam\": -1.0\n"
        + "  },\n"
        + "  \"tagType\": \"UdtType\",\n"
        + "  \"tags\": [\n"
        + "    {\n"
        + "      \"eventScripts\": [\n"
        + "        {\n"
        + "          \"eventid\": \"valueChanged\",\n"
        + "          \"script\": \"\\tprint \\\"Value changed!\\\"\"\n"
        + "        }\n"
        + "      ],\n"
        + "      \"valueSource\": \"memory\",\n"
        + "      \"dataType\": \"Int4\",\n"
        + "      \"name\": \"MemberEventScriptTag\",\n"
        + "      \"value\": 10,\n"
        + "      \"tagType\": \"AtomicTag\"\n"
        + "    },\n"
        + "    {\n"
        + "      \"name\": \"UdtFolderLevelOne\",\n"
        + "      \"tagType\": \"Folder\",\n"
        + "      \"tags\": [\n"
        + "        {\n"
        + "          \"valueSource\": \"memory\",\n"
        + "          \"dataType\": \"Float4\",\n"
        + "          \"alarms\": [\n"
        + "            {\n"
        + "              \"mode\": \"AboveValue\",\n"
        + "              \"setpointA\": 100.0,\n"
        + "              \"name\": \"HighValue\",\n"
        + "              \"priority\": \"High\"\n"
        + "            }\n"
        + "          ],\n"
        + "          \"name\": \"BasicTypeAlarmTag\",\n"
        + "          \"value\": 0.5,\n"
        + "          \"tagType\": \"AtomicTag\"\n"
        + "        },\n"
        + "        {\n"
        + "          \"valueSource\": \"expr\",\n"
        + "          \"expression\": \"{MyParam}\",\n"
        + "          \"dataType\": \"String\",\n"
        + "          \"expressionType\": \"Expression\",\n"
        + "          \"name\": \"BasicTypeExpressionTag\",\n"
        + "          \"value\": \"\",\n"
        + "          \"tagType\": \"AtomicTag\"\n"
        + "        },\n"
        + "        {\n"
        + "          \"name\": \"UdtFolderLevelTwo\",\n"
        + "          \"tagType\": \"Folder\",\n"
        + "          \"tags\": [\n"
        + "            {\n"
        + "              \"documentation\": {\n"
        + "                \"bindType\": \"parameter\",\n"
        + "                \"binding\": \"MyIntegerParam set to {MyIntegerParam}\"\n"
        + "              },\n"
        + "              \"tooltip\": {\n"
        + "                \"bindType\": \"parameter\",\n"
        + "                \"binding\": \"UDT instance {MyParam}\"\n"
        + "              },\n"
        + "              \"valueSource\": \"memory\",\n"
        + "              \"dataType\": \"Int4\",\n"
        + "              \"name\": \"LevelTwoMemoryTag\",\n"
        + "              \"value\": 2,\n"
        + "              \"tagType\": \"AtomicTag\"\n"
        + "            }\n"
        + "          ]\n"
        + "        }\n"
        + "      ]\n"
        + "    }\n"
        + "  ]\n"
        + "}";
}
 
private String getUdtInstancesImport() {
    return "{\n"
        + "  \"tags\": [\n"
        + "    {\n"
        + "      \"dataType\": \"Int4\",\n"
        + "      \"name\": \"BasicUDT_Instance0\",\n"
        + "      \"typeId\": \"BasicUDTDef\",\n"
        + "      \"value\": 0,\n"
        + "      \"parameters\": {\n"
        + "        \"MyParam\": \"Param for Basic UDT Instance\",\n"
        + "        \"MyIntegerParam\": 0.0\n"
        + "      },\n"
        + "      \"tagType\": \"UdtInstance\",\n"
        + "      \"tags\": [\n"
        + "        {\n"
        + "          \"name\": \"MemberEventScriptTag\",\n"
        + "          \"tagType\": \"AtomicTag\"\n"
        + "        },\n"
        + "        {\n"
        + "          \"name\": \"UdtFolderLevelOne\",\n"
        + "          \"tagType\": \"Folder\",\n"
        + "          \"tags\": [\n"
        + "            {\n"
        + "              \"name\": \"BasicTypeExpressionTag\",\n"
        + "              \"tagType\": \"AtomicTag\"\n"
        + "            },\n"
        + "            {\n"
        + "              \"name\": \"UdtFolderLevelTwo\",\n"
        + "              \"tagType\": \"Folder\",\n"
        + "              \"tags\": [\n"
        + "                {\n"
        + "                  \"name\": \"LevelTwoMemoryTag\",\n"
        + "                  \"tagType\": \"AtomicTag\"\n"
        + "                }\n"
        + "              ]\n"
        + "            },\n"
        + "            {\n"
        + "              \"name\": \"BasicTypeAlarmTag\",\n"
        + "              \"tagType\": \"AtomicTag\"\n"
        + "            }\n"
        + "          ]\n"
        + "        }\n"
        + "      ]\n"
        + "    },\n"
        + "    {\n"
        + "      \"dataType\": \"Int4\",\n"
        + "      \"name\": \"BasicUDT_OverrideInstance0\",\n"
        + "      \"typeId\": \"BasicUDTDef\",\n"
        + "      \"value\": 0,\n"
        + "      \"parameters\": {\n"
        + "        \"MyParam\": \"Param for Basic UDT override instance\",\n"
        + "        \"MyIntegerParam\": 1.0\n"
        + "      },\n"
        + "      \"tagType\": \"UdtInstance\",\n"
        + "      \"tags\": [\n"
        + "        {\n"
        + "          \"eventScripts\": [\n"
        + "            {\n"
        + "              \"eventid\": \"valueChanged\",\n"
        + "              \"script\": \"\\tprint \\\"Override: Value changed!\\\"\"\n"
        + "            }\n"
        + "          ],\n"
        + "          \"name\": \"MemberEventScriptTag\",\n"
        + "          \"tagType\": \"AtomicTag\"\n"
        + "        },\n"
        + "        {\n"
        + "          \"name\": \"UdtFolderLevelOne\",\n"
        + "          \"tagType\": \"Folder\",\n"
        + "          \"tags\": [\n"
        + "            {\n"
        + "              \"name\": \"UdtFolderLevelTwo\",\n"
        + "              \"tagType\": \"Folder\",\n"
        + "              \"tags\": [\n"
        + "                {\n"
        + "                  \"value\": \"4\",\n"
        + "                  \"name\": \"LevelTwoMemoryTag\",\n"
        + "                  \"tagType\": \"AtomicTag\"\n"
        + "                }\n"
        + "              ]\n"
        + "            },\n"
        + "            {\n"
        + "              \"enabled\": false,\n"
        + "              \"name\": \"BasicTypeExpressionTag\",\n"
        + "              \"tagType\": \"AtomicTag\"\n"
        + "            },\n"
        + "            {\n"
        + "              \"alarms\": [\n"
        + "                {\n"
        + "                  \"mode\": \"AboveValue\",\n"
        + "                  \"setpointA\": 200.0,\n"
        + "                  \"name\": \"HighValue\",\n"
        + "                  \"priority\": \"High\"\n"
        + "                },\n"
        + "                {\n"
        + "                  \"mode\": \"BelowValue\",\n"
        + "                  \"setpointA\": 10.0,\n"
        + "                  \"name\": \"LowValue\"\n"
        + "                }\n"
        + "              ],\n"
        + "              \"name\": \"BasicTypeAlarmTag\",\n"
        + "              \"tagType\": \"AtomicTag\"\n"
        + "            }\n"
        + "          ]\n"
        + "        }\n"
        + "      ]\n"
        + "    }\n"
        + "  ]\n"
        + "}";
}
```