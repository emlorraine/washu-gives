import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-mailbox',
  templateUrl: './mailbox.component.html',
  styleUrls: ['./mailbox.component.scss'],
})
export class MailboxComponent implements OnInit {
  constructor(
    private db: AngularFirestore,
    private firebaseAuth: AngularFireAuth
  ) {}

  items = [];
  noPosts: boolean;

  async ngOnInit(): Promise<void> {
    this.db
      .collection('postsByUser')
      .doc((await this.firebaseAuth.currentUser).email)
      .ref.get()
      .then((doc) => {
        this.noPosts = false;
        if (doc.exists) {
          this.items = doc.data()['posts'];
        } else {
          this.noPosts = true;
        }
      });
  }
}
