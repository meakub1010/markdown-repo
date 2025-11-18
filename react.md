## How react application render
When you run a react app
**Initial Render**
    1. **Entry Point** (e.g., index.js in CRA / Vite):
    ```ts
    import React from "react";
    import ReactDOM from "react-dom/client";
    import App from "./App";

    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<App />);
    ```
    - React finds the root DOM node (<div id="root"></div> in index.html).
    - ReactDOM takes your React component tree (<App />) and mounts it to the real DOM.

    **Component Execution** 
        - React calls the function component (App) or class component’s render method.
        - It returns a React element tree (a description of what the UI should look like).

**Virtual DOM**
    - The returned elements are plain JavaScript objects describing the UI (not real DOM yet).
    - React builds a Virtual DOM tree (lightweight representation).

Example:

```ts 
const element = <h1>Hello</h1>;```

becomes

```json
{
  type: "h1",
  props: { children: "Hello" }
}
```

**Reconcilation && Diffing**

- React compares the new virtual DOM with the previous one.
- It figures out what’s different (diffing algorithm).
- Only the changed parts are updated in the real DOM (efficient rendering).

**Commit Phase**
- React updates the actual DOM nodes.
- Browser paints the UI on screen.

**Re-render on State/Props Change**
When a component’s state or props change:
    - React re-runs that component function.
    - Produces a new Virtual DOM subtree.
    - React diffs it against the old one.
    - Only necessary DOM updates are applied.

**Example**
```jsx
function Counter() {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```
    - Initial render → count = 0
    - User clicks → setCount(1)
    - React re-runs Counter(), builds new Virtual DOM:
        - Old: <p>You clicked 0 times</p>
        - New: <p>You clicked 1 times</p>

React updates only the <p> text in the real DOM, not the entire component.

**⚡ Putting it Together**

**Example:**

```ts
function Counter() {
  const [count, setCount] = React.useState(0);

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

## Initial Render

   **Render Phase:**
    React calls Counter() → returns <button>0</button>
    Prepares to mount this in DOM.

   **Commit Phase:**

    Inserts <button>0</button> into the real DOM.

### Runs any useEffect hooks after paint.

**Click** → setCount(1)

**Render Phase:**

React calls Counter() again → <button>1</button>

**Diffs old vs new Virtual DOM.**

Finds text node changed (0 → 1).

**Commit Phase:**

Updates only the text inside <button>.

Runs effects.

**In summary:**
**React render cycle → Component execution → Virtual DOM → Diffing → Commit to real DOM → Browser paints.**

### ⚛️ React Rendering Phases (Fiber Architecture)
    React splits rendering into two main phases:

1. **Render Phase**

2. **Commit Phase**

## Performance & Rendering Optimization

# Scenario 01:
Your app has a dashboard with 10k rows of live financial data. React UI is lagging.

**Question: How would you optimize rendering to maintain smooth UI updates?**
 # Answer:
 - **Identify the bottleneck**
 - rendering 10k rows triggers heavy reactr reconcilations
 - frequent state updates can cause entirer conponent tree re-renders
 - browser painiting becomes slow due to DOM size

 **Tools**
 - use **React DevTools Profiler** -> identify which components re-render unnecessarily
 - **Chrome performance Tab** -> detect layout/throttle bottlenecks

 **Strategy to Optimize Rendering**

 - **Virtualization / Windowing**
    - rendering all 10k rows at a time is unnecessary if users can see only 500 at a time
    - **Solution** use libraries 
        - use react-window
        - use react-virtualized
    - **Effect** -> Only render visible rows, this will drastically reduces the DOM nodes and improve the react reconcilation
    ```jsx

    import { FixedSizeList as List } from 'react-window';
    <List
    height={600}
    itemCount={data.length}
    itemSize={35}
    width={1000}
    >
    {({ index, style }) => (
        <div style={style}>
        {data[index].symbol} - {data[index].price}
        </div>
    )}
    </List>

    ```
 - **Memoization**
    - Prevent unnecessary re-renders of rows/components
        - use React.memo() for functional row components
        - useMemo for expensive calculations
        - useCallback for stable callbacks
```js
const Row = React.memo(({ row }) => (
  <div>{row.symbol} - {row.price}</div>
));

