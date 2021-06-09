import { Component, OnInit } from '@angular/core';
import { H5P } from 'h5p-standalone';
import { FirestoreService } from '../../services/firestore.service';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { User } from '../../models/user';
import { ActivatedRoute, Params } from '@angular/router';
import { Game } from '../../models/game';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  user : User = {
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

  currentGame;

  currentGameScore;

  private gamePath = 'games/';
  private userPath = 'users/';

  uid = '';

  userPoints;
  gamePoints;

  totalPoints;
  gameMaxPoints;

  userWins;

  constructor(public database: FirestoreService, public firebaseauthService: FirebaseauthService, private rutaActiva: ActivatedRoute, public toastController: ToastController) {
    this.firebaseauthService.stateAuth().subscribe(res => {
      if (res != null) {
        this.uid = res.uid;
        this.getUserInfo(this.uid);
      }
    });

  }

  ngOnInit() {

    this.currentGame = this.rutaActiva.snapshot.paramMap.get("gameName");
    console.log(this.currentGame);
    const el = document.getElementById('h5p-container');
    //const h5pLocation = '../assets/h5p/workspace/prueba';

    const options = {
    id: 'lesson-one', // Optional unique ID, by default will be randomly generated
    h5pJsonPath: '../../assets/h5p/workspace/' + this.currentGame,
    frameJs: '../../assets/h5p/frame.bundle.js',
    frameCss: '../../assets/h5p/styles/h5p.css'
    };

    const displayOptions = { // Customise the look of the H5P
    frame: true,
    copyright: true,
    embed: false,
    download: false,
    icon: true,
    export: false
    };

    const h5p = new H5P(el, options, displayOptions);
  }

  setNewGamePoints(uid: string, aux: number) {
    /*let suma;
    this.database.getDoc<Game>(this.gamePath, this.gid).subscribe(res => {
      this.gamePoints = res.gameScore;
      console.log(this.gamePoints);
      console.log('Hola');
      this.database.getDoc<User>(this.userPath, uid).subscribe(res => {
        this.userPoints = res.userTotalPoints;
        console.log('adios');
        console.log(this.userPoints);
        suma = this.gamePoints + this.userPoints;
        console.log('Esta es la suma:' + suma);
        if (aux == 0) {
          this.database.updateDoc({"userTotalPoints": suma}, this.userPath, this.uid);
          aux++;
        }
        return;
      });
    });*/
    let suma;
    
      this.database.getDoc<User>(this.userPath, uid).subscribe(res => {
        if (aux == 0) {
        this.userPoints = res.userTotalPoints;
        console.log('adios');
        console.log(this.userPoints);
        suma = this.totalPoints + this.userPoints;
        console.log('Esta es la suma:' + suma);
        
          this.database.updateDoc({"userTotalPoints": suma}, this.userPath, this.uid);
          aux++;
        }
        return;
      });
  }

  endGame() {
    let aux = 0;
    this.setNewGamePoints(this.uid, aux);
    this.getPoints();
    console.log('Hola: ' + this.totalPoints);
    this.setUserVictories(this.uid, aux);
  }

  getPoints() {
    //var culo = document.getElementById("h5p-container");//.getElementsByClassName("bar")[0];
    //var culo = document.querySelector(".h5p-joubelui-score-number h5p-joubelui-score-number-counter");
    //var culo = document.body.querySelector(".div.h5p-joubelui-score-numeric > span.h5p-joubelui-score-number.h5p-joubelui-score-number-counter");
    var culo: any = document.querySelector('#h5p-iframe-lesson-one');
    var innerDoc = culo.contentDocument || culo.contentWindow.document;


    //var culote = innerDoc.querySelector("body > div > div > div.h5p-question-scorebar.h5p-question-visible > div > div > div.h5p-joubelui-score-numeric > span.h5p-joubelui-score-number.h5p-joubelui-score-number-counter");
    
    var culote = innerDoc.querySelector("body > div > div > div.questionset-results > div.feedback-section > div.feedback-scorebar > div > div.h5p-joubelui-score-numeric > span.h5p-joubelui-score-number.h5p-joubelui-score-number-counter");
    var culote2 = innerDoc.querySelector("body > div > div > div.h5p-programatically-focusable > div.h5p-feedback.h5p-show")
    var maxPoints = innerDoc.querySelector("body > div > div > div.questionset-results > div.feedback-section > div.feedback-scorebar > div > div.h5p-joubelui-score-numeric > span.h5p-joubelui-score-number.h5p-joubelui-score-max");
    //console.log(culote2);

    if ((culote == null) && (culote2 != null) && (maxPoints == null)) {
      //alert('¿Has completado el juego?')
      let inx = 0;
      this.database.getDoc<Game>(this.gamePath, this.currentGame).subscribe(res => {
        if (inx == 0) {
          this.currentGameScore = res.gameScore;
          console.log(this.currentGameScore);
          this.totalPoints = this.currentGameScore;
          inx++;
        }
        this.gameMaxPoints = 15;
      });
      var boton2 = document.getElementById('btn');
      boton2.style.display = 'none';
    } else if ((culote == null) && (culote2 == null) && (maxPoints == null)) {
      console.log('HOLA');
      this.presentToast();
    } else {
      this.totalPoints = parseInt(culote.innerHTML);
      this.gameMaxPoints = parseInt(maxPoints.innerHTML);
      var boton = document.getElementById('btn');
      boton.style.display = 'none';
    }
    console.log(this.totalPoints);   
    
    
  }

  setUserVictories(uid: string, aux: number) {

    // Poner un if para comprobar que el número de aciertos es igual al máximo y sumar la victoria.
    this.getPoints();

    if (this.totalPoints == this.gameMaxPoints) {
      let wins;
      this.database.getDoc<User>(this.userPath, uid).subscribe(res => {
        if (aux == 0) {
        this.userWins = res.userWins;
        console.log('adios');
        console.log(this.userWins);
        wins = this.userWins + 1;
        console.log('Número de victorias:' + wins);
        
          this.database.updateDoc({"userWins": wins}, this.userPath, this.uid);
          aux++;
        }
        return;
      });
      console.log('Suma victoria.');
    } else {
      console.log('No suma victorias.');
    } 
  }

  getUserInfo(uid: string) {
    const path = 'users';
    this.database.getDoc<User>(this.userPath, uid).subscribe(res => {
      this.user = res;
    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: '¿Aún no has completado el juego? <strong>Termina para continuar</strong>',
      position: 'middle',
      cssClass: 'toast-style',
      buttons: [
        {
          side: 'start',
          icon: 'alert-circle-outline'
        },
        {
          side: 'end',
          icon: 'close',
          text: 'Cerrar',
          role: 'cancel',
          handler: () => {
            console.log('cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }
}
