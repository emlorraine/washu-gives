import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-pic',
  templateUrl: './profile-pic.component.html',
  styleUrls: ['./profile-pic.component.scss']
})
export class ProfilePicComponent implements OnInit {

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  email: String;
  file: File;
  url = '';
  picLink = ''
  private basePath = '/images';
  
  // https://stackoverflow.com/questions/56069516/retrieve-images-from-firebase-storage-using-angular-7
  //Source for the below methods to upload an image and get the url to store in Firestore

  constructor(
    private firestore: AngularFirestore,
    private afStorage: AngularFireStorage,
    private firebaseAuth: AngularFireAuth) { }

  // handleFiles(event) {

  //   this.file = (event.target.files[0]);

  // }

  // // method to upload file at firebase storage
  // async uploadFile() {
  //   if (this.file) {
  //     const randomId = Math.random().toString(36).substring(2);
  //     const filePath = `${this.basePath}/${randomId}`;    //path at which image will be stored in the firebase storage
  //     const snap = await this.afStorage.upload(filePath, this.file);    //upload task
  //     // this.getUrl(snap);
  //   } else {alert('Please select an image'); }
  // }

  // //method to retrieve download url
  // private async getUrl(snap: firebase.storage.UploadTaskSnapshot) {
  //   const url = await snap.ref.getDownloadURL();
  //   this.url = url; 
  //   this.firestore.collection("userInformation").doc((await this.firebaseAuth.currentUser).email).update({
  //     'picLink' : this.url
  //   });
  //   console.log(this.url);
  // }


  ngOnInit(): void {
  }
  
}