```

**Throttling/Debouncing Updates**
- financial data comes with multiple updates withing split seconds
- don't update state for every incoming message as soon as they arrive
 - **Solution**
    - **requestAnimationFrame** -> sync updates with browser paint
    - throttle for some ms/s to reduce re-render
    - use async transaction updates if use agrid like libs
    - batch the thransactions updates to reduce the frequent re-rendering 

```ts
const [displayData, setDisplayData] = useState([]);
const buffer = useRef([]);

useEffect(() => {
    const interval = setInterval(() => {
    if (buffer.current.length > 0) {
        setDisplayData(prev => [...prev, ...buffer.current]);
        buffer.current = [];
    }
    }, 100); // 10 updates/sec
    return () => clearInterval(interval);
}, []);
```

**Use Web Workers for Heavy Calculations**
- compute derived matrics in Web Worker 
- keeps the main UI thread free

- **Avoid inline objects and functions**
    - Inline objects/functions in props create new references every render, triggering re-renders.
    - Use useMemo / useCallback to stabilize references.

**Advanced Optimizations**
- **WebGL** rendering for large datasets
- **Server-side filtering/pagination** -> don't send 10K rows to the client unnecessary

### Summary
To maintain smooth UI updates for 10k live rows:

- **Virtualize rows** → render only what is visible.
- **Memoize components & callbacks** → prevent unnecessary re-renders.
- **Throttle/batch updates** → reduce React reconciliation frequency.
- **Offload heavy computations** → Web Workers.
- **Optional: Canvas/WebGL** for extremely large datasets.
- **Result:** Dramatic reduction in DOM nodes, smoother UI, and more responsive user experience.


Code Splitting

Definition: Splitting your app’s JavaScript into smaller chunks instead of one huge bundle.

Why it matters: Users don’t need to download the entire app upfront; only the code required for the current page loads.

Example:

Without code splitting: bundle.js = 5 MB → loads all at once.

With code splitting: home.js = 1 MB, dashboard.js = 2 MB → only loads what’s needed.

Tools: Webpack, Vite, and Next.js support dynamic import() to do this automatically.

2. Tree Shaking

Definition: Removing unused code from your final bundle.

Why it matters: Makes your production bundle smaller and faster to load.

Example:

import { map, filter } from 'lodash';


If you only use map, tree shaking removes filter from the final bundle.

Tools: Modern bundlers like Webpack, Vite, Rollup, and ESBuild perform tree shaking automatically if modules are ES6.

3. Advanced Optimization

This is a general term for techniques that make your production build smaller, faster, and more efficient. Examples include:

Minification: Removes whitespace and shortens variable names.

Dead code elimination: Removes code that can never execute.

Scope hoisting: Optimizes how modules are wrapped and executed.

Lazy loading assets: Load images, fonts, or CSS only when needed.

Caching strategies: Add content hashes to files so browsers cache them efficiently.

✅ In short:

Code splitting: Don’t load everything upfront.

Tree shaking: Remove unused code.

Advanced optimization: Make your app as small and fast as possible for production.



### Scaling a React application from 200 users → 200k users requires thinking both at the infrastructure level and at the application level. I’ll break it down in detail.

**1️⃣ Infrastructure-Level Scaling**

Infrastructure scaling deals with how your app is served, hosted, and delivered.

a) **Frontend Delivery**

React apps are static JS/CSS/HTML, so you can scale mainly by optimizing delivery:

Use a CDN (Content Delivery Network):

Serve your index.html and static assets (JS/CSS/images) via a CDN like CloudFront, Cloudflare, or Akamai.

This offloads traffic from your server and reduces latency globally.

**Enable caching:**

Cache static files aggressively with long-lived cache headers.

**Use hashed filenames (bundle.[hash].js) so browsers only download updates.**

**Compress assets:**

**Gzip/Brotli compress JS and CSS.**

**Split bundles:**

Code-splitting using **React lazy (React.lazy) + Suspense.**

Only load what the user needs → faster first paint.

b) **Backend / API Layer**

Your React frontend likely talks to APIs. For 200k users, APIs must scale:

**Horizontal scaling:**

**Deploy multiple instances of your API behind a load balancer.**

AWS: ALB + Auto Scaling Group.

**Caching responses:**

**Use Redis or Memcached for frequently requested data.**

**Database scaling:**

Read replicas for high read traffic.

Partitioning/sharding for massive datasets.

Use serverless functions:

AWS Lambda, Cloudflare Workers, or Vercel Functions scale automatically with traffic spikes.

c) Hosting

React is static → can host on S3 + CloudFront, Netlify, Vercel.

Avoid traditional server hosting for massive traffic, unless combined with horizontal scaling.

2️⃣ Application-Level Scaling

Application scaling is about writing your React app in a way that handles large users efficiently.

a) Reduce JS bundle size

Minimize dependencies and tree-shake unused code.

Lazy-load heavy components only when needed.

Use libraries like React Query or SWR for data fetching to reduce unnecessary requests.

b) Optimize rendering

Memoize components: React.memo, useMemo, useCallback.

Avoid unnecessary re-renders (check with React DevTools profiler).

Consider virtualization for large lists: react-window or react-virtualized.

c) State Management

Keep global state minimal; lift state only when necessary.

Use local component state when possible → reduces unnecessary context re-renders.

d) Throttling & Debouncing

User input and API calls should be throttled/debounced to reduce server load.

e) Client-Side Caching

Cache API results in memory or localStorage to avoid redundant API calls.

f) Lazy Loading Routes

Split your React Router routes → load code only when user navigates to that page.

3️⃣ Traffic Considerations

200k users don’t hit your app simultaneously, but peak concurrency matters.

Estimate peak concurrent users (maybe 10-20% of total users).

Test your setup with load testing tools:

Frontend: Lighthouse, WebPageTest.

Backend: k6, JMeter, Locust.

4️⃣ Monitoring and Observability

Use monitoring to catch bottlenecks:

Frontend: Sentry, LogRocket.

Backend: Datadog, New Relic, Prometheus.

Track metrics: first paint, time-to-interactive, API response times, error rates.

5️⃣ Optional Advanced Optimizations

Server-Side Rendering (SSR) / Static Site Generation (SSG) for initial load speed → Next.js.

Edge rendering → deliver personalized content close to the user.

Progressive Web App (PWA) → offline caching, reduces repeated server calls.

✅ Summary Table

Aspect	200 Users → 200k Users
Hosting	S3/CloudFront, Netlify, Vercel, CDN
API	Horizontal scaling, caching, serverless functions
Database	Read replicas, sharding, partitioning
React App	Lazy load, memoization, virtualization, bundle splitting
Caching	CDN + client-side caching + API caching
Monitoring	Sentry, Datadog, performance metrics



### 1️⃣ Performance & Rendering Optimization

Scenario: Your app has a dashboard with 10k rows of live financial data. React UI is lagging.

Question: How would you optimize rendering to maintain smooth UI updates?

Scenario: A component re-renders too frequently even though its props haven’t changed.

**Question:** How do you identify the root cause and prevent unnecessary re-renders?
### Answer:
**To prevent unnecessary re-renders:**

Use React.memo for functional components.

Stabilize props with useMemo / useCallback.

Avoid passing new references each render (objects, arrays, functions).

Split components to isolate re-renders.

Optimize context usage or use state management libraries for selective subscriptions.

Use profiling tools to validate optimizations.

Result: Only components with actual changes re-render, improving performance in large React apps.


**Scenario: You have multiple child components consuming the same context, but only some need updates.**

**Question:** How would you optimize context usage to avoid unnecessary updates?


## Answer (Structured Approach)
1️⃣ Understand the Problem

React context triggers a re-render for all consumers whenever the context value changes.

Even if a consumer doesn’t use the changed part of the context, it will still re-render.

This can cause performance issues in large component trees.

2️⃣ Strategies to Optimize Context Usage
**A. Split Context**

Create multiple contexts, each holding only the piece of data relevant to certain consumers.

Example:
```tsx
// Instead of one big AppContext
const UserContext = createContext();
const ThemeContext = createContext();

