---
title: Programming for the Gateway
sidebar_position: 4
---

## Getting Started - The Module Hook
The first step to creating a Gateway scoped module is to create a `GatewayModuleHook`. This interface defines all of the functions that Ignition expects a module entry point to have. 

Although, because there aren’t many cases where you’ll need to define everything, you’ll almost always extend from `AbstractGatewayModuleHook`.

In several cases, however, the module provides information to the platform by overriding functions in the module hook. For this reason, it is useful to view the JavaDocs for `GatewayModuleHook` and acquaint yourself with the defined methods. These methods will also be covered in the next few sections.

## Life-cycle Functions
When you extend from `AbstractGatewayModuleHook`, there are a few life cycle functions that must be implemented. 

### setup(GatewayContext context)
The goal of this function is to give the module a chance to register objects with the platform, and prepare to run by defining anything you need to start for your module to work. All code related to your module’s actual business logic will likely be in startup(), not setup().

At this stage, the modules that this module depends on (per the module.xml) will have been loaded, but you won't be able to rely on any other modules having been loaded. Furthermore, many platform functions will not be available, so you shouldn't try to reach out to other areas of Ignition much. You may query the internal database, but should not modify it. If you must modify data, wait until the startup() phase.

**GatewayContext**

The setup() function is provided a GatewayContext. This is the access point for the module to the rest of the system, and should be stored by the module into a field for later use. GatewayContext is your module’s entrypoint to the rest of the Ignition platform, when your module needs to reach out to some other subsystem. The GatewayContext instance you receive will be valid for the entire lifetime of the gateway until the next restart, so you can safely use the same instance in any of your module’s methods.

### startup(LicenseState license)
Starts execution of the module. At this point the system is almost fully running, though some modules may be started after your module. The LicenseState parameter contains details about the gateway’s license, and can be used if you want your module to work during the trial period or only work under certain licensing terms.

### shutdown()
Called when the platform is shutting down, or the module is being removed/restarted.

>**Important:** You should take special care to remove all resources added by the module to the platform. If any resource is left uncollected, the entire module will remain in memory, leading to a memory leak, which will be particularly troublesome if the module is reloaded several times in one gateway session. 

```js
Package com.inductiveautomation.ignition.examples.reporting.datasource.common.gateway;
import com.inductiveautomation.ignition.common.licensing.LicenseState;
import com.inductiveautomation.ignition.gateway.model.AbstractGatewayModuleHook;
import com.inductiveautomation.ignition.gateway.model.GatewayContext;
import com.inductiveautomation.ignition.examples.reporting.datasource.common.RestJsonDataSource;
import com.inductiveautomation.reporting.gateway.api.GatewayDataSourceRegistry;

/**
*Class which is instantiated by the Ignition *platform when the module is loaded in the *Gateway scope.
    */
    public class GatewayHook extends AbstractGatewayModuleHook {
        private GatewayContext context;
    /**
    *Called before startup. This is the chance for the module 
    *to add its extension points and update persistent records 
    *and schemas. None of the managers will be started up at this 
    *point, but the extension point managers will accept 
    *extension point types.
    */
        public void setup(GatewayContext gatewayContext) {
            this.context = gatewayContext;
        }
    /**
    *Called to initialize the module. Will only be called once. 
    *Persistence interface is available, but only in read-only mode.
    */
        public void startup(LicenseState licenseState) {
            GatewayDataSourceRegistry.get(context).register(new RestJsonDataSource());
        }
    /**
    *Called to shutdown this module. Note that this instance will 
    *never be started back up - a new one will be created if a 
    *restart is desired.
    */
        public void shutdown() {

        }
    }
```
