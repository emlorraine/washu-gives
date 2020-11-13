import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import _ from 'lodash';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({ selector: 'home-component', templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
  constructor(private db: AngularFirestore, private formBuilder: FormBuilder, private firebaseAuth: AngularFireAuth) {}
  items = [];
  showModal: boolean = false;
  selectedCategory: any = '';
  selectedDescription: any = '';
  selectedLimitationDescription: any = '';
  selectedPerson: any = '';
  selectedContactInfo: any = '';
  selectedAffiliation: any = '';
  selectedSchool: any = '';
  emailAssociatedWithPost: any = '';

  itemKeys = []
  desiredFilterHasPosts = true

  //Brought in from the filter-form:
  filterForm: FormGroup;
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
  maxKeyWordLength = 30;

  ngOnInit() {
    this.getAllItems()
    this.filterForm = this.formBuilder.group({
      keyword: ['', Validators.maxLength(this.maxKeyWordLength)],
      category: [''],
      covidRisk: [''],
      affiliation: [''],
      limitations: [''],
      school: [''],
    });
  }

  getAllItems(){
    this.db
      .collection('postsByUser')
      .snapshotChanges()
      .subscribe((data) => {
        this.items = [];
        data.forEach((a) => {
          let item: any = a.payload.doc.data();
          item.id = a.payload.doc.id;
          for (var element of item.posts) {
            this.items.push(element);
          }
        });
      });
  }

  displayAffiliationOptions() {
    this.affiliation = this.filterForm.getRawValue().affiliation;
  }

  get f() {
    return this.filterForm.controls;
  }

  numberOfFiltersSelected() : number {
    var filtersSelected = 0
    if(this.filterForm.value.category != ''){
      filtersSelected += 1
    }
    if(this.filterForm.value.affiliation != ''){
      filtersSelected += 1
    }
    if(this.filterForm.value.school != ''){
      filtersSelected += 1
    }
    if(this.filterForm.value.limitations != ''){
      filtersSelected += 1
    }
    if(this.filterForm.value.covidRisk != ''){
      filtersSelected += 1
    }
    return filtersSelected
  }

  onSubmit() {
    this.itemKeys = []
    this.getAllItems()
    var filtersSelected = this.numberOfFiltersSelected()
    var goneThroughXFilters = 0
    if(this.filterForm.value.category != '' && this.desiredFilterHasPosts){
      this.db
      .collection('postsByCategory')
      .doc(this.filterForm.value.category)
      .ref.get()
      .then((doc) => {
        if(doc.exists) {
          if(filtersSelected == 1){
            this.items = this.findItemsByKeys(doc.data()['posts'])
          } else{
            this.itemKeys = this.itemKeys.concat(doc.data()['posts'])
            goneThroughXFilters += 1
            if(goneThroughXFilters > 1){
              this.itemKeys = this.removeDuplicates(this.findDuplicates(this.itemKeys))
            }
            this.updateItems(goneThroughXFilters, filtersSelected)
          }
        } else{
          this.desiredFilterHasPosts = false
        }
      })
    }
    if(this.filterForm.value.affiliation != '' && this.desiredFilterHasPosts){
      this.db
      .collection('postsByAffiliation')
      .doc(this.filterForm.value.affiliation)
      .ref.get()
      .then((doc) => {
        if(doc.exists) {
          if(filtersSelected == 1){
            this.items = this.findItemsByKeys(doc.data()['posts'])
          } else{
            this.itemKeys = this.itemKeys.concat(doc.data()['posts'])
            goneThroughXFilters += 1
            if(goneThroughXFilters > 1){
              this.itemKeys = this.removeDuplicates(this.findDuplicates(this.itemKeys))
            }
            this.updateItems(goneThroughXFilters, filtersSelected)
          }
        } else{
          this.desiredFilterHasPosts = false
        }
      })
    }
    if(this.filterForm.value.school != '' && this.desiredFilterHasPosts){
      this.db
      .collection('postsBySchool')
      .doc(this.filterForm.value.school)
      .ref.get()
      .then((doc) => {
        if(doc.exists) {
          if(filtersSelected == 1){
            this.items = this.findItemsByKeys(doc.data()['posts'])
          } else{
            this.itemKeys = this.itemKeys.concat(doc.data()['posts'])
            goneThroughXFilters += 1
            if(goneThroughXFilters > 1){
              this.itemKeys = this.removeDuplicates(this.findDuplicates(this.itemKeys))
            }
            this.updateItems(goneThroughXFilters, filtersSelected)
          }
        } else{
          this.desiredFilterHasPosts = false
        }
      })
    }
    if(this.filterForm.value.limitations != '' && this.desiredFilterHasPosts){
      this.db
      .collection('postsByLimitation')
      .doc(this.filterForm.value.limitations)
      .ref.get()
      .then((doc) => {
        if(doc.exists) {
          if(filtersSelected == 1){
            this.items = this.findItemsByKeys(doc.data()['posts'])
          } else{
            this.itemKeys = this.itemKeys.concat(doc.data()['posts'])
            goneThroughXFilters += 1
            if(goneThroughXFilters > 1){
              this.itemKeys = this.removeDuplicates(this.findDuplicates(this.itemKeys))
            }
            this.updateItems(goneThroughXFilters, filtersSelected)
          }
        } else{
          this.desiredFilterHasPosts = false
        }
      })
    }
    if(this.filterForm.value.covidRisk != '' && this.desiredFilterHasPosts){
      this.db
      .collection('postsByRisk')
      .doc(this.filterForm.value.covidRisk)
      .ref.get()
      .then((doc) => {
        if(doc.exists) {
          if(filtersSelected == 1){
            this.items = this.findItemsByKeys(doc.data()['posts'])
          } else{
            this.itemKeys = this.itemKeys.concat(doc.data()['posts'])
            goneThroughXFilters += 1
            if(goneThroughXFilters > 1){
              this.itemKeys = this.removeDuplicates(this.findDuplicates(this.itemKeys))
            }
            this.updateItems(goneThroughXFilters, filtersSelected)
          }
        } else{
          this.desiredFilterHasPosts = false
        }
      })
    }
    this.submitted = true;
    this.closeNav()
  }

  updateItems(filteredThrough: number, filtersSelected: number){
    if(filteredThrough == filtersSelected){
      console.log(this.itemKeys)
      this.items = this.findItemsByKeys(this.itemKeys)
    }
  }

  findItemsByKeys(arr: number []) : [{}]{
    var returnArray : [{}] = [{}]
    for(var i = 0; i < arr.length; ++i){
      for(var j = 0; j < this.items.length; ++ j){
        if(arr[i] === this.items[j]['postKey']){
          returnArray.push(this.items[j])
        }
      }
    }
    returnArray.shift()
    return returnArray
  }

  findDuplicates (arr : any) {
    var isDuplicated = false
    var newArray = []
    for(var i = 0; i < arr.length - 1; ++i){
      for(var j = i+1; j < arr.length; ++j){
        if(_.isEqual(arr[i], arr[j])){
          newArray.push(arr[i])
        }
      }
    }
    return newArray
  }

  removeDuplicates(arr : any) {
    return arr.filter((a, b) => _.isEqual(arr.indexOf(a), b))
  }

  openNav() {
    document.getElementById('mySidebar').style.width = '25%';
    document.getElementById('main').style.marginLeft = '25%';
    document.getElementById('openButton').style.display = 'none';
  }

  closeNav() {
    document.getElementById('mySidebar').style.width = '0';
    document.getElementById('main').style.marginLeft = '0';
    document.getElementById('openButton').style.display = 'inline';
  }

  openPost(item: any) {
    this.showModal = true;
    document.getElementById('main').style.opacity = '0.25';
    this.selectedCategory = item.category;
    this.selectedContactInfo = item.primaryContactInformation;
    this.selectedLimitationDescription = item.limitationDescription;
    this.selectedSchool = item.school;
    this.selectedAffiliation = item.affiliation;
    this.selectedDescription = item.description;
    this.selectedPerson = item.name;
    this.emailAssociatedWithPost = item.postedBy
  }

  closeModal() {
    document.getElementById('main').style.opacity = '1';
    this.showModal = false;
  }

  async ableToRequestInformation(){
    var currentUser = (await this.firebaseAuth.currentUser).email
    this.db.collection('userInformation').doc(currentUser).ref.get().then((doc) => {
      if(doc.exists){
        this.requestContactInformation()
      } else{
        alert("In order to request contact information regarding a post you must first update your profile information. You may do so under the 'Profile' tab.")
      }
    })
  }

  async requestContactInformation(){
    var currentUser = (await this.firebaseAuth.currentUser).email
    var currentName : string = ''
    this.db.collection('userInformation').doc(currentUser).ref.get().then((doc) => {
      currentName = doc.data()['name']
    })
    var documentReference = this.db
    .collection('requestMessages')
    .doc(this.emailAssociatedWithPost)
    documentReference
      .ref.get()
      .then((doc) => {
        if(doc.exists) {
          var previousArray: [{}] = doc.data()['messages']
          previousArray.push({
            previouslyOpened: false,
            isRequest: true,
            requestResolved: false,
            messageSentBy: currentUser,
            nameOfSender: currentName,
            postBeingRequested: this.selectedDescription
          })
          documentReference.set({messages: previousArray})
        } else{
          documentReference.set({
            messages: [{
              previouslyOpened: false,
              isRequest: true,
              requestResolved: false,
              messageSentBy: currentUser,
              nameOfSender: currentName,
              postBeingRequested: this.selectedDescription
            }]
          })
        }
      })
      alert("Request sent")
      this.closeModal()
  }
}
