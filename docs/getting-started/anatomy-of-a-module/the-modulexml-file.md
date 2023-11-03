---
title: The module.xml File
sidebar_position: 2
---
The module descriptor is an XML file included in the root of the module package that defines a variety of properties about the modules. This file must always be named `module.xml`. The descriptor lists the JARs to be used and their scopes. It also defines the minimum required platform version and the full path of the hook classes for each scope.

The module descriptor file can also define dependencies on other modules. For example, a module that adds components to Vision will require the Vision module before it can be loaded.  Below you will find the `.modl` file generated for our `AbstractTagDriverExample.modl`:

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
:::tip
If you are using an Ignition SDK Plugin to package your Module, then the `module.xml` file is automatically generated for you and packed into the final `.modl` file.  If you'd like to inspect the module file, uncompress your module using a zip tool (Winzip, StuffIt, Winrar, etc.) and you will be able to view the auto-generated xml.
:::

## Sub Elements

| Name | Description | Required? | Attributes |
|------|-------------|-----------|------------|
| `id` | The string identifier for the module. Must be unique across all modules. Should be a "fully qualified name". | Yes | n/a |
| `name` | The user-friendly name for this module. | Yes | n/a |
| `requiredignitionversion` | The version of Ignition required by the module. Versions have the following syntax: `major.minor.revision[-rcX][-betaX]`. | Yes | n/a |
| `requiredframeworkversion` | An integer indicating the framework version required. The framework version number is incremented when the API changes in a backwards-incompatible manner. | Yes | n/a |
| `hook` | Specifies the entry point into a module, for each scope.  Only one should be listed per each of the three scopes. | Yes | scope |
| `version` | The version of the module. Versions have the following syntax: `major.minor.revision[-rcX][-betaX]`.<br /><br />Additionally, the value "dev" is allowed, specifying that this is a development version of the module. The "dev" version bypasses most version equality checks, and may have unexpected consequences. However, when testing features like redundancy, it can be useful to get around stringent version matching. | Yes | n/a |
| `description` | A description for the module. | No | n/a |
| `license` | Name of an HTML file to be found in the root level of the modl file. Should define the license for the module. This is the license that a user would agree to upon installing the module. | No | n/a |
| `documentation` | Name of an HTML file that is the root of a user manual for the module. If present, this file must be located under a folder named "doc" in the `modl` file. Other HTML, image, and CSS files may be located in this folder as well. These webpages will be mounted when the module is installed. | No | n/a |
| `depends` | Specifies modules that this module depends on. The value is the `id` of the required module. There can be at most one `depends` element for each scope. | No | scope |
| `jar` | Specifies JAR files included in the module package that define the module, or upon which the module depends.<br /><br />All libraries, including those that comprise the module itself, should have their own JAR entry.  The main function of this element, besides specifying which libraries to load, is to specify their scope.  This is important for instructing the system to send libraries through the web launch system to clients and the designer, for example.  Conversely, it is important to prevent libraries from being sent to the client when they are not necessary, as they will increase the download size. | No | scope<br />os |
| `export` | Similar to `jar`, in that it specifies a JAR file, but different in that the JAR file will be loaded into a higher classloader, making it accessible to other modules.<br /><br />Two important notes about this element:<br /><ul><li>Modules using exports will require a Gateway restart to modify or uninstall.</li><li>This feature is only for the Gateway scope. Client and Designer scopes do not maintain a classloader hierarchy like the Gateway.</li></ul> | No | n/a |
