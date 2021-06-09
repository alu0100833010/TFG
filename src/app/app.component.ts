import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FirebaseauthService } from './services/firebaseauth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private firebaseauthService: FirebaseauthService, public alertController: AlertController) {}

  logout() {
    this.firebaseauthService.logout();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
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
