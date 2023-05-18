---
title: Build and Install
sidebar_position: 3
---
Now that we've examined some pieces of this example project, let's build and install our new module to see how it works in the Designer.

## Build the `.modl`

Since this example uses Gradle as its build system, you can build a `.modl` file using the following command:

```
gradlew.bat clean build
```
You'll find a new `.modl` file, `Scripting-Function-G.unsigned.modl`, in your project's `build` directory.

## Install and Test

1. On your Gateway, navigate to **Config > System > Modules**.
2. Click **Install or Upgrade a Module**.
3. Click **Choose File** and select the `Scripting-Function-G.unsigned.modl` file.
4. Click **Install**.

This scripting module will now appear at the bottom of your Modules page, under the **Unsigned Modules** heading. 

You can now launch a Designer and test out the scripting function we added. Open a **Script Console** and enter the following:

```python title="Multiply some numbers"
print system.example.multiply(6, 7)
```
Congratulations, you've just added a simple scripting function to Ignition!