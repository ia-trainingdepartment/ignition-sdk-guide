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
As briefly mentioned in the [Working With Workspaces](/docs/programming-for-the-designer/working-with-project-resources.md#working-with-workspaces) section, when you open resource nodes in the Project Browser, tabs will also open at the bottom of the workspace, allowing for easier navigation. Inside each tab is our resource editor class, which we are calling `PythonResourceEditor`. This is where we will actually make changes to our resources, and more complex systems can exist here, such as:
- Perspective's JxBrowser
- Vision's Drag and Drop Functionality
- Vision's Component Palette

In addition, our `PythonResourceEditor` extends from our base `ResourceEditor` class.

```
...
public class PythonResourceEditor extends ResourceEditor<PythonResource> {

    private ExtensionFunctionPanel extensionFunctionPanel;
    private JCheckBox enabledCheckBox;

    public PythonResourceEditor(PythonResourceWorkspace workspace, ResourcePath resourcePath) {
        super(workspace, resourcePath);
    }
...
}
```

We can use the following `init` method as a resource editor to get our `PythonResource` class, negating the need to convert a project resource to our `PythonResource` class. We can also add more UI elements, such as
- Checkboxes
- A code editor

```
...
@Override
    protected void init(PythonResource resource) {
        removeAll();
        setLayout(new MigLayout("ins 16, fill"));

        enabledCheckBox = new JCheckBox(i18n("words.enabled"));
        add(enabledCheckBox, "wrap");
        extensionFunctionPanel = new ExtensionFunctionPanel(ExtensionFunctionPanel.GATEWAY_HINTS);
        extensionFunctionPanel.setDescriptor(PythonResource.FUNCTION_DESCRIPTOR);
        extensionFunctionPanel.setUserScript(resource.getUserCode());

        add(extensionFunctionPanel, "push, grow");
    }
...
```

### Deserialization and Serialization
Deserialization and serialization can be thought of as inverse operations; however, they do not necessarily have to mirror the actions of the other. For example, the Perspective module contains thumbnails that gives users a preview of what the view looks like. In order to do this, we can use the `getObjectForSave` method and `serializeResource` function to store a `thumbnail.png` file, along with the byte array that represents the .png file.

```
...
 @Override
    protected PythonResource getObjectForSave() {
        return new PythonResource(extensionFunctionPanel.getUserScript(), enabledCheckBox.isSelected());
    }

    @Override
    protected void serializeResource(ProjectResourceBuilder builder, PythonResource object) {
        PythonResource.toResource(object).accept(builder);
        builder.putData( name "thumbnail.png", data)
    }
...
```

On the other hand, the thumbnail itself isn't necessary for Perspective when it is deserializing. Using this knowledge, we can use `getObjectForSave` and `serializeResource` to store one-way configuration data that is not needed when deserializing.

In general, the example above follows the pattern below:
1. Start with the initial state of our project resource that contains information such as where it is lcoated and which project it belongs to.
2. Convert the project resource into a mutable object (`ProjectResourceBuilder`).
3. In our `PythonResourceEditor`, we will call into the `serializeResource` function.
4. Perform any actions or changes you need on `ProjectResourceBuilder`.
5. Serialize our object (`PythonResource`).

See the [Using our Custom Class](/docs/programming-for-the-designer/working-with-project-resources.md#Using-our-Custom-Class) section to learn more about how we modify the contents in our builder using the `toResource` and `fromResource` classes.

The deserialize method in your `ResourceEditor` will take a common Ignition `ProjectResource` class and translate it into the custom Java class we want to use for `PythonResource`. 
```
...
@Override
    protected PythonResource deserialize(ProjectResource resource) {
        return PythonResource.fromResource(resource);
    }
...
```
On the backend, the process is as follows:
1. `deserialize` takes the data and .json file that exists on disk on the Gateway.
2. The Gateway brings in the data and .json file and stores it so that it knows the information is part of the project.
3. The user opens the resource in the Designer to attempt to edit the resource.
4. The Designer uses the resource path from the Project Browser and gets the project resource at the specified path.
5. The Designer will call into our workspace, at which point our workspace will get the editor for the specified path.
6. The editor will use our code to convert the data and .json file into our `PythonResource` class.

The `ProjectResource` class itself is comprised of a manifest and at least one data file. Using this, you can get information such as data keys or attributes, using the `getDataKeys` or `getAttributes` functions, respectively.

### Using our Custom Class
To `deserialize` or `serialize` our `PythonResource` object, we can use the `fromResource` and `toResource` classes, respectively. 

Similar to how `deserialize` and `serialize` can be thought of as inverse operations, `fromResource` and `toResource` can also be considered inverse operations. The example below uses `fromResource` to take a `ProjectResource` and return `PythonResource`. In other words, we are constructing our module-specific class from an Ignition general-purpose class.

```
...
 public static PythonResource fromResource(ProjectResource resource) {
        String code = new String(
            Objects.requireNonNull(resource.getData(RESOURCE_FILE)),
            StandardCharsets.UTF_8
        );
        boolean isEnabled = resource.getAttribute("enabled")
            .map(JsonElement::getAsBoolean)
            .orElse(true);
        return new PythonResource(code, isEnabled);
    }
...
```

On the opposite end, the example below uses `toResource` in our `ProjectResourceBuilder` to modify our `ProjectResource`:

```
...
 public static Consumer<ProjectResourceBuilder> toResource(@NotNull PythonResource resource) {
        return builder -> builder
            .putAttribute("enabled", resource.enabled)
            .putData(
                RESOURCE_FILE,
                resource.getUserCode().getBytes(StandardCharsets.UTF_8)
            );
    }
...
```

The data that we retrieve using `fromResource`, along with the data we put using `toResource` comes from and goes to a file called `code.py`. The `code.py` file is located in your Ignition directory > data > projects > (your project) > (your module ID) > (your resource type ID) > (your resource path).

Besides the `code.py` file, there is also a `resource.json` file. Within the `resource.json` file, we can find the "enabled" attribute, along with a reference to the `code.py` file. The `resource.json` is, in essence, the stored representation of our attributes, while `code.py` contains the actual code we want to use when deserializing our data.

In summary, the `fromResource` and `toResource` methods are how we can go from a general Ignition resource that is located on disk, to our `PythonResource`, and vice versa.

While we are storing a simple string and a single attribute saying whether the resource is "enabled" or "disabled" in our `PythonResource` example, other existing subsystems store different types of data. For example, Perspective can store long.json files, Vision windows can store xml data, and WebDev Python resources can be stored as many separate files. This is possible because `ProjectResource` is flexible enough to store files dynamically (many files versus a singular file).