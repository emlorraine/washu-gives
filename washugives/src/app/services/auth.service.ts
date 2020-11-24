import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';  
import { FirebaseService } from './firebase.service';
 
 
@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
 
    constructor(
        private router:Router,
        public FirebaseService:FirebaseService 
        ) {}
    canActivate(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): boolean {
        let userLog:boolean = this.FirebaseService.getLog();
        if (userLog == false)  {
            alert('You must log in or register first');
            this.router.navigate(['']);
            return false;
        } 
        return true;
    }
 
}

