---
title: Working With Project Resources
sidebar_position: 1
---

## Project Resource - Common
As a general pattern, your actual definition of a resource class should ideally be stored in a common scope, so that it can be serialized and deserialzed on the Gateway and in the Designer. You should also define a `ResourceType` that can be reused in dependent scopes. The `ResourceType` is a tuple of your module's ID and a unique ID for the actual resource type.

## Project Resource - Designer
In the Designer scope, you will register your resource workspace and a project browser node. It is generally recommended to subclass [`TabbedResourceWorkspace`](/docs/programming-for-the-designer/building-a-workspace.md#tabbed-resource-workspace) to give end users the most familiar editing paradigm. `TabbedResourceWorkspace` will automatically create instances of your `ResourceEditor` subclass and manage bookkeeping for you.

## Project Resource - Gateway
On the Gateway, we register a new `ProjectLifecycleFactory` that will automatically handle the bookeeping for restarting out long-lived Gateway class whenever the project or project resources change.

## Project Resource - Examples
The `DesignerHook` and `GatewayHook` are considered the "entry point" into any module in the Designer and Gateway scope, respectively.

```
public class DesignerHook extends AbstractDesignerModuleHook {
    public static final Icon RESOURCE_ICON;
    ...
}
```

### DesignerHook and Initialization
Upon selection and startup of a project in the Designer, each available module will initialize, calling into the `DesignerHook` class. Within the `DesignerHook` class, a workspace (which we will call `PythonResourceWorkspace`) is constructed. Afterwards, `PythonResourceWorkspace` is registered with the overall Designer context, allowing users to perform actions such as editing and building.

```
  @Override
    public void startup(DesignerContext context, LicenseState activationState) throws Exception {
        this.context = context;

        PythonResourceWorkspace workspace = new PythonResourceWorkspace(context);
        context.registerResourceWorkspace(workspace);

        BundleUtil.get().addBundle("pr", DesignerHook.class, "designer");

        context.registerSearchProvider(new HandlerSearchProvider(context, workspace));
    }
```

### Working With Workspaces
We will first create our `PythonResourceWorkspace` class, where we will call the `TabbedResourceWorkspace` superclass and pass the context and DESCRIPTOR (ResourceDescriptor) to it.

```
...
public PythonResourceWorkspace(DesignerContext context) {
        super(context, DESCRIPTOR);
    }
...
```

The DESCRIPTOR tells the superclass that it is a workspace and provides meta information for the `resourceType`, such as:
- The name of the resource workspace
- The icons to use
- Other information to help make the UI more presentable

```
public class PythonResourceWorkspace extends TabbedResourceWorkspace {
    public static final ResourceDescriptor DESCRIPTOR = ResourceDescriptor.builder()
        .resourceType(PythonResource.RESOURCE_TYPE)
        .nounKey("pr.handler.noun")
        .icon(DesignerHook.RESOURCE_ICON)
        .rootFolderText("Custom Event Handlers")
        .rootIcon(DesignerHook.RESOURCE_ICON)
        .build();
    ...
}
```

Using the `TabbedResourceWorkspace` superclass is recommended, as it is commonly used by muliple modules in the Designer. Some modules that use `TabbedResourceWorkspace` are:
- Vision
- Perspective
- Reporting

Additionally, extending from the `TabbedResourceWorkspace` superclass will help implement features and behaviors that users are accustomed to more easily, such as tabs to help navigate the workspace.

### TabbedResourceWorkspace Method: Resource Editor
One of most important methods defined in our `TabbedResourceWorkspace` superclass is `newResourceEditor`. In the example below, we are creating a new resource editor for our `PythonResource`. One of the parameters for `newResourceEditor` is the `ResourcePath`, which locates a resource based off its path.

```
@Override
    protected ResourceEditor<PythonResource> newResourceEditor(ResourcePath resourcePath) {
        return new PythonResourceEditor(this, resourcePath);
    }
```

When given a new `ResourcePath`, the `ResourceWorkspace` will know that it needs to create a new `ResourceEditor`, and call into our code to see what editor to use for our particular resource.

`ResourcePath` itself is comprised of a resourceType and a path. The following items are examples of resourceType(s):
- Vision Windows
- Vision Templates
- Perspective Views
- Scripts
- Reports

Meanwhile, the path is where the resource is located, such as
```
//folderA/folderB/ResourceName
```

#### Resource Context Menu Actions
In our `PythonResourceWorkspace`, you can use an `addNewResourceActions` method to add actions to a resource's right-clicked context menu. In the example below, we are adding a single context item called `NewPythonResourceAction`.

```
...
 private static class NewPythonResourceAction extends NewResourceAction {
        public NewPythonResourceAction(TabbedResourceWorkspace workspace, ResourceFolderNode folder) {
            super(workspace, folder, defaultPythonResource());
        }
    ...
    }
...
 @Override
    public void addNewResourceActions(ResourceFolderNode resourceFolderNode, JPopupMenu jPopupMenu) {
        jPopupMenu.add(new NewPythonResourceAction(this, resourceFolderNode));
    }
...
```

Using the Vision module as an example, opening the context menu on a Vision Window will give options such as:
- Opening the window
- Renaming the window
- Copying the window's path

### Implementing Designer Landing Pages for your Module
When opening modules in the Designer, you are greeted with a landing page. These landing pages contain different sections a user may find helpful, such as templates, recently modified resources, and creating a new resource. You can use the existing `WorkspaceWelcomePanel` to set up your module's landing page.

```
...
 @Override
    protected Optional<JComponent> createWorkspaceHomeTab() {
        return Optional.of(new WorkspaceWelcomePanel(
            i18n("pr.resource.category"),
            null,
            null
        ) {
            @Override
            protected List<JComponent> createPanels() {
                return List.of(
                    new ResourceBuilderPanel(
                        context,
                        i18n("pr.handler.noun"),
                        PythonResource.RESOURCE_TYPE.rootPath(),
                        List.of(
                            ResourceBuilderDelegate.build(defaultPythonResource())
                        ),
                        PythonResourceWorkspace.this::open
                    ),
                    new RecentlyModifiedTablePanel(
                        context,
                        PythonResource.RESOURCE_TYPE,
                        i18n("pr.handler.nouns"),
                        PythonResourceWorkspace.this::open
                    )
                );
            }
        });
    }
...
```

In the example above, we are using `ResourceBuilderPanel` to allow users to create a new resource from the landing page. In a similar fashion, we are using `RecentlyModifiedTablePanel` to allow users to open the most recently modified resources.

###  Modifying Immutable Project Resources
Since project resources are immutable, we can use the `defaultPythonResource` function as a workaround to modify project resources.

```
...private static Consumer<ProjectResourceBuilder> defaultPythonResource() {
        return PythonResource.toResource(
            new PythonResource("\tpass", true)
        );
    }
...
```

The `defaultPythonResource` function will return a function that accepts a `ProjectResourceBuilder`. The `ProjectResourceBuilder` is a modifiable version of your project resource, which you would make changes to, and then build to make a new immutable project resource. The end result will be a default empty resource for your workspace.

### The Resource Editor
line19, 14, 24