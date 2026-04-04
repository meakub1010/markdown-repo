**CLR** - runtime for .net framework that manages the execution of **old .net** program
it provides 
- memory management
- security
- exception handling
- garbage collection
- thread management
- execute MSIL
- convert MSIL to native code using JIT(just in time) compiler
- manages application lyfe cycle
- enforces code access security and type safety

**CLS** - Common Language Specification
it provides

- ensures interoperability among .net Languages
- ensures code written in one .net language can be used in another
- specifies subset of common features that all .net languages(C#, VB.NET, F#) must support to ensure compatibility

**.NET Runtime Architecture (High-Level)**

Your C# Code (source)
        ↓
Roslyn Compiler creates IL + metadata
        ↓
      .NET Runtime
    ┌────────────┐
    │   Loader   │  Loads assemblies (.dlls)
    │    JIT     │  Compiles IL → native code
    │    GC      │  Manages memory automatically
    │ Threading  │  Manages tasks, async/await
    │   BCL      │  Base libraries (System.*)
    └────────────┘
        ↓
_Machine Code executed on CPU_

**CoreCLR**
CLR = Common Language Runtime (old .NET Framework)
CoreCLR = Runtime used in modern cross-platform .NET 6 / 7 / 8 / 9.
Provides:

- JIT compilation
- GC
- Type system
- Assembly loading
- Exceptions
- Threading

### STACK vs HEAP memory
- stack memory is faster in allocate and deallocate compared to HEAP
- overusing heap memory cause frequent garbage collection which affect performance

- value types(stack) are copied in assignment, safer in concurrency
- reference types(heap) share memeory location, changes affect all references
- stack is thread safe but heap is not

### STACK - Value Type:

```csharp
int x = 5;
int y = x; // copy of x is assigned to y

y = 10; // x is still 5, because value is copied`
```

### HEAP - Reference Type:

````csharp
class Person { public string name; }

Person p1 = new Person { name = "Alice" };
Person p2 = p1;

p2.name = "Bob";
```
_now p1.name is also "Bob" beacause they point to same reference or heap object_

### Important notes on STACK and HEAP memory

- both are allocated in RAM
- **STACK** is allocated on the lower part of the RAM and HEAP is allocated on the upper portion of the RAM
- **STACK** is faster, smaller and limited but HEAP allows dynamic allocation but slower 
- **STACK** managed by Compiler/Runtime (LIFO), no garbase collection
- **HEAP** managed by GC(Random)
- In .NET we can specifies stack size while creating thread

```
var thread = new Thread(SomeMethod, stackSize: 2 * 1024 * 1024);
thread.start();
```

Memory Layout (simplified):

+------------------------------+
|          HEAP               |
|  "John" (string)            |
|  Person object              |
|------------------------------|
|          STACK              |
|  int x = 10                 |
|  ref to Person (pointer)    |
|  method call frames         |
+------------------------------+


### STRUCT 
struct is a value type to encapsulate small group of related variables kind of similar to class but with important differences in memeory
allocation, performance and use cases.
- allocated on stack since value type
- inheritence not supported
- copied by value
- use when object is small and contains mostly data
- you want immutable or atomic data containers like Point, Vector, Color


### FACTORY PATTERN

- **Factory Pattern** is used to create objects without exposing the creation logic to the client. It provides a layer of abstraction
over the instantiation process
- code reference FactoryPatternExample.cs

when to use Factory pattern
- need to centralize object creation logic
- when the creation logic is complex
- want to decouple clients from specific class implementations


### REPOSITORY PATTERN

- is used to abstract the data access logic from the business logic
- it acts like an in-memory collection for the domain but actually interacts with database

**Factory vs Repository Pattern**
- purpose of factory pattern is to create object but repository pattern is data access abstraction 
- factory return instance but repository returns domain/entity objects 
- use factory when instantiation logic is complex, use repository when seperate business logics from data
- Example: Factory - Vehicle Factory, Repository - product repository manages product entities

### Circuit Breaker Pattern
- Circuit breaker pattern has a different purpose than the "Retry pattern"
- Retry pattern enables application to retry an operation in the exception that the operation will eventually succeed
- Circuit breaker prevents application performing an operation that likely to fail
- An application can combine both of these pattern but retry logic should be sensitive and it should abandon retry attempts if the circuit breaker indicates that a fault is not transient


### Scenario: Application Suddenly Crashes in Production
**Problem:** .NET core API crashes intermittently without clear logs

**How to Troubleshoot**
1. Check events viewer or system logs for unhandled exceptions or memory access violations
2. Enable app.useExceptionHandler middleware to log internal errors gracefully
3. Analyze **core dumps** using **WinDbg** or **dotnet-dump**
4. Use **Application Insights** or **ELK Stack** to capture structured logs
5. **Tools**
- dotnet-dump
- WinDbg
- SeriLog/ELK
- Azure Application Insights
**Best practice** use global exception handler and circuit breaker pattern

### CPU spikes High CPU usage

- **CPU** spikes 80-100% 
- app becomes unresponsive

**Troubleshoot**
- use task manager or top/htop in linux to identify the process
- collect run time performance metrics running dotnet-trace or PerfView
- look for 
    - infinite loops
    - blocking calls on async calls
    - excessive GC collections
**Tools**
- dotnet-trace
- perfcollect(Linux)
- VS Diagnostice tools

### Memory Leak Detected After Deployment
- gradual memory growth
- out of memory exceptions

**Troubleshoot**
- monitor using **dotnet-counters** or **windows performance monitor**
- take memory dumps via **dotnet dump** and analyze with VS or DotMemory by JetBrains
- Look for
    - static collections holding reference
    - event handlers not being registered
    - large objects on HEAP not being freed

### API takes too long to respond Latency Issues

**Troubleshoot**
- use application performance monitor(APM) tools like app insights
- identify is slowness is
    - in DB - use SQL Profiler
    - in external API - add timeout and retries
    - in thread starvation - use ThreadPool.GetAvailableThreads
- use structured logging - SeriLog with proper trace ids

### Deployment works in local but fails in CI/CD

**Troubleshoot**
- check appsettings based on environment - appsettings.Development.json
- check if docker image runs fine, if in K8
- check .net sdk / runtime mismatch between dev and CI
- use dotnet publish with --self-contained if runtime not installed on target

**Tools**
- Github or Gitlab CI logs
- Docker logs
- Azure Devops release logs


### Intermittent 500 internal server errors

- log HttpContext.TraceIdentifier for correlation
- use Serilog enricher to log user/session/req id
- check middleware order
- validate appsettings for prod

### Authentication Issues in PROD

- JWT not being validated
- 401 on every call

**Troubleshoot**
- check if **clock skew** between client and server causes token invalidation
- confirm that audience/issuer settings are aligned with identity provider
- enable verbose logging for authentication
- decode JWT via jwt.io and verify claims

### Extension Methods
```
public static class StringExtensions {
    public static bool IsEmail(this string input){
        return input.Contains("@") && input.Contains(".");
    }
}

// usage
string email = "muhammad@gmai.com";
bool isValid = email.IsEmail(); // true
```
_**Note:** this keyword in the parameter tells the compiler it's an extension method_

### Operator Overloading
- let overload operators for custom behavior in your class

```
public class Money {
    public static bool operator ==(Money m1, Money m2){
        return m1.Amount == m2.Amount;
    }
    public static bool operator !=(Money m1, Money m2){
        return !(m1 == m2);
    }
}
// usage
Money a = new Money { Amount = 100 };
Money b = new Money { Amount = 100 };
Console.WriteLine(a == b); // true`
```
### Thread vs Task
**Thread**
- is a low level concept. It provides control over individual threads and works directly with the system's threading infrastructure
**Task**
- is a higher order abstraction that represents an asynchronous operation.
- it is part of Task Parallel Library(TPL) and is preferred for handling concurrency, parallelism, pooling, scheduling, execution management etc.
- 3P's
- P -> use thread pools
- P -> parallel processing
- P -> Plus( support return result, cancel, chain, async, await)
```
// Using Thread
Thread thread = new Thread(() => 
{
    Console.WriteLine("Thread started");
});
thread.Start();

// Using Task
Task task = Task.Run(() =>
{
    Console.WriteLine("Task started");
});
task.Wait();
```
### What is the use of async and await in multithreading?
- async and await are used to simplify asynchronous programming
- async marks method as asynchronous
- await is used to wait for the completion of a task
- usefull in UI apps to keep the UI responsive
```
public async Task<int> GetDataAsync()
{
    var result = await Task.Run(() =>
    {
        // Simulate a long-running task
        Thread.Sleep(2000);
        return 42;
    });
    return result;
}

public async Task ExecuteAsync()
{
    int data = await GetDataAsync();
    Console.WriteLine($"Data received: {data}");
}
```
### Explain ThreadPool and Task Parallel Library(TPL) in .NET

**ThreadPool**
- manages a pool of worker threads that are used to execute tasks without the overhead of creating and destroying threads manually

**TPL**
- builds on the threadpool to provide a higher level abstraction for scheduling work, running tasks in parallel, handling continuations

**Code using TPL**

```
using System;
using System.Threading.Tasks;

class Program
{
    static void Main()
    {
        // Using Task.Run to schedule a task on the ThreadPool
        Task<int> task = Task.Run(() => {
            // Simulate work
            int sum = 0;
            for (int i = 0; i < 10; i++)
            {
                sum += i;
                Task.Delay(100).Wait(); // Simulate delay
            }
            return sum;
        });

        // Continue with a continuation task when the first one completes
        task.ContinueWith(prevTask => {
            Console.WriteLine("Sum calculated: " + prevTask.Result);
        });

        Console.WriteLine("Main thread continues executing...");
        Console.ReadLine(); // Prevent the application from closing immediately
    }
}
```

### How do you manage Thread synchronizatin in .NET
- **lock**, ensure that only one thread executes the critical section at a time. it's a syntactic sugar for **Monitor.Enter/Monitor.Exit**
- **Monitor**, provide more controls with careful coding
- **Mutex**, kernel level synchronization primitive that can work across process bounnderies
- **Semaphore**, allows limiting the number of thread that can access a resource concurrently

**Lock:**
```
using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    private static readonly object _lockObj = new object();
    private static int _counter = 0;

    static void Main()
    {
        Parallel.For(0, 1000, i =>
        {
            // Synchronize the increment operation
            lock (_lockObj)
            {
                _counter++;
            }
        });

        Console.WriteLine($"Final counter value: {_counter}");
        // Expected output: Final counter value: 1000
    }
}
```
### What is Deadlock and how can you prevent them in a multi-threaded .net application
- deadlock occurs when two or more threads are waiting indefinitelty for resources locked by each other.

**Prevention Strategies**
- **Lock Ordering**, always acquire locks in a consistent order
- **Timeout** use synchronization primitive that support timeouts
- **Minimize lock scopes**, keep critical sections as short as possible
- **Using concurrent collections** when possible use thread safe collection from System.Collections.Concurrent

### What is thread safe lazy initialization in .net

- Thread-safe lazy initialization ensures that an object is created only once, even when multiple threads attempt to access it concurrently
**Code**
```
using System;