// Providers
<UserContext.Provider value={user}>
  <ThemeContext.Provider value={theme}>
    <App />
  </ThemeContext.Provider>
</UserContext.Provider>
```

Components subscribing to UserContext won’t re-render when theme changes, and vice versa.

**B. Memoize Context Value**

Use useMemo to avoid new object references on every render.
```ts
const value = useMemo(() => ({ user, setUser }), [user]);
<UserContext.Provider value={value}>
  {children}
</UserContext.Provider>
```

Prevents unnecessary re-renders caused by passing a new object each render.

**C. Consume Only What’s Needed**

Instead of consuming the whole context object, destructure or select only what’s needed.

Example:
```ts
const user = useContext(UserContext).user; // avoid accessing whole object
```
**D. Use Selector Pattern / State Management Libraries**

Libraries like Zustand, Redux, Recoil allow components to subscribe to specific slices of global state.

Only components depending on a slice re-render when that slice changes.
```ts
const userName = useStore(state => state.user.name);
```

Similar pattern can be implemented manually in context using custom hooks and selectors.

**E. React.memo for Consumers**

Wrap consumer components in React.memo so they only re-render when their props/context slice actually changes.

```ts
const UserProfile = React.memo(() => {
  const user = useContext(UserContext);
  return <div>{user.name}</div>;
});
```


### Scenario: You want to implement infinite scrolling for a long list.

**Question: How would you implement it efficiently in React?**

## Answer (Structured Approach)
1️⃣ Identify Key Challenges

Rendering all items at once will slow down the UI and increase memory usage.

Fetching all data at once is inefficient for the network.

Need to detect when the user reaches the bottom to load more data.

Need to avoid unnecessary re-renders.

2️⃣ Efficient Implementation Strategies
**A. Use Windowing / Virtualization**

Only render visible items in the viewport.

Libraries:

react-window → lightweight, fast.

react-virtualized → feature-rich (sorting, variable row heights).
```ts
import { FixedSizeList as List } from 'react-window';

