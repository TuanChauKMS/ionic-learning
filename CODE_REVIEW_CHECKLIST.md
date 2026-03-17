# Code Review Checklist

Use this checklist to review your own code before submitting a PR. Items are grouped by layer (Frontend, Backend, Database) and by category.

**Legend:** `0` = High priority · `1` = Medium · `2` = Lower · `TBU` = To Be Updated / Standard

---

## Frontend (Angular / SPA)

### Code Formatting

- [ ] **Cleanup comments** — All code should be clear enough that comments are not needed to understand the logic. Remove redundant comments.

### Coding Standards

- [ ] **No leading underscore on variables** — Do not use `_` at the beginning of variable names.  
  **Invalid:** `private SessionInfo _session;`

- [ ] **Use variables / enums instead of magic strings or numbers** — Replace literals with named constants or enums.

- [ ] **Explicit access modifiers** — Clearly specify access modifier for each function and variable.  
  **Example:**  
  `private showItem(): void { }`  
  `public ngOnInit(): void { }`

- [ ] **Avoid getters/functions in template bindings** — Do not use functions or getter functions in the template for binding; it can cause performance issues.  
  **Valid:** `<button [disabled]="isValid" />`  
  **Invalid:** `<button [disabled]="invalidBinding" />` (where `invalidBinding` is a getter)

- [ ] **Strongly typed forms** — Use typed `FormControl`/`FormGroup`, not `UntypedFormControl`/`UntypedFormGroup`.  
  **Example:** `new FormControl<PromptEnum>(PromptEnum.Summary)`

- [ ] **Break lines between sections** — Add blank lines between: imports and `@Component`, between members and constructor, and between methods for readability.

- [ ] **Imports before exports** — In `*.models.ts` files, place imports before exports.

- [ ] **Prefer `inject()` over constructor injection** — Declare the property and use `inject()` so you don’t need `super()`.  
  **Example:** `private sessionService = inject(SessionService);`

- [ ] **Remove unused imports and variables** — Clean up before commit.

- [ ] **Use control-flow syntax** — Replace `*ngIf` with `@if`, and use `@for` where appropriate. When touching existing files, convert to the new standard.

- [ ] **Standalone components** — New components should be `standalone: true` and import dependencies directly: `imports: [DxPopupModule, LoadingComponent]`. When changing existing components, update to this standard.

- [ ] **Avoid `any`; use `unknown` sparingly** — Prefer specific types.  
  **Invalid:** `public close(): Observable<any>`  
  **Valid:** `public close(): Observable<SessionInfo>` or `Observable<unknown>` when necessary.

- [ ] **Import specific components, not whole modules** — Avoid importing `SharedComponentsModule`, `ValantComponentsModule`. Import only what you use: `imports: [LoadingComponent, DxPopupModule]`.

- [ ] **Re-export in `*.models.ts`** — Use `export { FeedbackType } from '...'` instead of `import { FeedbackType } from '...'; export type FeedbackType = FeedbackType;`

- [ ] **Remove empty constructors** — Delete constructors that have no logic and no parameters.

### Best Practices

- [ ] **Callbacks: use methods, not inline bindings** — Prefer a method for event handlers.  
  **Invalid:** `<dx-dropdown (valueChanged)="selectedValue=$event"/>`  
  **Valid:** `<dx-dropdown (valueChanged)="onSelectedPatientChanged($event)"/>`

- [ ] **Early return with braces** — Use a block for early returns.  
  **Invalid:** `if (!isDirty) return of(null);`  
  **Valid:**  
  `if (!isDirty) { return of(null); }`

- [ ] **Formatting** — Fix indentation and spacing; run Prettier after resolving merge conflicts.

- [ ] **Static attributes** — Use `minWidth="300"` instead of `[minWidth]="300"` when the value is constant.

- [ ] **Self-closing tags** — Prefer self-closing for elements with no content.  
  **Invalid:** `<dx-html-editor [value]="comment.content" [readOnly]="true"> </dx-html-editor>`  
  **Valid:** `<dx-html-editor [value]="comment.content" [readOnly]="true"/>`

- [ ] **`takeUntilDestroyed` instead of manual subscription management** — Prefer `takeUntilDestroyed(this.destroyRef)` and combine streams with `merge()` when the same logic runs for multiple sources.  
  **Instead of:**  
  `this.subscription.add(this.appointmentService.makePaymentSucceededSubject.subscribe(...));`  
  **Use:**  
  `merge(this.appointmentService.makePaymentSucceededSubject, this.appointmentService.checkInSucceededSubject).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.refreshForms());`

- [ ] **Label `for` attribute** — Add `for` on `<label>` pointing to the id of the associated control.

- [ ] **dx-popup `wrapperAttr`** — Add `[wrapperAttr]="{ id: '...' }"` for identification.  
  **Example:** `<dx-popup [wrapperAttr]="{ id: 'ai-note-popup' }" />`

### TBU / Conventions

- [ ] **Grid columns** — Prefer pre-calculating column values when data loads or changes instead of `calculateCellValue`.

- [ ] **Grid columns: `TypedColumn<T>`** — Use `TypedColumn<T>` for grid columns. Avoid `nameOf()`.

- [ ] **`::ng-deep` scoping** — When using `::ng-deep`, always scope with `:host` and/or a unique class/id so styles don’t leak.  
  **Examples:**  
  `:host ::ng-deep .patient-row`  
  `::ng-deep #patient-select-popup`

### Other

- [ ] **SPA / Prospects / MYIO autogen** — ValantIO SPA and related apps (e.g. Prospects, MYIO) autogen must be re-run when there are updates in shared models.

---

## Backend (C# / Web API)

### Best Practices