class Program
{
    // The Lazy<T> initializer ensures that the object is created in a thread-safe manner.
    private static readonly Lazy<HeavyObject> _lazyObject =
        new Lazy<HeavyObject>(() => new HeavyObject(), isThreadSafe: true);

    private static readonly Lazy<HeavyObject> _obj = new Lazy<HeavyObject>(() => new HeavyObject(), isThreadSafe: true);

    static void Main()
    {
        // The object is initialized when accessed for the first time.
        HeavyObject obj = _lazyObject.Value;
        obj.DisplayMessage();
    }
}

class HeavyObject
{
    public HeavyObject()
    {
        Console.WriteLine("HeavyObject is being constructed...");
    }

    public void DisplayMessage()
    {
        Console.WriteLine("HeavyObject instance is now in use.");
    }
}
```

  ### HTTP status code usage
  | HTTP Verb         | Status Code | When?                              |
| ----------------- | ----------- | ---------------------------------- |
| `GET /users`      | 200         | Returns a list of users            |
| `POST /users`     | 201         | A user was created                 |
| `DELETE /users/5` | 204         | User deleted, no content to return |
| `PUT /users/5`    | 200 or 204  | User updated                       |
| `GET /unknown`    | 404         | User doesn't exist                 |

### How to write custom middleware in .net

- Create class with constructor that accept (RequestDelegate next) as param
- Implement async Task InvokeAsync(HttpContext context)
- after the work is done for custom middleware call next middleware await next(context)

**Create custom middleware:**
```
public class MyCustomMiddleware
{
    private readonly RequestDelegate _next;

    public MyCustomMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Before the next middleware
        Console.WriteLine($"[Middleware] Request: {context.Request.Method} {context.Request.Path}");

        await _next(context); // Call the next middleware

        // After the next middleware
        Console.WriteLine($"[Middleware] Response: {context.Response.StatusCode}");
    }
}
```
**Create extension method for clean usage**

```
public static class MyCustomMiddlewareExtensions
{
    public static IApplicationBuilder UseMyCustomMiddleware(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<MyCustomMiddleware>();
    }
}

```
**Register the middleware in the Pipeline(Program.cs)**

```
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseMyCustomMiddleware(); // 👈 Custom middleware goes here

app.MapControllers(); // Or app.Run(...) if using minimal API
app.Run();

```

### Create singleton servie
- sealed class
- private static instance
- private constructor
- public attribute to read singleton instance
- public method to do the activities

**Code**
```
public interface ILoggerService
{
    public void Log(string message);
}
public sealed class LoggerService : ILoggerService // sealed class
{
    // read only private instance
    private static readonly LoggerService _instance = new LoggerService();

    // private constructor
    private LoggerService()
    {
        // initialize resource if needed
    }

    // public static member to access the instance
    public static LoggerService Instance => _instance;

    public void Log(string message)
    {
        Console.WriteLine($"[LOG - {DateTime.Now}] {message}");
    }
}
```
**Register with .net**
```
services.AddSingleton<ILoggerService, LoggerService>();
```

### When Singleton is Recommended
- Stateless shared services
- When you need a single shared configuration that doesn't change during runtime.
- When creating the object is expensive and you want to reuse it (e.g., DB connection factory, thread pool manager).


### When Singleton is not recommended
- If the class holds mutable state that varies per user or session, singleton can cause shared-state bugs.
- Hard to test and maintain
- If not implemented correctly, can cause race conditions or data corruption.

### Best practice: Use DI with Singleton Lifetime
In modern frameworks (e.g., ASP.NET Core), you don't implement singletons manually. You let the DI container manage the lifetime:
**Code**
```
public interface IMyService { }
public class MyService : IMyService { }

// Register in Startup.cs or Program.cs
services.AddSingleton<IMyService, MyService>();

```

### Inheritence Vs Decorator Pattern

**Inheritence**
- inheritence happens compile time, we need to implement subclass for every combination
- this is not flexible, we need to use composition instead of inheritence

**DECORATOR PATTERN**
- Decorator pattern allows us to add new functionality to an existing object without altering its structure
- It is achieved by creating a set of decorator classes that are used to wrap concrete components

**Implement Decorator Pattern**
- Create interface(ICoffee)
- Create decorator with constructor that receive ICoffee and also implements ICoffee
- Inside the decorator within the ICoffe member functions you get base cost and base flavor plus add new flavor and cost based on with decorator you are in
- and we keep wrapping plain coffee with multiple decorators


**Code for Inheritence**
```C#
public class Coffee
{
    public virtual string GetDescription()
    {
        return "Coffee";
    }

    public virtual double GetCost()
    {
        return 2.0; // Base cost of coffee
    }
}
public class MilkCoffee : Coffee
{
    public override string GetDescription()
    {
        return base.GetDescription() + ", Milk";
    }

    public override double GetCost()
    {
        return base.GetCost() + 0.5; // Additional cost for milk
    }
}

// and so on for other add-ons like Sugar, Whipped Cream, etc.
public class SugarCoffee : MilkCoffee
{
    public override string GetDescription()
    {
        return base.GetDescription() + ", Sugar";
    }

