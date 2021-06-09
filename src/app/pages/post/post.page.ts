import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Post } from '../../models/post';
import { User } from '../../models/user';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {

  postBtn: boolean = true;
  post: string = '';
  subscriberInfo: Subscription;

  newImg = '';
  newFile = '';

  loading: any;

  constructor(public firestore: FirestoreService, 
              public firebaseauth: FirebaseauthService, 
              public nav: NavController,
              public firestorage: FirestorageService,
              public loadingController: LoadingController) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.subscriberInfo) {
      this.subscriberInfo.unsubscribe();
    }
  }

  async createPost() {
    const post = this.post;
    console.log(post);
    const path = '/posts';
    const pathUser = 'users';
    const uid = await this.firebaseauth.getUid();
    const imgPath = '/forum';
    const name = this.firestore.getId();
    console.log(this.newFile);
    let resImg;
    if (this.newFile == '') {
      resImg = '';
    } else {
      resImg = await this.firestorage.uploadImage(this.newFile, imgPath, name);
    }
    
   
    this.presentLoading();
    this.subscriberInfo = this.firestore.getDoc<User>(pathUser, uid).subscribe(res => {
      if (res != undefined) {
        const data: Post = {
          autor: res.userName,
          post: post,
          fecha: new Date(),
          likes: 0,
          id: this.firestore.getId(),
          img: resImg
        }
        //this.presentLoading();
        this.firestore.createDoc(data, path, data.id).then( () => {
          this.loading.dismiss();
          console.log('Comentario enviado');
          this.nav.navigateRoot('/foro');
          this.post = '';
        });
      }
    });
  }

  check() {
    if (this.post == '')
      this.postBtn = true;
    else
      this.postBtn = false;
  }

  newImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = ((image) => {
        this.newImg = image.target.result as string;

      });
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: '',
      message: 'Publicando post...',
      duration: 2000
    });
    await this.loading.present();

    //await loading.onDidDismiss();
    //console.log('Loading dismissed');
  }

}
