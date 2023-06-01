---
title: Working with Platform Services
sidebar_position: 8
---

The Ignition Platform offers a wide range of services that modules can build on, instead of implementing themselves. The services presented below are provided through the ``GatewayContext`` given to each module.

## Databases

Database access is at the core of Ignition, and is used by many parts of the system. The platform manages the definition of connections and provides enhanced classes that make it easy to accomplish many database tasks with minimal work. Full access is also available to JDBC connections. Database connection pooling is handled through the Apache DBCP system, so module writers do not need to worry about the efficiency of opening connections (though it's crucial that connections are properly closed). Additional features, such as automatic connection failover, are also handled by the platform.

### Creating a Connection and Executing Basic Queries

All database operations are handled through the DatasourceManager provided by the GatewayContext. The DatasourceManager allows you to get a list of all defined data sources and open a new connection on them. The returned connection is an SRConnection, which is a subclass of the standard JDBC Connection object that provides a variety of time saving convenience functions. It’s important to remember that even when using the convenience functions the connection must still be closed. The following example illustrates the best practice of wrapping the connection in a try-with-resources block. 

New Connection Example:
```JSON int maxVal;
try (SRConnection con = context.getDatasourceManager().getConnection("myDatasource")) {
    con.runPrepQuery("INSERT INTO example(col) VALUES", 5);
    maxVal = (Integer) con.runScalarQuery("SELECT max(col) FROM example");
}
```


Note that this example does not handle potential errors thrown during query execution.

The SRConnection class also provides the following useful functions:
* ``getCurrentDatabaseTime()``: Shortcut to query the current time.
* ``getParentDatasource()``: Provides access to the datasource object that created the connection, which can provide state information and access to other important classes like the database translator.
* ``runPrep*()``: Several functions that send values to the database through prepared statements. Prepared statements, such as the one used in the example above, are preferred to text queries as they are less prone to errors.

### Executing Complex Transactions

The SRConnection extends from the standard JDBC Connection object and can be used in the same way so you can run multi-statement transactions with rollback support and use batching for high-performance data insertion. For more information, consult any JDBC guide.

### Verifying Table Structure

When creating database-centric modules, it is very common to expect a table to exist, or a need to create a table. Ignition provides a helper class called ``DBTableSchema`` that can help with this task. 

The class is instantiated with the table name and the datasource provides the database translator to use. Columns are then defined, and finally the state is checked against the given connection. Missing columns can be added later. For example, the following is a common way to define and check a table, creating it if required:

Defining Table Structure Example:
```JSON try (SRConnection con = context.getDatasourceManager().getConnection("myDatasource")) {
    DBTableSchema table = new DBTableSchema("example",con.getParentDatasource().getTranslator());
    table.addRequiredColumn("id", DataType.Int4, EnumSet.of(ColumnProperty.AutoIncrement, ColumnProperty.PrimaryKey));
    table.addRequiredColumn("col", DataType.Int8, null);
    table.verifyAndUpdate(con);
}
```

## Execution Scheduling

Performing a task on a timer or in a different thread is a frequent requirement of Gateway scoped modules. The Ignition platform makes this easy by offering ``ExecutionManager``, which manages time-based execution, can execute a task once, or allow a task to schedule itself, all while providing status and troubleshooting information through the Gateway webpage. Private execution managers can be created to allocate threads for a specific task, though, for most users, the general execution manager provided by the Gateway context should suffice.

### Registering Executable Tasks

Anything that implements Java's Runnable interface can be registered to execute with the execution manager. Tasks can either be executed once with the ``executeOnce()`` functions or registered to run repeatedly with the various ``register*()`` functions. Recurring tasks must be registered with an owner and a name. Both are free form strings and are used together to identify a unique unit of execution, so the task can be modified and unregistered later. 

Tasks can be modified after registering by simply registering again with the same name. To stop the task, call ``unRegister()``. Some functions in the execution manager return ``ScheduledFuture`` objects, which can be used to cancel execution before it happens.

### SelfSchedulingRunnable Tasks

Most tasks are registered at a fixed rate and rarely change. In some cases, the task may need to frequently change its rate and re-registering each time is inefficient. Instead of supplying a Runnable in these cases, you can implement a ``SelfSchedulingRunnable``. After every execution, the ``SelfSchedulingRunnable`` provides the delay to wait before the next execution. When it is registered, it is provided with a ``SchedulingController`` that can be used to re-schedule the task at any time. 

For example, a self-scheduling task could run every 30 seconds, and would normally return 30000 from the ``getNextExecDelayMillis()`` function. Then, if a special event occurs, the task could be executed at 500ms for some amount of time. The self scheduling runnable would call ``SchedulingController.requestReschedule()`` and would return 500 until the special event was over.

### Fixed Delay vs. Fixed Rate

Executable tasks are almost always registered with fixed delays, meaning that the spacing between executions is calculated from the end of one execution to the start of another. If a task is scheduled to run every second, but takes 30 seconds to execute, there will still be a one second wait between each event. Some functions in the execution manager allow the opposite of this with execution at a fixed rate. In this case, the next execution is calculated from the start of the event. If an event takes longer than the scheduled delay, the next event will occur as soon as possible after the first completes. 

It's worth noting that events cannot back up. If a task is scheduled at a one second rate, but the first execution takes five seconds, it will not run multiple times to make up for the missed time. Instead, it will run once, and then follow the schedule thereafter.

### Creating Private Execution Managers

In situations where the tasks being registered might take a long time to execute, and several of them may run at once, it is usually better to create a private execution manager. The private managers work the same as the shared manager, but do not share their threads. That way, if tasks take a long time to execute, other parts of the system won't be held up. 

A private execution manager can be created by creating your own ``BasicExecutionEngine`` instance. When creating an instance, you must give it a name and decide how many threads it will have access to. The amount of threads is an important consideration as too many will waste system resources, yet too few might lead to thread starvation, where no threads are available to service a task waiting to execute.

## Auditing

The Audit system provides a mechanism for tracking events that occur in the system. The events are almost always associated with a particular user, in order to build a record of who did what and when. Audit events are reported through an ``AuditProfile``, set on a per-project level. Any module that wishes to track user actions can report audit events to the profile specified for the current project.

### Reporting Events

Adding events to the audit system is as simple as generating an ``AuditRecord`` and giving it to an ``AuditProfile``. Instead of implementing the AuditRecord interface, it is more typical to use the existing ``DefaultAuditRecord`` class. Retrieve the ``AuditProfile`` to use from the ``AuditManager`` available on the ``GatewayContext``.

### Querying Events

Modules can also access the history of audit events by using the ``query()`` function on the ``AuditProfile``. This function allows filtering on any combination of parameters in the ``AuditRecord`.

## Alarming

The main components to alarming include the definition, execution, state, and the notification of alarm events. The first set of tasks is managed by the ``AlarmManager`` provided by the ``GatewayContext``, while the notification is handled by the separate Alarm Notification Module, which provides its own API.

### AlarmManager

This system handles the evaluation and state of alarms. Modules can listen for alarm events, query status and history, and even register new alarms.

### Listening for events

Alarms can be monitored by registering an ``AlarmListener`` through the ``GatewayContext.getAlarmManager().addListener(...). The addListener(...)`` method takes a QualifiedPath and delivers events at or below the specified path. Therefore, it is easy to subscribe to everything in the system, below a specific tag provider, a specific tag, or a specific alarm under a tag.

### Extended Configuration Properties

Alarms are defined using properties. AlarmEvents implement the PropertySet interface, allowing code to query what properties are defined or included in the event. Normally, users configure predefined properties on alarms through the Ignition Designer. However, modules have the opportunity to register additional well-known properties. To do this, define your properties using the AlarmProperty interface, or preferably, extending from ``BasicAlarmProperty`` and registering them through ``AlarmManager.registerExtendedConfigProperties(...)``. The latter method eliminates worry about making the implementation class available to the Designer scope as well. Now, they will display along with the standard properties in the Designer, can be set by the user, will be stored in the journal, and can be queried from the status system or retrieved from an alarm event.

### Querying Status and History

The status and history of alarms can be obtained through the ``queryStatus(...)`` and ``queryJournal(...)`` functions, respectively. Both use an ``AlarmFilter`` to specify events to return and result in an ``AlarmQueryResult``.

### Working with AlarmFilter

The alarm system provides a great deal of flexibility in querying events and the ``AlarmFilter`` class is used to define what the search parameters are. A filter consists of one or more conditions, which operate on different fields of the alarm. Only an event that passes all defined conditions will be returned. The alarm filter can be defined by creating a new instance and adding conditions for the static fields defined on the class through ``AlarmFilter.and(...)``. 

However, it is considerably easier to use the ``AlarmFilterBuilder`` helper class, unless you need to define your own type of conditions.

The following example shows how to create a filter that returns all active alarms with priority greater than Low.

```JSON 
AlarmFilter filter = new AlarmFilterBuilder().isState(AlarmState.ActiveUnacked, AlarmState.ActiveAcked).priority_gt(AlarmPriority.Low).build(); 
```

In addition to conditions, the AlarmFilter also has statically defined flags that affect how queries behave. For example, AlarmFilter.FLAG_INCLUDE_DATA specifies that the associated data of an event should be included in the query. These are applied by using the AlarmFilterBuilder or by modifying the flags object returned by AlarmFilter.getFlags().

### Working with AlarmQueryResult

Fundamentally, AlarmQueryResult is simply a list of AlarmEvents. However, additional functions that can be useful include ``getDataset()``, which returns the events as a dataset that can be used with Ignition dataset functions, and ``getAssociatedData()``, which returns the associated data of an event as a dataset. Although the information returned by these two functions can be obtained directly on the alarm events, these functions are useful when datasets are required.

### Creating New Alarms

Most alarms in Ignition are defined on tags. However, it is possible for modules to generate their own alarms. Since all alarm evaluation is handled by the ``AlarmManager``, you simply give it the definition of an alarm through ``AlarmManager.registerAlarm(...)`` and it provides an ``AlarmEvaluator`` that you update from time to time with the current value.

### Defining Alarms

An alarm configuration is defined by the AlarmConfiguration interface, which holds multiple AlarmDefinitions. This allows you to define multiple alarms for a particular source. An AlarmDefinition contains properties that define the alarm, both static and bound. It is recommended to use the ``BasicAlarmConfiguration`` and ``BasicAlarmDefinition`` classes instead of implementing the interfaces.

Most of the basic alarm properties are defined statically in ``CommonAlarmProperties``. Properties specific to the setpoint/mode are in ``AlarmModeProperties``.

**NOTE:** Once you are done using the alarm, or the source is going to be destroyed, you should call ``AlarmEvaluator.release()`` to unregister the alarms.
 
