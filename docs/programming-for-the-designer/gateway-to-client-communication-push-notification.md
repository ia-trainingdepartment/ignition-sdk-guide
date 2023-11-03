---
title: Gateway to Client Communication (Push Notification)
sidebar_position: 8
---

Somewhat similar to RPC, but in reverse, is the Push Notification System. This system allows the Gateway to send messages to Clients and Designers. The messages are sent through the GatewaySessionManager and can be sent to a specific Client or to all currently active sessions.

## How Push Notifications Work
Push notification messages are defined by three fields:
- moduleId
- messagetype
- message
The first two are string fields used to identify the receiver, while the third is a serializable object to be delivered.

The Gateway places these notifications into a queue for each Client Session that should receive them, and the client retrieves them at the next Gateway poll. The messages are then delivered to any registered listeners in the client.

## Receiving Messages in the Designer/Client
To receive push messages in the Client, you simply register a PushNotificationListener with the GatewayConnectionManager singleton. For example:
```js
GatewayConnectionManager.getInstance().addPushNotificationListener(new MyPushListener());
```

The only problem with this is that the listener will receive all push messages, for all modules, and will need to filter them itself. To help, the FilteredPushNotification base class can be used instead. This class will automatically filter messages based on module ID and message type.

#### Delivering Messages on the EDT
It is common that messages received will trigger a change to the UI state of a module. As UI operations should only be performed on the Event Dispatch Thread (EDT), the code handling push notifications often contains many calls to EventQueue.invokeLater(). If you override the dispatchOnEDT() method to return true, the FilteredPushNotification class can handle this task for you.
:::note
The examples in this chapter use strings directly for the module id and message ids to improve clarity, but as mentioned elsewhere, it is preferable to define these strings as constants in a central "module meta" class.
:::

## Sending Messages From the Gateway
#### Sessions and the GatewaySessionManager
Before using the push notification system, it is important to understand the concept of a session. A session, as the name implies, is one particular instance of a client connection, spanning its lifetime. The term “client” is used to describe both Designer connections and Vision module runtime clients. When a user logs in, a session is created with a unique identifier, and is categorized based on the “scope”, or connection type, it represents.

The sessions are managed by GatewaySessionManager, and can be accessed through that system in the GatewayContext.

#### Sending Notifications
There are two ways to send notifications to many clients at once through GatewaySessionManager.sendNotificaton() or to a specific client session, by getting the ClientReqSession object from the GatewaySessionManager and calling addNotification(). Since the first method is able to filter based on scope, the second method is generally only used in more complex schemes where the client registers itself with the module on the Gateway through RPC. This provides the Gateway with its session ID, after which the Gateway then sends messages specifically for that client.

#### Example: Sending a Notification to all Designers
Designer sessions are identified with the scope ApplicationScope.DESIGNER. Therefore, it’s easy to send a message to all active designers through the GatewaySessionManager. In this example, we send a message with the ID “IMPORTANT_MSG” to our module in the Designer. The message class called ImportantMessage is an imaginary serializable message that will be delivered to the other side.
```js
context.getGatewaySessionManager().sendNotification(ApplicationScope.DESIGNER, "mymodule_id", "IMPORTANT_MSG", new ImportantMessage("Problem detected!", true));
```