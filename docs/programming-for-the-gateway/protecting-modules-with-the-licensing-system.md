---
title: Protecting Modules with the Licensing System
sidebar_position: 2
---

## Protecting Modules with the Licensing System

The Ignition platform allows multiple licenses to be installed at a time. Each license file contains information about its "licensed" modules, such as whether they've been purchased, along with any restrictions that might be included in them. When designing your module, you will need to decide whether it will be free, freely licensed, or commercial.

Each license gets installed during the activation process. A license file is generated and encrypted by Inductive Automation, based on a system identifier provided by the target machine during the first step of activation. Licenses for your module can be generated with the portal provided by Sales Engineering.

## What the LicenseManager handles

The license management is handled by the `LicenseManager`, which can be consulted at any time to retrieve the `LicenseState` of a module. The license state is also provided to a module on startup, and modules are notified of changes to the state through the `notifyLicenseStateChanged()` function defined in the `GatewayModuleHoo`k.
The `LicenseState` contains `LicenseDetails`, which specifies the version that the license applies to and any defined `LicenseRestrictions` applied. This object exists for individual modules and on the platform level.

`LicenseRestrictions` are simple name/value pairs that can be embedded in the license file and used to define different levels of functionality. License restrictions might define the number of tags that can be used by the module, or the number of components instantiated. This gives module writers full control over what different editions of their module can do, simply by changing the license that gets sent during activation. For example, the SQL Bridge module has a LicenseRestriction called "edition", which can currently be set to "standard" or "historical". 

## Working with the demo system

The Ignition platform provides a demo system that dictates 2-hour periods that can be reset by the user. Non-free modules should respect this demo, and stop functioning when the demo expires. This can easily be done by watching the LicenseState and observing two properties:
* LicenseState.getLicenseMode()==LicenseMode.Trial
* LicenseState.isTrialExpired()

When a module is activated, the license state provided to it will be updated accordingly, and the `getLicenseMode()` function will return `LicenseMode.Activated`. When the demo is reset, the `isTrialExpired()` function will return `false`. Any change in the properties will cause the `notifyLicenseStateChanged()` function to be called to the module hook.

## Leased Licensing

### What you need to know about leased license:

### How to integrate into the licensing infrastructure:
