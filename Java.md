## 1.Method Overloading - Compile-time Polymorphism
**Valid Overloading**
```java
void print(int a)
void print(String s)
void print(String s, int a)
void print(int a, String s)
```

**Invalid**
```java
int print(String s)
void print(String s)  // ❌ compile error
```

**Case 1 — Most specific method wins**
```java
class Test {
    void show(Object o){ System.out.println("Object")}
    void show(String o){ System.out.println("String")}

    public static void main(String[] args){
        new Test().show(null);
    }
}
```
OUTPUT:
```ts
String
```
Because String is more specific than Object.

**Case 2 — Ambiguity with siblings**
```java
class Test {
    void m(Integer i) { System.out.println("Integer"); }
    void m(String s) { System.out.println("String"); }

    public static void main(String[] args) {
        new Test().m(null);  // ❌ Compile-time error
    }
}
```
**✔ Why?**
Both Integer and String are not related, JVM can't pick one → ambiguous.

**Case 3 — Widening vs Boxing vs Varargs**
```java
class Test {
    void m(long l) { System.out.println("widening"); }
    void m(Integer i) { System.out.println("boxing"); }
    void m(int... i) { System.out.println("varargs"); }

    public static void main(String[] args) {
        new Test().m(10); // widening
    }
}
```

### 🚀 2. METHOD OVERRIDING — Runtime Polymorphism

Subclass redefines method with:

✔ Same name
✔ Same parameters
✔ Same or covariant return type
✔ Cannot reduce visibility

**Case 1 — Return type covariance**
```java
class A {
    A get() { return this; }
}

class B extends A {
    @Override
    B get() { return this; } // different return type allowed
}
```
Allowed in java

**Case 2 — Exception rules**
```java
class A {
    void m() throsws Exception {}
}
class B extends A {
    @Override
    void m(){} // allowed throws fewer/narrower checked exceptions
}
```
**Case 3 - Can't reduce visibility**
```java
class A {
    public void test(){}
}
class B extends A {
    protected void test(){} // compile error 
}
```

**Case 4 - Overriding with static -> not allowed**
```java
class A {
    static void run(){}
}

class B extends A {
    void run(){ } // Compile error, not overriding
}
```
**Case 5 - Overriding + Fields(fields never override)**
```java
class A{
    int x = 10;
}
class B extends A {
    int x = 20;
}

public class Main {
    public static void main(String[] args){
        A a = new B();
        System.out.println(a.x);
    }
}

```

## Java Virtual Machine

✅ JVM Architecture (Simple Explanation)

When you run a Java program, the JVM (Java Virtual Machine) converts your .java code → .class bytecode → executes it.

JVM has three major components:

**1. JVM Memory**
    - **Heap Memory** shared across all threads
        - Objects, Strings, Arrays, Old Gen
        - Heap maintains generations
        - Young Generation and Old Generation
    - **Stack Memory**, one stack per thread
        - contians method call frames
        - local variables
        - refrence to heap objects
    - **Method Area part of Metaspace**
        - class definitions
        - bytecode
        - method code
        - static variables
        - constants        
    - **PC Register**
        Holds current executing instruction for each thread.
    - **Native Method Stack**
    Used when Java calls native (JNI/C++) code.

**Diagram**
```markdown
                JVM MEMORY
----------------------------------------------------
|                     Heap                         |
|   [Objects]  [Strings]  [Arrays]   [Old Gen]     |
----------------------------------------------------
|      Stack (Thread 1)    |   Stack (Thread 2)    |
|  [local vars] [refs]     | [local vars] [refs]   |
----------------------------------------------------
|            Metaspace (class metadata)            |
----------------------------------------------------
|        PC Registers | Native Method Stack        |
----------------------------------------------------
```

```java
int x = 10;
Employee e = new Employee("John");
```
x → stored in stack
e → reference in stack, object in heap

Each thread has its own stack.

###🚀 Put It All Together With an Example

```java
class Employee {
    String name;
    Employee(String name) {
        this.name = name;
    }
}

public class App {
    public static void main(String[] args) {
        int x = 10;
        Employee emp = new Employee("John");
        System.out.println(emp.name);
    }
}
```
🔥 What happens step-by-step:
- **STEP 1 - Class loading**
    - App.class -> loaded into metaspace
    - Employee.class -> loaded into metaspace
