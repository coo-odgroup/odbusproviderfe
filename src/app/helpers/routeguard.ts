import { Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree
} from "@angular/router";

  
@Injectable()
export class Routeguard implements CanActivate {

    isSignedIn:boolean;
    constructor( private router: Router) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean | Promise<boolean> {

               const user=sessionStorage.getItem('TOKEN');  
                if(user){
                    this.isSignedIn =true;                  
                } else{
                    this.router.navigate(['login']);
                }

        return this.isSignedIn;
    }
}