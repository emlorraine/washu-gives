import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';  
// import { AuthGuardService } from './services/auth.service';

@Injectable()
export class FirebaseService {
  isLoggedIn = false; 
  constructor(
      public firebaseAuth : AngularFireAuth
  ) { }

  async signin(email: string, password: string){
    event.preventDefault();
    await this.firebaseAuth.signInWithEmailAndPassword(email,password)

    .then(res=> {
      this.isLoggedIn = true; 
      localStorage.setItem('user', JSON.stringify(res.user))
    })
  }

  async signup(email: string, password: string){
    event.preventDefault();    
    await this.firebaseAuth.createUserWithEmailAndPassword(email,password)
    .then(res=> {
      this.isLoggedIn = true; 
      localStorage.setItem('user', JSON.stringify(res.user))
    })
  }

  logout(){
    this.firebaseAuth.signOut()
    localStorage.removeItem('user')
  }

  getLog():boolean{
    console.log(this.isLoggedIn);
    return this.isLoggedIn; 
  }

}
