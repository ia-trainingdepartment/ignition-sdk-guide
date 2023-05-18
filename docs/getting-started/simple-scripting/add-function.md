---
title: Add a Function
sidebar_position: 4
---
In the initial example, the `multiply()` function is defined under the `AbstractScriptModule` class. Let's add a simple function after line 27:

```js  title=AbstractScriptModule.java  
public String helloWorld(){
        return "Hi there!";
}
```

That's it! We're ready to test it out. Build the module, install it, launch the designer, open the Script Console and try calling the function:

```python title="Our new function!"
print system.example.helloWorld()
```

## Adding Descriptions
We can use the `@ScriptFunction` annotation to denote where the descriptions for our function should be. 
We can add the annotation to our `helloWorld()` function:


```js  title=AbstractScriptModule.java 
// highlight-next-line
@ScriptFunction(docBundlePrefix = "AbstractScriptModule")
public String helloWorld(){
    return "Hi there!";
}
```

In this case, the `docBundlePrefix` argument states that the `AbstractScriptModule` properties file (also located under `common`) has the descriptions that should be used in conjunction with this function. 

Next we need to actually write the descriptions. Open the `AbstractScriptModule.properties` file. You'll see the descriptions for the `multiply()` function:

```js title=AbstractScriptModule.properties
multiply.desc=Multiple two integers and return the result.
multiply.param.arg0=The first operand.
multiply.param.arg1=The second operand.
multiply.returns=Returns the first operand multiplied by the second.
```

The notation here is the following:

- `desc` is the description of the function
- `param.%argName%` is the description for a particular argument
- `returns` is the description for the return value

Our function does not accept any arguments, so we only have two entries to add to `helloWorld()`:

```js title=AbstractScriptModule.properties
helloWorld.desc=Returns a friendly greeting
helloWorld.returns=The string "Hi There!"
```
Build the module, install the new module on top of the old, relaunch the designer, and check the autocomplete popup.
 You should see your new descriptions. 
