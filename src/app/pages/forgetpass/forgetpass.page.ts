import { Component, OnInit } from '@angular/core';
import { FirebaseauthService } from '../../services/firebaseauth.service';

@Component({
  selector: 'app-forgetpass',
  templateUrl: './forgetpass.page.html',
  styleUrls: ['./forgetpass.page.scss'],
})
export class ForgetpassPage implements OnInit {

  email: string = "";

  constructor(private auth: FirebaseauthService) { }

  ngOnInit() {
  }

  sendLinkReset() {

    if (this.email) {
      this.auth.resetPassword(this.email).then(() => {
        console.log('enviado');
      }).catch(() => {
        console.log('error');
      });
    } else {
      alert("Algo ha salido mal. Inténtalo de nuevo.")
    }
  }

}
