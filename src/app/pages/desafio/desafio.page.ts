import { Component, OnInit } from '@angular/core';
import { H5P } from 'h5p-standalone';
import { ActivatedRoute, Params } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-desafio',
  templateUrl: './desafio.page.html',
  styleUrls: ['./desafio.page.scss'],
})
export class DesafioPage implements OnInit {

  user: User;
  userPath = 'users';
  uid;

  userPoints;
  desafioPoints;

  totalPoints;
  desafioMaxPoints;

  userWins;

  private desafioPath = 'desafios/';
  currentDesafio;

  constructor(private rutaActiva: ActivatedRoute, 
              public database: FirestoreService, 
              public firebaseauthService: FirebaseauthService,
              public toastController: ToastController) {
                this.firebaseauthService.stateAuth().subscribe(res => {
                  if (res != null) {
                    this.uid = res.uid;
                    this.getUserInfo(this.uid);
                  }
                });
  }

  ngOnInit() {
    this.currentDesafio = this.rutaActiva.snapshot.paramMap.get("desafioName");
    console.log(this.currentDesafio);
    const el = document.getElementById('h5p-container');
    //const h5pLocation = '../assets/h5p/workspace/prueba';

    const options = {
    id: 'lesson-one', // Optional unique ID, by default will be randomly generated
    h5pJsonPath: '../../assets/h5p/workspace/' + this.currentDesafio,
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

  getUserInfo(uid: string) {
    const path = 'users';
    this.database.getDoc<User>(this.userPath, uid).subscribe(res => {
      this.user = res;
    });
  }

  getPoints() {
    
    var elemento: any = document.querySelector('#h5p-iframe-lesson-one');
    var innerDoc = elemento.contentDocument || elemento.contentWindow.document;
 
    var points = innerDoc.querySelector("body > div > div > div > div > div.h5p-text-overlay > div.h5p-text-dialog.h5p-summary > div > div > div.h5p-question-scorebar.h5p-question-visible > div > div > div.h5p-joubelui-score-numeric > span.h5p-joubelui-score-number.h5p-joubelui-score-number-counter");
    var maxPoints = innerDoc.querySelector("body > div > div > div > div > div.h5p-text-overlay > div.h5p-text-dialog.h5p-summary > div > div > div.h5p-question-scorebar.h5p-question-visible > div > div > div.h5p-joubelui-score-numeric > span.h5p-joubelui-score-number.h5p-joubelui-score-max");

    if ((points == null) && (maxPoints == null)) {
      this.presentToast();
    } else {
      this.totalPoints = parseInt(points.innerHTML);
      this.desafioMaxPoints = parseInt(maxPoints.innerHTML);
      var boton = document.getElementById('btn');
      boton.style.display = 'none';
    }

    
  }

  setUserVictories(uid: string, aux: number) {

    this.getPoints();

    if (this.totalPoints == this.desafioMaxPoints) {
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

  setNewGamePoints(uid: string, aux: number) {

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