- [ ] **Positive condition first** — Write `if (condition) { do thing } else { do other thing }`, not `if (!condition) { do other thing } else { do thing }`.  
  **Valid:** `if (a == b) { ... } else { ... }`  
  **Invalid:** `if (a != b) { ... } else { ... }`

- [ ] **Validate at start of controller actions** — First line of each action should validate the model; let existing exception middleware handle thrown exceptions.  
  **Example:** `await this.{validator}.ValidateAndThrowAsync(model)`  
  **Goal:** Remove `.InitializeValidation(new List<Assembly>(){typeof(Startup).Assembly}` from .NET 6 API code.

- [ ] **List null check** — Use `IsNullOrEmpty` extension when checking lists for null/empty.

- [ ] **AutoMapper** — Follow Valant AutoMapper guidance: [C# Considerations – AutoMapper](https://valant-production.atlassian.net/wiki/spaces/PPSEN/pages/2189852676/C+Considerations#AutoMapper).

- [ ] **No logic in models** — Keep logic out of DTOs/models.  
  **Invalid:** `public string State => PatientState.NullIfEmpty() ?? BillingState;`

- [ ] **CDK** — Use separate configuration files for different environments.

- [ ] **appsettings** — Keep `appsettings.json` values empty for project-specific config; use `appsettings.local.json` for local overrides.

- [ ] **IEnumerable never null** — Always initialize: `= new List<T>()` or `= []`.

- [ ] **No logic in controllers** — Controllers handle web plumbing, validation, and delegating to the service layer. Put logic in the service layer.

- [ ] **Remove unnecessary async/await** — Don’t use async/await when there’s no asynchronous work.

- [ ] **ExecuteInTransactionAsync** — Don’t wrap a single statement. Use it to group multiple calls that share a transaction. If a transaction is already passed in, don’t use it again.

- [ ] **String comparison** — Use `StringComparison.Ordinal` or `StringComparison.OrdinalIgnoreCase` for culture-agnostic, performant comparison.  
  **Example:** `string.Equals(url.Scheme, "https", StringComparison.OrdinalIgnoreCase)` instead of `url.Scheme.ToLower() == "https".ToLower()`

### Coding Standards

- [ ] **API verb and route** — Follow naming convention; no verb in the route path.

- [ ] **Fluent validator** — Add `IsInEnum()` for all enum types in validators.

- [ ] **Time types** — Use NodaTime types (`OffsetDateTime`, `LocalDate`, `LocalDateTime`, etc.) for new models instead of `DateTime`. Use Dapper’s `AddTypeHandler` when needed.

- [ ] **Package references** — Do not use `PackageReference` for NuGet; use Paket globally.

- [ ] **JSON** — Use `System.Text.Json` only; no Newtonsoft in APIs.

- [ ] **Default value on interface** — Put default values (e.g. `dbTransaction = null`) on the interface, not the implementation.

- [ ] **Date comparison** — Use `DateTimeUtilities.Min` / `DateTimeUtilities.Max` for date comparisons.

- [ ] **Feature flags** — New feature flags should start with `enable`, e.g. `enable{FeatureName}`.

- [ ] **Enum Description** — Don’t add `Description` attribute if it would match the enum name.

- [ ] **Controller return type** — Controller return type should not be the DTO name (use a proper response/model name).

- [ ] **Tests** — Use DI to resolve dependencies in tests; avoid `new`-ing up classes.

- [ ] **SimpleDbCommand** — Use only when the query extension method requires it.

### Other

- [ ] **New APIs** — Run as console app by default, not IIS Express (production runs as console).

- [ ] **Modify existing methods** — Prefer changing existing methods over adding new ones when implementing features.

- [ ] **Authentication** — Provide documentation for reviewers: Key, Application Key, Parameter Store, and authentication mechanism.

- [ ] **HTTP status codes** — Return appropriate status codes for each response.

- [ ] **Practice vs tblClient** — Treat `tblClient` and Practice as the same .NET model named `Practice`. Add new columns to `Practice`, not `tblClient`.

### Security

- [ ] **ClientId** — Models should not expose a `ClientId` field inappropriately.

- [ ] **Auditing** — Do not audit sensitive data (e.g. password, salt, question/answer combos).

---

## Database (SQL)

### Best Practices

- [ ] **JOIN instead of IN** — Prefer `JOIN` over `IN` in queries where appropriate.

- [ ] **Schema-qualified table names** — Include schema in table names (e.g. `dbo.TableName`).

- [ ] **No MERGE** — Avoid `MERGE` statements in SQL.

### Other

- [ ] **ClientId in JOINs** — Include `ClientId` in `ON` when joining tables that have it.  
  **Example:**  
  `FROM [dbo].[Patient] p`  
  `INNER JOIN [dbo].[Document] d ON d.PatientRid = p.Rid AND d.ClientId = p.ClientId`

### TBU

- [ ] **Dynamic list in query** — Use parameter as table type (e.g. `ProviderUids.AsUidTableTypeParameter()`) and use `FromUidTableTypeParameter` to create a named temp table and insert distinct values, instead of hand-rolled `#tmpReminderUids`-style temp tables.

---

## Quick scan (before commit)

1. Comments cleaned; no magic strings/numbers; access modifiers and types explicit.
2. Frontend: no getters in bindings; `@if`/`@for`; `inject()`; standalone; no `any`; specific imports.
3. Backend: validation first in actions; no logic in controllers/models; correct async and transaction usage.
4. SQL: schema in names; `JOIN` and `ClientId` in `ON` where applicable; no `MERGE`.
5. Unused imports and variables removed; formatting (e.g. Prettier) applied.

*Last structured from team code review checklist. Adjust priorities and scope to match your repo.*
