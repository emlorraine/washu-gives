import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatCardModule } from '@angular/material/card';

@Component({ selector: 'home-component', templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
  constructor(private db: AngularFirestore) {}
  items = [];
  showModal: boolean = false;
  selectedCategory: any = '';
  selectedDescription: any = '';
  selectedLimitationDescription: any = '';
  selectedPerson: any = '';
  selectedContactInfo: any = '';
  selectedAffiliation: any = '';
  selectedSchool: any = '';

  ngOnInit() {
    this.db
      .collection('postsByCategory')
      .snapshotChanges()
      .subscribe((data) => {
        this.items = [];
        data.forEach((a) => {
          let item: any = a.payload.doc.data();
          item.id = a.payload.doc.id;
          for (var element of item.posts) {
            this.items.push(element);
            // console.log(element)
          }
        });
      });
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
  }

  closeModal() {
    document.getElementById('main').style.opacity = '1';
    this.showModal = false;
  }
}