    public override double GetCost()
    {
        return base.GetCost() + 0.2; // Additional cost for sugar
    }
}
```

**Code for Decorator**
```csharp
public interface ICoffee
{
    string GetDescription();
    double GetCost();
}

public class PlainCoffee : ICoffee
{
    public string GetDescription()
    {
        return "Plain Coffee";
    }

    public double GetCost()
    {
        return 2.0; // Base cost of coffee
    }
}

public class MilkDecorator : ICoffee
{
    private readonly ICoffee _coffee;

    public MilkDecorator(ICoffee coffee)
    {
        _coffee = coffee;
    }

    public string GetDescription()
    {
        return _coffee.GetDescription() + ", Milk";
    }

    public double GetCost()
    {
        return _coffee.GetCost() + 0.5; // Additional cost for milk
    }
}

public class SugarDecorator : ICoffee
{
    private readonly ICoffee _coffee;

    public SugarDecorator(ICoffee coffee)
    {
        _coffee = coffee;
    }

    public string GetDescription()
    {
        return _coffee.GetDescription() + ", Sugar";
    }

    public double GetCost()
    {
        return _coffee.GetCost() + 0.2; // Additional cost for sugar
    }    
}
```

**Usage Example**

```C#
public class DecoratorInheritenceExample
{
    public static void Main(string[] args)
    {
        ICoffee coffee = new PlainCoffee();
        Console.WriteLine($"{coffee.GetDescription()} - ${coffee.GetCost()}");
        coffee = new MilkDecorator(coffee);
        Console.WriteLine($"{coffee.GetDescription()} - ${coffee.GetCost()}");
        coffee = new SugarDecorator(coffee);
        Console.WriteLine($"{coffee.GetDescription()} - ${coffee.GetCost()}");
        // Output:
        // Plain Coffee - $2.0
        // Plain Coffee, Milk - $2.5  
        // Plain Coffee, Milk, Sugar - $2.7
        // This allows us to dynamically add functionality without modifying the original object  
    }
}
```

### .NET Services

###region  1. Transient

**What it is:** A new instance of the service is created every time it's requested from the DI container. This means if a service is injected into multiple places within a single request, each injection will get a fresh instance.

**When to use it:**

- **Stateless, Lightweight Operations:** Ideal for services that perform operations without relying on internal state or shared data across requests.
- **Disposable Services:** Suitable for services that need to be created, used, and then disposed of immediately after their use.
- **Utility Services:** Examples include formatters, mappers, or simple calculation services that do not maintain any state, says Medium.
- **Multithreading:** Can be a good choice for multithreading operations as each thread gets its own instance, according to ByteHide.
- **Considerations:** Overusing transient for heavy or expensive services can lead to performance degradation due to the frequent instantiation, notes codewithmukesh. 


### 2. Scoped

**What it is:** A new instance of the service is created once per client request (typically an HTTP request) and shared across all components that participate in that request. This instance is then disposed of when the request ends.

**When to use it:**

- **Request-Specific Operations:** Perfect for services that need to share context or state within the scope of a single request, but should not persist across different requests.

- **Database Contexts:** Commonly used for database contexts like **DbContext in Entity Framework**, ensuring all operations within a single request use the same database connection and context, avoiding inconsistencies or multiple connections, according to codewithmukesh.

- **Unit of Work Patterns:** Well-suited for implementing the Unit of Work pattern, where all database operations within a request are managed as a single transaction.
User-Specific Data: For services caching or managing user-specific data during a request, according to Medium.

- **Considerations:** Scoped services should not be injected directly into Singleton services as this can lead to runtime errors or unexpected behavior because a singleton lives longer than a scope, according to codewithmukesh. 

### 3. Singleton

**What it is:** Only one instance of the service is created for the entire lifetime of the application, and this same instance is shared across all requests and consumers.

**When to use it:**

- **Stateless Services:** Ideal for services that do not maintain any internal state and can be safely shared across the entire application.
Configuration: Services providing configuration settings that are constant for the application's duration.

- **Caching Services:** For application-wide caches or shared resources accessed by many components.

- **Logging Services:** Centralized logging services that need to be accessible from all parts of the application, says Medium.

- **Expensive Initialization:** When a service is expensive to create or initialize, and you only need one instance for the entire application, according to Reddit.

- **Considerations:** Since singleton services are shared across all threads, you must ensure they are thread-safe if they maintain any mutable state, notes Reddit. Avoid injecting Scoped or Transient services directly into a Singleton, as this can lead to issues due to the lifetime mismatch.


### AzureDevOps

```yml
# azure-pipelines.yml