- **STEP 2 - main() starts -> new Stack frame**
**Stack:**
```ts
main() frame:
  x = 10
  emp = reference to heap object
```
- **STEP 3 - new Employee()**
**Heap**
```ts
Employee@123 {
   name = "John"
}
```
Stack:
```ts
emp --> Employee@123
```
- **STEP 4 - Print Name**
Interpreter/JIT runs the code -> print "John"
- **STEP 5 - Program Ends**
GC removes Employee object from Heap

### What is JMX?

**JMX (Java Management Extensions)** is a Java technology to monitor and manage applications at runtime.

It exposes internal application metrics as **MBeans (Managed Beans).**

Examples of what JMX can monitor/manage:

- JVM memory usage
- Garbage Collection stats
- Thread usage
- Class loading
- HikariCP connection pool
- Kafka clients
- Custom application metrics

Tools like **JConsole, VisualVM**, Java Mission Control (JMC) connect using JMX and **show live data.**

### Does JMX use a specific port?

Yes.
JMX uses RMI + an additional port.

**There are two ports:**

➤ 1. RMI Registry Port

Used to create the RMI registry
(Example: 1099 — common default)

➤ 2. RMI Server Port

The actual port used to communicate
(Example: a random port unless fixed)

⚠️ By default, JVM picks a random port for RMI server → BAD for firewalls.
### How to Set FIXED JMX Ports (Important for Production)
```ts
-Dcom.sun.management.jmxremote
-Dcom.sun.management.jmxremote.port=9010
-Dcom.sun.management.jmxremote.rmi.port=9010
-Dcom.sun.management.jmxremote.local.only=false
-Dcom.sun.management.jmxremote.authenticate=false
-Dcom.sun.management.jmxremote.ssl=false
```
**Now JMX runs on port 9010 only.**

### How to Enable JMX in Spring Boot (application.properties)
```ts
management.endpoints.jmx.exposure.include=*
spring.jmx.enabled=true
```

### ⚙️ How to Connect Using JConsole / VisualVM
```bash
jconsole
```
Then choose:
Remote process
Enter: service:jmx:rmi:///jndi/rmi://<host>:9010/jmxrmi

Example:
```bash
service:jmx:rmi:///jndi/rmi://localhost:9010/jmxrmi
```
You will now see:
✔ Memory
✔ Threads
✔ GC
✔ MBeans
✔ CPU usage
✔ HikariCP pool usage

### What Can You View in JMX?

**1. JVM Metrics**

- Heap / non-heap memory
- Metaspace usage
- Thread dump
- GC count & time
- Class loading count

**2. Spring Boot Metrics**

- health status
- cache stats
- datasource connection pool usage

**3. HikariCP MBeans**

Examples:

HikariPool-1 → Active, Idle, Total Connections

**4. Custom MBeans**

You can register your own:
```java
public interface AppMetricsMBean {
    int getRequestCount();
}

public class AppMetrics implements AppMetricsMBean {
    public int getRequestCount() { return 102; }
}
```

Register:
```java
ManagementFactory.getPlatformMBeanServer()
    .registerMBean(new AppMetrics(), new ObjectName("app.metrics:type=stats"));
```
**Benefits of JMX**
✔ Production monitoring without restarting app
✔ Access JVM internals in real-time
✔ Zero code changes for basic JVM monitoring
✔ Works seamlessly with:

- VisualVM
- JConsole
- Java Mission Control
- Prometheus JMX Exporter
- Jolokia (HTTP JMX bridge)

✔ Ideal for troubleshooting:

- memory leaks
- high CPU threads
- connection pool starvation
- GC thrashing
- deadlocks

### Security Warning

**JMX should NEVER be open to the internet.**

If needed:

- **enable SSL**
- **require authentication**
- **restrict firewall to internal IPs only**

✅ 1. application.yml (Spring Boot way for JMX enablement)

You can enable/disable JMX and expose actuator beans:
```yml
spring:
  jmx:
    enabled: true

management:
  endpoints:
    jmx:
      exposure:
        include: "*"
```

⚠️ This does NOT set JMX port.
The port must be set via JVM options.

🚀 2. If you run Spring Boot using Maven/Gradle

You can configure fixed JMX ports in application.yml using:

management:
  jmx:
    enabled: true

