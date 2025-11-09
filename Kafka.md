### Apache Kafka architecture

## Core components

- **Producers:** Applications that publish (write) events to Kafka topics.

- **Consumers:** Applications that subscribe to (read and process) these events.

- **Brokers:** Kafka servers that store data and serve client requests. A Kafka cluster consists of multiple brokers.

- **Topics:** A logical channel that organizes messages, where producers write data and consumers subscribe to them.

- **Partitions:** A sub-division of a topic, enabling parallel processing. Each partition is replicated across brokers for fault tolerance.

- **Offsets:** A unique ID for each message within a partition, representing its position.

- **Consumer Groups:** Groups of consumers that work together to consume messages from a topic.

- **ZooKeeper:** Coordinates and manages Kafka brokers and clusters, ensures fault tolerance, and handles leader elections for partitions. According to Medium, ZooKeeper is being replaced by KRaft in newer versions. 

### How Kafka works

- Producers send messages (events) to Kafka topics.
Kafka brokers store these messages in partitions, assigning each message a unique offset.
Consumers read messages from the topics, either in real-time or by replaying old messages from a specific offset.
Kafka's architecture, including the use of partitions and consumer groups, enables high throughput, scalability, and fault tolerance. 

### Kafka Stream architecture

**Kafka Streams:** A client library for processing and analyzing data stored in Kafka, notes Apache Kafka.

**DSL (Domain-Specific Language):** A high-level abstraction for constructing stream processing logic. It provides built-in operations like map, filter, join, and aggregations for both stateless and stateful transformations.
Processor API: A lower-level, imperative API that allows developers to define and connect custom processors and interact with state stores, offering fine-grained control over data processing.

**Topology:** Defines the stream processing logic in your application.

**Stream Tasks:** Stream processing logic is scaled by dividing it into multiple tasks, each handling a set of input partitions.

**State Stores:** Embedded within stream tasks, these stores are used to manage stateful operations like aggregations and joins.

**KStream:** Represents an ongoing flow of records, with each record being an "insert" (like adding entries to an append-only ledger).

**KTable:** Maintains an updatable view of the stream, where each record is considered an "update" (like rows in a database table).

**GlobalKTable:** Similar to a KTable, but is populated with data from all partitions of a topic, according to Medium. 

### How Kafka Streams works

- Kafka Streams applications consume data from Kafka topics.
- They process these streams of data using either the DSL or the Processor API to build a processing topology.
- For stateful operations (e.g., aggregations, joins), Kafka Streams leverages internal state stores.
- Results are often written back to Kafka topics or can be integrated with external systems. 
- Related interview questions and answers

### Apache Kafka

**What is Apache Kafka?**

Apache Kafka is a distributed event streaming platform for building real-time data pipelines and streaming applications. It's a highly scalable, fault-tolerant, and durable messaging system.

**Explain the key components of Kafka's architecture.**

Brokers: Servers that store and serve messages.

Topics: Categories or feeds for messages.

Partitions: Divisions of topics, enabling scalability and replication.

Producers: Clients that send messages to topics.

Consumers: Clients that read messages from topics.

ZooKeeper: Coordinates brokers and maintains cluster metadata (being replaced by KRaft).

**How does Kafka achieve fault tolerance?**

Kafka achieves fault tolerance through replication. Partitions of a topic are replicated across multiple brokers. If a broker fails, a replica can become the new leader, ensuring data availability.

**Explain the concept of "offset" in Kafka.**

An offset is a unique ID number assigned to each message within a partition, representing its position in the partition's log, notes Simplilearn.com. Consumers use offsets to track their progress and resume reading after a failure.

**What is a consumer group in Kafka?**
A consumer group is a collection of consumers that work together to consume messages from one or more topics. Each consumer in a group reads from a unique set of partitions, ensuring load balancing and high availability. 

**Kafka Streams**

**What is Kafka Streams?**

Kafka Streams is a client library for building real-time stream processing applications that run on data stored in Kafka topics, according to Apache Kafka.

