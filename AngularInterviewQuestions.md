## 1. What is Angular?

Angular is a TypeScript-based open-source web application framework developed by Google for building single-page client applications using HTML and TypeScript.

## 2. What are components in Angular?

Components are the basic building blocks of Angular applications.

```ts
@Component({
  selector: 'app-hello',
  template: '<h1>Hello World</h1>'
})
export class HelloComponent {}
```

## 3. What is a module in Angular?

A module is a container that groups components, directives, pipes, and services.

```ts
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

## 4. What is the difference between constructor and ngOnInit?

* `constructor` is used for dependency injection.
* `ngOnInit` is called after the component is initialized.

## 5. What is data binding in Angular?

Four types:

* Interpolation: `{{data}}`
* Property binding: `[property]="value"`
* Event binding: `(event)="handler()"`
* Two-way binding: `[(ngModel)]="data"`

## 6. What is a directive?

A directive adds behavior to DOM elements.

* Structural: `*ngIf`, `*ngFor`
* Attribute: `[ngClass]`, `[ngStyle]`

## 7. What is a service in Angular?

Services are singleton classes used to share data and logic.

```ts
@Injectable({ providedIn: 'root' })
export class DataService {
  getData() {
    return ['A', 'B', 'C'];
  }
}
```

## 8. What is dependency injection?

Automatic provision of services to components via constructor injection.

## 9. How do you create and use routes?

```ts
const routes: Routes = [
  { path: 'home', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

## 10. How to lazy load a module?

```ts
{
  path: 'admin',
  loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
}
```

## 11. What is ng-content?

Used to project content into a component.

```ts
<ng-content></ng-content>
```

## 12. What is the difference between Observable and Promise?

* Observable: multiple values, cancellable
* Promise: single value

## 13. How to handle forms?

* Template-driven using `FormsModule`
* Reactive using `ReactiveFormsModule`

## 14. What is a pipe in Angular?

Pipes transform data in templates.

```ts
{{ today | date:'shortDate' }}
```

## 15. How to create a custom pipe?

```ts
@Pipe({name: 'capitalize'})
export class CapitalizePipe implements PipeTransform {
  transform(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
```

## 16. How to perform HTTP calls?

```ts
this.http.get('/api/data').subscribe(data => console.log(data));
```

## 17. What is the use of `ngOnChanges`?

Called when input properties change.

## 18. How do you pass data between components?

* @Input()
* @Output() with EventEmitter
* Shared service

## 19. What is a resolver?

Used to fetch data before route activation.

## 20. What are guards in Angular?

* CanActivate
* CanDeactivate

## 21. What is the role of `ChangeDetectionStrategy`?

Controls how the view updates.

## 22. What are Angular lifecycle hooks?

* ngOnInit
* ngOnDestroy
* ngOnChanges
* etc.

## 23. How do you create a singleton service?

Use `providedIn: 'root'`.

## 24. What is ViewChild?

Access a child component/directive in the view.

```ts
@ViewChild('myInput') inputRef: ElementRef;
```

## 25. How do you implement state management?

NgRx, services with BehaviorSubject, Akita.

## 26. How do you optimize Angular apps?

* Lazy loading
* AOT Compilation
* Tree shaking
* Change detection strategy

## 27. What is AoT compilation?

Ahead-of-Time compiles templates during build.

## 28. How to handle errors in HTTP?

```ts
this.http.get('/api/data').pipe(
  catchError(error => of([]))
).subscribe();
```

## 29. Difference between template-driven and reactive forms?

Reactive gives more control via code.

## 30. What is HttpInterceptor?

Intercept HTTP requests and responses.

```ts
intercept(req: HttpRequest<any>, next: HttpHandler) {
  const cloned = req.clone({ headers: req.headers.set('Auth', 'token') });
  return next.handle(cloned);
}
```

## 31. What is Angular Universal?

Server-side rendering for Angular.

## 32. What is the async pipe?

Automatically subscribes to Observable.

```ts
<div *ngIf="data$ | async as data">{{ data }}</div>
```

## 33. Difference between ngIf and hidden?

* `*ngIf` removes from DOM
* `hidden` just hides the element

## 34. What is trackBy in ngFor?

Boost performance by identifying items uniquely.

## 35. What are TemplateRef and ViewContainerRef?

Used for dynamic view creation.

## 36. How to write unit tests?

Use Jasmine and TestBed for services/components.

## 37. What is TestBed?

Testing module for unit testing components/services.

## 38. How to mock services?

Use `providers` array with `useClass` or `useValue`.

## 39. What is Renderer2?

Abstracted API to manipulate DOM.

## 40. How to detect platform/browser?

Use `PLATFORM_ID` and `isPlatformBrowser()`.

## 41. How to implement dynamic components?

Use `ComponentFactoryResolver` or Angular 14's `ViewContainerRef.createComponent()`.

## 42. How to use Signals in Angular 20?

Signals are reactive primitives.

```ts
const count = signal(0);
```

## 43. What is zoneless Angular?

New architecture using signals instead of ZoneJS.

## 44. What is an injector?

Resolves dependencies via DI container.

## 45. How do you use environment files?

Angular provides `environment.ts` and `environment.prod.ts`.

## 46. How to handle global error?

Use `ErrorHandler` class.

## 47. What is SSR?

Server Side Rendering improves SEO and performance.

## 48. What is differential loading?

Builds separate bundles for modern and legacy browsers.

## 49. What are standalone components?

Angular 14+ feature to build components without NgModules.

```ts
@Component({
  standalone: true,
  template: `<h1>Hello</h1>`
})
export class HelloComponent {}
```

## 50. What is hydration in Angular?

Hydration reuses SSR HTML instead of re-rendering on the client.

---

Would you like a PDF version or mock interview questions with answers?
