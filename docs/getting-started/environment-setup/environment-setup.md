---
title: Environment Setup
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Prerequisites
Regardless of the Development Environment you prefer, there are some common prerequisites:

### Java JDK
You will need a Java JDK installed. Be mindful of which version you install:

* Ignition platform 7 requires a Java 1.8 JDK
* Ignition platform 8 requires a Java 11 JDK

You have several options for JDKs. Popular options are:

* [Azul JDK Downloads](https://www.azul.com/downloads/zulu-community/?&package=jdk)
* [Java JDK Downloads](http://www.oracle.com/technetwork/java/javase/downloads/index-jsp-138363.html)

### Build System
You will need to choose and install a build system. Recommended build systems include **Gradle** and **Maven**.

#### To install Gradle:
```mdx-code-block
<Tabs groupId="OS">
  
  <TabItem value="linux" label="Linux">
  ```
  
  [SDKMAN!](http://sdkman.io/) is a tool for managing parallel versions of multiple Software Development Kits on most Unix-based systems: `sdk install gradle 8.1.1`
  ```mdx-code-block
  </TabItem>
  <TabItem value="OSX" label="OSX">
  ```
  OSX users using brew can `brew install gradle`
  
  ```mdx-code-block
  </TabItem>
  <TabItem value="windows" label="Windows">
  ```
  ```mdx-code-block
  1. [Download](https://gradle.org/releases) the latest Gradle distribution.
  2. Create a new directory `C:\Gradle` with File Explorer.
  3. Open a second File Explorer window and go to the directory where the Gradle distribution was downloaded. Double-click the ZIP archive to expose the content. 
  4. Drag the content folder `gradle-8.1.1` to your newly created `C:\Gradle` folder.
  5. In **File Explorer** right-click on the **This PC** (or **Computer**) icon, then click `Properties -> Advanced System Settings -> Environmental Variables`.
  6. Under System Variables select **Path**, then click **Edit**. Add an entry for `C:\Gradle\gradle-8.1.1\bin`. 
  7. Click **OK** to save.

  ```

  ```mdx-code-block
  </TabItem>
  ```
</Tabs>


#### To install Maven:
```mdx-code-block
<Tabs groupId="OS">
  
  <TabItem value="linux" label="Linux">
  ```
  
  Linux users can use their package manager to install at the command line: `sudo apt-get install maven`
  ```mdx-code-block
  </TabItem>
  <TabItem value="OSX" label="OSX">
  ```
  OSX users using brew can `brew install maven`
  
  ```mdx-code-block
  </TabItem>
  <TabItem value="windows" label="Windows">
  ```
  Windows users can install via [Chocolatey](https://chocolatey.org/) (`choco install maven`) or by downloading the installer at the Maven downloads page.

  ```mdx-code-block
  </TabItem>
  ```
</Tabs>

## Download IDE and Set Up Your Workspace

```mdx-code-block
<Tabs groupId="IDE">
  <TabItem value="eclipse" label="Eclipse">
```  
  Download *Eclipse IDE for Java Developers* from http://www.eclipse.org/

  When you first start Eclipse, you will be asked what workspace you want to work in. A workspace is a folder on your hard drive that holds a collection of projects. You can have multiple workspaces. If you're already an Eclipse user, you'll want to create a new workspace.  
  
  To make a workspace, create a folder to be your workspace or choose a path through Eclipse when you start the IDE. For example: `C:\development\IgnitionSDK_Workspace`. We will configure the SDK dependencies inside the IDE. 

```mdx-code-block
  </TabItem>
```
```mdx-code-block
  <TabItem value="intellij" label="IntelliJ">
```
  ```mdx-code-block
  Download *IntelliJ Community Edition* from https://www.jetbrains.com/idea/

  When you first install IntelliJ, you will be prompted to do the following:
  1. Check the option to **"Add 'bin' folder to the PATH"**.
  2. Check the option to **"Add 'Open Folder as Project'"**.
  3. Accept all other defaults.
  4. Reboot when prompted.

  We also recommend that you [set up auto-import](https://www.jetbrains.com/help/idea/2022.1/creating-and-optimizing-imports.html).
  ```
  </TabItem>
  </Tabs>  
