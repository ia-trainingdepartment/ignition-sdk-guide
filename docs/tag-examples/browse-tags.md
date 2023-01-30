---
title: Browse Tags
---

This code example is intended to be run within Gateway scope, and assumes that the `GatewayContext` object is available. To run from a Designer or client, [see this guide to create an RPC object](/docs/programming-for-the-designer-client).



```js
private void browseTags() throws Exception {
    IgnitionGateway context = IgnitionGateway.get();
    GatewayTagManager tagManager = context.getTagManager();
    TagProvider provider = tagManager.getTagProvider("default");  // Change tag provider name here as needed
 
    TagPath root = TagPathParser.parse("");
    browseNode(provider, root);
}
 
private void browseNode(TagProvider provider, TagPath parentPath) throws Exception {
    Results<NodeDescription> results = provider.browseAsync(parentPath, BrowseFilter.NONE).get(30, TimeUnit.SECONDS);
 
    if(results.getResultQuality().isNotGood()) {
        throw new Exception("Bad quality results: "+ results.getResultQuality().toString());
    }
 
    Collection<NodeDescription> nodes = results.getResults();
    StringBuilder structure = new StringBuilder();
    for(int i = 0; i<parentPath.getPathLength(); i++) {
        structure.append("\t");
    }
 
    String formatted = structure.toString() + "[%s] objectType=%s, dataType=%s, subTypeId=%s, currentValue=%s, displayFormat=%s, attributes=%s, hasChildren=%s";
    for(NodeDescription node: nodes) {
        String currentValue = node.getCurrentValue().getValue() != null ? node.getCurrentValue().getValue().toString(): "null";
        String descr = String.format(formatted, node.getName(),
            node.getObjectType(),
            node.getDataType(),
            node.getSubTypeId(),
            currentValue,
            node.getDisplayFormat(),
            node.getAttributes().toString(),
            node.hasChildren());
        // logger.info(descr);
 
 // Browse child nodes, but not Document nodes such as UDT parameters
 if(node.hasChildren() && DataType.Document != node.getDataType()) {
            TagPath childPath = parentPath.getChildPath(node.getName());
            browseNode(provider, childPath);
        }
    }
}
```