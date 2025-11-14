# Python Coding Interview Cheatsheet

## 1. Data Types & Basics

``` python
a = 5
b = 3.14
s = "hello"
arr = [1,2,3]
t = (1,2,3)
st = {1,2,3}
d = {"a": 1, "b": 2}
```

## 2. Collections Operations

### Lists

``` python
arr.append(x)
arr.pop()
arr.pop(i)
arr.sort()
sorted(arr)
arr.reverse()
```

### List Slicing

``` python
arr[1:4]
arr[::-1]
```

### List Comprehension

``` python
[x*x for x in range(10)]
[x for x in arr if x % 2 == 0]
```

## 3. Strings

``` python
s = "apple"
s[::-1]
s.upper()
s.lower()
s.split(",")
" ".join(list)
```

## 4. Dictionaries

``` python
d = {}
d["key"] = 10
d.get("missing", 0)
for k, v in d.items(): ...
```

## 5. Sets

``` python
st = set([1,2,3])
st.add(4)
st.remove(3)
1 in st
```

## 6. Useful Built-ins

``` python
sum(arr)
max(arr)
min(arr)
abs(x)
len(arr)
```

## 7. Math / Heap / Queue

``` python
import math
math.sqrt(x)
math.floor(x)
math.ceil(x)
```

### Heap

``` python
import heapq
heapq.heappush(h, x)
heapq.heappop(h)
```

### Max-heap

``` python
heapq.heappush(h, -x)
val = -heapq.heappop(h)
```

## 8. Deque

``` python
from collections import deque
dq = deque()
dq.append(x)
dq.appendleft(x)
dq.pop()
dq.popleft()
```

## 9. Counter / defaultdict

``` python
from collections import Counter, defaultdict

freq = Counter(arr)
freq["a"]

mp = defaultdict(int)
mp["missing"] += 1
```

## 10. Sorting Tricks

``` python
arr.sort(key=lambda x: x[1])
arr.sort(reverse=True)
```

## 11. Functions

``` python
def fn(a, b=0):
    return a + b

lambda x: x*x
```

## 12. Fast I/O

``` python
import sys
data = sys.stdin.readline().strip()
```

## 13. Sliding Window Template

### No duplicates

``` python
seen = set()
l = 0
for r in range(len(arr)):
    while arr[r] in seen:
        seen.remove(arr[l])
        l += 1
    seen.add(arr[r])
```

## 14. Binary Search

``` python
import bisect
i = bisect.bisect_left(arr, target)
j = bisect.bisect_right(arr, target)
```

## 15. Graph Templates

### BFS

``` python
from collections import deque
q = deque([start])
seen = {start}
while q:
    node = q.popleft()
    for nei in g[node]:
        if nei not in seen:
            seen.add(nei)
            q.append(nei)
```

## 16. DP Memoization

``` python
from functools import lru_cache

@lru_cache(None)
def dp(i):
    if i == 0:
        return 1
    return dp(i-1) + dp(i-2)
```

## 17. Edge Helpers

``` python
float('inf')
float('-inf')
```
