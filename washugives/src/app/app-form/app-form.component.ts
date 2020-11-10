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
  riskLevels: any = ['None', 'Low', 'Medium', 'High'];
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
  yesOrNo: String[] = ['Yes', 'No'];
  limitation: String;

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
    var temporary = this.providerForm.value;
    var userEmail = (await this.firebaseAuth.currentUser).email;
    const documentReference = this.firestore
      .collection('postsByUser')
      .doc(userEmail);
    documentReference.ref.get().then((doc) => {
      if (doc.exists) {
        var previousArray: [{}] = doc.data()['posts'];
        previousArray.push({
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
          postedBy: userEmail
        });
        documentReference.set({ posts: previousArray });
      } else {
        documentReference.set({
          posts: [
            {
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
              postedBy: userEmail
            },
          ],
        });
      }
    });
    this.submitToFilter('postsByCategory', 'category', userEmail);
    this.submitToFilter('postsByAffiliation', 'affiliation', userEmail);
    this.submitToFilter('postsByRisk', 'covidRisk', userEmail);
    this.submitToFilter('postsByLimitation', 'limitations', userEmail);
    this.submitToFilter('postsBySchool', 'school', userEmail);
    alert('Post submitted successfully');
    this.routeTo.navigate(['/home']);
  }

  async submitToFilter(collection: string, filter: string, userEmail: any) {
    var temporary = this.providerForm.value;
    const documentReference = this.firestore
      .collection(collection)
      .doc(temporary[filter]);
    documentReference.ref.get().then((doc) => {
      if (doc.exists && doc.data()) {
        var previousArray: [{}] = doc.data()['posts'];
        previousArray.push({
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
          postedBy: userEmail
        });
        documentReference.set({ posts: previousArray });
      } else {
        documentReference.set({
          posts: [
            {
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
              postedBy: userEmail
            },
          ],
        });
      }
    });
  }
}
