---
title: Scripting
sidebar_position: 11
---

Everything discussed in this section is also applicable on the Gateway. Keep in mind however, that due to scope, scripting functions created in one scope will not automatically be available in other scopes. You will need to add them separately. 

Ignition uses Python for its scripting facilities, allowing access to a wide range of powerful functions and syntax for event handlers, timed scripts, etc. More specifically, the scripting is provided by Jython, a python implementation in Java. As a result, it is easy for module authors to provide new scripting functions, while implementing them behind the scenes in Java.

## Motivation
- Wrap up 3rd party Java libraries and expose them through scripting
- Take common scripting goals and wrap them up into a module that can be easily distributed/ maintained.
- Protect proprietary algorithms by allowing use, but not modification. 

## Registering Functions
The process for registering new functions is very simple:
1. Implement initializeScriptManager(ScriptManager manager) in your module hook. This is available in all scopes.
2. Call ScriptManager.addScriptModule(...) and register your class.

### Class or Instance?
The addScriptModule has several overloaded versions. Fundamentally, there are two options; provide a Class instance, or an actual object instance. When providing a class, only static methods and fields from the class will be added to the scripting library. When an object instance is provided, both static and non-static members will be added.

### Method Visibility
Methods will only be added to the given location’s namespace if they meet the following criteria:
- The method is public
- The method is not ‘synthetic’ according to bytecode
- The method name does not contain a literal ‘$’ character
- The method is not throw, according to bytecode, the PyIgnoreMethodTag exception

<!---
*This part is commented out because it currently is incorrect  due to a bug. There is currently a bug fix that will address this issue (IGN-6751).
Location (H3)
The "location" parameter specifies the namespace where the functions will be loaded. For example, if you add a class Foo, who has a function bar(), at location "foo", you would be able to call that function in the following way:
import foo foo.bar()
Important: As illustrated here, the namespace is not automatically imported. However, you are allowed to add functions under the "system" namespace, which is automatically imported. So, if instead of location 'foo", we used 'system.foo", we could call the function directly with:
system.foo.bar()
--->

### Adding Documentation
When libraries are added using the base `addScriptModule` function, the libraries will not have any documentation associated with them. To provide documentation, you need to implement a `ScriptFunctionDocProvider` for your class, and call the overload of `addScriptModule` that takes the provider. This interface is self explanatory, and simply provides documentation for the various components of the scripting functions (return value, parameters, function). It is also possible to define documentation through properties files, and link them through annotations, using the `PropertiesFileDocProvider` helper class.

## Advanced Topics
### Function Annotations
Various Java Annotations can be used on functions in the script class to modify behavior, accept named arguments, link documentation, etc.

#### @NoHint
On a function, causes it not to be displayed in the context-sensitive help.

#### @ScriptFunction(docBundlePrefix)
Defines the root prefix for the externalized documentation, and is used in conjunction with the `PropertiesFileDocProvider` class. The following paths will be used to generate documentation:
- prefix.desc: The description of the function 
- prefix.param.paramName: The description of a particular parameter
- prefix.returns: The description of the return value

#### @ScriptArg(name)
Used on arguments to a scripting function, this attribute allows you to override the name of the parameter. Note that this also overrides the parameter name used for documentation lookup through the `ScriptFunction` attribute, if used.

#### @KeywordArgs(names=String[], types=Class[])
Specifies the names and types of supported keyword-style invocation arguments. See the next topic for more information.

## Keyword-style Invocation
Normally, script functions are defined with a specific set of parameters, and a value must be provided for each (in other words, a "normal" function call). However, in the scripting system, there is a second option: *keyword* based invocation. In this system, arguments are specified by name, not by order.

They are optional, and the user is free to only pass the arguments they care about. To create scripting functions that support this scheme, you must do several things:
1. Define your function to accept keyword arguments. This means you accept two arguments:
    - PyObject[] pyArgs
    - String[] keywords
2. Add a `@KeywordArgs` attribute to your function, defining the possible argument names and types
3. In your function, retrieve the keywords through the PyArgumentMap.interpretPyArgs(...) helper function

#### Example
```js
public class MyScriptClass{
    @KeywordArgs(names={"path", "start", "end"}, types={String.class, Date.class, Date.class})
    public List<Data> querySomething(PyObject[] pyArgs, String[] keywords){ 
        PyArgumentMap args = PyArgumentMap.interpretPyArgs(pyArgs, keywords, MyScriptClass.class, "querySomething");   
        Date startDate = args.getDateArg("start"); 
        if(startDate==null){
            ...
        }
    }
}
```

## Using RPC With Scripting
It is possible to expose scripting functions that actually execute on the Gateway using standard Gateway RPC techniques. This can be advantageous when the scripts might take a while, process lots of data that would need to be transferred to the client otherwise, or require disk or other resource access that only the Gateway can provide.

To quickly add RPC based functions to scripting, you can simply do the following:
1. Define an Interface for the functions you want. If using an existing library that has an interface defined, you can skip this
2. Update your gateway RPC handler to implement that interface, delegating to the library if necessary
3. In your designer/client hook, use `ModuleRPCFactory`, and add the result to the script manager

#### Example
```js
@Override
public void initializeScriptManager(ScriptManager manager) {
    manager.addScriptModule("module.gatewayfuncs", ModuleRPCFactory.create(MODULE_ID, RPCInterface.class));
}
```