# Pass JVM args to Spring Boot plugin
```yml
spring:
  jvm:
    arguments:
      - -Dcom.sun.management.jmxremote=true
      - -Dcom.sun.management.jmxremote.port=9010
      - -Dcom.sun.management.jmxremote.rmi.port=9010
      - -Dcom.sun.management.jmxremote.local.only=false
      - -Dcom.sun.management.jmxremote.authenticate=false
      - -Dcom.sun.management.jmxremote.ssl=false
```

⚠️ This works only if you use Spring Boot Maven/Gradle plugin that supports JVM args injection.

🐳 3. docker-compose.yml (MOST RELIABLE YAML VERSION)

This is the recommended YAML configuration for fixed JMX ports:
```yml
version: "3.8"

services:
  smart-order:
    image: smart-order:latest
    ports:
      - "8080:8080"   # Spring Boot
      - "9010:9010"   # JMX port
    environment:
      JAVA_OPTS: >
        -Dcom.sun.management.jmxremote=true
        -Dcom.sun.management.jmxremote.port=9010
        -Dcom.sun.management.jmxremote.rmi.port=9010
        -Dcom.sun.management.jmxremote.local.only=false
        -Dcom.sun.management.jmxremote.authenticate=false
        -Dcom.sun.management.jmxremote.ssl=false
    command: ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

This version is fully guaranteed to work.
## Throwable hierarchy
```ts
                     java.lang.Throwable
                     /                 \
          java.lang.Exception       java.lang.Error
                /       \
    RuntimeException   (Checked Exceptions)
```
_Errors - non-recoverable system problems like JVM failures, never be caught_

### Java Exception Handling
**Two Categories**

- **Checked Exceptions** → Must be declared or handled (e.g., **IOException, SQLException**)
- **Unchecked Exceptions** → Runtime exceptions (e.g., **NullPointerException, IllegalArgumentException**)

**Error Hierarchy**
```ts
Throwable
 ├── Exception
 │    ├── Checked
 │    └── Unchecked (RuntimeException)
 └── Error (JVM level issues) non-recoverable system problems like JVM failures, never be caught
```
**Why does Java have two types?**
- **Checked** → Encourage graceful recovery
- **Unchecked** → Programmer errors / bug indicators

**❓ Why are unchecked exceptions not required to be declared in the method signature?**
Because they indicate programming errors that should be fixed, not recovered from.

### Scenario A: Rethrowing Exceptions With Preserved Stack Trace

```java
try {
    risky();
}
catch(Exception e){
    throw new CustomException("Failed processing order", e);
}
```
_You preserve the root cause while adding context._

### Scenario B: Wrapping Checked → Unchecked
Used in modern Spring Boot systems.
```java
try{
    Files.readAllBytes(path);
}
catch(IOException e){
    throw new UncheckedIOException(e);
}
```

### Scenario C: Custom Exceptions With Metadata
```java
public class OrderProcessingException extends RuntimeException {
    private final String errorCode;
    public OrderProcessingException(String message, String errorCode, Throwable cause){
        super(message, cause);
        this.errorCode = errorCode;
    }
    public String getErrorCode(){
        retunr this.errorCode;
    }
}

// usage

throw new OrderProcessingException("Inventory unavailable", "INV_04", cause);

```

**Never swallow exceptions**
```java
catch(Exception e){
    log.error("Failed order", e);
    throw e;
}
```
### finally Block and Advanced Behaviours

**❗finally always executes EXCEPT:**

- JVM crashes
- System.exit()
- Thread death (deprecated)
- Infinite loop inside try

```java
public int test() {
    try {
        return 1;
    } finally {
        return 2; // overrides try return
    }
}
// returns 2
```

### 🔥 What Is a Suppressed Exception?

A **suppressed exception** is an exception that **occurs during cleanup (usually inside finally or when closing resources)**, but does NOT replace the main exception.

Java stores it as a secondary exception inside the main exception.

Typical scenario:

- Main exception happens in try.
- Another exception occurs in close() of a resource.
- Java does not lose the main exception — instead, the cleanup exception is suppressed.

**Why Do Suppressed Exceptions Exist?**

Before Java 7:

- If you threw an exception in try
- And another happened in finally
- The finally exception **overwrote the real root exception.**

Java 7 fixed this using **try-with-resources.**


### try-with-resources — mandatory for lead engineers
- prevents resource leaks
- handle suppressed exceptions correctly

```java
class FaultyResource implements AutoCloseable {

