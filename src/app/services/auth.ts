import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ROUTE_URL_LOGIN } from '../app.routes.constants';

export interface User {
  id: number;
  username: string;
  displayName: string;
}

const MOCK_USERS: (User & { password: string })[] = [
  { id: 1, username: 'demo', password: 'demo', displayName: 'Demo User' },
  { id: 2, username: 'admin', password: 'admin', displayName: 'Admin' },
];

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);

  public readonly currentUser$: Observable<User | null> =
    this.currentUserSubject.asObservable();

  public readonly isLoggedIn$: Observable<boolean> = this.currentUser$.pipe(
    map((user) => user !== null)
  );

  public get isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  public get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  public login(username: string, password: string): boolean {
    const found = MOCK_USERS.find(
      (u) => u.username === username.trim() && u.password === password
    );
    if (found) {
      const user: User = {
        id: found.id,
        username: found.username,
        displayName: found.displayName,
      };
      this.currentUserSubject.next(user);
      return true;
    }
    return false;
  }

  public logout(): void {
    this.currentUserSubject.next(null);
    this.router.navigate([ROUTE_URL_LOGIN]);
  }
}