**What is the difference between KStream and KTable?**

KStream: Represents an unbounded stream of records, where each record is treated as an "insert" or an independent event. Examples include credit card transactions or log entries.

KTable: Represents a changelog stream, where each record is an update to a specific key, like a database table. It maintains the latest value for each key.

**When would you use the Kafka Streams DSL versus the Processor API?**

DSL (Domain-Specific Language): Use for most common stream processing tasks (filtering, mapping, joining, aggregations) as it's easier to use and more concise.

Processor API: Use for complex scenarios requiring fine-grained control, custom state management, or integration with external systems, says Redpanda.

**How does Kafka Streams handle stateful operations?**

Kafka Streams supports stateful operations (like aggregations, joins, windowing) by using state stores embedded within stream tasks. These state stores are backed by local storage (often RocksDB) and can be fault-tolerant via replication to Kafka topics.

**Explain the concept of "windowing" in Kafka Streams.**

Windowing involves grouping and processing records within specific time boundaries. Kafka Streams offers different types of windows (tumbling, hopping, sliding) to perform aggregations or joins on data received within these windows, says Medium. This is crucial for handling time-sensitive data and out-of-order records. 

### 🔄 How Kafka Handles Message Sequencing:
1. **Messages go to a topic partition**
A Kafka topic can have multiple partitions.

When a producer sends messages to a topic:

It either specifies a key or not.

If a key is used, Kafka uses the key's hash to decide which partition.

If no key is used, Kafka distributes messages round-robin (default strategy) to partitions.

2. **Ordering is guaranteed within a single partition**
Kafka assigns an offset (a sequential ID) to each message within the partition.

Consumers reading from a partition get the messages in the exact order.

**📌 Example:**
Let’s say you have a Kafka topic orders with 3 partitions (P0, P1, P2).

You send messages like:
```
OrderID=1001
OrderID=1002
OrderID=1003
...

```
If:

You send messages with the same key:
**e.g.**, key = CustomerID-123
- all messages for that customer will go to same partition, say P0
- ✅ Sequence is preserved.

You send without a key:
- Kafka will randomly assign to partitions (P0, P1, or P2)
- ❌ Sequence not preserved across partitions.

### 🧠 So how do you manage sequence across multiple partitions?
**You can’t, unless:**

✅ You group related messages (e.g., by customer/order ID) to same partition by using keys.
✅ You use only 1 partition (not recommended for high-throughput systems).
❌ You can't maintain strict ordering if messages are distributed to multiple partitions with different keys.

### What if you need strict ordering

**✅ 1. Use a Single Partition**

🔹 How it works:
Kafka guarantees strict ordering within a partition.

By sending all messages to one partition, you preserve order.

**✅ Pros:**
Guarantees strict, total ordering.

**❌ Cons:**
No parallelism, limits throughput and scalability.

Can become a bottleneck (one partition = one consumer thread).

🔧 Use this only when message order is absolutely critical and message volume is low to moderate.

**✅ 2. Use a Key to Partition Logically**

🔹 How it works:

Messages with the same key go to the same partition.

Ordering is preserved within that key's message stream.

**✅ Pros:**
Partial ordering per key.

Supports scalability — more partitions, each handling independent ordered streams.

**❌ Cons:**
You don’t get total ordering across the entire topic.

Consumers may need to reconstruct partial order if messages from different keys are interleaved.

✅ Use this when you need ordering per customer/account/session/order.

✅ 3. Re-sequencing Downstream (Custom Logic)

🔹 How it works:

Allow Kafka to scale across partitions.

At the consumer end, maintain a buffer or queue and sort messages using timestamps or sequence IDs.

**✅ Pros:**
Allows for parallel processing and higher throughput.

Can simulate global order when needed.

**❌ Cons:**
Adds latency and complexity.

Needs idempotency, out-of-order tolerance.

**✅ 4. Use Exactly-Once Semantics (EOS) + Idempotency**

Kafka producers can use exactly-once semantics to avoid duplicates and ensure proper commit order.

