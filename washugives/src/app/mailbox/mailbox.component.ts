import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import _ from 'lodash';
import { forEach } from 'lodash';

@Component({
  selector: 'app-mailbox',
  templateUrl: 'mailbox.component.html',
  styleUrls: ['./mailbox.component.scss'],
})
export class MailboxComponent implements OnInit {
  constructor(
    private db: AngularFirestore,
    private firebaseAuth: AngularFireAuth
  ) {}

  items = [];
  messages = [];
  noPosts: boolean;
  noMessages: boolean;
  showModal: boolean = false;
  selectedMessage : any
  requestorName: any = ''
  requestorDescription: any = ''
  requestorPhoneNumber: any = ''
  itemIsRequest: boolean = false
  itemIsResponse: boolean = false
  showDeleteModal : boolean = false
  postSelected : any

  async ngOnInit(): Promise<void> {
    this.getPostsAndMessages()
  }

  async getPostsAndMessages(){
    this.items = []
    this.db
      .collection('postsByUser')
      .doc((await this.firebaseAuth.currentUser).email)
      .ref.get()
      .then((doc) => {
        this.noPosts = false;
        if (doc.exists && doc.data()['posts'].length > 0) {
          this.items = doc.data()['posts'];
        } else {
          this.noPosts = true;
        }
      });   
      await this.getMessages()
  }

  async getMessages(){
    this.messages = []
    var currentUser = (await this.firebaseAuth.currentUser).email
    this.getMessagesFromCollection('requestMessages', currentUser)
    this.getMessagesFromCollection('requestResponse', currentUser)
  }

  getMessagesFromCollection(collectionName: string, currentUser: any){
    this.db
      .collection(collectionName)
      .doc(currentUser)
      .ref.get()
      .then((doc) => {
        if (doc.exists) {
          this.messages = this.messages.concat(doc.data()['messages'])
        }
        if(this.messages.length < 1){
          this.noMessages = true
        } else{
          this.noMessages = false
        }
      })
  }

  openModal(item: any) {
    this.showModal = true;
    document.getElementById('main').style.opacity = '0.25';
    this.selectedMessage = item
    if(item.isRequest){
      if(this.selectedMessage.isRequest){
        this.db.collection('userInformation').doc(item.messageSentBy).ref.get().then((doc) => {
          this.requestorName = doc.data()['name']
          this.requestorDescription = doc.data()['description']
          this.requestorPhoneNumber = doc.data()['phoneNumber']
        })
      }
      this.itemIsRequest = true
      this.itemIsResponse = false
      this.markMessageAsRead(item, 'requestMessages')
    } 
    //If it is not a request then it is a response to a request
    else{
      this.itemIsRequest = false
      this.itemIsResponse = true
      this.markMessageAsRead(item, 'requestResponse')
    }
  }

  openDeleteModal(post: any){
    document.getElementById('main').style.opacity = '0.25';
    this.showDeleteModal = true
    this.postSelected = post
  }

  async markMessageAsRead(message: any, collectionName: string){
    var documentReference = this.db.collection(collectionName).doc((await this.firebaseAuth.currentUser).email)
    documentReference.ref.get()
    .then((doc) => {
      var previousArray: [{}] = doc.data()['messages']
      var newArray: [{}] = [{}]
      for(var i = 0; i < previousArray.length; ++i){
        if(_.isEqual(message, previousArray[i])){
          message['previouslyOpened'] = true
          newArray.push(message)
        }
        else{
          newArray.push(previousArray[i])
        }
      }
      newArray.shift()
      documentReference.set({messages: newArray})
    })
  }

  closeModal() {
    document.getElementById('main').style.opacity = '1';
    this.showModal = false;
    this.itemIsRequest = false
    this.itemIsResponse = false
  }

  closeDeleteModal(){
    document.getElementById('main').style.opacity = '1';
    this.showDeleteModal = false
  }

  async approveRequest(){
    var currentUser = (await this.firebaseAuth.currentUser).email
    var documentReference = this.db
    .collection('requestResponse')
    .doc(this.selectedMessage.messageSentBy)
    documentReference.ref.get().then((doc) => {
      if(doc.exists){
        var previousArray: [{}] = doc.data()['messages']
        previousArray.push({
          isRequest: false,
          previouslyOpened: false,
          requestApproved: true,
          responseBy: currentUser,
          postBeingRespondedTo: this.selectedMessage.postBeingRequested
        })
        documentReference.set({
          messages: previousArray
        })
      } else{
        documentReference.set({
          messages: [{
            isRequest: false,
          previouslyOpened: false,
          requestApproved: true,
          responseBy: currentUser,
          postBeingRespondedTo: this.selectedMessage.postBeingRequested
          }]
        })
      }
    })
    this.deleteMessage('requestMessages', this.selectedMessage)
    alert("Request approved")
    this.closeModal()
  }
  
