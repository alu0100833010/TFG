import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseauthService {

  datosUser: User;

  constructor(public auth: AngularFireAuth, private router: Router, private db: FirestoreService) { 
    this.getUid();
    this.stateUser();
  }

  stateUser() {
    this.stateAuth().subscribe(res => {
      if (res != null) {
        this.getInfoUser();
      }
    });
  }

  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    this.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

  register(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  resetPassword(email:string) {
    return this.auth.sendPasswordResetEmail(email);
  }

  async getUid() {
    const user = await this.auth.currentUser;
    if (user === null) {
      return null;
    } else {
      return user.uid;
    }
  }

  stateAuth() {
    return this.auth.authState;
  }

  async getInfoUser() {
    const path = 'users'
    const uid = await this.getUid();
    this.db.getDoc<User>(path, uid).subscribe(res => {
      if (res != undefined) {
        this.datosUser = res;
      }
    });
  }
}