Combine this with transactional writes and idempotent consumers to reduce ordering issues under retries or failures.

But this only helps to a point. EOS does not enforce order across partitions.

**✅ 5. Use an External Sequencer (Rare)**
Use a separate service (or DB) to assign a global sequence ID before sending to Kafka.

Consumers then sort by this sequence number.

❌ Very uncommon — typically high overhead and adds central bottleneck.
🚫 What You Cannot Do:
You cannot guarantee strict ordering across partitions in Kafka.

Kafka is not a global FIFO queue — it’s a partitioned log system by design.

### 🔍 What is Round-Robin Partitioning?

When a Kafka producer does not specify a key, Kafka will distribute messages in round-robin fashion across all partitions for the topic.

**Example:**

Topic orders has 3 partitions: P0, P1, P2.

Producer sends 6 messages with no key:

M1 → P0
M2 → P1
M3 → P2
M4 → P0
M5 → P1
M6 → P2
🔁 This round-robin method balances load, but there’s no control over order.

**🚨 What Happens to Ordering?**

Ordering is only preserved within a single partition, so:

M1 → P0, M4 → P0 → M1 and M4 are ordered relative to each other.

But M1, M2, M3 can be processed out of order across partitions.

❌ If your messages represent updates to the same entity (like Order123), round-robin can cause updates to arrive out of sequence.

✅ When to Avoid Round-Robin
If you care about ordering for an entity, do not rely on round-robin. Instead:

✅ Use a key in the producer:
```Java
ProducerRecord<String, String> record = new ProducerRecord<>("orders", "Order123", "update1");
Kafka will hash "Order123" and route all messages for that key to the same partition, maintaining order.
```

### Common Kafka Errors

🔹 1. Message Deserialization Errors
Scenario: A message cannot be deserialized due to schema mismatch or corrupted data.

Kafka (Consumer):
❌ Consumer throws SerializationException.

✅ Fix:

Use ErrorHandlingDeserializer with Spring Kafka or custom deserializer.

Log or route to dead-letter topic (DLT).

Kafka Streams:
java
Copy
Edit
StreamsConfig.DEFAULT_DESERIALIZATION_EXCEPTION_HANDLER_CLASS_CONFIG
= LogAndContinueExceptionHandler.class;
Options:
LogAndContinueExceptionHandler: logs and skips.

LogAndFailExceptionHandler: stops the app.

🔹 2. Processing Failures (e.g. business logic errors)
Scenario: Division by zero, database call failed, or custom logic exception.

Kafka Streams:
Use transform() or process() with try-catch:

java
Copy
Edit
.mapValues(value -> {
    try {
        return process(value);
    } catch (Exception e) {
        // route to error topic or log
        return null;
    }
})
Best Practice:

Use side outputs for errors (DLQ pattern).

Use retry queue with backoff.

🔹 3. Offset Commit Failures
Scenario: Consumer can't commit offset due to network issue or broker crash.

Kafka Consumer:
Handle with retries.

In Spring Kafka: configure AckMode.MANUAL_IMMEDIATE for fine-grained control.

java
Copy
Edit
acknowledgment.acknowledge(); // commit manually
🔹 4. Rebalancing Issues
Scenario: Consumer group constantly rebalancing.

Causes:
Long processing time → heartbeat missed → kicked out.

Consumer crash/restart loop.

Fix:
Tune max.poll.interval.ms.

Ensure consumer doesn’t take too long to process.

Use pause()/resume() during long processing.

🔹 5. Lagging Consumers
Scenario: Consumer can't keep up, large lag.

Tools:
Kafka Consumer Lag UI (Burrow, Cruise Control).

kafka-consumer-groups.sh --describe ...

Fix:
Add more consumer instances (scale horizontally).

Optimize processing logic.

Increase partition count (with key-based routing in mind).

🔹 6. State Store Corruption (Kafka Streams)
Scenario: Stream app fails due to corrupted RocksDB state store.

Fix:
Use --reset on startup or delete local state store.

