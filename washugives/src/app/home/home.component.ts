import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
// import { AngularFirestore } from 'angularfire2/firestore';
// import { FirebaseService } from '../services/firebase.service';


@Component({ selector: 'home-component', templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
// public firebaseService: FirebaseService
  constructor() {}

  ngOnInit() {}

  openNav() {
    document.getElementById('mySidebar').style.width = '25%';
    document.getElementById('main').style.marginLeft = '25%';
    document.getElementById('openButton').style.display = 'none';
    document.getElementById('addListingButton').style.display = 'none';
  }

  closeNav() {
    document.getElementById('mySidebar').style.width = '0';
    document.getElementById('main').style.marginLeft = '0';
    document.getElementById('openButton').style.display = 'inline';
    document.getElementById('addListingButton').style.display = 'block';
  }

  // getData(){
  //   firebaseService.collection("postsByUser")
  //   .get()
  //   .then(function(querySnapshot) {
  //       querySnapshot.forEach(function(doc) {
  //           console.log(doc.data());
  //       });
  //   })
  // }

  // generateCards(){}

}
