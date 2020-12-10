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
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { isNaN } from 'lodash';

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
  firstQuestions = [
    'What was the house number and street name you lived in as a child?',
    'What were the last four digits of your childhood telephone number?',
    'What primary school did you attend?',
    'In what town or city was your first full time job?',
    'In what town or city did your parents meet?']
  selectedFirstQuestion = false
  secondQuestions = [
    'What was your childhood nickname?',
    'In what city does your nearest sibling live?',
    'What was your first car?',
    'What was your dream job as a child?',
    'What was the first concert you attended?']
  selectedSecondQuestion = false

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private routeTo: Router,
    public firebaseService: FirebaseService,
    private db: AngularFirestore,
  ) {}

  ngOnInit() {
    this.registrationForm = this.formBuilder.group(
      {
        name: ['', [Validators.required, Validators.maxLength(50)]],
        phoneNumber: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{3}-[0-9]{3}-[0-9]{4}$')]],
        description: ['', [Validators.required, Validators.maxLength(300)]],
        securityQuestion1: ['', Validators.required],
        securityQuestion1Answer: ['', Validators.required],
        securityQuestion2: ['', Validators.required],
        securityQuestion2Answer: ['', Validators.required],
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

  changeFirstQuestion(){
    this.registrationForm.controls['securityQuestion1'].setValue('')
    this.selectedFirstQuestion = false
  }

  changeSecondQuestion(){
    this.registrationForm.controls['securityQuestion2'].setValue('')
    this.selectedSecondQuestion = false
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
    try{
      await this.firebaseService.signup(
        this.registrationForm.value['email'],
        this.registrationForm.value['password']
      );
      if (this.firebaseService.isLoggedIn) {
        this.isLoggedIn = true;
        this.routeTo.navigate(['/home']);
      }
      var firstAnswer : string = this.registrationForm.controls['securityQuestion1Answer'].value
      var secondAnswer : string = this.registrationForm.controls['securityQuestion2Answer'].value
      this.registrationForm.controls['securityQuestion1Answer'].setValue(firstAnswer.toLowerCase())
      this.registrationForm.controls['securityQuestion2Answer'].setValue(secondAnswer.toLowerCase())
      var docRef = this.db.collection('userInformation').doc(this.registrationForm.getRawValue().email)
      docRef.ref.get().then((doc) => {
        docRef.set({
          firstQuestion: this.registrationForm.getRawValue().securityQuestion1,
          firstQuestionAnswer: this.registrationForm.getRawValue().securityQuestion1Answer,
          secondQuestion: this.registrationForm.getRawValue().securityQuestion2,
          secondQuestionAnswer: this.registrationForm.getRawValue().securityQuestion2Answer,
          description: this.registrationForm.getRawValue().description,
          name: this.registrationForm.getRawValue().name,
          phoneNumber: this.registrationForm.getRawValue().phoneNumber
        })
      })
    }
    catch (e: any){
      alert("Email is already in use")
    }
  }

  formatForUser(){
    var currentNumber = (this.registrationForm.controls['phoneNumber'].value)
    var numberOfDigits = 0
    for(var i = 0; i < currentNumber.length; ++i){
      if(this.isCharDigit(currentNumber[i])) {
        ++numberOfDigits
      }
    }
    //We format the number for the user
    if(numberOfDigits == 10 && currentNumber.length !== 12){
      var formattedNumber : string = ""
      for(var i = 0; i < currentNumber.length; ++i){
        if(i == 2){
          formattedNumber += currentNumber[i]
          formattedNumber += '-'
        }
        else if(i == 5){
          formattedNumber += currentNumber[i]
          formattedNumber += '-'
        } else{
          formattedNumber += currentNumber[i]
        }
      }
      this.registrationForm.controls['phoneNumber'].setValue(formattedNumber)
    }
  }

  isCharDigit(n : any){
    return !!n.trim() && n > -1;
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registrationForm.controls;
  }
}
