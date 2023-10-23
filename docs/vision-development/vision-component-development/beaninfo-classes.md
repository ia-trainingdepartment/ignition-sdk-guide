---
title: BeanInfo Classes
sidebar_position: 3
---
Each of your components will have a corresponding BeanInfo class. These classes are loaded up in the Designer scope only, and are used to describe the component to the Designer.

## BeanInfo Location
BeanInfo classes are located using a combination of naming conventions and explicit configuration. 

BeanInfo classes must always be named the same as the component they describe, with "BeanInfo" appended to the end. For example, if your component is called `MyGreatChart`, your BeanInfo class for that component would be named `MyGreatChartBeanInfo`.

Typically, you'll have all of your BeanInfo classes residing in a single package in your Designer-scoped project. For example, let's say that package is `com.example.mymodule.beaninfos`. Using your module's Designer hook class, you can add that package name to the Vision module's BeanInfo search path:
```js title=MyModuleDesignerHook.java
public class MyModuleDesignerHook extends AbstractDesignerModuleHook {

	public void startup(DesignerContext context, LicenseState activationState) throws Exception {
		context.addBeanInfoSearchPath("com.example.mymodule.beaninfos");
	}
}
```
Now, when the Designer needs to look for the BeanInfo class for the MyGreatChart component, it knows to look for the class `com.example.mymodule.beaninfos.MyGreatChartBeanInfo`.

## Writing a BeanInfo Class
A BeanInfo class describes your component to the Vision module. It is used to present the user with a list of properties when your component is selected. The properties get friendly descriptions and are categorized and prioritized. It defines the name and icon for your component's presence in the palette. It can add your own customizers for extended configuration.

Your BeanInfo class itself should extend from `CommonBeanInfo`. It will need to override methods like `initProperties` in order to add and expose all of the properties of your component.

### Example

This BeanInfo class describes the HelloWorldComponent. Note how the BeanInfo class does the following:
* Adds properties to the component
* Adds descritptions to these properties
* Defines the component's appearance in the Designer palette


```js title=HelloWorldComponentBeanInfo.java
public class HelloWorldComponentBeanInfo extends CommonBeanInfo {

    public HelloWorldComponentBeanInfo() {
        /*
         * Our superclass constructor takes the class of the component we describe and the customizers that are
         * applicable
         */
        super(HelloWorldComponent.class, DynamicPropertyProviderCustomizer.VALUE_DESCRIPTOR, StyleCustomizer.VALUE_DESCRIPTOR);
    }

    @Override
    protected void initProperties() throws IntrospectionException {
        // Adds common properties
        super.initProperties();

        // Remove some properties which aren't used in our component.
        removeProp("foreground");
        removeProp("background");
        removeProp("opaque");

        // Add our properties
        // Note that all String properties are automatically added to the component's translatable terms
        // unless you add NOT_TRANSLATABLE_MASK
        addProp("text", "Text", "The text to display in the component", CAT_DATA, PREFERRED_MASK | BOUND_MASK);

        addEnumProp("animation", "Animation Mode", "This mode turns on or off animation marquee.", CAT_BEHAVIOR,
                new int[]{ANIMATION_OFF, ANIMATION_LTR, ANIMATION_RTL},
                new String[]{"Off", "Left to Right", "Right to Left"});
        addProp("animationRate", "Animation Rate", "The time between frames of animation, if it is turned on.",
                CAT_BEHAVIOR);

        addProp("fillColor", "Fill Color", "The color to fill the letters with.", CAT_APPEARANCE, PREFERRED_MASK);
        addProp("strokeColor", "Stroke Color", "The color to use for the letter outline.", CAT_APPEARANCE);
        addProp("strokeWidth", "Stroke Width", "The width of the letter outline, or 0 to turn outlining off.",
                CAT_APPEARANCE);
    }

    @Override
    public Image getIcon(int kind) {
        switch (kind) {
            case BeanInfo.ICON_COLOR_16x16:
            case BeanInfo.ICON_MONO_16x16:
                return new ImageIcon(getClass().getResource("/images/hello_world_16.png")).getImage();
            case SimpleBeanInfo.ICON_COLOR_32x32:
            case SimpleBeanInfo.ICON_MONO_32x32:
                return new ImageIcon(getClass().getResource("/images/hello_world_32.png")).getImage();
        }
        return null;
    }

    @Override
    protected void initDesc() {
        VisionBeanDescriptor bean = getBeanDescriptor();
        bean.setName("Hello World");
        bean.setDisplayName("Hello World");
        bean.setShortDescription("A component that displays the text 'Hello World'.");
        // This adds any extra translatable terms (other than String properties above)
        // Alter HelloWorldComponentTermFinder to add static and dynamic props
        bean.setValue(CommonBeanInfo.TERM_FINDER_CLASS, HelloWorldComponentTermFinder.class);
    }

}
```
