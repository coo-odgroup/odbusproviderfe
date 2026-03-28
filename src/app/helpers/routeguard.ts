import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class Routeguard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    const token = sessionStorage.getItem('TOKEN'); // ✅ use TOKEN

    if (token) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false; // ✅ IMPORTANT
    }
  }
}