<List
  height={600} // viewport height
  itemCount={data.length} // total items loaded
  itemSize={50} // row height
  width={'100%'}
>
  {({ index, style }) => (
    <div style={style}>{data[index].name}</div>
  )}
</List>
```
**B. Detect Scroll Position to Load More**

Use Intersection Observer or scroll event to trigger fetching more data when reaching the bottom.
```ts
const loadMoreRef = useRef();

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        fetchMoreData();
      }
    },
    { threshold: 1 }
  );
  if (loadMoreRef.current) observer.observe(loadMoreRef.current);
  return () => observer.disconnect();
}, [loadMoreRef]);
```

Place a sentinel div at the bottom of your list to observe.

**C. Throttle / Debounce Scroll Events**

If using onScroll directly:

Throttle updates with lodash.throttle to avoid excessive renders.

**D. Batch / Paginate Data**

Fetch data in pages (e.g., 50–100 items per request).

Maintain loaded items in state:
```ts
const [items, setItems] = useState([]);
const [page, setPage] = useState(1);

const fetchMoreData = async () => {
  const newItems = await api.getItems(page);
  setItems(prev => [...prev, ...newItems]);
  setPage(prev => prev + 1);
};
```
**E. Memoize Rows**

Wrap rows in **React.memo** to prevent re-rendering unchanged rows.
```ts
const Row = React.memo(({ item }) => <div>{item.name}</div>);
```
**F. Optional Optimizations**

Placeholder / skeleton loading for better UX.

Infinite scrolling + caching: store already fetched pages in memory or local storage.

Combine with virtualization → supports millions of items efficiently.

**3️⃣ Summary**

To implement infinite scrolling efficiently in React:

- Windowing / virtualization → only render visible rows.

- Detect scroll / intersection → load more data lazily.

- Paginate / batch fetch → don’t load all items at once.

- Memoize row components → reduce unnecessary re-renders.

Optional: skeletons, caching, throttling.

Result: Smooth, performant infinite scroll, minimal memory overhead, good UX even with thousands of items.


## 2️⃣ State Management & Architecture

**Scenario: Your app uses Redux, but performance suffers when dispatching frequent actions.**

**Question: How would you refactor your state management to improve performance?**

### Answer (Structured Approach)
1️⃣ Identify the Performance Bottleneck

Frequent actions trigger:

All subscribed components to check for updates.

Large reducers performing expensive computations.

Unnecessary re-renders due to state object reference changes.

**Tools to diagnose:**

**React DevTools Profiler** → detect re-rendering components.

**Redux DevTools** → monitor dispatched actions, payload sizes.

**2️⃣ Optimization Strategies**
A. Slice State & Use Fine-Grained Selectors

Avoid storing everything in a single large object.

**Split state into multiple slices:**

// Instead of one huge state
state = { dashboard: { ... }, chat: { ... }, users: { ... } }


Use selector functions (reselect) to memoize derived data:
```ts
import { createSelector } from 'reselect';