trigger:
  branches:
    include:
      - develop
      - main

pr:
  branches:
    include:
      - develop
      - main

schedules:
  - cron: "0 2 * * *"       # Daily at 2:00 AM UTC
    displayName: Daily Build
    branches:
      include:
        - develop
        - main
    always: true

variables:
  buildConfiguration: 'Release'
  solution: '**/*.sln'
  artifactName: 'drop'

stages:

# ----------------------------
# Stage 1: Build
# ----------------------------
- stage: Build
  displayName: 'Build .NET REST API'
  jobs:
  - job: BuildJob
    pool:
      vmImage: 'windows-latest'
    steps:
      - task: UseDotNet@2
        displayName: 'Install .NET SDK'
        inputs:
          packageType: 'sdk'
          version: '7.x'    # adjust to your .NET version

      - task: NuGetToolInstaller@1

      - task: NuGetCommand@2
        inputs:
          restoreSolution: '$(solution)'

      - task: VSBuild@1
        inputs:
          solution: '$(solution)'
          configuration: '$(buildConfiguration)'

      - task: VSTest@2
        inputs:
          platform: 'Any CPU'
          configuration: '$(buildConfiguration)'

      - task: PublishBuildArtifacts@1
        inputs:
          PathtoPublish: '$(Build.ArtifactStagingDirectory)'
          ArtifactName: '$(artifactName)'
          publishLocation: 'Container'

# ----------------------------
# Stage 2: Deploy to Dev
# ----------------------------
- stage: DeployDev
  displayName: 'Deploy to Dev Environment'
  dependsOn: Build
  condition: and(succeeded(), eq(variables['Build.SourceBranchName'], 'develop'))
  jobs:
  - deployment: DevDeployment
    environment: 'Dev'
    strategy:
      runOnce:
        deploy:
          steps:
          - task: AzureWebApp@1
            inputs:
              azureSubscription: '<YOUR-SERVICE-CONNECTION>'
              appType: 'webApp'
              appName: '<DEV-APP-NAME>'
              package: '$(Pipeline.Workspace)/$(artifactName)/**/*.zip'

# ----------------------------
# Stage 3: Deploy to Prod
# ----------------------------
- stage: DeployProd
  displayName: 'Deploy to Production Environment'
  dependsOn: Build
  condition: and(succeeded(), eq(variables['Build.SourceBranchName'], 'main'))
  approval:
    approvals:
      - name: 'Production Deployment Approval'
        reviewers:
          - '<your-email@domain.com>'
  jobs:
  - deployment: ProdDeployment
    environment: 'Production'
    strategy:
      runOnce:
        deploy:
          steps:
          - task: AzureWebApp@1
            inputs:
              azureSubscription: '<YOUR-SERVICE-CONNECTION>'
              appType: 'webApp'
              appName: '<PROD-APP-NAME>'
              package: '$(Pipeline.Workspace)/$(artifactName)/**/*.zip'

