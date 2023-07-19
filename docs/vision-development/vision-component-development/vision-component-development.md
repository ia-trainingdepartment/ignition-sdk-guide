---
title: Vision Component Development
sidebar_position: 6
---
One of the easiest types of modules to write is a module that adds a new component to the Vision module. Vision components are written in Java Swing and are modeled after the JavaBeans specification. If you've never used Swing before, consult [The Swing Tutorial](https://docs.oracle.com/javase/tutorial/uiswing/) before getting started. 

A basic module that adds components to the Vision module will need two projects: one for the Client scope and one for the Designer scope. You do not need a project for the Gateway scope unless your components are part of a larger module that requires Gateway-scoped resources. 

## Client Scope
In your Client scope project you'll have all of your components defined. You don't strictly need a Client module hook class at all. Your components will get compiled into a `.jar` file that will be marked in your `module.xml` file as "DC" for Designer and Client scoped:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="build">
<TabItem value="gradle" label="Gradle"><MDXLayout>

```xml title=build.gradle.kts
 projectScopes.putAll(
        mapOf(
            ":client" to "CD",
            ":designer" to "D",
        )
    )
```
</MDXLayout>
</TabItem>
<TabItem value="maven" label="Maven"><MDXLayout>

```xml title=pom.xml
<projectScope>
    <name>ce-client</name>
        <scope>CD</scope>
</projectScope>
```
</MDXLayout></TabItem>
</Tabs>

## Designer Scope
In your Designer scope project you'll have a [hook class](/docs/vision-component-development/designer-hook.md) and your [BeanInfo classes](/docs/vision-component-development/beaninfo-classes.md). The hook will be responsible for adding your components to the Vision Module's palette. The BeanInfo classes are used to describe the components to the Vision module. Make sure to mark the designer's hook with a dependency on the Vision module:


<Tabs groupId="build">
<TabItem value="gradle" label="Gradle"><MDXLayout>

```xml title=build.gradle.kts
moduleDependencies.put("com.inductiveautomation.vision", "DC")
```
</MDXLayout>
</TabItem>
<TabItem value="maven" label="Maven"><MDXLayout>

```xml title=pom.xml
<depends>
    <depend>
        <scope>D</scope>
        <moduleId>com.inductiveautomation.vision</moduleId>
    </depend>
</depends>
```
</MDXLayout>
</TabItem>
</Tabs>


