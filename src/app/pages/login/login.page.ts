import { Component, OnInit } from '@angular/core';
import { FirebaseauthService } from '../../services/firebaseauth.service';
import { Router } from "@angular/router";
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  password: string;

  showPassword = false;
  passwordToggleIcon = 'eye';

  constructor(private authService: FirebaseauthService, public router: Router, public toastController: ToastController) { }

  ngOnInit() {
  }

  onSubmitLogin() {
    //console.log("funciona");
    this.authService.login(this.email, this.password).then(res => {
      this.router.navigate(['/home']);
    }).catch(err => this.presentToast());
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
    if(this.passwordToggleIcon == 'eye') {
      this.passwordToggleIcon = 'eye-off';
    } else {
      this.passwordToggleIcon = 'eye';
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'El <strong>usuario</strong> o la <strong>contraseña</strong> son incorrectas o no existen.',
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

  /* Mejoras futuras */

  loginFacebook() {

  }

  loginGoogle() {
    
  }


  

}
