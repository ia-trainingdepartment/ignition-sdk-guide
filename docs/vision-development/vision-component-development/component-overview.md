---
title: Component Overview
sidebar_position: 1
---
## JavaBean Properties
To expose a property, make it accessible via JavaBean-style getter/setter functions. For example, if you have a String field called "title" on your component, you would add these functions to expose the property:

```js title=MyComponent.java
public String getTitle() {
    return title;
}
public void setTitle(String title) {
    this.title = title;
}
```

As long as the `title` property is included in your component's BeanInfo class, it will appear in the Property Table pane when your user selects the component in the Designer. The user can set the property's value, bind it to a tag, and more.

## Bound Properties
Components have two major types of properties: normal properties and *bound* properties. All properties whose type is understood by Ignition can use the binding system. That is, the user can configure a binding on that property. However, only *bound* properties can be bound to. 

To understand this, look at the Text Field component. It has many properties. Now put a Label on a window and bind the text of the Label to the Text Field's text. You'll notice that the list of the Text Field's properties that you can bind the Label's text to is much shorter than the whole list of properties for the Text Field. This shorter list is the list of bound properties. A better name for these might be *properties that can be bound to*.

There are two things that make a property a bound property:

* In the component's BeanInfo class, the component is marked as a bound property with the `BOUND_MASK`.
* The component property fires the `propertyChangeEvent` when the field is altered. This event is what powers the binding system. For example, to allow the `title` field to fire events, you can alter the setter function to this:

```js title="MyComponent.java"
public void setTitle(String title) {
    // highlight-next-line
    String oldValue = this.title;
    this.title = title;
    // highlight-next-line
    firePropertyChange("title", oldValue, title);
}
```
## Special Abilities
There are a few special abilities that Vision users expect a component to have:
* Dynamic properties
* Quality overlays
* Styles
* Cursor and name collision handling

To save you the trouble of implementing a handful of interfaces that you may not be familiar with, the Vision module provides abstract base classes that you are encouraged to extend. Extending from the `AbstractVisionComponent`, `AbstractVisionPanel`, and `AbstractVisionScrollPane` classes will give you access to all of the special abilities that your users will expect.

The following example extends from the `AbstractVisionComponent` class to access methods from `LocaleListener`: 
```js title=HelloWorldComponent.java
public class HelloWorldComponent extends AbstractVisionComponent implements LocaleListener {

/**
     * This function is called whenever the user's locale changes. Add code here to deal with any
     * translations, number formats, or date formats that need to change as a result of the locale
     * changing. Some items may need to be revalidated/repainted to cause the screen to update.
     */
    @Override
    public void localeChanged(Locale locale) {
        //We need to fire a change on text in order to trigger html based displays to refresh.
        firePropertyChange("text", null, getText());
        repaint();
    }
}
    ...

```

## Lifecycle
All Vision components are expected to implement the `VisionComponent` interface. This defines quality monitoring behavior as well as the `ComponentLifecycle` behavior. `ComponentLifecycle` is an interface that defines a startup and shutdown method. 

The startup method gives you the `VisionClientContext`, which allows you to reference the rest of the system. Most importantly, it lets your component know when to shut itself down. Any component that has long-running background processes (threads) needs to shut them down when the `shutdownComponent()` function is called. This function is called when the window that contains the component is closed: 

```js title=HelloWorldComponent.java
@Override
    protected void onStartup() {
        // Seems like a no-op, but actually will trigger logic to re-start the timer if necessary
        setAnimation(animation);
    }

    @Override
    protected void onShutdown() {
        if (_timer != null && _timer.isRunning()) {
            _timer.stop();
        }
    }
```