---
title: Build a Module
sidebar_position: 2
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

An Ignition Module consists of an xml manifest, jar files, and additional resources and meta-information. When you [create a module](create-a-module.md) from an existing `gradlew.bat` or Maven Archetype, your project will have a `build` directory with the basic tools necessary to compile and build a `.modl` file. Depending on your build system, you may want to further edit the files in your `build` directory to declare dependencies, update signing settings, or configure tasks. See the [Plugins](#plugins) section for configuration settings specific to your build system.

## Compile and Build
When you are ready to build your `.modl` file, follow the instructions for your IDE:

[IntelliJ IDEA](https://www.jetbrains.com/help/idea/compiling-applications.html)

[Eclipse](https://www.ibm.com/docs/en/elms/esdr/9.0.1?topic=eclipse-building-projects)

## Plugins


<Tabs
    values={[
        {label: 'Gradle', value: 'gradle'},
        {label: 'Maven', value: 'maven'},
    ]}>
<TabItem value="gradle"><MDXLayout>

The Ignition Module Plugin for Gradle lets module developers use the [Gradle](https://www.gradle.org) build tool to create and sign functional modules (_.modl_ ) through a convenient DSL-based configuration model.

This plugin is applied to a single project (the 'root' of the module) that may or may not have child projects. When the plugin is applied, it will attempt to identify if the root or any subprojects apply the `java-library` plugin. For each that does, it will add the `modlApi` and `modlImplementation` configurations so that they may be used in the project's dependency settings. In addition, it will create the asset collection tasks and bind them to the `_ assemble_` lifecycle tasks, and ultimately establish task dependencies for the 'root-specific' tasks that create the module xml, copy files into the appropriate structure, zip the folder into an unsigned modl file, sign it, and report the result.

## Usage

To apply the plugin to an existing project, follow the instructions on the plugin's [Gradle Plugin Repo Page](https://plugins.gradle.org/plugin/io.ia.sdk.modl), and then configure as described below.

### Apply the plugin
Apply the plugin to a `build.gradle` or `build.gradle.kts` file. In the case of a multi-project build, apply to the root or parent project.   

:::note 
You should only apply the plugin to a single parent project in a multi-scope structure (e.g., one where you have separate source directories for `gateway` and `designer` code, for instance).  If you have questions about structure, use the module generator to create well-structured examples.
:::

For current versions of gradle, add to your `build.gradle.kts`:

```kotlin
// build.gradle.kts
plugins {
  id("io.ia.sdk.modl") version("0.1.1")
}
```

Or for Groovy DSL buildscripts:

```groovy
// build.gradle
plugins {
    id 'io.ia.sdk.modl' version '0.1.1'
}
```

### Configure the module
Configure your module through the `ignitionModule` configuration DSL.  See [DSL properties section](#ignitionmodule-dsl-properties) below for details.

Choosing which [Configuration](https://docs.gradle.org/current/userguide/declaring_dependencies.html) to apply may have important but subtle impacts on your module, as well as your development/build environment.  In general, the following rule of thumb is a good starting point:

| Configuration  | Usage Suggestion | Included in Module? | Includes Transitive Dependencies In Module? | Exposes Transitive Dependencies to Artifact Consumers? |
|-------|--------|-------------------------|----------|---------|
| compileOnly   | Use for 'compile time only' dependencies, including ignition sdk dependencies. Similar to maven 'provided'.  | No | No | No |
| compileOnlyApi   | Use for 'compile time only' dependencies, including ignition sdk dependencies. Similar to maven 'provided'.  | No | No | No |
| api    | Project dependencies that do not explicitly get registered in the module DSL project scopes.  | No | No | Yes |
| implementation   | Project dependencies that do not explicitly get registered in the module DSL project scopes. | No | No | No |
| modlImplementation   | Dependencies that are used in a module project's implementation, but are not part of a public API.  | Yes | Yes | No |
| modlApi | Dependencies that are used in a module project and are exposed to dependents. | Yes | Yes | Yes |

#### `ignitionModule` DSL Properties

Configuration for a module occurs through the `ignitionModule` extension DSL.  See the source code `ModuleSettings.kt` for all options and descriptions.  Example configuration in a groovy buildscript:

<details><summary>Groovy example</summary>

```groovy
ignitionModule {
    /*
     * Human readable name of the module, as will be displayed on the gateway status page
     */
    name = "Starlink Driver"

    /*
     * Name of the '.modl' file to be created, without file extension.
     */
    fileName = "starlink-driver"
    /*
     * Unique identifier for the module.  Reverse domain convention is recommended (e.g.: com.mycompany.charting-module)
     */
    id = "net.starlink.driver"

    moduleVersion = version   // common to refer to the version of the gradle project like this

    moduleDescription = "A short sentence describing what it does, but not much longer than this."
    /*
     * Minimum version of Ignition required for the module to function correctly.  This typically won't change over
     * the course of a major Ignition (7.9, 8.0, etc) version, except for when the Ignition Platform adds/changes APIs
     * used by the module.
     */
    requiredIgnitionVersion = "8.0.10"
    /*
     *  This is a map of String: String, where the 'key' represents the fully qualified path to the project
     *  (using colon-separated gradle project path syntax), and the value is the shorthand Scope string.
     *  Example entry: [ ":gateway": "G", ":common": "GC", ":vision-client": "C" ]
     */
    projectScopes = [
        ":gateway" : "G"
    ]

    /*
     * Add your module dependencies here, following the examples, with scope being one or more of G, C or D,
     * for (G)ateway, (D)esigner, Vision (C)lient.
     *
     * Example Value:
     * moduleDependencies = [
           "com.inductiveautomation.opcua": "G"
     * ]
     */
    moduleDependencies = [ : ]   // syntax for initializing an empty map in groovy

    /*
     * Map of fully qualified hook class to the shorthand scope.  Only one scope per hook class.
     *
     * Example entry: "com.myorganization.vectorizer.VectorizerDesignerHook": "D"
     */
    hooks = [
        "net.starlink.driver.gateway.GatewayHook": "G"
    ]

    /**
     * Optional map of arbitrary String to String entries.  These will make it into the final _buildResult.json_, but
     * are otherwise unused and have no impact on the module itself.  These values may be useful for adding data to
     * used by consumers of this build's output.  For instance: CI and publication systems, integrity checking, etc.
     */
     metaInfo.put("someKey", "Some arbitrary value useful to later use")
     metaInfo.put("publicationUrl", "1.2.3.4:8090")
}

```
</details>

Configuring in a kotlin buildscript is similar, except that you'll want to use the appropriate `set()` methods.  Here is an example:

<details><summary>Kotlin example</summary>

```kotlin
ignitionModule {
    /*
     * Human readable name of the module, as will be displayed on the gateway status page
     */
    name.set("Starlink Driver")

    /*
     * Name of the '.modl' file to be created, without file extension.
     */
    fileName.set("starlink-driver")
    /*
     * Unique identifier for the module.  Reverse domain convention is recommended (e.g.: com.mycompany.charting-module)
     */
    id.set("net.starlink.driver")

    /*
     * Version of the module.  Here being set to the same version that gradle uses, up above in this file.
     */
    moduleVersion.set("${project.version}")

    moduleDescription.set("A short sentence describing what it does, but not much longer than this.")

    /*
     * Minimum version of Ignition required for the module to function correctly.  This typically won't change over
     * the course of a major Ignition (7.9, 8.0, etc) version, except for when the Ignition Platform adds/changes APIs
     * used by the module.
     */
    requiredIgnitionVersion.set("8.1.11")
    /*
     *  This is a map of String: String, where the 'key' represents the fully qualified path to the project
     *  (using gradle path syntax), and the value is the shorthand Scope string.
     *  Example entry: listOf( ":gateway" to "G", ":common" to "GC", ":vision-client" to "C" )
     */
    projectScopes.putAll(mapOf(
        ":gateway" to "G"
    ))

    /*
     * Add your module dependencies here, following the examples, with scope being one or more of G, C or D,
     * for (G)ateway, (D)esigner, Vision (C)lient.
     * Example:
     * moduleDependencies = mapOf(
     *    "com.inductiveautomation.vision" to "CD",
     *    "com.inductiveautomation.opcua" to "G"
     *  )
     */
    moduleDependencies.set(mapOf<String, String>(
        "com.inductiveautomation.opcua" to "G"
    ))

    /*
     * Map of fully qualified hook class to the shorthand scope.  Only one scope may apply to a class, and each scope
     * must have no more than single class registered.  You may omit scope registrations if they do not apply.
     *
     * Example entry: "com.myorganization.vectorizer.VectorizerDesignerHook" to "D"
     */
    hooks.putAll(mapOf(
        "net.starlink.driver.gateway.GatewayHook" to "G"
    ))

    /*
     * Optional 'documentation' settings.  Supply the files that would be desired to end up in the 'doc' dir of the
     * assembled module, and specify the path to the index.html file inside that folder. In this commented-out
     * example, the html files being collected are located in the module root project in `src/docs/`
     */
    // the files to collect into the documentation dir, with example implementation
    // documentationFiles.from(project.file("src/docs/"))

    /* The path from the root documentation dir to the index file, or filename if in the root doc dir. */
    // documentationIndex.set("index.html")

    /*
     * Optional unsigned modl settings. If true, modl signing will be skipped. This is not for production and should
     * be used merely for development testing
     */
    skipModlSigning.set(false)
}
```
</details>

### Configure signing settings

Configure your signing settings, either in a `gradle.properties` file, or as commandline flags.  The required properties are defined in constants.kt, and used in the SignModule task.  You may mix and match flags and properties (and flags will override properties), as long as all required values are configured.  The only requirement is that option flags _must_ follow the gradle command to which they apply, which is the 'signModule' task in this case.   The flags/properties are as follows, with usage examples:

:::note
Builds prior to v0.1.0-SNAPSHOT-6 used a separate property file called `signing.properties`.  Builds after that use `gradle.properties` files instead.
:::

   | Flag  | Usage  | gradle.properties entry |
   |-------|--------|-------------------------|
   | certAlias  | gradlew signModule --certAlias=someAlias  | ignition.signing.certAlias=someAlias  |
   | certFile  | gradlew signModule --certFile=/path/to/cert  | ignition.signing.certFile=/path/to/cert  |
   | certPassword  | gradlew signModule --certPassword=mysecret  | ignition.signing.certFile=mysecret  |
   | keystoreFile  | gradlew signModule --keystoreFile=/path/to/keystore  | ignition.signing.keystoreFile=/path/to/keystore  |
   | keystorePassword  | gradlew signModule --keystorePassword=mysecret  | ignition.signing.keystoreFile=mysecret  |


### Specify dependencies 
When depending on artifacts (dependencies) from the Ignition SDK, they should be specified as `compileOnly` or `compileOnlyApi`  dependencies as they will be provided by the Ignition platform at runtime.  Dependencies that are applied with either the `modlApi` or `modlImplementation` _Configuration_ in any subproject of your module will be collected and included in the final `.modl` file, including transitive dependencies. 

In general, behaviors of the `_modl_` configuration follow those documented by the Gradle java-library plugin (e.g. - publishing, artifact uploading, transitive dependency handling, etc).  Test-only dependencies should NOT be marked with any `modl` configuration. Test and Compile-time dependencies should be specified in accordance with the best practices described in Gradle's `java-library` [plugin documentation](https://docs.gradle.org/current/userguide/java_library_plugin.html).




 ## Tasks

:::tip
To see all tasks provided by the plugin, run the `tasks` gradle command, or `tasks --all` to see all possible tasks.
:::


The module plugin exposes a number of tasks that may be run on their own, and some which are bound to lifecycle tasks
provided by Gradle's [Base Plugin](https://docs.gradle.org/current/userguide/base_plugin.html).  Some tasks apply
only to the root project (the project which is applying the plugin), while others are applied to one or more
subprojects.  The following table is a brief reference:


| Task  | Scope  | Description |
|-------|--------|-------------------------|
| collectModlDependencies  | root and child projects  | Resolves and collects dependencies from projects with the `java-library` plugin that marked with 'modlApi/modlImplementation' configuration |
| assembleModlStructure | aggregates assets, dependencies and assembled project jars created by the 'collectModlDependencies' task into the module staging directory |
| writeModuleXml  | root project  | Writes the module.xml file to the staging directory  |
| zipModule  | root project | Compresses the staged module contents into an unsigned zip archive with a .modl file extension  |
| checksumModl  | root project  | Generates a checksum for the signed module, and writes the result to a json file  |
| moduleAssemblyReport  | root project | Writes a json file containing meta information about the module's assembly  |
| signModl | root project | signs the unsigned modl using credentials/certs noted above
| deployModl | root project | deploys the built module file to an ignition gateway running in developer module upload mode &#735;|

### Developer mode
To enable the developer mode, add `-Dia.developer.moduleupload=true` to the 'Java Additional Parameters' in the `ignition.conf` file and restart the gateway.  

:::warning warning
This should only be done on secure development gateways, as it opens a significant security risk on production gateways, in addition to instabilities that may result from your in-development module.
:::

## Task Configuration

To configure properties of a task that are not directly exposed by the plugin configuration extension, you can use
one of the `withType()` methods, which are nicely documented [here](https://docs.gradle.org/current/userguide/task_configuration_avoidance.html#sec:old_vs_new_configuration_api_overview).

For example, to set the host url for the development gateway being targeted by the "deployModl" task (which is of task class type `Deploy`):

```kotlin

// in the build.gradle.kts file where the module plugin is applied
tasks {
    withType<io.ia.sdk.gradle.modl.task.Deploy> {
        this.hostGateway.set("https://some.gateway.com:8099")
    }
}
```

In groovy based buildscripts, the syntax is different, but the result is the same:

```groovy
tasks.withType(io.ia.sdk.gradle.modl.task.Deploy).configureEach {
    hostGateway = "https://some.gateway.net:8033"
}
```
</MDXLayout>
</TabItem>
<TabItem value="maven">
<MDXLayout>

The plugin artifacts (jars) are hosted with the rest of the SDK at the Inductive Automation Nexus Repositories. To reference Maven dependencies from the repositories, you simply need to include our repository information in your Maven dependency list. Here is an example of an entry as can be seen in our [example projects'](https://github.com/inductiveautomation/ignition-sdk-examples) pom files:

```Java title="The Inductive Automation Maven Artifact Repository"
<distributionManagement>
    <repository>
        <id>releases</id>
        <name>IA Release</name>
        <url>http://nexus.inductiveautomation.com/repository/inductiveautomation-releases/</url>
    </repository>
<distributionManagement>
```
With your Ignition SDK dependencies resolved, we can take a look at how the plugin works.  

## Usage
The ignition plugin runs as part of the maven `<build>` cycle, and should be listed specified under `<plugins>` as a `<plugin>`. The plugin has two goals specified for building your Module:

* `modl`
* `post`

### The `modl` goal
The `modl` goal allows for the execution of a customized package phase of the maven build. This goal will compile and test your project, resolve and download dependencies against the Ignition SDK repositories, search for specified doc and license files and zip them up into an modl file.

### The `post` goal
As of `ignition-maven-plugin` v1.0.8, there is also the `post` goal. The `post` goal acts as helper goal to "post" your packaged `modl` file to your running developer gateway. 

:::note 
You'll need to specify a `<gatewayAddress>` in the plugin configurations if you are not using the default (localhost:8088)
:::  

### Configuring the Plugin
The plugin has three requirements that need to be configured. The best way to understand the plugins with a variety of scope/dependy configurations is to review some of the examples, but here is a an overview of the different parts of the plugin configuration:

#### The `descriptor`
The descriptor is a typical Maven descriptor and consists of the `<groupId>`, `<artifactId>` and the `<version>`. The group and artifact ids are always going to be the same, and the version should be whichever version of the `ignition-maven-plugin` you are using. Here is an example descriptor:

```
<groupId>com.inductiveautomation.ignitionsdk</groupId>
<artifactId>ignition-maven-plugin</artifactId>
<version>1.0.8</version>
```
#### The `executions`
The `<executions>` section of the plugin is where we specify the goals of the plugin. `<executions>` can have one or more `<execution>` listed, and requires a `<goal>` to be specified. By default, the phases of the `modl` and `post` goals are bound to the package and install goals respectively. With multiple executions, you should also have an `<id>` for each execution. An example of the execution section looks like this:
```
<executions>
    <execution>
        <id>modlexecution</id>
        <phase>package</phase>
        <goals>
            <goal>modl</goal>
        </goals>
    </execution>
    <execution>
        <id>postexecution</id>
        <phase>install</phase>
            <goals>
                <goal>post</goal>
            </goals>
    </execution>
</executions>
```
#### The `configuration`
The `<configuration>` section is the real heart of the plugin. Here is a list of required configuration tags:

| Tag | Description |
|-----|-------------|
| `projectScopes`| Used to define the scope of each part of your project. Has name and scope tags, where name represents the artifact id of the project dependency, and the scope is any combination of one or more characters 'C', 'D' and or 'G' representing the scope (Client, Designer or Gateway) of the project. |
| `moduleId` | The full package module identifier, for example `com.inductiveautomation.examples.examplemodule` |
| `moduleName` | The readable text name of your Module, as it will be displayed in the gateway module page. |
| `moduleDescription` | A brief description if your module. |
| `moduleVersion` | The version of your module, most often set to `${project.version}`. |
| `requiredIgnitionVersion` | The minimum required version of Ignition. |
| `requiredFrameworkVersion` | The minimum required version of Java |
| `depends` | Specifies the dependencies for each scope. |
| `hooks` | Tells the Gateway and/or Designer where to find the hooks for your module. |

In addition, we have the following optional tags:

| Tag | Description |
|-----|-------------|
| `documentationFile` | The path to the `index.html` file of your documentation. By default, the plugin will look for a docs/ folder at at the root of your module. |
| `licenseFile` | The location of your `license.html` file. Can be `license.html` if it's in the same directory as the build pom, or a full path to the file. |
| `gatewayAddress` | The URL and port of your testing gateway if not using the default location at http://localhost:8088. Should follow the format http://example.gateway.com:1234.  |

## Example Build `pom.xml`


<details><summary>Example</summary>

```
<project>
...
<build>
    <plugins>
        <plugin>   <!-- start the plugin configuration -->
 
            <!-- The descriptor block -->
            <groupId>com.inductiveautomation.ignitionsdk</groupId>
            <artifactId>ignition-maven-plugin</artifactId>
            <version>1.0.8-SNAPSHOT</version>
 
            <!-- The executions block -->
            <executions>
                <execution>              
                    <id>modlexecution</id>  <!-- id is needed when there are more than one execution in <executions> -->
                    <phase>package</phase>  <!-- phase of the lifecycle the goal should execute in, defaults to phase -->
                    <goals>
                        <goal>modl</goal>   <!-- the goals to execute in this phase -->
                    </goals>
                </execution>
                <execution>
                    <id>postexecution</id>
                    <phase>install</phase>
                        <goals>
                            <goal>post</goal>
                        </goals>
                </execution>
            </executions>
 
            <!-- The configuration block -->
            <configuration>
                <projectScopes>
                    <projectScope>
                        <name>wme-client</name>  <!-- we have a project called wme-client with the client source -->
                        <scope>CD</scope>        <!-- the scopes required by the project files, here Client and Designer are needed -->
                    </projectScope>
 
                    <projectScope>
                        <name>wme-designer</name>  <! -- the project that has our designer source -->
                        <scope>D</scope>
                    </projectScope>
                </projectScopes>
 
                <moduleId>com.inductiveautomation.ignition.examples.wme</moduleId>
                <moduleName>WeatherModuleExample</moduleName>
                <moduleDescription>
                    A module that provides current and forecasted weather conditions.
                </moduleDescription>
                <moduleVersion>${project.version}</moduleVersion>
                <requiredIgnitionVersion>7.7.0</requiredIgnitionVersion>
                <requiredFrameworkVersion>6</requiredFrameworkVersion>
                <licenseFile>license.html</licenseFile>
                <documentationFile>doc/</documentationFile>
     
                <!-- specify our dependencies -->
                <depends>
                    <depend>
                        <scope>D</scope>
                        <moduleId>fpmi</moduleId>
                    </depend>
                </depends>
                 
                <!-- specify one or more hook locations and their scope -->
                <hooks>
                    <hook>
                        <scope>D</scope>
                        <hookClass>com.inductiveautomation.ignition.examples.wme.designer.DesignerHook</hookClass>
                    </hook>
                </hooks>
            </configuration>
        </plugin>
    </plugins>
</build>
...
</project>
```
</details>

</MDXLayout>
</TabItem>
</Tabs>