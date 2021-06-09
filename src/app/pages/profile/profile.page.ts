import { Component, OnInit } from '@angular/core';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { User } from '../../models/user';
import { Level } from '../../models/level';
import { Logro } from '../../models/logro';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

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

  logroUser : Logro  ={
    logroId: 0,
    logroTitulo: '',
    logroDes: '',
    logroImg: '',
    logroPuntos: 0
  }

  logrosTotales: any = [];

  level: Level [] = [];
  logro: Logro [] = [];

  uid = '';

  userCurrentPoints = null;
  userActualLevel = null;

  userCurrentWins = null;

  userInsignLevel = '';

  constructor(public firebaseauthService: FirebaseauthService, public firestoreService: FirestoreService, 
    public alertController: AlertController) {
    this.firebaseauthService.stateAuth().subscribe(res => {
      if (res != null) {
        this.uid = res.uid;
        this.getUserInfo(this.uid);
      }
    });
  }

  async ngOnInit() {
    const uid = await this.firebaseauthService.getUid();
    console.log('Hola: ' + uid);
    this.getUserLevel(uid);
    this.getLogros(uid);
  }

  getUserLevel(uid: string) {
    const path = 'users';
    let cont = 0;
    let aux = 0;
    let aux2 = 0;
    this.firestoreService.getDoc<User>(path, uid).subscribe(res => {
      if(cont == 0) {
        this.userCurrentPoints = res.userTotalPoints;
        this.userActualLevel = res.userLevel;
        console.log('Puntos Actuales del usuario: ' + this.userCurrentPoints);
        this.firestoreService.getCollection<Level>('/levels').subscribe(res => {
          this.level = res;
          while (aux == 0) {
            if(this.userCurrentPoints < this.level[aux2].levelPoints) {
              this.userActualLevel = this.level[aux2-1].levelValue;
              this.userInsignLevel = this.level[aux2-1].levelImg;
              console.log(this.level[aux2].levelValue);
              console.log('userActualLevel: ' + this.userActualLevel);
              this.firestoreService.updateDoc({"userLevel": this.userActualLevel}, path, uid);
              this.firestoreService.updateDoc({"userIns": this.userInsignLevel}, path, uid);
              aux++;
            } else if (aux2 == res.length-1) {
              this.userActualLevel = 10;
              this.userInsignLevel = this.level[res.length-1].levelImg;
              this.firestoreService.updateDoc({"userLevel": this.userActualLevel}, path, uid);
              this.firestoreService.updateDoc({"userIns": this.userInsignLevel}, path, uid);
              aux++;
            }
            else {
              aux2++;
            }
          }
        });
        cont++;
      }
      return;
    });
  }

  getLogros(uid: string) {
    let aux = 0;
    let aux2 = 0;
    let cont = 0;
    const path = 'logros/';
    this.firestoreService.getDoc<User>('users/', uid).subscribe(res => {
      if (cont == 0) {
        this.userCurrentWins = res.userWins;
        this.userCurrentPoints = res.userTotalPoints;
        this.firestoreService.getCollection<Logro>(path).subscribe(res => {
          this.logro = res;
          while(aux != this.logro.length) {
            if (this.userCurrentPoints >= res[aux].logroPuntos) {
              console.log('Victorias del usuario: ' + this.user.userWins);
              console.log('Tengo el logro: ' + res[aux].logroTitulo);
              this.logrosTotales.push(res[aux].logroImg);
              this.firestoreService.updateDoc({"userLogros": this.logrosTotales}, 'users/', uid);
            }
            aux++;
          }
        });
        this.firestoreService.sortDocByValue<User>('users', "userTotalPoints").subscribe(res => {
          if ((this.userCurrentPoints == res[0].userTotalPoints) && (res.length > 1)) {
            this.firestoreService.getDoc<Logro>(path, "4").subscribe(res => {
              if (aux2 == 0) {
                console.log('Tengo el logro: ' + res.logroTitulo);
                this.logrosTotales.push(res.logroImg);
                this.firestoreService.updateDoc({"userLogros": this.logrosTotales}, 'users/', uid);
              }
              aux2++;
            })
          }
        });
      }
      cont++;
    });
  }

  getUserInfo(uid: string) {
    const path = 'users';
    this.firestoreService.getDoc<User>(path, uid).subscribe(res => {
      this.user = res;
    });
  }

  logout() {
    this.firebaseauthService.logout();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Advertencia',
      message: '¿Seguro que quieres <strong>cerrar sesión</strong>?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    await alert.present();
  }


}