bash
Copy
Edit
rm -rf /tmp/kafka-streams/your-app-id
Use ApplicationResetTool to reset offsets and state.

🔹 7. Topic Does Not Exist
Scenario: Producer or consumer tries to connect to a non-existent topic.

Fix:
Enable auto topic creation only in dev/test.

In prod: validate topic existence during deployment.

Use admin client to check:
```Java
AdminClient client = AdminClient.create(props);
client.listTopics();
```

🔹 8. Kafka Broker Unavailable
Scenario: Timeout or NotLeaderForPartitionException.

**Fix:**
Check broker health.

Ensure producer/consumer is configured with all broker bootstrap addresses.

Check Zookeeper (if using older Kafka versions).

✅ Tips for Error Handling
Scenario	Handling Strategy
Bad message	Dead-letter topic (DLT), logging
Temporary failure	Retry with backoff
Fatal error	Alert and shutdown
State corruption	Reset state / reprocess
Processing exception	Use try-catch, fallback

1. How do you handle poison pills in Kafka Streams?
Poison pills are malformed or problematic messages that consistently cause processing failure. Handling them includes:

Use DeserializationExceptionHandler
Configure a custom handler to log, skip, or route bad messages:

java
Copy
Edit
props.put(StreamsConfig.DEFAULT_DESERIALIZATION_EXCEPTION_HANDLER_CLASS_CONFIG, MyCustomHandler.class);
Route to Dead Letter Queue (DLQ)
Implement a processor or error-handling mechanism to forward the bad record to a DLQ for further analysis.

Skip with Logging (default)
You can use LogAndContinueExceptionHandler:

java
Copy
Edit
props.put(StreamsConfig.DEFAULT_DESERIALIZATION_EXCEPTION_HANDLER_CLASS_CONFIG,
          LogAndContinueExceptionHandler.class);
2. What happens if Kafka Streams processing fails mid-way?
If Kafka Streams fails mid-processing:

It retries automatically depending on the configured number of retries and backoff settings.

State is recovered on restart using changelogs and Kafka’s internal topics.

In-flight data may be lost, especially if not checkpointed (committed) yet.

Exactly-once guarantees can help avoid duplication or loss if configured (processing.guarantee=exactly_once_v2).

3. Can Kafka guarantee ordering after retries or rebalancing?
Within a partition, yes: Kafka maintains order of messages.

Across partitions, no: Ordering is not guaranteed.

After rebalance:

Order is preserved within partitions.

Rebalancing may cause delay but not disorder.

Retries from producer maintain order if retries are per partition and not retried out of order.

4. How do you configure retries for a Kafka producer?
You can configure retries using producer properties:

```java

props.put("retries", 5); // Number of retries
props.put("retry.backoff.ms", 100); // Wait between retries
props.put("acks", "all"); // Strong durability
Other relevant settings:

max.in.flight.requests.per.connection: Set to 1 to ensure strict ordering during retries.

enable.idempotence: Set true for exactly-once semantics.
```

5. What if your stream application crashes repeatedly due to bad messages?
Mitigations:

Use a try-catch in your processing logic to handle known bad formats gracefully.

Send bad messages to a Dead Letter Queue (DLQ) using a custom Transformer or side-effect logging.

Skip or quarantine messages using deserialization or production exception handlers.

Add schema validation (e.g., Avro + Schema Registry) to enforce message structure.

6. What tools do you use to monitor Kafka health and lag?
🔧 Kafka Monitoring Tools:
Confluent Control Center – Enterprise UI for Kafka.

Kafka’s built-in JMX metrics – For producer, consumer, broker metrics.

Prometheus + Grafana – Most common open-source combo.

Burrow – For consumer lag monitoring.

Cruise Control – For broker balancing and monitoring.

Datadog, New Relic, Instana, Dynatrace – For APM with Kafka integration.

🔍 Key things to monitor:
Consumer lag (kafka.consumer:type=consumer-fetch-manager-metrics,metric-name=records-lag)

Under-replicated partitions

Message throughput

Broker disk usage

Producer send failures and retries