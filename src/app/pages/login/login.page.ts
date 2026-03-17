import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth';
import {
  ROUTE_URL_HOME,
  QUERY_PARAM_RETURN_URL,
} from '../../app.routes.constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
  standalone: false,
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly navCtrl = inject(NavController);
  private readonly route = inject(ActivatedRoute);

  public readonly ROUTE_URL_HOME = ROUTE_URL_HOME;
  public username = '';
  public password = '';
  public error = '';

  public onSubmit(): void {
    this.error = '';
    if (!this.username.trim()) {
      this.error = 'Please enter a username.';
      return;
    }
    const returnUrl = this.getReturnUrl();
    if (this.auth.login(this.username, this.password)) {
      this.navCtrl.navigateRoot(returnUrl);
    } else {
      this.error =
        'Invalid username or password. Try demo / demo or admin / admin.';
    }
  }

  private getReturnUrl(): string {
    const url = this.route.snapshot.queryParams[QUERY_PARAM_RETURN_URL];
    return url && typeof url === 'string' ? url : ROUTE_URL_HOME;
  }
}
