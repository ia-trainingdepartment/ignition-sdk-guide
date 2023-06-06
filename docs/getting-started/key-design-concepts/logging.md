---
title: Logging
sidebar_position: 1
draft: true
---
Ignition uses the Apache Log4J framework to record events, errors and debug messages. Log4J is a simple framework that makes it easy to log information, and store those logs in different formats.

## Introduction to Log4J
Log4J is a logging system, meaning that information is stored to it, recording what happened in the system. The information is stored to a particular **Logger**, a named entity used to log messages. These messages always contain a **Severity** rating.

**Appenders** in the system receive the messages and do something in response, such as writing them to a text file. Appenders can be configured to only log messages of a certain severity, and at any time we can set the level of severity that a given logger will accept by using that logger's name. 

For example, **trace** severity, which is the lowest level, is usually very verbose, and not logged by default. If we are trying to troubleshoot a particular part of the system and we know which logger it uses, we can turn on trace logging for that logger in order to see all of its information.

## Getting a Logger
You can obtain a **Logger** by calling the static `LogManager.getLogger` functions. There are two primary methods used to get loggers: class and name. 

The class method uses the full path of the class. The name method allows you to use any name you'd like. For example:

```js title=GatewayHook.java
Logger log = LogManager.getLogger(getClass()); log.info("System started.");
```
or
```js title=GatewayHook.java
Logger log = LogManager.getLogger("MyModule.CoreSystem.Status")
```

Note that in Log4J, names are separated by the "." character. With the second example above, for instance, if we had other loggers with similar names under `CoreSystem`, we could set them all to log debug messages as well by setting that level directly on `MyModule.CoreSystem`.

## Naming Loggers
It is usually advisable to use custom names that have meaning to both you and the end user so that someone who is trying to troubleshoot a problem can find the logger without help. While it is easy to get loggers based on class name, it is important to remember that these names will have little meaning to customers and integrators trying to use your module. On the other hand, using completely custom names sometimes makes it difficult to later track down where things are occurring in code. 


## Logging Severities and Messages
Logging information is an art, and one that is difficult to perfect. There are a few elements that meet good logging practices:

#### Log messages should contain helpful and identifiable data. 
For example, if you have a logger in a driver and write "Device connected", it will be of little use- multiple instances of a driver might be running at once, and the message does not indicate which instance it is referring to.

#### Log messages set to Info and above should not "flood the log."
Messages should not report so frequently that they make it impossible to see other logs or fill up the allocated buffer quickly. There are several strategies for avoiding this. You can log once, and then log subsequent messages on **Debug** for a period of time. You may also log only the first event, and then make the status easily visible in the Gateway or Designer.


#### Log messages involving an exception should always include a custom message, in addition to the exception object. 
If only the exception object is provided, some appenders will not store the stack trace, making troubleshooting very difficult.

### Severities
The use of severities is ultimately up to you, but here is a general guideline:

#### Error
An error in the system is typically based on some sort of exception that is unusual and should be reviewed

#### Warning
Like error, a warning is an unusual event that should likely be reviewed. It may indicate that something is not quite correct, but is not necessarily preventing correct operation.

#### Info
Standard messages indicating a change of state, or anything else that might be beneficial for the user to know.

#### Debug
Information used for troubleshooting, perhaps logged repeatedly or more frequently, and provides technical information that might only make sense to a trained user or the developer.

### Trace
Information that might be verbose. Generally, trace severity is only logged for a short period of time in order to gather information for troubleshooting. This level is usually very technical, such as packet contents and result codes.