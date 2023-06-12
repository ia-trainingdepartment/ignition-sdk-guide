---
title: Supporting Undo and Redo
sidebar_position: 6
---

Undo and Redo are supported through the singleton `UndoManager` class, and the `UndoAction` interface. The system allows actions to be grouped based on the context of what the user is doing, and supports both independent and “aggregate” events.

## Undo Contexts
The UndoManager supports the idea of multiple contexts, meaning multiple stacks of undo/redo tasks, with the active stack being determined by the screen or action that the user is currently on. For example, the SQL Bridge and Vision modules both define a context, so that the undo/redo operations are local to each. Additionally, when the user is editing a group and clicks Undo, it won’t undo the last edit to a window.

To define a context, or switch to it, simply call UndoManager.setSelectedContext(). The context object can be anything, as long as it is appropriate for the key of a hashmap. When and how often you set the setSelectedContext() function will depend on the scope of your context, but it is common to call it when resources in your module are selected, a frame activated, or any other time that might indicate a switch has been made from a different context. If you don’t wish to manage the context in this way, you can also simply include it in the overloaded function to add UndoActions, UndoManager.add().

## The UndoAction Interface
The `UndoAction` represents a unit of execution that can be performed, reversed (undo), and then done again (redo). The core functions are:
- execute()
    - This is the positive action and always means “do this”
- undo()
    - This is the negative action and the opposite of execute()
Given the semantics of these functions, it’s common to define an UndoAction, call execute(), and then, if successful, add it to the UndoManager. The UndoAction.getDescription() function provides the text that will be displayed to the user. Additionally, this value is used to group similar actions, if appropriate.

## Grouping Actions
There are several different ways that actions can be grouped by the UndoManager. 

In the first case, with normal independent events, repeat events that occur within 700ms of each other will be grouped together, and executed together when Undo or Redo are called. This provides the behavior expected by the user when performing a small event many times within a short period, such as typing, or moving a component.

The second type of grouping that is available is dictated by the UndoAction.isGroupSequenceIndependent() function. When that function returns true, only the first registered action will be called, regardless how many times the same action was registered.