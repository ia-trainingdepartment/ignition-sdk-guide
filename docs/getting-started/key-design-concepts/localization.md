---
title: Localization
sidebar_position: 5
---
Localization adapts an application to present information in a way consistent with what users in different countries are accustomed to, such as date formatting.  Ignition supports localization. It is fairly easy for module developers to adapt their code to support it, though it is easier if they understand how the system works from the outset. 

At the core of localization is the idea of externalizing string data. Any time you would have a string of text in English, instead of using the string directly, you store it externally and reference it through the localization system. In Ignition, these strings are stored in key/value properties files, called resource bundles. Beyond externalizing strings, it is important to convert numbers and dates to strings using a locale aware mechanism instead of direct toStrings.


## `BundleUtil`
Nearly all operations involving localized string data in Ignition go through the statically accessed BundleUtil class. Modules can register resource bundles through a number of convenient functions of this class, and can retrieve the value using the resource key (sometimes also referred to as the bundle key). 

For example, it is common that a Gateway module will have one main resource bundle defining most of its strings. If the file was located directly next to the Gateway hook class, and was named "module_gateway.properties", in the startup function of the module it could be registered as follows:
```js title=GatewayModuleHook.java
BundleUtil.get().addBundle("modgw", this.getClass(), "module_gateway")
```

This registers the bundle under the name "modgw". Anywhere in our gateway module that we wanted to display text defined in the file, for example a resource key "State.Running" that corresponds to "State is running", we could do:

```js 
BundleUtil.get().getString("modgw.State.Running");
```

There are a variety of overloads for loading bundles and getting strings. See the BundleUtil [JavaDocs](https://github.com/inductiveautomation/ignition-sdk-examples/wiki/Javadocs-&-Notable-API-Changes) for more information.

## Other Localization Mechanisms
Some systems support other localization mechanisms. For example, in developing gateway web pages, placing a properties file next to a Java class with the same name will be enough to register that bundle with the system. Mechanisms such as these will be described in the documentation as they come up.

## Localization and Platform Structures
Many parts of the system that appear to use strings actually require a resource key instead. When implementing a function that returns a string, take special care to identify whether the value returned should be the actual value, or a resource key that can be used to retrieve the value. This should be noted in the documentation of the function, but most functions and arguments use naming conventions such as "getTextKey" and "function(descKey)" to indicate this.

## Translating Your Resources
Resources are loaded based on the user's current locale, falling back to the best possible alternative when the locale isn't present. The Java documentation for the ResourceBundle class explains the process. To provide translations for different locales, you can place the translated files (properly named with the locale id) next to the base bundles.