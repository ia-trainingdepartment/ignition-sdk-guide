---
title: Tutorial - Simple Scripting Module
sidebar_position: 2
---
![Scripting-function-g example project opened in IntelliJ](2023-03-20_15-01-03.png)
## Overview
This module (`scripting-function-g`) provides a basic example of a scripting function that executes through a remote procedure call (RPC).
In a [Client scope](/docs/vision-development//vision-client-development/vision-client-development.md), the function delegates to the module's RPC handler, which then calls `multiply` on the Gateway and returns the result.

In this tutorial, you'll examine some of the classes that make this function work before installing the example module onto your own Gateway. Next, you'll add your own function to the `AbstractScriptModule` class provided by the example.

## Prerequisites
* Set up your [development environment](/docs/getting-started/environment-setup/environment-setup.md). Since this example uses **Gradle**, follow the steps to install Gradle.
* Configure Ignition to allow unsigned modules. Open the `ignition.conf` file in the `data/` directory, then in the `wrapper.java.additional` section add a line like: 

```
wrapper.java.additional.[index]=-Dignition.allowunsignedmodules=true 
```

## Getting Started
Once you have configured your developer Gateway, make sure git is installed and clone this repo to a directory of your choice: 
```
git clone https://github.com/inductiveautomation/ignition-sdk-training.git
```

Using your IDE of choice, you should be able open the included `scripting-function-g` module through the `settings.gradle.kts` file located in the root directory. 

Upon importing this project into your IDE, it should download (if auto-import is on) necessary dependencies from the Inductive Automation artifact repository. Dependencies are managed through Maven and are cached to your local environment after they are downloaded.
