import { Component, OnInit } from '@angular/core';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { User } from '../../models/user';
import { Comment } from '../../models/coment';
import { Subscription } from 'rxjs';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-coments',
  templateUrl: './coments.page.html',
  styleUrls: ['./coments.page.scss'],
})
export class ComentsPage implements OnInit {

  comment: string = '';
  subscriberInfo: Subscription;

  comments: Comment[] = [];

  constructor(public firestore: FirestoreService, public firebaseauth: FirebaseauthService, public nav: NavController) { }

  ngOnInit() {
    this.loadComments();
  }

  ngOnDestroy(): void {
    if (this.subscriberInfo) {
      this.subscriberInfo.unsubscribe();
    }
  }

  loadComments() {
    let postId = sessionStorage.getItem('postId');
    const path = 'posts/' + postId + '/comments';
    this.firestore.sortDocByValue<Comment>(path, "fecha").subscribe(res => {
      this.comments = res;
    });
  }

  async createComments() {
    const comment = this.comment;
    console.log(comment);
    let postId = sessionStorage.getItem('postId');
    const path = 'posts/' + postId + '/comments';
    console.log(path);
    const pathUser = 'users';
    const uid = await this.firebaseauth.getUid();
    this.subscriberInfo = this.firestore.getDoc<User>(pathUser, uid).subscribe(res => {
      if (res != undefined) {
        const data: Comment = {
          autor: res.userName,
          coment: comment,
          fecha: new Date(),
          id: this.firestore.getId(),
          img: '',
        }
        this.firestore.createDoc(data, path, data.id).then( () => {
          console.log('Comentario enviado');
          this.comment = '';
        });
      }
    });
  }


}
