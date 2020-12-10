import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private firestore: AngularFirestore,
    private firebaseAuth: AngularFireAuth,
    private formBuilder: FormBuilder
  ) {}

  hasUpdatedPreviously: boolean = false;
  needsUpdate: boolean = false;
  loading: boolean = true;
  name: string;
  fullName: string;
  description: string;
  phoneNumber: string;
  updateProfileForm: FormGroup;

  async ngOnInit(): Promise<void> {
    this.updateProfileForm = this.formBuilder.group({
      name: ['', Validators.required],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('^((\\+91-?)|0)?[0-9]{3}-[0-9]{3}-[0-9]{4}$'),
        ],
      ],
      description: ['', [Validators.required, Validators.maxLength(300)]],
    });
    this.firestore
      .collection('userInformation')
      .doc((await this.firebaseAuth.currentUser).email)
      .ref.get()
      .then((doc) => {
        if (doc.exists) {
          this.hasUpdatedPreviously = true;
          this.fullName = doc.data()['name']
          this.name = doc
            .data()
            ['name'].substr(0, doc.data()['name'].indexOf(' '));
          this.description = doc.data()['description'];
          this.phoneNumber = doc.data()['phoneNumber'];
        } else {
          this.hasUpdatedPreviously = false;
        }
        this.loading = false;
      });
  }

  async onSubmit() {
    const documentReference = this.firestore
      .collection('userInformation')
      .doc((await this.firebaseAuth.currentUser).email);
    documentReference.ref.get().then((doc) => {
      documentReference.set({
        name: this.updateProfileForm.value['name'],
        phoneNumber: this.updateProfileForm.value['phoneNumber'],
        description: this.updateProfileForm.value['description'],
      });
      this.name = this.updateProfileForm.value['name'].substr(
        0,
        this.updateProfileForm.value['name'].indexOf(' ')
      );
      this.description = this.updateProfileForm.value['description'];
      this.phoneNumber = this.updateProfileForm.value['phoneNumber'];
    });
    this.hasUpdatedPreviously = true;
    this.needsUpdate = false;
  }

  cancelUpdate(){
    this.needsUpdate = false
  }

  async updateProfile() {
    this.updateProfileForm = this.formBuilder.group({
      name: [this.fullName, Validators.required],
      phoneNumber: [
        this.phoneNumber,
        [
          Validators.required,
          Validators.pattern('^((\\+91-?)|0)?[0-9]{3}-[0-9]{3}-[0-9]{4}$'),
        ],
      ],
      description: [this.description, [Validators.required, Validators.maxLength(300)]],
    });
    this.needsUpdate = true;
  }

  formatForUser(){
    var currentNumber = (this.updateProfileForm.controls['phoneNumber'].value)
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
      this.updateProfileForm.controls['phoneNumber'].setValue(formattedNumber)
    }
  }

  isCharDigit(n : any){
    return !!n.trim() && n > -1;
  }

}
