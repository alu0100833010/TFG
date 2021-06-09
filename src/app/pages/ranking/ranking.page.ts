import { NgStyle } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
})
export class RankingPage implements OnInit {

  private userPath = 'users/';

  user: User = {
    userId: '',
    userName: '',
    userEmail: '',
    userPassword: '',
    userLevel: 0,
    userIns: '',
    userWins: 0,
    userTotalPoints: 0,
    userLogros: []
  }

  ranking: User[] = [];

  uid = '';

  constructor(public firebaseauthService: FirebaseauthService, public firestoreService: FirestoreService) {
    this.firebaseauthService.stateAuth().subscribe(res => {
      if (res != null) {
        this.uid = res.uid;
        this.getUserInfo(this.uid);
        console.log(this.uid);
        this.lista();
      }
    });
  }

  ngOnInit() {
    
  }

  lista() {

    
    this.firestoreService.sortDocByValue<User>(this.userPath, "userTotalPoints").subscribe( res => {
      this.ranking = res;
      /*for (let aux = 0; aux < this.ranking.length; aux++) {
        if (this.ranking[aux].userName == this.user.userName){

        }   
      }*/

      //console.log(this.ranking[0].userName);
      //console.log('Nombre del usuario actual: ' + this.user.userName);
    });
  }

  getUserInfo(uid: string) {
    const path = 'users';
    this.firestoreService.getDoc<User>(path, uid).subscribe(res => {
      this.user = res;
    });
  }
}
