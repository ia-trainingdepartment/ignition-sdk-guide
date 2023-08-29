---
title: Providing Progress Information
sidebar_position: 9
---

Everyone hates it when they perform some action and the system simply locks up for an indeterminate amount of time. This is usually caused by a poorly programmed task executing for longer than expected on the EDT, which prevents the screen from updating. These situations can be drastically improved by executing the task in its own thread, and providing the user feedback as to the progress of the task. The ClientProgressManager, accessed through the ClientContext, helps with both of these.

The ClientProgressManager allows you to register tasks for execution. When the task executes, it will be in a different thread, and can provide information about its progress. The system will take care of displaying the progress for you. If the task allows canceling, the user will be given that option. Tasks initiated in the designer/client that pass to the gateway can also support progress, if programmed to do so in the gateway. Progress information generated in the gateway will be passed back to the initiating session for display.
In addition to the ClientProgressManager, a popular option is to invoke a SwingWorker.  Like the ClientProgressManager, a SwingWorker provides a means of creating a background thread to complete time or resource intensive operations while allowing the EDT continue.  SwingWorkers don't include the concept of canceling, but do support progress messages while your background tasks run.  For more information on SwingWorkers, see the [Java documentation](https://docs.oracle.com/javase/tutorial/uiswing/concurrency/worker.html).

## Creating and Executing an AsyncClientTask
To use the progress system, you must first create a task. This is done by implementing the `AsyncClientTask` interface. This interface defines three functions:
- One for the task title
- One dictating whether the task can be canceled 
- A "run" function that actually performs the task

The run function takes a `TaskProgressListener` which it can update with information, and through which the cancel state will be sent.

Once defined, the task should be registered with the `ClientProgressManager.runTask()` function. There are two forms of this function, one of which takes an additional boolean flag indicating whether the task is dominant. 

Dominant tasks are given priority for display. Normally, tasks get stacked in the order in which they're registered. Dominant tasks, however, go to the top. This is useful when creating tasks that spawn other tasks, particularly in the Gateway. If your original task is not dominant, when the next task begins it will take the display. If the original task is dominant, however, it will remain in display, and can provide information about the overall progress instead of each individual sub-task.

## Updating Progress
The executing task is provided with a TaskProgressListener that it can update with status information. This listener can be used as much as necessary - the note can be updated multiple times, the progress reset, etc.

If the task is cancelable, and has been canceled, it will be reflected through the `isCanceled()` function. Therefore, the executing task should check this flag frequently and exit gracefully if this situation is encountered.

If the progress of a task cannot be known exactly, the task should be marked as indeterminate. Indeterminate tasks do not return progress, and get displayed appropriately with a bouncing bar or other animation that indicates something is happening.

Tasks are finished when the executing function returns. If the function throws an exception, the error will be displayed to the user. Therefore, it is perfectly normal to throw exceptions when the task cannot be finished for any particular reason that the user should know about.

## Tracking Progress on the Gateway
If a client task calls a function on the Gateway that supports asynchronous invocation, the Gateway can provide progress information that gets piped back to the calling client. The client can also request that tasks on the Gateway be canceled. Unlike in the Designer/Client scope where the special interface must be implemented, the Gateway is designed to be unobtrusive and compatible with existing code. To support Gateway to Vlient progress, the invoked function must be marked as asynchronous (using the AsyncFunction annotation), and then the actual executing function must use the `GatewayProgressManager.getProgressListenerForThread()` function to get the listener to update.

For most modules, the only functions that might be used with this system are the RPC functions. For example, let's imagine that we extend our RPC example to include a function that pings an address from the Gateway multiple times, and returns whether all the attempts were successful. For simplicity's sake, the ping will be handled by a function that isn't shown:
```js
public class ModuleRPCImpl implements ModuleRPC {
    ...previous definition...
    @AsyncFunction
    public boolean testAddress(String addr){
        boolean result=true;
        //Get the progress listener for this thread
        TaskProgressListener progress = gatewayContext.getProgressManager().getProgressListenerForThread();
        progress.setProgressMax(5);
        for(Integer i=0; i<5; i++){
            //Update progress to show current state.
            progress.setProgress(i);
            progress.setNote("Executing test attempt: " + (i+1).toString());
            boolean testResult = ping(addr);
             
            if(!testResult){ 
                result=false; 
                break;
            }
         
            //If the task has been canceled,return what we have so far
            if (progress.isCanceled()) { 
                break;
            }
        }
    return result;
    }
}
```