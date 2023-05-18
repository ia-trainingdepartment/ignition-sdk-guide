---
title: Module Services
sidebar_position: 8
---
Module services are a way for modules to provide APIs to other modules, or to implement well-known services in new ways. Put differently, the `ModuleSerivceManager` (accessed through `GatewayContext`) is a directory of Objects, referenced by their class type. Any module can register a new `ModuleService`, and other modules can subscribe to these types of services and retrieve the registered instance when its available. This allows child modules to get the running instance of a class provided by a parent module.

## Implementing and Registering a Module Service
To create a module service, a class or interface must extend the empty `ModuleService` marker interface. No other definition is required. This class or interface, however, will need to be located in a project that can be referenced by child modules (such as an `api` or `common` project), as they will be referring to it explicitly to retrieve the implementation. 

The cycle for a module service is:

1. Register the implementation
2. Notify the system that the service is ready
3. Modules use the service
4. Notify the system that the service is not ready, on shutdown.

For example, let's say that we want to create an "Advanced Calculation Engine", that lets sub-modules register and use new types of calculations:

```js title="Advanced Calculation Engine"
public interface AdvancedCalculationEngine extends ModuleService { 
    List<String> getCalculationTypes();
    CalculationResults performCalculation(String type, InputData data); 
    void registerCalculationType()
}
```
In the gateway hook of our module, which happens to implement our interface, we would register it with the context on setup, and notify the manager of the state on startup and shutdown:

```js title=GatewayModuleHook.java
public class AdvancedCalculationEngineGatewayHook extends AbstractGatewayModuleHook implements AdvancedCalculationEngine {
    protected GatewayContext context; 
    public void setup(GatewayContext context) {
        //Store the context locally so we can get it when we need to. 
        this.context = context;
        // highlight-next-line 
        context.getModuleServicesManager().registerService(AdvancedCalculationEngine.class, this);
    }
 
    public void startup(LicenseState activationState) { 
        // highlight-next-line
        context.getModuleServiceManager().notifyServiceReady(this);
    }
 
    public void shutdown() {
        //Stop the service and de-register it on shutdown
        // highlight-next-line 
        context.getModuleServicesManager().notifyServiceShutdown(this);
        // highlight-next-line
        context.getModuleServicesManager().unregisterService(AlarmNotificationContext.class);
    }
     
    //Implementation of the service
    ...
}
```
### Consume the Module Service
In our sub-module, which depends on the module that provides the service (so it knows about the Interface, in this example, the `AdvancedCalculationEngine`), we subscribe to the service by providing a `ModuleServiceConsumer`, and obtain the implementation when the consumer is notified that it is ready. 
To continue our example, the gateway hook of our `CalculationEngineConsumer` implements the `ModuleServiceConsumer` interface:

```js title=GatewayModuleHook.java
public class CalculationEngineConsumer extends AbstractGatewayModuleHook implements ModuleServiceConsumer {
    GatewayContext context;
    //When we get the engine from the service, we'll keep it here. AdvancedCalculationEngine engine;
    public void setup(GatewayContext context) { 
        this.context = context;
        // highlight-next-line
        context.getModuleServicesManager().subscribe(AdvancedCalculationEngine.class, this);
    }
  
    public void serviceReady(Class<?> serviceClass) {
        // highlight-next-line
        if (serviceClass == AdvancedCalculationEngine.class) {
            // highlight-next-line
            engine = context.getModuleServicesManager().getService(AdvancedCalculationEngine.class);
        }
    }
     
    public void serviceShutdown(Class<?> serviceClass) {
        if (serviceClass == AlarmNotificationContext.class) { 
            engine = null;
        }
    }
}
```
Since it is possible to subscribe to multiple service classes, it is important to check that the service being notified on is the actual class that is desired. While this example doesn't go further, the idea is that the module could now do things like register new calculations, or perform calculations through the service.

## Uses in Ignition
The module service system can be used as necessary by modules, but it is also used for several important parts of Ignition. Currently, it is used to register new OPC-UA device drivers (the `DriverManager` service interface, defined in `driver-api`), and to access the `AlarmNotificationContext`, which is part of the Alarm Notification Module and its API. 

