---
title: Vision Component Development
sidebar_position: 6
---
One of the easiest types of modules to write is a module that adds a new component to the Vision module. Vision components are written in Java Swing and are modeled after the JavaBeans specification (not to be confused with Enterprise JavaBeans or EJBs, which is entirely different). If you've never used Swing before, consult The Swing Tutorial before getting started. 

A basic module that adds components to the Vision module will need two projects: one for the Client scope and one for the Designer scope. You do not need a project for the Gateway scope unless your components are part of a larger module that requires Gateway-scoped resources. 

### Client Scope
In your Client-scope project you'll have all of your components defined. You don't strictly need a Client-scoped module hook class at all. Your components will get compiled into a `.jar` file that you'll mark in your `module.xml` file as "DC" - designer and client scope. 

### Designer Scope
In your Designer scope project you'll have a hook class and your BeanInfo classes. The hook will be responsible for adding your components to the Vision Module's palette. The BeanInfo classes are used to describe the components to the Vision module. Make sure to mark the designer's hook with a dependency on the Vision module, whose module id is `fpmi` because of its historical roots as our legacy FactoryPMI product.