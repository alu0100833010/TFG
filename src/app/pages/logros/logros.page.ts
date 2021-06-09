import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Logro } from '../../models/logro';

@Component({
  selector: 'app-logros',
  templateUrl: './logros.page.html',
  styleUrls: ['./logros.page.scss'],
})
export class LogrosPage implements OnInit {

  logroPath = 'logros/';

  logros: Logro[] = [];

  user: User;

  uid = '';

  constructor(private firestore: FirestoreService, public firebaseauthService: FirebaseauthService) {
    this.firebaseauthService.stateAuth().subscribe(res => {
      if (res != null) {
        this.uid = res.uid;
        this.getUserInfo(this.uid);
        console.log(this.uid);
      }
    });
   }

  ngOnInit() {
    this.getLogros();
  }

  getLogros() {
    this.firestore.getCollection<Logro>(this.logroPath).subscribe(res => {
      this.logros = res;
    });
  }

  getUserInfo(uid: string) {
    const path = 'users';
    this.firestore.getDoc<User>(path, uid).subscribe(res => {
      this.user = res;
    });
  }

}
