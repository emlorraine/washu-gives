import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { first } from 'rxjs/operators';
import { FirebaseService } from '../services/firebase.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';

@Component({ selector: 'app-form', templateUrl: 'app-form.component.html' })
export class AppFormComponent implements OnInit {
  providerForm: FormGroup;
  submitted = false;
  riskLevels: any = ['Low', 'Medium', 'High'];
  categories: any = [
    'Employment',
    'Food',
    'Housing',
    'Transportation',
    'Storage',
    'Support',
    'Other',
  ];
  formsOfContact: String[] = ['Email', 'Phone', 'Other'];
  primaryFormOfContact: any = '';
  affiliationOptions: String[] = [
    'Undergraduate',
    'Graduate',
    'Faculty or Staff',
  ];
  affiliation: String;
  undergraduateSchools: String[] = [
    'Arts & Sciences',
    'Engineering',
    'Olin',
    'Sam Fox',
  ];
  graduateSchools: String[] = this.undergraduateSchools.concat([
    'Law',
    'Medicine',
    'Brown',
  ]);
  postingOrLooking : String[] = ['Posting aid', 'Looking for aid']
  yesOrNo: String[] = ['Yes', 'No'];
  limitation: String;
  incrementalKeyNumber: number;
  hasntSelectedTypeOfPost = true

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private firebaseAuth: AngularFireAuth,
    private routeTo: Router
  ) {}

  ngOnInit() {
    this.providerForm = this.formBuilder.group({
      //Required fields:
      post: ['', Validators.required],
      name: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', [Validators.minLength(50), Validators.required]],
      covidRisk: ['', Validators.required],
      primaryContact: ['', Validators.required],
      primaryContactInformation: ['', Validators.required],
      affiliation: ['', Validators.required],
      limitations: ['', Validators.required],
      //Optional fields
      school: [''],
      limitationDescription: [''],
    });
  }

  setPostOrRequest(){
    if(this.providerForm.getRawValue().post == 'Posting aid'){
      this.providerForm.controls['post'].setValue("true")
    } else{
      this.providerForm.controls['post'].setValue("false")
      this.setDefaults()
    }
    this.hasntSelectedTypeOfPost = false
  }

  setDefaults(){
    this.providerForm.controls['covidRisk'].setValue("NA")
    this.providerForm.controls['limitations'].setValue("NA")
  }

  getCurrentKeyIndex() {
    this.firestore
    .collection('totalKeys')
    .doc('keys').ref.get().then((doc) => {
      if(doc.exists){
        this.incrementalKeyNumber = doc.data()['totalKeyNumber']
      } else{
        this.incrementalKeyNumber = 0
      }
    })
  }

  displayContactInput() {
    this.primaryFormOfContact = this.providerForm.getRawValue().primaryContact;
  }

  displayAffiliationOptions() {
    this.affiliation = this.providerForm.getRawValue().affiliation;
  }

  updateLimitation() {
    this.limitation = this.providerForm.getRawValue().limitations;
  }

  get f() {
    return this.providerForm.controls;
  }

  async onSubmit() {
    //Increment the total key count by 1
    this.getCurrentKeyIndex()
    var totalKeyReference = this.firestore
    .collection('totalKeys')
    .doc('keys')
    totalKeyReference.ref.get().then((doc) => {
        totalKeyReference.set({totalKeyNumber: this.incrementalKeyNumber + 1})
    })
    var temporary = this.providerForm.value;
    var userEmail = (await this.firebaseAuth.currentUser).email;
    const documentReference = this.firestore
      .collection('postsByUser')
      .doc(userEmail);
    documentReference.ref.get().then((doc) => {
      if (doc.exists) {
        var previousArray: [{}] = doc.data()['posts'];
        previousArray.push({
          post: temporary['post'],
          affiliation: temporary['affiliation'],
          category: temporary['category'],
          covidRisk: temporary['covidRisk'],
          description: temporary['description'],
          limitationDescription: temporary['limitationDescription'],
          limitations: temporary['limitations'],
          name: temporary['name'],
          primaryContact: temporary['primaryContact'],
          primaryContactInformation: temporary['primaryContactInformation'],
          school: temporary['school'],
          postedBy: userEmail,
          postKey: this.incrementalKeyNumber + 1,
          requestedBy: []
        });
        documentReference.set({ posts: previousArray });
      } else {
        documentReference.set({
          posts: [
            {
              post: temporary['post'],
              affiliation: temporary['affiliation'],
              category: temporary['category'],
              covidRisk: temporary['covidRisk'],
              description: temporary['description'],
              limitationDescription: temporary['limitationDescription'],
              limitations: temporary['limitations'],
              name: temporary['name'],
              primaryContact: temporary['primaryContact'],
              primaryContactInformation: temporary['primaryContactInformation'],
              school: temporary['school'],
              postedBy: userEmail,
              postKey: this.incrementalKeyNumber + 1,
              requestedBy: []
            },
          ],
        });
      }
    });
    this.submitToFilter('postsByCategory', 'category');
    this.submitToFilter('postsByAffiliation', 'affiliation');
    this.submitToFilter('postsByRisk', 'covidRisk');
    this.submitToFilter('postsByLimitation', 'limitations');
    this.submitToFilter('postsBySchool', 'school');
    this.submitToFilter('isAPost', 'post');
    alert('Post submitted successfully');
    this.routeTo.navigate(['/home']);
  }

  async submitToFilter(collection: string, filter: string) {
    var temporary = this.providerForm.value;
    console.log(temporary[filter])
    const documentReference = this.firestore
      .collection(collection)
      .doc(temporary[filter]);
    documentReference.ref.get().then((doc) => {
      if (doc.exists && doc.data()) {
        var previousArray: number [] = doc.data()['posts'];
        previousArray.push(
          this.incrementalKeyNumber + 1
        );
        documentReference.set({ posts: previousArray });
      } else {
        documentReference.set({
          posts: [
            this.incrementalKeyNumber + 1
          ],
        });
      }
    });
  }
}
