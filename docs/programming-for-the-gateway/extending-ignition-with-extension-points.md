---
title: Extending Ignition with Extension Points
sidebar_position: 5
---

As described in the [Extension Points section](/docs/getting-started/key-design-concepts/extension-points.md), extension points are hooks that allow modules to implement new versions of abstract ideas, such as a new type of authentication profile or a new alarm journal.

## How Extension Points Work
Various parts of the system have been defined as "extension points". These parts include:

* User Schedules 
* Alarm Notification
* Audit logging
* Email providers
* OPC connections
* Tag history providers
* Tag providers
* User sources
* OPC UA module device

Each one of these parts has an extension point type defined for it, and a manager that handles the bookkeeping of registered types. There is also a base settings record defined for the type.

When the system starts up, modules register new extension point implementations with the managers. When a user chooses to create a new instance of something, such as an authentication profile, the system looks at all of the registered types, and displays them to the user. When the user selects one, a new base settings record is created for the new profile. If the extension point implementation defines additional settings, an instance of that persistent record will also be created and linked to the base record.

When it comes time to start up the profiles, the manager will locate the registered type and call its create function, providing it with the GatewayContext and the base profile setting record. The custom type can use this profile record to load its settings record, and instantiate the implementing class.

At a high level, the process for creating a new extension point implementation is as follows:

1. Create a class that implements the desired type of object.

    Ultimately, the goal is to provide your own implementation of functionality to some piece of the system before you worry too much about the other scaffolding needed in Ignition. Here is an example implementing a custom alarm notification system. The rest of the Extension Point system is for bookkeeping and linking in your class. The table below specifies which interface to implement for each extension point. 
    <!-->Where is the table?<-->

2. Define the extension point type.

    Each system in Ignition that exposes an extension point will define an abstract implementation of ExtensionPointType. In addition to default implementations, it will also define a function to instantiate an instance of the type. Your extension point definition will implement this function in order to load and configure your implementation at runtime.

3. Define any settings that will be required for the implementation
    
    If your implementation has its own settings, you can define your own PersistentRecord to hold them. The persistent record that you define must have a reference to the profile record for the Extension Point you are implementing.

    For example, if implementing an authentication profile with custom settings, your settings record would have the following reference in it:

    ```JSON
    public static final LongField ProfileId = new LongField(META, "ProfileId", SFieldFlags.SPRIMARY_KEY);
    
    public static final ReferenceField<AuthProfileRecord> Profile = new ReferenceField<AuthProfileRecord>(META, AuthProfileRecord.META, "Profile", ProfileId);
    ```

    It's worth noting that in that example, the ProfileId is used not only as the foreign key, but also the primary key for our settings record. Therefore, for this persistent record, there would not be a separate IdentityField defined.

4. Register the extension point with the appropriate manager.

    The final task is to actually register the extension point with the system, through the appropriate manager. In the startup() function of your GatewayModuleHook, use the manager specified below to add your type. 
    <!-->Specified below, where?<-->
