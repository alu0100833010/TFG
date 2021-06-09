import { Component, OnInit } from '@angular/core';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { User } from '../../models/user';
import { Level } from '../../models/level';

@Component({
  selector: 'app-levels',
  templateUrl: './levels.page.html',
  styleUrls: ['./levels.page.scss'],
})
export class LevelsPage implements OnInit {

  user: User;

  levels: Level[] = [];

  uid = '';

  levelPath = 'levels/';

  constructor(public firebaseauthService: FirebaseauthService, public firestore: FirestoreService) {
    this.firebaseauthService.stateAuth().subscribe(res => {
      if (res != null) {
        this.uid = res.uid;
        this.getUserInfo(this.uid);
        console.log(this.uid);
        this.getLevels();
      }
    });
   }

  ngOnInit() {
  }

  getLevels() {
    this.firestore.getCollection<Level>(this.levelPath).subscribe(res => {
      this.levels = res;
    });
  }

  getUserInfo(uid: string) {
    const path = 'users';
    this.firestore.getDoc<User>(path, uid).subscribe(res => {
      this.user = res;
    });
  }

}
