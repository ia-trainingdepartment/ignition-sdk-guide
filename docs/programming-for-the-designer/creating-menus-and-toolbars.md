---
title: Creating Menus and Toolbars
sidebar_position: 4
---

The menu and toolbar system in the Designer can include contributions from modules. Each designer gook has the opportunity to add its own menu items and toolbars, as does each workspace. The menu items and toolbars from each workspace will only be visible when that workspace is active.

## Actions
Before getting into the specifics of adding toolbars and the menu merging system, it would be worthwhile to discuss actions. **Actions** are a Swing concept where the general idea is that instead of coding up a menu item and a toolbar button that do the same thing, you define an action object that has a name, tooltip, icon(s), and the code of how to execute the action itself. Then, you simply add that action to a menu and/or toolbar, and the menu itself or toolbar itself creates the proper item or button for that action.

For a normal action that just needs to do something when clicked on, you typically make one by creating a subclass of `javax.swing.AbstractAction`. You may wish to use Ignition’s `BaseAction` class, which makes it more convenient to hook an Action’s text and tooltip into our internationalization system. The Javadocs on `BaseAction` explain how it is used. <!---Add  code sample for BaseAction.create--> For actions that are destined to become things like radio button menu items, checkbox menu items, or mutually exclusive toolbar toggles, you can create subclasses of StateChangeAction.

## Toolbars
To add a toolbar, you implement getModuleToolbars() from your Designer hook, or getToolbars() from a `ResourceWorkspace` implementation. Both of these functions return a `List<CommandBar>`. `CommandBar` is a class from the JIDE docking framework, a 3rd party commercial UI library that the Designer uses. You can also use `DesignerToolbar`, a subclass of `CommandBar`, which has handy functions to deal with creating various kinds of toolbar buttons from actions.

## Menu Merge
To add menu items, you create a collection of menu merge objects. Just like with toolbars, you add these to the system either by implementing getModuleMenu() from your designer hook, or getMenu() from a resource workspace.

The menu merge system is a way to insert menu items into the existing menu structure. It relies heavily on knowing the exact names and locations of known menus. These are stored in the `WellKnownMenuConstants` class. See the [Javadocs on `JMenuMerge`](https://files.inductiveautomation.com/sdk/javadoc/ignition81/8.1.1/com/inductiveautomation/ignition/designer/model/menu/JMenuMerge.html) for details.