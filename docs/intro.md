---
sidebar_position: 1
---

# Introduction

:::info
We're going to replace all this, don't worry
:::

Ignition was designed to be a powerful industrial application platform, built from the ground up to support extensibility through a modular architecture. In fact, nearly all of the commercial pieces associated with Ignition, such as SQLBridge, Vision, and OPC-UA, are modules built with the same SDK that you have in your hands.

This document is written to be a friendly reference guide to the platform, and to provide all of the information you need to get started with the SDK. Some parts of the SDK might not be covered as well as they could be, and we always encourage feedback on this point, though when coupled with the technical documentation (the JavaDocs) everything should at least be represented. As questions come up, or you come up with ideas for ways the platform could be improved, we encourage you to contact us, preferably through the Module SDK Forum on our website or the comments section right here.

## What can you do?

An Ignition module can do anything you might imagine. The scope of an Ignition module is extremely broad - from adding something minor to complement the framework or leverage the framework to create an entirely new product. Modules can even add new functionality to other modules!


Here are some ideas, in no particular order, to help spur creativity:

* Write an ethernet driver for a PLC or other device.
* Add a visual component to the Vision module.
* Incorporate an existing 3rd party Java library to include some new technology 
* Insert new useful functions into the scripting system
* Create a new authentication profile type
* Add some sort of industry-specific suite of functionality 
* Implement a numerical analysis that Ignition doesn't yet include

## Prerequisite Knowledge
<!--
The Prerequisite Knowledge section can be transformed to also list all the third-party systems that we will be mentioning in later sections, as a sort of index.This can also be were we will say which options our guide will favor, like although we will make note of Maven throughout, the focus will be around Gradle, etc. - NB 
-->
To be successful with the Ignition Module SDK, you'll want to become acquainted with the following technologies and concepts before you get started.

### Java SE
Java is the language that Ignition is written in, and the language that modules must also be written in. Therefore, to even get started with the SDK, you'll need to have a decent foundation in the Java language and framework. Concepts such as package management, classpaths, and JAR files are frequently used in the development of Ignition modules. Ignition is built against Java 8. 

See also:  [Oracle's Java Developer Portal](http://www.oracle.com/technetwork/java/index.html)

### Build Systems

**Ant** is the build file system used by past versions of Ignition's SDK.  While not strictly necessary for module development, understanding and using Ant for those versions will make things much easier.  Each example project in the legacy SDK (which includes SDK versions up through Ignition 7.7.6) includes an Ant build file `build.xml` which can be modified and adapted as necessary.

Current versions of the Ignition SDK use **Gradle** instead of Ant. Gradle is often easier for Java developers to understand, but you can use any Java build tools you are comfortable with.

**Maven** is the predominant dependency management tool utilized in Java, and is also one of the most popular build systems.  Its 'convention over configuration' approach has laid the foundation for how modern Java applications are structured.  If you use our Ignition Maven Plugin, you will need to be familiar with `pom.xml` files and the Maven build cycle.

See also:

[Apache Ant Homepage](http://ant.apache.org/)  
[Maven Homepage](http://maven.apache.org/)    
[Gradle Homepage](http://www.gradle.org/)

### Ignition
Of course, to build an Ignition module, it's helpful to have good background in working with Ignition itself. You should have a good understanding of how many of the platform services work and are configured through the gateway, such as database connections, authentication profiles, SQLTags providers, OPC connections, and projects. For some targeted project types, such as a device driver for OPC-UA, a wide knowledge of the platform isn't necessary, but you should still be acquainted with how the existing drivers are configured and used.

## Getting Help
This guide intends to get you started as an *Ignition Module* developer, but isn't a comprehensive manual.  If you run into a problem with the SDK, or aren't sure how to accomplish something, the module SDK forum on the Inductive Automation website is the place to go! The forum is visited by a wide range of users who have experience building modules, and it is frequently checked by the IA development team.

For more general questions with Java, Python, Ant, etc., the internet has a wealth of resources.  [StackOverflow.com](http://www.stackoverflow.com/) is a particularly good place to ask questions, though you generally can't go wrong typing nearly anything into Google.

## Inductive Automation SDK License
The Inductive Automation SDK License Agreement may be found at https://inductiveautomation.com/ignition/sdk-license