    public void doWork() {
        throw new RuntimeException("Exception from doWork()", new Throwable());
    }

    @Override
    public void close() {
        throw new RuntimeException("Exception from close", new Throwable());
    }

}

public class SuppressedException {
    public static void main(String[] args) {
        try (FaultyResource r = new FaultyResource()) {
            r.doWork();
        } catch (Exception e) {
            System.out.println("Main exception" + e.getMessage());

            for (Throwable suppressed : e.getSuppressed()) {
                System.out.println("Suppressed: " + suppressed.getMessage());
            }
        }
    }

}
/**
 * output:
 * Main exceptionException from doWork()
 * Suppressed: Exception from close
 */
```

### ✔ When checked exceptions make sense?

- File I/O
- Network I/O
- Database connectivity problems
- Any external resource interaction

_These are expected recoverable failures._

### How do you handle exceptions in asynchronous code?
**In Java (CompletableFuture)**

```java
CompletableFuture.supplyAsync(() -> {
    return compute();
}).exceptionally(ex -> {
    log.error("order failed", ex);
    return fallbackValue;
});
```
**Key points:**
Exceptions do NOT propagate to the calling thread.

You must handle them using:

- .exceptionally()
- .handle()
- .whenComplete()

**In Spring WebFlux (Mono/Flux)**
```java
service.call()
.onErrorResume(ex -> Mono.just(fallback));
```
**In Spring WebFlux (Mono/Flux)**
```java
@Async
public CompletableFuture<String> task(){
    try{

    }catch(Exception e){
        return CompletableFuture.failedFuture(e);
    }
}
```
_Asynchronous pipelines require their OWN error paths._

### Why is catching Exception or Throwable bad practice?
**✔ Because it hides real bugs**

Catching Exception catches:

- NullPointerException
- IllegalStateException
- IllegalArgumentException
- Programming bugs

_These should crash fast, not be masked._

**✔ Because you cannot differentiate between:**8

- recoverable failures
- programming mistakes
- system errors

**✔ Catching Throwable is even worse**

It catches:

- OutOfMemoryError
- StackOverflowError
- Internal JVM errors

_You should never catch these because you cannot recover._

**✔ It causes misleading logs**

You log one exception, but the root cause is lost.

**✔ It breaks exception hierarchy design**

### How does Spring translate exceptions across layers?

Spring uses exception translation to convert low-level infrastructure errors into meaningful application exceptions.

📌 Example: Spring Data JPA (**PersistenceExceptionTranslator**)

**When DB throws:**

- SQLIntegrityConstraintViolationException
- SQLException
- OptimisticLockException

**Spring converts them to:**

- DataIntegrityViolationException
- DataAccessResourceFailureException
- OptimisticLockingFailureException

**Why?**

**_Because you want database-agnostic exceptions._**

**_Your service should NOT need to know what DB vendor you use._**

### Flow of exception translation

```ts
DB Driver exception
     ↓
JPA Provider exception (Hibernate)
     ↓
Spring DataAccessException (Runtime)
     ↓
@ControllerAdvice converts to HTTP error JSON
```

### What is a BlockingQueue?

In Java, a BlockingQueue is a **thread-safe queue** that supports blocking operations, meaning:

Producer methods:

put(E e) → waits if the queue is full

offer(E e, timeout) → waits for specified time if full

Consumer methods:

take() → waits if the queue is empty

poll(timeout) → waits for specified time if empty

So you don’t write your own wait/notify, Java handles all of it safely.

### Why use BlockingQueue?

Because it solves the core concurrency problems:

✔ Thread-safe

Internally uses locks or lock-free algorithms.

✔ Provides built-in wait/notify logic

Producers automatically block when full.
Consumers automatically block when empty.

✔ Supports backpressure

A bounded queue naturally limits overproduction.

✔ Used by modern concurrency frameworks

ThreadPoolExecutor uses BlockingQueue<Runnable> internally.

### Future and CompletableFuture
Future<T> represents the result of an asynchronous task, but it is extremely limited.

**CompletableFuture<T> is:**

✔ A Future
✔ + Callback style
✔ + Promise style
✔ + Functional pipeline
✔ + Async chaining
✔ + Non-blocking handling

```java
import java.util.concurrent.*;

