import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/models/game';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FirebaseauthService } from '../../services/firebaseauth.service';
import { AlertController, MenuController } from '@ionic/angular';
import { User } from '../../models/user';
import { Desafio } from '../../models/desafio';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

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

  uid = '';

  games: Game[] = [];  
  desafios: Desafio[] = [];

  private gamePath = 'games/';
  private desafioPath = 'desafios/';

  bgColor = ['color1','color2','color3','color4'];

  constructor(private authService: FirebaseauthService, private database: FirestoreService, private menu: MenuController,
    public alertController: AlertController) {
    this.authService.stateAuth().subscribe(res => {
      if (res != null) {
        this.uid = res.uid;
        this.getUserInfo(this.uid);
      }
    });
  }

  async ngOnInit() {
    this.menu.enable(true);
    const uid = await this.authService.getUid();
    console.log('Hola' + uid);
    this.getGames();
    this.getDesafios();
  }

  getGames() {
    this.database.getCollection<Game>(this.gamePath).subscribe(res => {
      this.games = res;
    });
  }

  getDesafios() {
    this.database.getCollection<Desafio>(this.desafioPath).subscribe(res => {
      this.desafios = res;
    })
  }

  getUserInfo(uid: string) {
    let aux = 0;
    const starRating = 10;
    const path = 'users';
    let userStar;
    this.database.getDoc<User>(path, uid).subscribe(res => {
      if (aux == 0) {
        this.user = res;
        userStar = this.user.userLevel;
        console.log(userStar);
        const starPercentage = (userStar / starRating) * 100;
        console.log(starPercentage);
        const starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;
        (document.querySelector('.stars-inner') as HTMLElement).style.width = starPercentageRounded;
        aux++;
      }
    });
  }

  logout() {
    this.menu.enable(false);
    this.authService.logout();
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
