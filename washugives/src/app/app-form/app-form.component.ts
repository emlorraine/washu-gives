import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { FirebaseService } from '../services/firebase.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuthModule } from '@angular/fire/auth';

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
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.providerForm = this.formBuilder.group({
      //Required fields:
      name: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.minLength(50) && Validators.required],
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

  async onSubmit(affiliationValue, schoolValue, subSchoolValue, 
    categoryValue, descriptionValue, limitationValue, limitationDescriptionValue, 
    primaryContactValue, primaryContactInformationValue, covidRiskLevelValue) {
    const docID = await db.collection("posts").set({
      affiliation: this.affiliation,
      category: this.category,
      covidRisk: this.covidRisk,
      description: this.description,
      limitationDescription: this.limitationDescription,
      limitations: this.limitations,
      name: this.name,
      primaryContact: this.primaryContact,
      primaryContactInformation: this.primaryContactInformation,
      school: this.school
    })
    console.log("DocumentID: ", docID);
    this.submitted = true;
  }
}
