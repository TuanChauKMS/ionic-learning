import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';
import type { User } from '../../services/auth';
import { ROUTE_URL_HOME } from '../../app.routes.constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.css'],
  standalone: false,
})
export class DashboardPage {
  private readonly auth = inject(AuthService);

  public readonly user: User = this.auth.currentUser!;
  public readonly ROUTE_URL_HOME = ROUTE_URL_HOME;

  public logout(): void {
    this.auth.logout();
  }
}
