---
title: Building a Workspace
sidebar_position: 3
---

The UI in the center area of the Designer is called the Workspace. Any module can add new workspaces to the Designer, but only one workspace is active at a time. A workspace should be designed to allow the user to edit some project resource. Typically, they select the resource to edit by clicking in the project browser. Each project browser tree node can have a workspace ID associated with it so that when it is selected, that workspace can become active.

To add a workspace, a module must create an object that implements the `ResourceWorkspace` interface. As you can see from the JavaDocs, this interface allows the workspace to provide a big JComponent to fill up the center workspace area, as well as associated menus, toolbars, and floating frames that should be visible when the workspace is active. The most important function of this interface is the one that returns the workspace itself, which can be any Swing component you’d like. This allows the workspace system to present any arbitrary UI to the user for resource customization.

## Tabbed Resource Workspace
To ease the process of adding new Ignition Designer workspaces, Ignition 7.7 introduced the `TabbedResourceWorkspace`, which implements the `ResourceWorkspace` mentioned above. While other classes also use the `DefaultDesignableWorkspace` (see the next section), the `TabbedResourceWorkspace` takes advantage of tabbed workspace editors. Additionally, the `TabbedResourceWorkspace` does not include drag-and-drop functionality, but may be easier to extend for your purposes. Basing your workspace on this class will allow easy integration with the Designer navigation tree. <!---Link to new SDK example of implemented a TabbedresourceWorkspace here-->

## Designable Workspace
There is a special abstract subclass of `ResourceWorkspace` called the `DefaultDesignableWorkspace` that is intended for any workspace that needs to design something using drag-and-drop “What You See Is What You Get” (WYSIWYG)-style manipulation. Writing this sort of system by hand is very time-consuming, and would inevitably leave the user with an inconsistent feel to workspaces. For these reasons, if your module would benefit from drag-and-drop manipulation of visually represented components, you are encouraged to use the designable workspace system. To learn about this system, read the Javadocs for `AbstractDesignableWorkspace` and `DesignPanel`, which do the bulk of the work.

The general concept is that `AbstractDesignableWorkspace` is a tabbed pane, with each tab holding something that should be designed. The item being designed is your own creation, but must be some sort of JComponent that implements `DesignableContainer`. Each tab will hold a `DesignPanel`, which is a customized JScrollPane. The scroll pane view will hold your component, and a glasspane-like component on top of that called the InteractionLayer. When in preview mode, the interaction layer will intercept all mouse events, and draw handles, guides, and grid, and all the other things you’re used to from the Vision module. Your subclass of `AbstractDesignableWokspace` must know how to create an ItemDelegate for each of its children, which in turn, must know how to do various things like set the size and location of objects contained within it.

## The resetFrames Function
One function in `ResourceWorkspace` that is non-obvious is the resetFrames function. This function is called when:
- Initializing the workspace’s view
- The user chooses the Reset Panels menu option, located under “View”, while the resource is active
It is this function’s duty to set up any dockable frames that should be visible while the workspace is active. Some dockable frames, such as the project browser and the SQLTags browser, will be visible and docked along the left side by default. Other panels will be hidden. 

You should set up the states and sizes of any dockable frames that you’ve added in your workspace as well as any built-in frames that you care about. For example, the Vision module, which wants the OPC browsing dockable frame to be hidden and then start as a popup when made visible, implements the function like this:

```
DockableFrame opc = dockingManager.getFrame(OPCBrowserPanel.DOCKING_KEY);
opc.setInitMode(DockContext.STATE_HIDDEN - DockContext.STATE_FLOATING);
opc.setUndockedBounds(new Rectangle(350, 250, 280, 450));
opc.setInitSide(DockContext.DOCK_SIDE_WEST);
opc.setInitIndex(1);
```

Meanwhile, the SQL Bridge module, which wants the OPC browsing frame to be docked as a tab with the SQLTags browser, implements it like this:

```
DockableFrame opc = dockingManager.getFrame(OPCBrowserPanel.DOCKING_KEY);
opc.setInitMode(DockContext.STATE_FRAMEDOCKED);`
opc.setInitSide(DockContext.DOCK_SIDE_WEST);`
opc.setInitIndex(1);
```

To learn more about how the docking system works, read the documentation from the [JIDE developer guide](https://www.jidesoft.com/products/JIDE_Components_Developer_Guide.pdf) or browse the [JIDE Javadocs](https://javadoc.io/doc/com.jidesoft/jide-oss/latest/index.html).