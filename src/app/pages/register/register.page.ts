import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseauthService } from '../../services/firebaseauth.service';
import { User } from '../../models/user';
import { FirestoreService } from 'src/app/services/firestore.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  user : User = {
    userId: '',
    userName: '',
    userEmail: '',
    userPassword: '',
    userLevel: 1,
    userIns: '',
    userWins: 0,
    userTotalPoints: 0,
    userLogros: []
  }

  showPassword = false;
  passwordToggleIcon = 'eye';

  confirmPassword: any;

  constructor(private auth: FirebaseauthService, private firestoreService: FirestoreService , private router: Router) { }

  async ngOnInit() {
    const uid = await this.auth.getUid();
    console.log(uid);
  }

  async register() {
    const credentials = {
      email: this.user.userEmail,
      password: this.user.userPassword,
    };
    const res = await this.auth.register(credentials.email, credentials.password).catch(err => {
      console.log('ERROR: ', err);
    });
    const uid = await this.auth.getUid();
    this.user.userId = uid;
    this.registerUser();
    this.router.navigate(['/home']);
  }

  registerUser() {
    const path = 'users';
    const name = this.user.userName;
    this.firestoreService.createDoc(this.user, path, this.user.userId).then(res => {
      console.log('Guardado con éxito.')
    }).catch(err => {
      console.log('ERROR: ', err);
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
    if(this.passwordToggleIcon == 'eye') {
      this.passwordToggleIcon = 'eye-off';
    } else {
      this.passwordToggleIcon = 'eye';
    }
  }

  /* Mejoras futuras */

  loginFacebook() {

  }

  loginGoogle() {
    
  }

}
