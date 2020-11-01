import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { FirebaseService } from '../services/firebase.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

@Component({ selector: 'login_component', templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  isLoggedIn = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public firebaseService: FirebaseService,
    private routeTo: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  async onSignIn() {
    try {
      await this.firebaseService.signin(
        this.loginForm.value['username'],
        this.loginForm.value['password']
      );
      if (this.firebaseService.isLoggedIn) {
        this.isLoggedIn = true;
        this.routeTo.navigate(['/home']);
      }
    } catch (e: any) {
      alert('Incorrect username or password.');
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }
}