  async denyRequest() {
    var currentUser = (await this.firebaseAuth.currentUser).email
    var documentReference = this.db
    .collection('requestResponse')
    .doc(this.selectedMessage.messageSentBy)
    documentReference.ref.get().then((doc) => {
      if(doc.exists){
        var previousArray: [{}] = doc.data()['messages']
        previousArray.push({
          isRequest: false,
          previouslyOpened: false,
          requestApproved: false,
          responseBy: currentUser,
          postBeingRespondedTo: this.selectedMessage.postBeingRequested
        })
        documentReference.set({
          messages: previousArray
        })
      } else{
        documentReference.set({
          messages: [{
            isRequest: false,
          previouslyOpened: false,
          requestApproved: false,
          responseBy: currentUser,
          postBeingRespondedTo: this.selectedMessage.postBeingRequested
          }]
        })
      }
    })
    this.deleteMessage('requestMessages', this.selectedMessage)
    alert("Request denied")
    this.closeModal()
  }

  async deleteMessage(collectionName : string, message: any){
    this.selectedMessage = message
    var currentUser = (await this.firebaseAuth.currentUser).email
    var documentReference = this.db
    .collection(collectionName)
    .doc(currentUser)
    documentReference.ref.get().then((doc) => {
      var previousArray = this.deleteSelectedItem(doc.data()['messages'])
      if(previousArray.length > 1){
        previousArray.shift()
        documentReference.set({
          messages: previousArray
        })
      } else{
        documentReference.delete()
      }
      this.getMessages()
    })
  }

  deleteSelectedItem(array: [{}]) : [{}] {
    var returnArray : [{}] = [{}]
    array.forEach(element => {
      if(! _.isEqual(element, this.selectedMessage)) {
        returnArray.push(element)
      }
    })
    return returnArray
  }

  async deletePost(){
    var documentReference = this.db.collection('postsByUser').doc((await this.firebaseAuth.currentUser).email)
    documentReference
    .ref.get().then((doc) => {
      var previousArray = doc.data()['posts']
      var newArray = []
      for(var i = 0; i < previousArray.length; ++i){
        if(previousArray[i].postKey !== this.postSelected.postKey){
          newArray.push(previousArray[i])
        }
      }
      documentReference.set({
        posts: newArray
      })
      this.getPostsAndMessages()
    })
    this.deleteMessagesAssociatedWithPost(this.postSelected.description)
    this.removeFromCollection('postsByAffiliation', this.postSelected.affiliation, this.postSelected.postKey)
    this.removeFromCollection('postsByCategory', this.postSelected.category, this.postSelected.postKey)
    this.removeFromCollection('postsByLimitation', this.postSelected.limitations, this.postSelected.postKey)
    this.removeFromCollection('postsByRisk', this.postSelected.covidRisk, this.postSelected.postKey)
    this.removeFromCollection('postsBySchool', this.postSelected.school, this.postSelected.postKey)
    this.removeFromCollection('isAPost', this.postSelected.post, this.postSelected.postKey)
    this.closeDeleteModal()
  }

  async deleteMessagesAssociatedWithPost(description : any){
    var documentReference = this.db.collection('requestMessages').doc((await this.firebaseAuth.currentUser).email)
    documentReference
    .ref.get().then((doc) => {
      var previousArray = doc.data()['messages']
      var newArray = []
      for(var i = 0; i < previousArray.length; ++i){
        if(previousArray[i].postBeingRequested !== description){
          newArray.push(previousArray[i])
        }
      }
      documentReference.set({
        messages: newArray
      })
      this.getMessages()
    })
  }

  removeFromCollection(collectionName: string, document: any, key: any){
    var documentReference = this.db.collection(collectionName).doc(document)
    documentReference
    .ref.get().then((doc) => {
      var previousArray: [] = doc.data()['posts']
      var newArray = []
      for(var i = 0; i < previousArray.length; ++i){
        if(previousArray[i] !== key){
          newArray.push(previousArray[i])
        }
      }
      documentReference.set({
        posts: newArray
      })
    })
  }
}