const selectUsers = state => state.users;
const selectActiveUsers = createSelector(
  [selectUsers],
  users => users.filter(u => u.active)
);
```

Only components using the derived slice re-render when it changes.

B. Normalize Data

For lists of objects (e.g., financial instruments, messages), normalize state:

Store as id → entity mapping.

Benefits:

Only updated entities trigger component re-renders.

Easier to update single items without replacing the whole list.

state = {
  stocks: { byId: { 'AAPL': {...}, 'MSFT': {...} }, allIds: ['AAPL', 'MSFT'] }
}

C. Batch / Throttle Actions

Problem: Frequent actions (e.g., 50 updates/sec) overload Redux and React.

Solution: Batch updates:

Use redux-batched-actions or middleware to dispatch one batched action per interval.

Example: aggregate updates every 100ms.
```ts
const batchedUpdate = (updates) => ({
  type: 'BATCH_UPDATE',
  payload: updates
});
```
**D. Avoid Deep Copy / Immutable Bottlenecks**

Ensure reducers are efficient:

Avoid copying entire large arrays/objects unnecessarily.

Use libraries like Immer for structural sharing, which minimizes new object creation.

**E. Component-Level Optimization**

Use **React.memo** and **useSelector** with shallow equality to prevent unnecessary re-renders.

Example:
```ts
const stock = useSelector(state => state.stocks.byId[stockId]);
```

Only the component showing that stock re-renders on update.

**F. Consider Alternative State Management for High-Frequency Data**

For extremely frequent updates (like live tickers), Redux may be overkill.

Alternatives:

**Zustand / Valtio / Recoil → allow components to subscribe to slices of state directly.**

**Reduces unnecessary tree re-renders.**

Example with Zustand:
```ts
const useStore = create(set => ({
  stocks: {},
  setStock: (id, data) => set(state => ({ stocks: {...state.stocks, [id]: data} }))
}));
```
**3️⃣ Optional: Separate “Live” Data from Global Redux**

Keep high-frequency streaming data in a local state or subscription rather than Redux.

Use Redux for app-level state (settings, filters, user info), and leave live data in component-level or external store.

**4️⃣ Summary**

To improve Redux performance with frequent actions:

- **Split state into slices** → fine-grained selectors.

- **Normalize data** → update only affected entities.

- **Batch / throttle actions** → reduce dispatch frequency.

- **Efficient reducers** → use Immer or structural sharing.

- **Memoize components and selectors** → avoid unnecessary re-renders.

Consider alternative state libraries for very high-frequency updates.

Result: Redux remains manageable and performant, even under high-frequency updates.


## Scenario: Multiple components across the app need the same data, but they also fetch it independently.

Question: **How would you centralize data fetching to avoid redundant requests?**

Scenario: You need to persist user preferences across sessions and tabs.

Question: **How would you architect the state to support this?**


### Answer
Centralized fetching: Use React Query, SWR, or a global store to avoid redundant requests.

Persistent preferences: Store in localStorage or IndexedDB, sync across tabs using storage events or BroadcastChannel.

Result: Efficient, consistent, and user-friendly state management across sessions and tabs.


### Scenario: You have a modal component that can be triggered from anywhere in the app.

Question: How would you architect it so the modal is not tightly coupled to parent components?

3️⃣ Asynchronous Data & Side Effects

### Scenario: You have multiple concurrent API calls for a dashboard; new user actions should cancel outdated calls.

**Question: How would you implement this in React using hooks?**

**Using AbortController in a custom hook**
```ts
import { useEffect, useRef, useState } from "react";

