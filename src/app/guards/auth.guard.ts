import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanMatchFn = (route, state) => {
  const auth = inject(AuthService)
  const router = inject(Router)
  if(!auth.estaAutenticado()){
    router.navigate(['/login']); 
    return false;
    }
  return  auth.estaAutenticado();
};
