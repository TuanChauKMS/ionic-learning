import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';
import { ROUTE_URL_LOGIN, QUERY_PARAM_RETURN_URL } from '../app.routes.constants';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn) {
    return true;
  }

  return router.createUrlTree([ROUTE_URL_LOGIN], {
    queryParams: { [QUERY_PARAM_RETURN_URL]: router.url },
  });
};
