import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private firestore: AngularFirestore,
    private firebaseAuth: AngularFireAuth,
    private formBuilder: FormBuilder,
    private afStorage: AngularFireStorage
  ) {}

  hasUpdatedPreviously: boolean = false;
  needsUpdate: boolean = false;
  loading: boolean = true;
  name: string;
  fullName: string;
  description: string;
  phoneNumber: string;
  updateProfileForm: FormGroup;

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  downloadURL: any;
  event: any;
  uploadedPicture = false


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
      description: ['', [Validators.required, Validators.minLength(30)]],
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
      this.displayImage()
  }

  upload = (event) => {
    this.event = event
    this.uploadedPicture = true
  }

  async displayImage(){
    const randomId = (await this.firebaseAuth.currentUser).email;
    // create a reference to the storage bucket location
    this.ref = this.afStorage.ref('/images/' + randomId);
    this.downloadURL = this.ref.getDownloadURL()
  }

  async onSubmit() {
    var userEmail = (await this.firebaseAuth.currentUser).email
    const documentReference = this.firestore
      .collection('userInformation')
      .doc(userEmail);
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

    if(this.uploadedPicture){
      this.loading = true
      const pictureId : string = userEmail;
      // create a reference to the storage bucket location
      this.ref = this.afStorage.ref('/images/' + pictureId);
      // the put method creates an AngularFireUploadTask
      // and kicks off the upload
      this.task = this.ref.put(this.event.target.files[0]);
      this.task.snapshotChanges().pipe(
        finalize(() => this.loading = false)
      )
      .subscribe();
      this.hasUpdatedPreviously = true;
      this.needsUpdate = false;
    } else{
      this.hasUpdatedPreviously = true;
      this.needsUpdate = false;
    }
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
      description: [this.description, [Validators.required, Validators.minLength(30)]],
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
