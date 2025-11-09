### 👉DDL - Data Definition Language
Used to define or modify the structure of database objects (tables, schemas, etc.)

| Command    | Description                                       |
| ---------- | ------------------------------------------------- |
| `CREATE`   | Create new table, database, index, etc.           |
| `ALTER`    | Modify an existing table structure                |
| `DROP`     | Delete table, view, or database                   |
| `TRUNCATE` | Remove all rows from a table (faster than DELETE) |
| `RENAME`   | Rename database objects (not in all DBs)          |


_📌 These commands define the schema. They are auto-committed (cannot be rolled back)._

### 👉DML – Data Manipulation Language

Used to work with the actual data inside tables

| Command  | Description                               |
| -------- | ----------------------------------------- |
| `SELECT` | Retrieve data from one or more tables     |
| `INSERT` | Add new rows to a table                   |
| `UPDATE` | Modify existing rows                      |
| `DELETE` | Remove rows from a table                  |
| `MERGE`  | Insert/update based on condition (UPSERT) |

_📌 These are transactional (can be rolled back or committed)._


### 👉DCL – Data Control Language
Used to control access to data in the database

| Command  | Description                 |
| -------- | --------------------------- |
| `GRANT`  | Give user access privileges |
| `REVOKE` | Take away user privileges   |


### How to write MERGE and UPSERT Query
```SQL
MERGE INTO target_table AS target
USING source_table AS source
ON target.id = source.id
WHEN MATCHED THEN
    UPDATE SET target.name = source.name
WHEN NOT MATCHED THEN
    INSERT (id, name)
    VALUES (source.id, source.name);
```
**Let’s say we have a table Employees and want to insert or update records from NewEmployees.**
```SQL
MERGE INTO Employees AS e
USING NewEmployees AS ne
ON e.EmployeeID = ne.EmployeeID
WHEN MATCHED THEN
    UPDATE SET 
        e.Name = ne.Name,
        e.Department = ne.Department
WHEN NOT MATCHED THEN
    INSERT (EmployeeID, Name, Department)
    VALUES (ne.EmployeeID, ne.Name, ne.Department);
```

### 🔹 @@IDENTITY

**Definition:**
Returns the last identity value inserted into an identity column in **any table in the current** session.

**Example:**
```SQL
INSERT INTO Users (Name) VALUES ('Alice');
SELECT @@IDENTITY;  -- Returns the ID generated for Alice
```

⚠️ Caution:
It can return the identity value from a trigger if one was fired, which can lead to unexpected results.

### 🔹 SCOPE_IDENTITY()
Recommended alternative to **@@IDENTITY**

**Definition:**
Returns the last identity value inserted in the same scope.

**Example:**

```SQL
INSERT INTO Users (Name) VALUES ('Bob');
SELECT SCOPE_IDENTITY();  -- Safe: Only returns Bob's ID
```

### 🔹 IDENT_CURRENT('TableName')
**Definition:**
Returns the last identity value generated for a specific table, regardless of session or scope.

**Example:**
```SQL
SELECT IDENT_CURRENT('Users');
```

⚠️ Not limited to your session — use carefully in multi-user environments.


### Summary

| Function             | Returns identity from       | Session-Specific | Scope-Specific | Trigger-Safe |
| -------------------- | --------------------------- | ---------------- | -------------- | ------------ |
| `@@IDENTITY`         | Last identity in session    | ✅                | ❌              | ❌            |
| `SCOPE_IDENTITY()`   | Last identity in same scope | ✅                | ✅              | ✅            |
| `IDENT_CURRENT('T')` | Last identity for table `T` | ❌                | ❌              | ✅            |


### What is PIVOT in SQL
In SQL, a **PIVOT** is used to transform rows into columns, allowing you to **reorganize and summarize data in a more readable or analytical format.**

```SQL
    SELECT *
    FROM (
        SELECT customer_id, item, amount
        FROM Orders
    ) AS src
    PIVOT (
        SUM(amount)
        FOR item IN ([Keyboard], [Mouse], [Monitor], [Mousepad])
    ) AS PivotTable;
```


### What is Window function in SQL
A window function performs a calculation across a set of rows that are related to the current row, without collapsing the result into a single row (unlike aggregate functions with GROUP BY).

🔍 Key Features:
It works on a "window" (subset) of rows related to the current row.

The result is returned for every row, unlike GROUP BY which reduces rows.

Always used with the OVER() clause.