```

### Monitor .NET apps

1️⃣ Built-in .NET / OS Tools
A. Event Logs (Windows)

Event Viewer → Logs unhandled exceptions, startup issues, crashes.

Application Logs / System Logs

B. Performance Counters

Track CPU, memory, threads, GC activity.

Examples: .NET CLR Memory, .NET CLR Exceptions, .NET CLR LocksAndThreads.

Use PerfMon (Windows Performance Monitor).

C. dotnet-counters

Lightweight CLI tool to monitor performance counters in real time.

Example:

dotnet-counters monitor --process-id <PID>


Metrics: CPU usage, GC stats, exception rates, thread pool usage.

D. dotnet-trace

Collect ETW (Event Tracing for Windows) / diagnostic traces for deeper profiling.

Example:

dotnet-trace collect --process-id <PID>


Can analyze performance bottlenecks, high CPU, memory issues.

E. dotnet-dump

Take memory dump of a running process.

Analyze with Visual Studio or WinDbg:

dotnet-dump collect --process-id <PID>
dotnet-dump analyze <dumpfile>


Useful for memory leaks, deadlocks, and crashes.

F. dotnet-gcdump

Collect GC memory dumps of managed heap for memory analysis:

dotnet-gcdump collect --process-id <PID>


Inspect which objects are alive, memory growth patterns.

2️⃣ Application Performance Monitoring (APM) Tools

These are third-party or SaaS solutions for real-time monitoring in production:

Tool	Features
Application Insights (Azure)	Logs, metrics, exceptions, dependency tracking, live metrics
New Relic	Full-stack monitoring, distributed tracing, performance analytics
Datadog	APM + infrastructure monitoring + logs
Dynatrace	Automatic code-level instrumentation
Stackify Retrace	.NET performance + error tracking

Pros:

Easy to set up in production

Track slow requests, exceptions, DB calls

Correlate logs, traces, and metrics

3️⃣ Logging Frameworks
Structured Logging

Serilog, NLog, log4net

Logs errors, warnings, performance info

Output: console, file, ElasticSearch, Seq, or cloud logging (Azure, AWS, GCP)

Example with Serilog:

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/log.txt")
    .CreateLogger();

Log.Information("App started");
Log.Error(ex, "Something went wrong");


Tip: Use correlation IDs for distributed systems to trace a request across services.

4️⃣ Remote Debugging

Visual Studio Remote Debugger

Attach debugger to live server

Step through code in production (with caution!)

dotnet-monitor

Cross-platform tool from Microsoft

Exposes metrics, logs, dumps, traces over HTTP API

Lightweight, great for containerized apps

Example:

dotnet tool install --global dotnet-monitor
dotnet monitor collect

5️⃣ Profiling Tools

JetBrains dotTrace / dotMemory → CPU/memory profiling

PerfView → Windows ETW profiling, GC analysis

Visual Studio Diagnostic Tools → Attach to process for live CPU/memory profiling

6️⃣ Cloud / Container Monitoring

For modern Kubernetes / Docker deployments:

Prometheus + Grafana → Metrics, dashboards

OpenTelemetry → Distributed tracing, metrics, logs

Azure Monitor / AWS CloudWatch / GCP Operations → Cloud-native monitoring

7️⃣ Key Things to Monitor in .NET Apps
Metric	Why Important
CPU Usage	High CPU → performance bottleneck
Memory / GC	Memory leaks, Gen2 growth, frequent GC
Thread Pool / Tasks	Thread starvation, deadlocks
Exceptions	Detect errors early, analyze trends
HTTP Requests	Latency, failures, slow endpoints
Dependencies	DB, HTTP calls, external services
Startup / Shutdown	Crashes, misconfigurations
8️⃣ Recommended Stack for Production

Minimal / self-hosted approach:

Serilog / NLog → Structured logs

dotnet-monitor → Traces, counters, dumps

Application Insights / Grafana → Metrics + dashboard

PerfView / dotnet-trace → Deep performance investigation

This gives a full picture of health, performance, and exceptions.