function useCancellableFetch(url: string, deps: any[] = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setLoading(true);
    fetch(url, { signal: abortController.signal })
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => {
        if (err.name !== "AbortError") setError(err);
      })
      .finally(() => setLoading(false));

    return () => abortController.abort(); // Cancel on deps change/unmount
  }, deps);

  return { data, error, loading, cancel: () => abortControllerRef.current?.abort() };
}
```
## With this how can we handle multiple concurrent requests
If you need multiple API calls for different widgets but want to cancel all outdated ones on user action:
- use AbortControllerRef as array

```ts
    const abortControllers = useRef<AbortController[]>([]);
```
- for each request push that ref into controllerRef array
- later based on user action iterate over the refs array and cancel them
- also during return we can iterate and abort all request
```ts
function useDashboardData(params) {
  const abortControllers = useRef<AbortController[]>([]);
  const [data, setData] = useState({});

  useEffect(() => {
    // Cancel all previous calls
    abortControllers.current.forEach(ctrl => ctrl.abort());
    abortControllers.current = [];

    const endpoints = ["/api/chart1", "/api/chart2", "/api/chart3"];
    const promises = endpoints.map((endpoint) => {
      const ctrl = new AbortController();
      abortControllers.current.push(ctrl);
      return fetch(`${endpoint}?param=${params}`, { signal: ctrl.signal }).then(res => res.json());
    });

    Promise.allSettled(promises).then(results => {
      const formatted = results.map(r => (r.status === "fulfilled" ? r.value : null));
      setData({ chart1: formatted[0], chart2: formatted[1], chart3: formatted[2] });
    });

    return () => abortControllers.current.forEach(ctrl => ctrl.abort());
  }, [params]);

  return data;
}

```

### Alternative approach could be using React Query/TanStack Query
If you use React Query (TanStack), it provides a built-in way to cancel outdated requests automatically:
```ts
import { useQuery } from "@tanstack/react-query";