**Common Window Functions**

| Function          | Purpose                           |
| ----------------- | --------------------------------- |
| `ROW_NUMBER()`    | Unique sequential number per row  |
| `RANK()`          | Ranking with gaps for ties        |
| `DENSE_RANK()`    | Ranking without gaps for ties     |
| `NTILE(n)`        | Divides rows into `n` buckets     |
| `SUM()`, `AVG()`  | Running totals or moving averages |
| `LAG()`, `LEAD()` | Access previous/next row values   |
| `FIRST_VALUE()`   | First value in the window         |
| `LAST_VALUE()`    | Last value in the window          |


```SQL

```
### ✅ 1. RANK() vs DENSE_RANK()
Both are window functions used for ranking rows based on a column's value. The difference is in how they handle ties (duplicate values).

**🔹 RANK():**
Skips ranking numbers after a tie.

Leaves a "gap" in the ranking.

**🔹 DENSE_RANK():**
No gaps — assigns the next available rank after a tie.

🧪 Example:
```SQL
SELECT name, score,
    RANK() OVER (ORDER BY score DESC) AS rank,
    DENSE_RANK() OVER (ORDER BY score DESC) AS dense_rank
FROM students;
```

### ✅ 2. Why use HAVING instead of WHERE?
🔹 **WHERE** filters rows **before aggregation.**
🔹 **HAVING** filters groups **after aggregation (GROUP BY).**
🧪 Example:
```SQL
    -- Invalid: WHERE can't use aggregate
    SELECT customer_id, SUM(amount) AS total
    FROM Orders
    WHERE SUM(amount) > 1000 -- ❌ ERROR
    GROUP BY customer_id;

    -- Correct: Use HAVING
    SELECT customer_id, SUM(amount) AS total
    FROM Orders
    GROUP BY customer_id
    HAVING SUM(amount) > 1000; -- ✅
```
➡️ Use HAVING when filtering on aggregated values like SUM(), COUNT(), etc.

### ✅ 3. How does MERGE handle concurrency?
MERGE (also known as upsert) combines INSERT, UPDATE, and DELETE into a single atomic operation.

**🔒 Concurrency concerns:**
**Race conditions:** Two sessions may try to update/insert the same row.

**Deadlocks:** Can occur if multiple MERGE statements conflict.

**Lost updates:** If the same row is updated by different users.

**🔐 How to handle:**
Use Transactions:

Wrap MERGE in a transaction to ensure atomicity.

Apply Row-level Locking (SQL Server):

You can add hints like HOLDLOCK or SERIALIZABLE.
```SQL
MERGE target_table WITH (HOLDLOCK)
USING source_table
ON target_table.id = source_table.id
```

**Optimistic Concurrency:**

Use a version column or timestamp to detect conflicts.

Retry logic:

Handle deadlocks or concurrency failures in application logic.

➡️ Always test MERGE under concurrent loads to prevent phantom rows, double inserts, or updates being lost.


### ✅ What is a Cursor in SQL?
A cursor is a database object used to retrieve, manipulate, and iterate through a result set row by row — kind of like a pointer in programming that processes one row at a time.

### ✅ Why Use a Cursor?
Normally, SQL works on sets of rows (set-based operations). But sometimes you need row-by-row processing, especially when:

Performing operations with complex logic that can't be expressed in a single query.

Running procedural code in stored procedures or scripts.

### ✅ What is a CTE (Common Table Expression) in SQL?
A CTE (Common Table Expression) is a temporary, named result set you define within a WITH clause and use in a subsequent SELECT, INSERT, UPDATE, or DELETE.

**Example**
```SQL
WITH HighEarners AS (
    SELECT employee_id, name, salary
    FROM Employees
    WHERE salary > 100000
)
SELECT * FROM HighEarners;
```

### Temp table Vs Temp Variable
In SQL Server, temporary tables and table variables are both used to store temporary data — but they have different performance, scope, and use cases.

**Temporary Table**
```SQL
CREATE TABLE #TempTable (
    id INT,
    name VARCHAR(100)
);
```

**Table Varaible**
```SQL
DECLARE @TempVar TABLE (
    id INT,
    name VARCHAR(100)
)
```

