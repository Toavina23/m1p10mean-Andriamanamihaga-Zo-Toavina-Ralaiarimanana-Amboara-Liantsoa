import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { AuthService } from '../services/auth.service'

export const rolesGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const userRole = inject(AuthService).getUserRole()
  const expectedRole = route.data['role']

  switch (userRole) {
    case expectedRole:
      return true

    case 'ADMIN':
      router.navigate(['/manager'])
      return false

    case 'EMPLOYEE':
      router.navigate(['/employee'])
      return false

    case 'CLIENT':
      router.navigate(['/customer'])
      return false

    default:
      router.navigate(['/login'])
      return false
  }
}
