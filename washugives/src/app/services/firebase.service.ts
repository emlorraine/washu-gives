import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';  
import { Post } from './home/post.model';  



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  isLoggedIn = false; 
  constructor(
      public firebaseAuth : AngularFireAuth,
  ) { }

  async signin(email: string, password: string){
    console.log("firebase sign in")
    event.preventDefault();
    console.log(email)
    console.log(password)
    await this.firebaseAuth.signInWithEmailAndPassword(email,password)

    .then(res=> {
      console.log("sign in processed")
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

  // logout(){
  //   this.firebaseAuth.signOut()
  //   localStorage.removeItem('user')
  // }

}