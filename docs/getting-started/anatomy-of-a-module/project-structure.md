---
title: Project Structure
sidebar_position: 3
---
Ultimately, the structure of your module project (or projects, as most modules will consist of multiple sub-projects) is up to you. However, there are a few common structures that are used in most module scenarios. Primarily, breaking the projects up by scope, with another "common" project, is useful. Each project usually represents a JAR in the build process, and the common jar can be marked as applying to all scopes. Of course, this can also be accomplished through package structure and handled in the build process. The important point is that the resulting JAR files should be carefully tailored to their scopes, to reduce the amount of code unnecessarily loaded into scopes which don't use it.

### Localization Support
All string data that might be presented to the user should be held in external "resource bundle" files. There are several schemes for managing these files, but the easiest is to have a single file for each scope in the root package of your module and to load it into the `BundleUtil` in the hook. The section on Localization has more information about how this system works.

### Design Best Practice
Strings that represent identifiers or names, such as the "module id", should be defined in a single place in the **common project**, instead of repeatedly in code. For example:

```js title="Common Module Code"
package com.mycompany.mymodule.metainfo;
public class ModuleMeta {
    public final static String MODULE_ID = "com.mycompany.mymodule";
}
```
Now, all parts of your module can access the static values, and you don't have to worry about mistyping an identifier.

### Driver API
These byte utility classes are provided by the driver API and are very useful when writing protocol based drivers.

| Class | Description |
|-------|-------------|
| `ByteUtilities` | Useful functions for serializing most basic data types to byte arrays. |
| `BCDByteUtilities` | Similar to ByteUtilies, but for BCD encoding, with both Little and Big Endian support. |

### Designer API
These classes are provided by the Designer API:

| Class | Description |
|-------|-------------|
| `EDTUtil` | Provides convenience functions for working with the EDT, and a useful `coalescingInvokeLater()` function that can be used to group multiple calls into a single event. |
| `ErrorUtil` | Many functions for displaying errors, but also other dialogs such as info and warning messages, and prompts. |
| `IconUtil` | Used for retrieving icons provided with Ignition. |

