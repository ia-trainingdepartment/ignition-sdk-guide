---
title: Anatomy of a Module
sidebar_position: 5
---

A module is a `.modl` file that is loaded into the Gateway. That file is simply a zip file containing all of the module's code ( `*.jar` files) and a required manifest file that describes it.

A module can be made up of any number of projects that are compiled into one or more JAR files. Somewhere in the code there will be "hook" classes defined that allow Ignition access to the module. In addition to the module code, the JAR files might also contain resources such as images, and resource bundle files for localization. As you go through this guide, you'll get an idea of how to structure and build your `.modl`.

## Contents of a `.modl` File
The module package file will contain the compiled JARs for your module, the descriptor file, and optionally a license file and documentation for the module. The Ignition platform will load the module, locate the hooks, and start them up. Additional resources, such as images, should be compiled into the JAR files, and not included directly in the module package (with the exception of the "doc/" folder). This is all started from the descriptor file (also called the module.xml) built into the .modl, which we'll take a look at next.    