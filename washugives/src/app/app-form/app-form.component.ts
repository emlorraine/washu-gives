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
  riskLevels: any = ['Low (not immunocompromised or live with those who are immunocompromised)', 'Medium (immunocompromised or live with at-risk people who are immunocompromised)', 'High (very immunocompromised or live with highly immunocompromised people)'];
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
  postingOrLooking : String[] = ['Provide Assistance', 'Request Assistance']
  yesOrNo: String[] = ['Yes', 'No'];
  limitation: String;
  incrementalKeyNumber: number;
  hasntSelectedTypeOfPost = true
  storedPhoneNumber = ""
  storedEmail = ""
  loading = true

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
      description: ['', [Validators.maxLength(300), Validators.required]],
      covidRisk: ['', Validators.required],
      primaryContact: ['', Validators.required],
      primaryContactInformation: ['', Validators.required],
      affiliation: ['', Validators.required],
      limitations: ['', Validators.required],
      //Optional fields
      school: [''],
      limitationDescription: [''],
    });
    this.getPreviousInformationFormProfile()
  }

  async getPreviousInformationFormProfile(){
    var userEmail = (await this.firebaseAuth.currentUser).email;
    this.firestore.collection('userInformation').doc(userEmail).ref.get().then((doc) => {
      this.providerForm.controls['name'].setValue(doc.data()['name'])
      this.storedPhoneNumber = doc.data()['phoneNumber']
      this.getPreviousInformationFromPosts(userEmail)
    })
  }

  async getPreviousInformationFromPosts(userEmail: any){
    this.firestore.collection('postsByUser').doc(userEmail).ref.get().then((doc) => {
      if(doc.exists && doc.data()['posts'].length > 0){
        this.providerForm.controls['affiliation'].setValue(doc.data()['posts'][0]['affiliation'])
        this.displayAffiliationOptions()
        this.providerForm.controls['school'].setValue(doc.data()['posts'][0]['school'])
        this.providerForm.controls['primaryContact'].setValue(doc.data()['posts'][0]['primaryContact'])
        if(doc.data()['posts'][0]['primaryContact'] == "Email"){
          this.storedEmail = doc.data()['posts'][0]['primaryContactInformation']
        } else{
          this.storedEmail = userEmail
        }
        this.displayContactInput()
        this.loading = false
      } else{
        this.storedEmail = userEmail
        this.loading = false
      }
    })
  }

  setPostOrRequest(){
    if(this.providerForm.getRawValue().post == 'Provide Assistance'){
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
    var contact = this.providerForm.controls['primaryContact'].value
    this.primaryFormOfContact = contact
    var contactControl = this.providerForm.get('primaryContactInformation')
    contactControl.clearValidators()
    if(contact == "Email"){
      contactControl.setValidators([Validators.required, Validators.email])
      this.providerForm.controls['primaryContactInformation'].setValue(this.storedEmail)
    }
    else if(contact == "Phone"){
      contactControl.setValidators([Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{3}-[0-9]{3}-[0-9]{4}$')])
      this.providerForm.controls['primaryContactInformation'].setValue(this.storedPhoneNumber)
    } else{
      contactControl.setValidators(Validators.required)
      this.providerForm.controls['primaryContactInformation'].setValue('')
    }
  }

  formatPhoneNumber(){
    if(this.providerForm.controls['primaryContact'].value == "Phone"){
      var currentNumber = (this.providerForm.controls['primaryContactInformation'].value)
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
        this.providerForm.controls['primaryContactInformation'].setValue(formattedNumber)
      }
      } 
    }
  
    isCharDigit(n : any){
      return !!n.trim() && n > -1;
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
