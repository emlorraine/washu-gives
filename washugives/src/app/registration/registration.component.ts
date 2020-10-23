import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';
import { FirebaseService } from '../services/firebase.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

@Component({ selector: 'registration_component', templateUrl: 'registration.component.html' })
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  isLoggedIn = false; 

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public firebaseService : FirebaseService
  ) {}


  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  async onSignUp(email:string,password:string){
    console.log("recognized")
      await this.firebaseService.signup(email, password)
      if(this.firebaseService.isLoggedIn){
        this.isLoggedIn = true
      }
  }


  // convenience getter for easy access to form fields
  get f() {
    return this.registrationForm.controls;
  }
  // onSubmit() {
  //   this.submitted = true;
  // }
}
