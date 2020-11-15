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
  name: string;
  description: string;
  phoneNumber: string;
  updateProfileForm: FormGroup;
  loading: boolean = true

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
          this.name = doc
            .data()
            ['name'].substr(0, doc.data()['name'].indexOf(' '));
          this.description = doc.data()['description'];
          this.phoneNumber = doc.data()['phoneNumber'];
        } else {
          this.hasUpdatedPreviously = false;
        }
        this.loading = false
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

  async updateProfile() {
    this.needsUpdate = true;
  }
}