function Dashboard({ query }) {
  const { data } = useQuery({
    queryKey: ["dashboardData", query],
    queryFn: () => fetch(`/api/data?q=${query}`).then(r => r.json()),
    staleTime: 0, 
    gcTime: 0
  });

  return <pre>{JSON.stringify(data)}</pre>;
}
```
React Query automatically cancels the previous fetch when the queryKey changes.


Scenario: Some API calls are slow and block the UI update.

Question: How would you design the app to handle slow or failing API calls gracefully?

Scenario: You need to fetch data on route change and show a loader until all requests complete.

Question: How would you implement a global loading state efficiently?

Scenario: You need to prefetch data for routes users are likely to visit next.

Question: How would you implement this in React?

4️⃣ Concurrency & Fiber / React 18 Features

Scenario: Your app experiences a freeze when updating a large component tree.

Question: How would you leverage React 18 concurrent features to prevent UI blocking?

Scenario: You want to keep the UI responsive while updating multiple large lists in parallel.

Question: How would you use startTransition or Suspense?

Scenario: A component fetches data but you want to show a skeleton UI while fetching.

Question: How would you implement this using Suspense for data fetching?

5️⃣ Security & Robustness

Scenario: Your React app is vulnerable to XSS attacks through user input.

Question: How would you sanitize and secure it?

Scenario: A component relies on third-party libraries that may fail at runtime.

Question: How would you handle errors to prevent the app from crashing?

Scenario: Some parts of your app should only be visible to certain users.

Question: How would you architect role-based rendering in React?

6️⃣ Testing & Maintainability

Scenario: A complex component has multiple conditional renders and effects.

Question: How would you write tests to ensure it behaves correctly under all scenarios?

Scenario: You want to refactor a large component into smaller hooks without breaking functionality.

Question: How would you ensure correctness and maintainability?

Scenario: Your app uses heavy third-party dependencies.

Question: How would you monitor and test their impact on performance and stability?

7️⃣ Real-World Scaling Scenarios

Scenario: Your app is expected to scale from 1k to 1M users.

Question: What React-specific optimizations would you do in addition to infrastructure changes?

Scenario: You have a real-time chat app with 100k messages and 50k concurrent users.

Question: How would you architect your React components for efficient rendering and memory usage?

Scenario: You want your app to load instantly on slow networks.

Question: How would you leverage code-splitting, SSR, or PWA features?


### Why Vite and esbuild is faster than webpack?
**1. Development Mode:**
Webpack

**How it works:**

- Bundles your entire app before serving.

- Uses a single build pipeline that processes all files upfront.

- Requires a full rebuild or large chunk re-compilation on every change.

**Consequence:**

- Slow startup time (especially for large apps).

- Hot Module Replacement (HMR) is slower because changes trigger re-bundling.

- Vite (uses esbuild for dev)

**How it works:**

- Leverages native ES modules (ESM) in the browser.

- No upfront bundling; serves source files directly.

- On file change, only the changed module is recompiled, not the entire bundle.

- Uses esbuild (written in Go) for lightning-fast transpilation.

**Consequence:**

Instant server start (even for large projects).

Near-instant HMR.

2. Build Tooling:
Webpack

Written in JavaScript.

Transformation and bundling happen in a single-threaded process.

Heavy on plugin/loader chains, which increases build time.

esbuild

Written in Go (compiled, not interpreted).

Highly optimized and uses parallelism (multi-core).

Extremely fast at transforming TypeScript/JSX (10-100x faster than JS-based tools).

Vite

Uses esbuild for dev and Rollup for production build.

esbuild handles dev speed.

Rollup handles tree-shaking & production optimizations.

3. Caching

Vite aggressively caches dependencies using esbuild output.

Dependencies rarely change → Only source files recompiled during HMR.

Webpack can cache too, but configuration is heavier and slower to warm up.

4. Output Strategy

**Webpack: Full bundle, monolithic.**

**Vite: Uses lazy loading of modules and on-demand compilation during development.**

**Why is esbuild itself so fast?**

- Written in Go (compiled, not interpreted like JS).

- Uses parallelism for file processing.

- Avoids unnecessary AST transformations compared to Babel/Webpack loaders.

Optimized for minimal I/O and memory usage.

### For simple Counter App how Vite and webpack will handle the build process?


## Concrete Example: Simple Counter App

**Files:**

index.jsx → imports App.jsx
App.jsx → imports Counter.jsx
Counter.jsx → uses useState

**With Webpack:**

- Webpack bundles index.jsx + App.jsx + Counter.jsx into one file (bundle.js) before serving.

- Browser loads bundle.js.

- Change Counter.jsx → Webpack rebuilds the relevant bundle and pushes via HMR.

**With Vite:**

- Dev server starts instantly.

- Browser requests /index.jsx → Vite transpiles and serves.

- Browser requests /App.jsx → served on-demand.

- Browser requests /Counter.jsx → served on-demand.

- Change Counter.jsx → only that file is transpiled and re-sent.


## REDUX 

**Explain Redux Toolkit’s createSlice.**
It combines:

- Reducer
- Actions
- Initial state
```ts
const counterSlice = createSlice({
  name: 'counter',
  initialState: {value: 0},
  reducers: {
    increment: (state) => {value: state.value + 1},
    decrement: (state) => {value: state.value - 1}
  }
});

export const {increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;
```

```tsx
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

```tsx
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, reset } from './counterSlice';

function App() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>Redux Counter</h1>
      <h2>{count}</h2>

      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(reset())}>Reset</button>
    </div>
  );
}

export default App;
```
