import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-details',
  templateUrl: './reset-details.component.html',
  styleUrls: ['./reset-details.component.scss']
})
export class ResetDetailsComponent implements OnInit {

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
    private routeTo: Router,
    private activatedRoute: ActivatedRoute

  ) { }

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      })
  }


  async updateFirebasePassword(){
    let code = ""; 
    this.activatedRoute.queryParams.subscribe(params => {
        code = params['oobCode'];
    });
    let password = this.resetPasswordForm.controls.password.value;
    await this.firebaseAuth.confirmPasswordReset(code, password)
    alert('Password successfully reset. Please login again to access your account.')
    this.routeTo.navigate([''])
    return 1; 
  }


  onSubmit(){}

}
