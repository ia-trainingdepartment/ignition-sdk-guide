---
title: Examine the Example
sidebar_position: 2
---
Let's examine some pieces of the example module to see how they interact to create a scripting function.

:::note
This is not an exhaustive list of every file or class required to make this example work, but rather a few selected highlights. We encourage you to examine the other directories included in this example project as well to see how they all fit together.
:::

## `common`
The `common` directory defines the interface and abstract class that all the implementing functions must adhere to, regardless of scope. This directory contains the files that define the function itself:
* `AbstractScriptModule.java`
* `MathBlackBox.java`

### `AbstractScriptModule`
The `AbstractScriptModule` class defines the function and its arguments:

```js title=AbstractScriptModule.java
@ScriptFunction(docBundlePrefix = "AbstractScriptModule")
    public int multiply(@ScriptArg("arg0") int arg0,
                        @ScriptArg("arg1") int arg1) {

        return multiplyImpl(arg0, arg1);
    }
```

### `MathBlackBox`
The `AbstractScriptModule` implements the abstract class `MathBlackBox` to provide the math behind the `multiply()` scripting function:

```js title=MathBlackBox.java
package com.inductiveautomation.ignition.examples.scripting.common;

public interface MathBlackBox {

    public int multiply(int arg0, int arg1);

}
```


## `ClientScriptModule`
An instance of `ClientScriptModule` is used in the Designer and Client scope to provide details about the function. The `ClientScriptModule` class creates the actual RPC handler, using the API's `ModuleRPCFactory.create()` method:

```js title=/src/main/java/com/inductiveautomation/ignition/examples/scripting/client/ClientScriptModule.java
public ClientScriptModule() {
        rpc = ModuleRPCFactory.create(
                "com.inductiveautomation.ignition.examples.scripting.ScriptingFunctionG",
                MathBlackBox.class
        );
    }
```
The `ModuleRPCFactory` handles the "heavy lifting" of passing values back and forth between scopes.

## `GatewayScriptModule`

When executed, the `ModuleRPCFactory` will automatically call the `GatewayHook`'s `getRPCHandler` method, which 
returns the `GatewayScriptModule` with the actual implementation of `MathBlackBox`:

```js title=gateway/src/main/java/com/inductiveautomation/ignition/examples/scripting/GatewayScriptModule.java
package com.inductiveautomation.ignition.examples.scripting.gateway;

import com.inductiveautomation.ignition.examples.scripting.common.AbstractScriptModule;

public class GatewayScriptModule extends AbstractScriptModule {

    @Override
    protected int multiplyImpl(int arg0, int arg1) {
        return arg0 * arg1;
    }

}
```
