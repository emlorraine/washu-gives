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
  postSelected: any = ''
  loading: boolean = true
  howManyFilters: number = 0
  howManyFiltersGoneThrough: number = 0
  unreadMessage: boolean
  isOwnPost : boolean

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
  postOrRequestOptions: String[] = ['Providers', 'Requests']
  lookingForPosts : boolean
  hasSelectedType = false
  yesOrNo: String[] = ['Yes', 'No'];
  limitation: String;
  maxKeyWordLength = 30;

  ngOnInit() {
    this.getAllItems()
    this.hasUnreadMessages()
    this.filterForm = this.formBuilder.group({
      postOrRequest: [''],
      category: [''],
      covidRisk: [''],
      affiliation: [''],
      limitations: [''],
      school: [''],
    });
    this.loading = false
  }

  async hasUnreadMessages(){
    var currentUser = (await this.firebaseAuth.currentUser).email
    this.updateUnread(currentUser, 'requestMessages')
    this.updateUnread(currentUser, 'requestResponse')
  }

  async updateUnread(currentUser: any, collectionName: string){
    this.db
    .collection(collectionName)
    .doc(currentUser).ref.get()
    .then((doc) => {
      if(doc.exists) {
        var requestArray: [] = doc.data()['messages']
        for(var i = 0; i < requestArray.length; ++i){
          if(! requestArray[i]['previouslyOpened']){
            this.unreadMessage = true
            break
          }
        }
      }
    })
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
    this.onSubmit()
  }

  get f() {
    return this.filterForm.controls;
  }

  numberOfFiltersSelected() {
    this.howManyFilters = 0
    if(this.filterForm.value.postOrRequest != ''){
      this.howManyFilters += 1
    }
    if(this.filterForm.value.category != ''){
      this.howManyFilters += 1
    }
    if(this.filterForm.value.affiliation != ''){
      this.howManyFilters += 1
    }
    if(this.filterForm.value.school != ''){
      this.howManyFilters += 1
    }
    if(this.filterForm.value.limitations != ''){
      this.howManyFilters += 1
    }
    if(this.filterForm.value.covidRisk != ''){
      this.howManyFilters += 1
    }
  }

  onSubmit() {
    this.loading = true
    this.itemKeys = []
    this.getAllItems()
    this.numberOfFiltersSelected()
    this.howManyFiltersGoneThrough = 0
    if(this.howManyFilters == 0){
      this.loading = false
    } else{
      if(this.filterForm.value.postOrRequest != '' && this.desiredFilterHasPosts){
        if(this.filterForm.value.postOrRequest == 'Providers'){
          this.filterBy('isAPost', 'true')
        } else{
          this.filterBy('isAPost', 'false')
        }
      }
      if(this.filterForm.value.category != '' && this.desiredFilterHasPosts){
        this.filterBy('postsByCategory', this.filterForm.value.category)
      }
      if(this.filterForm.value.affiliation != '' && this.desiredFilterHasPosts){
        this.filterBy('postsByAffiliation', this.filterForm.value.affiliation)
      }
      if(this.filterForm.value.school != '' && this.desiredFilterHasPosts){
        this.filterBy('postsBySchool', this.filterForm.value.school)
      }
      if(this.filterForm.value.limitations != '' && this.desiredFilterHasPosts){
        this.filterBy('postsByLimitation', this.filterForm.value.limitations)
      }
      if(this.filterForm.value.covidRisk != '' && this.desiredFilterHasPosts){
        this.filterBy('postsByRisk', this.filterForm.value.covidRisk)
      }
    }
    this.submitted = true;
  }

  clearFormFields(){
    this.filterForm = this.formBuilder.group({
      postOrRequest: [''],
      category: [''],
      covidRisk: [''],
      affiliation: [''],
      limitations: [''],
      school: [''],
    });
    this.hasSelectedType = false
    this.onSubmit()
    this.closeNav()
  }

  resetUniqueValues(){
    this.hasSelectedType = true
    this.filterForm.controls['covidRisk'].setValue('')
    this.filterForm.controls['limitations'].setValue('')
    this.onSubmit()
  }

  filterBy(collectionName: string, documentName: any){
    this.db
      .collection(collectionName)
      .doc(documentName)
      .ref.get()
      .then((doc) => {
        if(doc.exists) {
          if(this.howManyFilters == 1){
            this.items = this.findItemsByKeys(doc.data()['posts'])
            this.loading = false
          } else{
            this.itemKeys = this.itemKeys.concat(doc.data()['posts'])
            this.howManyFiltersGoneThrough += 1
            if(this.howManyFiltersGoneThrough > 1){
              this.itemKeys = this.removeDuplicates(this.findDuplicates(this.itemKeys))
            }
            this.updateItems()
          }
        } else{
          this.desiredFilterHasPosts = false
        }
      })
  }

  updateItems(){
    if(this.howManyFiltersGoneThrough == this.howManyFilters){
      this.loading = false
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

  async openPost(item: any) {
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
    this.postSelected = item
    var currentUser = (await this.firebaseAuth.currentUser).email
    if(item.postedBy == currentUser){
      this.isOwnPost = true
    } else{
      this.isOwnPost = false
    }
  }

  closeModal() {
    document.getElementById('main').style.opacity = '1';
    this.showModal = false;
  }

  async ableToRequestInformation(){
    var currentUser = (await this.firebaseAuth.currentUser).email
    var hasPreviouslyRequestedThisPost = false
    var requestedBy: string[] = (this.postSelected.requestedBy)
    for(var i = 0; i < requestedBy.length; ++i){
      if(requestedBy[i] == currentUser){
        hasPreviouslyRequestedThisPost = true
      }
    }
    if(hasPreviouslyRequestedThisPost) {
      alert("You have already requested information regarding this post, please wait for a response.")
      this.closeModal()
    } else{
      this.db.collection('userInformation').doc(currentUser).ref.get().then((doc) => {
        if(doc.exists){
          this.requestContactInformation()
        } else{
          alert("In order to request contact information regarding a post you must first update your profile information. You may do so under the 'Profile' tab.")
        }
      })
    }
  }

  async requestContactInformation(){
    var currentUser = (await this.firebaseAuth.currentUser).email
    this.db.collection('postsByUser').doc(this.postSelected.postedBy).ref.get().then((doc) =>{
      var previousArray: [{}] = doc.data()['posts']
      var newArray: [{}] = [{}]
      var previousArrayOfRequestors = []
      for(var i = 0; i < previousArray.length; ++i){
        if(_.isEqual(previousArray[i], this.postSelected)){
          previousArrayOfRequestors = previousArray[i]['requestedBy']
          previousArrayOfRequestors.push(currentUser)
          newArray.push({
            post: this.postSelected.post,
            affiliation: this.postSelected.affiliation,
            category: this.postSelected.category,
            covidRisk: this.postSelected.covidRisk,
            description: this.postSelected.description,
            limitationDescription: this.postSelected.limitationDescription,
            limitations: this.postSelected.limitations,
            name: this.postSelected.name,
            postKey: this.postSelected.postKey,
            postedBy: this.postSelected.postedBy,
            primaryContact: this.postSelected.primaryContact,
            primaryContactInformation: this.postSelected.primaryContactInformation,
            school: this.postSelected.school,
            requestedBy: previousArrayOfRequestors
          })
        } else{
          newArray.push(previousArray[i])
        }
      }
      newArray.shift()
      this.db.collection('postsByUser').doc(this.postSelected.postedBy).set({
        posts: newArray
      })
    })
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
