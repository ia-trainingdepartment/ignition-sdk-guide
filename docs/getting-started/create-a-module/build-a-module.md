---
title: Build a Module
sidebar_position: 2
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

An Ignition Module consists of an xml manifest, jar files, and additional resources and meta-information. When you [create a module](create-a-module.md) from an existing `gradlew.bat` or Maven Archetype, your project will have a `build` directory with the basic tools necessary to compile and build a `.modl` file. Depending on your build system, you may want to further edit the files in your `build` directory to declare dependencies, update signing settings, or configure tasks. See the [Plugins](#plugins) section for configuration settings specific to your build system.

## Compile and Build
When you are ready to build your `.modl` file, open a command prompt in your project's root directory and run the following command:

<Tabs
    values={[
        {label: 'Gradle', value: 'gradle'},
        {label: 'Maven', value: 'maven'},
    ]}>
<TabItem value="gradle"><MDXLayout>

```
gradlew.bat clean build
```
</MDXLayout>
</TabItem>
<TabItem value="maven">
<MDXLayout>

```
mvn package
```
</MDXLayout></TabItem>
</Tabs>

You now have a `.modl` file that is ready to install on an Ignition Gateway. 

:::tip
If you have not yet [signed your module](/docs/getting-started/create-a-module/module-signing.md), you will need to either sign it or configure your Gateway to allow unsigned modules. To allow unsigned modules, open the `ignition.conf` file in the `data/` directory, then in the `wrapper.java.additional` section add a line like: 

```
wrapper.java.additional.[index]=-Dignition.allowunsignedmodules=true 
```
:::


Your IDE may also provide a GUI interface to compile and build your project, if you prefer. See the documentation for your preferred IDE: 

[IntelliJ IDEA](https://www.jetbrains.com/help/idea/compiling-applications.html)

[Eclipse](https://www.ibm.com/docs/en/elms/esdr/9.0.1?topic=eclipse-building-projects)


