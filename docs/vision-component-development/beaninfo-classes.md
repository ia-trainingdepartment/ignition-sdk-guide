---
title: BeanInfo Classes
sidebar_position: 2
---
Each of your components will have a corresponding BeanInfo class. These classes are loaded up in the Designer scope only, and are used to describe the component to the Designer.

## BeanInfo Location
BeanInfo classes are located using a combination of naming conventions and explicit configuration. 

BeanInfo classes must always be named the same as the component they describe, with "BeanInfo" appended to the end. For example, if your component is called `MyGreatChart`, your BeanInfo class for that component would be named `MyGreatChartBeanInfo`.

Typically, you'll have all of your BeanInfo classes residing in a single package in your Designer-scoped project. For example, let's say that package is `com.example.mymodule.beaninfos`. Using your module's Designer-scope hook class, you can add that package name to the Vision module's BeanInfo search path:
```js
public class MyModuleDesignerHook extends AbstractDesignerModuleHook {

	public void startup(DesignerContext context, LicenseState activationState) throws Exception {
		context.addBeanInfoSearchPath("com.example.mymodule.beaninfos");
	}
}
```
Now, when the Designer needs to look for the BeanInfo class for the MyGreatChart component, it knows to look for the class `com.example.mymodule.beaninfos.MyGreatChartBeanInfo`.

## Writing a BeanInfo Class
A BeanInfo class describes your component to the Vision module. It is used to present the user with a list of properties when your component is selected. 