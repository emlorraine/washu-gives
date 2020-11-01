import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Route } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';
import { FirebaseService } from '../services/firebase.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

@Component({
  selector: 'registration_component',
  templateUrl: 'registration.component.html',
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  isLoggedIn = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private routeTo: Router,
    public firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    this.registrationForm = this.formBuilder.group(
      {
        email: [
          '',
          [Validators.required, Validators.email, this.wustlEmailDomain],
        ],
        password: ['', [Validators.required, Validators.minLength(8)]],
        passwordRepetition: ['', [Validators.required]],
      },
      { validator: this.MustMatch('password', 'passwordRepetition') }
    );
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  wustlEmailDomain(control: AbstractControl) {
    const email: string = control.value;
    const domain = email.substring(email.lastIndexOf('@') + 1);
    if (domain.toLocaleLowerCase() === 'wustl.edu') {
      return null;
    } else {
      return { emailDomain: true };
    }
  }

  //Must match taken from: https://jasonwatmore.com/post/2018/11/07/angular-7-reactive-forms-validation-example
  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  async onSignUp() {
    console.log('recognized');
    await this.firebaseService.signup(
      this.registrationForm.value['email'],
      this.registrationForm.value['password']
    );
    if (this.firebaseService.isLoggedIn) {
      this.isLoggedIn = true;
      this.routeTo.navigate(['/home']);
    }
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.registrationForm.controls;
  }
}
