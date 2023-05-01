---
title: The module.xml File
sidebar_position: 2
---
The module descriptor is an XML file included in the root of the module package that defines a variety of properties about the modules. This file must always be named module.xml. The descriptor lists the JARs to be used, and their scopes. It also defines the minimum required platform version, and the full path of the hook classes for each scope.


The module descriptor file can also define dependencies on other modules. For example, a module that adds components to Vision will require that module before it can be loaded.  Below you will find the .modl file generated for our `AbstractTagDriverExample.modl`:

```xml title=module.xml
<?xml version="1.0" encoding="UTF-8"?>
<modules>
    <module>
        <id>com.inductiveautomation.ignition.examples.atd</id>
        <name>AbstractTagDriver</name>
        <description>An AbstractTagDriver implementation example.</description>
        <version>1.7.0</version>
        <requiredignitionversion>7.7.0</requiredignitionversion>
        <requiredframeworkversion>6</requiredframeworkversion>
        <license>license.html</license>
        <documentation>documentation.html</documentation>
        <jar scope="G">atd-gateway-1.7.0.jar</jar>
        <hook scope="G">com.inductiveautomation.ignition.examples.atd.ModuleHook</hook>
    </module>
</modules>
```
If you are using an Ignition SDK Plugin to package your Module, then the `module.xml` file is automatically generated for you and packed into the final `.modl` file.  If you'd like to inspect the module file, uncompress your module using a zip tool (Winzip, StuffIt, Winrar, etc.) and you will be able to view the auto-generated xml.

 