public class CompletableFutureDemo {
    public static void main(String[] args) throws InterruptedException, ExecutionException {
        ExecutorService pool = Executors.newFixedThreadPool(4);

        // complatable feature
        CompletableFuture<Integer> f1 = CompletableFuture.supplyAsync(() -> {
            sleep(200);
            return 5;
        }, pool);

        CompletableFuture<Integer> f2 = CompletableFuture.supplyAsync(() -> {
            sleep(300);
            return 10;
        }, pool);

        CompletableFuture<Integer> result = f1.thenCombine(f2, Integer::sum)
                .thenApply(sum -> sum * 2)
                .exceptionally(ex -> {
                    System.err.println("Error: " + ex);
                    return -1;
                });

        System.out.println("Result: " + result.join());
        pool.shutdown();
    }

    private static void sleep(long ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

### throws() after method name
```java
public void readFile() throws IOException {
    // code that may throw IOException
}
```
**Meaning:**
- This method may throw an IOException.
- The caller must handle it or rethrow it.

**volatile vs synchronized?**
volatile guarantees visibility and ordering for individual variable reads/writes (no compound actions). synchronized provides mutual exclusion and establishes happens-before for broader critical sections.

**When use ReentrantReadWriteLock?**
When many readers and few writers — allows concurrent readers while writers need exclusive lock.

**Why AtomicInteger instead of synchronized increment?**
Lower overhead under contention, non-blocking CAS; but beware ABA and complex multi-variable invariants.

**Explain happens-before.**
A happens-before relationship is a guarantee that memory writes by one action are visible to another. synchronized unlock → lock, volatile write → read, thread start/join create happens-before edges.

**How to avoid deadlock?**
- Use consistent lock ordering
- tryLock with timeout and backoff
- reduce lock granularity
- prefer lock-free designs.

**CompletableFuture vs Future?**
- CompletableFuture supports non-blocking composition and chaining
- Future is blocking and limited.

**How to tune ThreadPoolExecutor?**
Choose corePoolSize, maxPoolSize, queue type, and rejection policy based on task CPU/IO boundness, use metrics and scraping.

### Ways to create thread in java

**1. Extend the Thread class (Traditional way)**
```java
class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("Thread running: " + Thread.currentThread().getName());
    }
}

public class Demo {
    public static void main(String[] args) {
        new MyThread().start();
    }
}
```
✔ When to use:
Rarely — prefer using Runnable or executor services.

**2. Implement Runnable (Most common traditional way)**

```java
class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("Running in: " + Thread.currentThread().getName());
    }
}

public class Demo {
    public static void main(String[] args) {
        Thread t = new Thread(new MyRunnable());
        t.start();
    }
}

```

✔ When to use:
- When task is independent of the thread’s lifecycle.
- Classic use for concurrency.

**3. Anonymous Runnable (short form)**

```java
Thread t = new Thread(() -> System.out.println("Hello from lambda"));
t.start();
```
✔ When to use:
- Small inline tasks
- Modern Java code

**4. Using Callable + FutureTask (when you need a return value)**
```java
Callable<Integer> task = () -> 42;

FutureTask<Integer> ft = new FutureTask<>(task);
Thread t = new Thread(ft);
t.start();

System.out.println(ft.get());  // prints 42

```
✔ When to use:

- Need return value
- Need checked exceptions
- Before Java 8 CompletableFuture

**5. Using ExecutorService (modern, recommended)**
```java
ExecutorService executor = Executors.newFixedThreadPool(3);

executor.submit(() -> {
    System.out.println("Running in thread pool");
});

executor.shutdown();

```
✔ When to use:

- Server apps
- Thread pooling
- Scalable systems
- You want to avoid creating threads manually

**6. Using ScheduledExecutorService (for scheduled tasks)**
```java
ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

scheduler.schedule(() -> System.out.println("Task after 2 sec"), 2, TimeUnit.SECONDS);
```
✔ When to use:
- Repeated scheduling
- Cron-like functionality

**7. Using Virtual Threads (Java 21+, Loom)**
```java
Thread.startVirtualThread(() ->
    System.out.println("Running in a virtual thread")
);

```
✔ When to use:

- High-concurrency apps
- Replace thread pools
- Non-blocking IO
- Modern microservices
