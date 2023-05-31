---
title: Example Modules
sidebar_position: 3
---
Inductive Automation provides a variety of example SDK modules on our [ignition-sdk-examples GitHub repository](https://github.com/inductiveautomation/ignition-sdk-examples). his repository demonstrates some of the ways you can extend Ignition with the Ignition SDK. Examples include components, an expression function, an OPC UA Device, and more. Use the following command to clone the repository for your personal use:

```git title="Clone the repository"
git clone https://github.com/inductiveautomation/ignition-sdk-examples
```
This repository demonstrates some of the possible ways you can extend Ignition with the Ignition SDK. Examples include components, an expression function, an OPC UA Device, and more.

Open an example in your IDE of choice to explore a project's structure, or try your hand at modifying an example with your own code. 

:::tip
If you prefer a simpler, guided example, head to the [Tutorial example](/docs/getting-started/simple-scripting/simple-scripting.md) first.
:::

## Prerequisites
These requirements and recommendations generally apply to both Gradle and Maven build tools:

* Java Development Kit (JDK) 11 installed. You can download it on the [Java SDK Downloads](http://www.oracle.com/technetwork/java/javase/downloads/index-jsp-138363.html) page. Licensed/TCK tested JDK vendors such as Adoptium, Azul Zulu, etc, are generally suitable JDKs as well.
* A running, 8.0+ version of Ignition to test your module in. If you don't already have Ignition installed head to the [Inductive Automation downloads](https://www.inductiveautomation.com/downloads/) page, download the correct package for your system and follow the installation instructions to get a gateway up and running.
* For development convenience, you may want to allow unsigned modules. Open the `ignition.conf` file in the `data/` directory, then in the `wrapper.java.additional` section add the following line: 
    ```
    wrapper.java.additional.[index]=-Dignition.allowunsignedmodules=true 
    ```