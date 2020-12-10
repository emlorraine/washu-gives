import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  verifyEmailForm: FormGroup;
  resetPasswordForm: FormGroup;
  emailIsVerified = false
  securityQuestions : string[] = []
  selectedSecurityQuestion = false

  constructor(
    private formBuilder: FormBuilder,
    private db: AngularFirestore,
    public firebaseService: FirebaseService,
    public firebaseAuth : AngularFireAuth,
    private routeTo: Router
  ) { }

  ngOnInit(): void {

    this.verifyEmailForm = this.formBuilder.group({
      email: ['', [Validators.required, this.wustlEmailDomain]],
    });
    this.resetPasswordForm = this.formBuilder.group({
      securityQuestion : ['', Validators.required],
      answer : ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordRepetition: ['', [Validators.required]],
      },
      { validator: this.MustMatch('password', 'passwordRepetition')})
  }

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

  wustlEmailDomain(control: AbstractControl) {
    const email: string = control.value;
    const domain = email.substring(email.lastIndexOf('@') + 1);
    if (domain.toLocaleLowerCase() === 'wustl.edu') {
      return null;
    } else {
      return { emailDomain: true };
    }
  }

  verifyEmail(){
    var docReference = this.db.collection('userInformation').doc(this.verifyEmailForm.getRawValue().email)
    docReference.ref.get().then((doc) => {
      if(doc.exists){
        this.securityQuestions.push(doc.data()['firstQuestion'])
        this.securityQuestions.push(doc.data()['secondQuestion'])
        this.emailIsVerified = true
          this.firebaseAuth.sendPasswordResetEmail(this.verifyEmailForm.getRawValue().email)
          .then(() => 
            alert('Sent password reset email. Please check your inbox and follow the link.')
            )
          .catch((error) => console.log(error))
      }
    })
    
  }

  get f() {
    return this.resetPasswordForm.controls;
  }
  
 

  resetPassword(){
    console.log("successful nav in firebase")
    //If they chose question 1:
    var docReference = this.db.collection('userInformation').doc(this.verifyEmailForm.getRawValue().email)
    docReference.ref.get().then((doc) => {
      //If they selected the first question
      if(this.resetPasswordForm.controls['securityQuestion'].value == doc.data()['firstQuestion']){
        var firstAnswer : string = this.resetPasswordForm.controls['answer'].value
        if(firstAnswer.toLowerCase() == doc.data()['firstQuestionAnswer']){
        } else{
          alert("Sorry, the answer provided for the selected question is incorrect")
        }
      } 
      //If selected the second question
      else{
        var secondAnswer : string = this.resetPasswordForm.controls['answer'].value
        if(secondAnswer.toLocaleLowerCase() == doc.data()['secondQuestionAnswer']){
          alert("Successfully answered the question and password can be reset")
          
          // this.routeTo.navigate([''])
        } else{
          alert("Sorry, the answer provided for the selected question is incorrect")
        }
      }
    })
  }

  


  onSubmit(){}

}
