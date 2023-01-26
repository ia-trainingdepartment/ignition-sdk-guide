---
title: Create a Module
sidebar_position: 2
---
:::note
Pulling in Rob's notes (Gradle) and existing docs (Maven)
WIP
:::

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Pull tools repository

<Tabs groupId="buildTools">
  <TabItem value="gradle" label="Gradle">

```
git clone https://github.com/inductiveautomation/ignition-module-tools
```

  </TabItem>

  <TabItem value="maven" label="Maven">

```
git clone https://github.com/inductiveautomation/ignition-sdk-archetypes
```

  </TabItem>
  </Tabs>  

    
## Build a new project
description

  <Tabs groupId="buildTools">
  <TabItem value="gradle" label="Gradle">

1. Go into `ignition-module-tools`
2. Then one level down into `generator`

Run the following:
```
gradlew.bat clean build
```
Create a new project:

```
gradlew.bat  runCli –console plain
```

You will be prompted to ...

```
Enter scopes:  		GCD
Human readable name: 	New SDK Project
Root package:  		com.inductiveautomation.ignition.newsdkproject
```
  </TabItem>

  <TabItem value="maven" label="Maven">

Your new module will have directories in place, be configured to use the `ignition-maven-plugin` described below, and will be ready for you to start adding your own source. 

With Maven installed, enter the following in the command line:
```
mvn archetype:generate -DarchetypeGroupId=com.inductiveautomation.ignitionsdk -DarchetypeArtifactId=client-designer-gateway-archetype -DarchetypeVersion=1.0.3
```
This archetype will create a new project structure for you with seperate directories for each of the Gateway, Designer and Client scopes, as well as a Common and Build directory. For a full list of the Ignition archetypes, you can browse for [com.inductiveautomation](http://search.maven.org/#search%7Cga%7C1%7Ccom.inductiveautomation) at [Maven Central](http://maven.org/)
  </TabItem>
  </Tabs>
