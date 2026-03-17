import { Component, inject } from '@angular/core';
import { Observable, Subject, merge, of, concat } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ApiDemoService } from '../../services/api-demo';

export interface ApiDemoState {
  loading: boolean;
  error: string | null;
  response: unknown;
  lastMethod: string;
  responseJson: string;
}

function toResponseJson(response: unknown): string {
  if (response == null) {
    return '';
  }
  return JSON.stringify(response, null, 2);
}

const initialState: ApiDemoState = {
  loading: false,
  error: null,
  response: null,
  lastMethod: '',
  responseJson: '',
};

type RequestAction =
  | { method: 'GET_LIST' }
  | { method: 'GET_ONE'; id: string }
  | {
      method: 'POST';
      body: { title: string; body: string; userId: number };
    }
  | {
      method: 'PUT';
      id: string;
      body: {
        id: number;
        title: string;
        body: string;
        userId: number;
      };
    }
  | { method: 'DELETE'; id: string };

@Component({
  selector: 'app-api-demo',
  templateUrl: './api-demo.page.html',
  styleUrls: ['./api-demo.page.css'],
  standalone: false,
})
export class ApiDemoPage {
  private readonly apiService = inject(ApiDemoService);
  private readonly action$ = new Subject<RequestAction>();

  public readonly state$: Observable<ApiDemoState> = merge(
    of(initialState),
    this.action$.pipe(
      switchMap((action) => {
        const loadingState$ = of<ApiDemoState>({
          ...initialState,
          loading: true,
          lastMethod: action.method,
          responseJson: '',
        });
        const result$ = this.executeRequest(action).pipe(
          map((response) => ({
            loading: false,
            response,
            lastMethod: action.method,
            error: null as string | null,
            responseJson: toResponseJson(response),
          })),
          catchError((err) => {
            const responsePayload = err.error ?? { message: err.message };
            return of<ApiDemoState>({
              loading: false,
              response: responsePayload,
              lastMethod: action.method,
              error: err.message || 'Request failed',
              responseJson: toResponseJson(responsePayload),
            });
          })
        );
        return concat(loadingState$, result$);
      })
    )
  );

  public resourceId = '1';
  public postTitle = 'Demo title';
  public postBody = 'Demo body';
  public postUserId = '1';

  public getList(): void {
    this.action$.next({ method: 'GET_LIST' });
  }

  public getOne(): void {
    this.action$.next({
      method: 'GET_ONE',
      id: this.resourceId.trim() || '1',
    });
  }

  public post(): void {
    this.action$.next({
      method: 'POST',
      body: {
        title: this.postTitle,
        body: this.postBody,
        userId: Number(this.postUserId) || 1,
      },
    });
  }

  public put(): void {
    const id = this.resourceId.trim() || '1';
    this.action$.next({
      method: 'PUT',
      id,
      body: {
        id: Number(id),
        title: this.postTitle,
        body: this.postBody,
        userId: Number(this.postUserId) || 1,
      },
    });
  }

  public delete(): void {
    this.action$.next({
      method: 'DELETE',
      id: this.resourceId.trim() || '1',
    });
  }

  private executeRequest(action: RequestAction): Observable<unknown> {
    switch (action.method) {
      case 'GET_LIST':
        return this.apiService.getList();
      case 'GET_ONE':
        return this.apiService.getOne(action.id);
      case 'POST':
        return this.apiService.post(action.body);
      case 'PUT':
        return this.apiService.put(action.id, action.body);
      case 'DELETE':
        return this.apiService.delete(action.id);
    }
  }
}
