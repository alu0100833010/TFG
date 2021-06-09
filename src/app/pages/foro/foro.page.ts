import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FirebaseauthService } from '../../services/firebaseauth.service';
import { MenuController, NavController } from '@ionic/angular';
import { Post } from '../../models/post';

@Component({
  selector: 'app-foro',
  templateUrl: './foro.page.html',
  styleUrls: ['./foro.page.scss'],
})
export class ForoPage implements OnInit{

  posts: Post[] = [];

  numLikes;

  constructor(private authService: FirebaseauthService, private database: FirestoreService, private menu: MenuController,
              public nav: NavController) { }

  async ngOnInit() {
    this.menu.enable(true);
    this.getPosts();
  }

  refresh() {
    window.location.reload();
  }

  getPosts() {
    const path = 'posts';
    this.database.sortDocByValue<Post>(path, "fecha").subscribe(res => {
      this.posts = res;
    });
  }

  likes(id) {
    let aux = 0;
    const path = 'posts';
    this.database.getDoc<Post>(path, id).subscribe(res => {
      if (aux == 0) {
        this.numLikes = res.likes;
        this.database.updateDoc({"likes": this.numLikes + 1}, path, id);
      }
      aux++;
    })
  }
  
  comment(id) {
    sessionStorage.setItem('postId', id);
    this.nav.navigateForward('/coments');
  }

  agrandar(event) {
    let imagen = event.srcElement;
    if (!imagen.classList.contains('imgScaled')) {
      imagen.classList.add('imgScaled');
    } else {
      this.resetAgradar(imagen);
    }
  }

  resetAgradar(imagen) {
    //document.getElementsByClassName('imgScaled')[0].classList.remove('imgScaled');
    //let auxImg = document.getElementsByClassName('imgScaled')[0];
    /*if (auxImg != undefined) {
      document.getElementsByClassName('imgScaled')[0].classList.remove('imgScaled');
    }*/
    imagen.classList.remove('imgScaled');
  }
}