**Example**
**✅ Table Variable:**
```SQL
DECLARE @Products TABLE (product_id INT, name VARCHAR(50));
INSERT INTO @Products VALUES (1, 'Apple'), (2, 'Orange');
SELECT * FROM @Products;
```
**✅ Temp Table:**
```SQL
CREATE TABLE #Products (product_id INT, name VARCHAR(50));
INSERT INTO #Products VALUES (1, 'Apple'), (2, 'Orange');
SELECT * FROM #Products;
```
**Global Temp Table**
```SQL
CREATE TABLE ##GlobalTempTable
-- visible across all sessions
```

**🔍 2. Key Differences**
| Feature               | #Temporary Table (`#TempTable`) | @Table Variable (`@TempVar`)        |
| --------------------- | ------------------------------- | ----------------------------------- |
| **Scope**             | Connection/session level        | Batch/procedure level               |
| **Transaction log**   | Logged like regular tables      | Minimal logging                     |
| **Indexes**           | Can add indexes explicitly      | Limited (no explicit non-clustered) |
| **Statistics**        | Has statistics (optimizer uses) | No statistics                       |
| **Performance**       | Better for large data           | Better for small datasets           |
| **Persistence**       | Exists in `tempdb`              | In memory, also tempdb backed       |
| **ALTER allowed**     | Yes                             | ❌ No `ALTER` on structure           |
| **Used in recursion** | Yes                             | Not allowed in recursive CTE        |
| **Parallelism**       | Supported                       | Not supported                       |


### Normalization
**Normalization** is the process of organizing data in a database to reduce redundancy and improve data integrity. The goal is to **divide large tables into smaller**, related ones and ensure dependencies make sense. It follows a series of "normal forms" (rules) that help refine the structure of your database.

#### Example

**🧱 Unnormalized Table (UNF)**
| StudentID | Name       | Courses       |
| --------- | ---------- | ------------- |
| 1         | John Doe   | Math, Science |
| 2         | Jane Smith | History, Math |


#### 1️⃣ First Normal Form (1NF)
**Rule:** No repeating groups or arrays. All entries must be atomic (**single value per field**).
| StudentID | Name       | Course  |
| --------- | ---------- | ------- |
| 1         | John Doe   | Math    |
| 1         | John Doe   | Science |
| 2         | Jane Smith | History |
| 2         | Jane Smith | Math    |

#### 2️⃣ Second Normal Form (2NF)
Rule: Must be in 1NF and all non-key columns must depend on the whole primary key (**no partial dependency**).

Composite key: (StudentID, Course)

Split into two tables:

**Student**

| StudentID | Name       |
| --------- | ---------- |
| 1         | John Doe   |
| 2         | Jane Smith |

**StudentCourses**

| StudentID | Course  |
| --------- | ------- |
| 1         | Math    |
| 1         | Science |
| 2         | History |
| 2         | Math    |

#### 3️⃣ Third Normal Form (3NF)
Rule: Must be in 2NF and no transitive dependencies (non-key column depending on another non-key column).

Assume we added a column "Department" based on Course:

| StudentID | Course | Department |
| --------- | ------ | ---------- |
| 1         | Math   | Science    |

**_This violates 3NF — "Department" depends on "Course", not "StudentID"._**

**Fix:**

**Courses**
| Course  | Department |
| ------- | ---------- |
| Math    | Science    |
| Science | Science    |
| History | Arts       |

Then update **StudentCourses:**
| StudentID | Course |
| --------- | ------ |
| 1         | Math   |



### ADVANCED SQL QUERY 


### 🔹 1. Find the second highest salary (without using TOP or LIMIT)
```SQL
SELECT MAX(salary) AS SecondHighestSalary
FROM Employees
WHERE salary < (
    SELECT MAX(salary) FROM Employees
);
```

### 🔹 2. Employees with higher salary than their department average

```SQL
SELECT e.* FROM Employees e
JOIN (
    SELECT id, AVG(salary) AS AvgSalary
    FROM Employees
    GROUP BY id
) d ON e.department_id = d.id
WHERE e.salary > d.AvgSalary;
```
### 🔹 3. Find duplicate records
```SQL
SELECT name, count(*) from Employees
group by name
having count(*)>1
```

### 🔹 4. Rank employees by salary in their department

```SQL
SELECT name, department_id, salary
RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as SalaryRank
FROM Employees
```
✅ Uses RANK() with PARTITION BY, very common in analytical queries.

### 🔹 5. Find gaps in a sequence(missing dates or IDs)
```SQL
SELECT id+1 AS missing
FROM Invoice
WHERE id + 1 NOT IN (SELECT id from Invoice)
```