import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public database: AngularFirestore) { }

  createDoc(data: any, path: string, id: string) {      // Función para mandar datos a la base de datos.
    const collection = this.database.collection(path);  // Apuntamos a la colección que queremos
    return collection.doc(id).set(data)
  }

  getDoc<tipo>(path: string, id: string) {
    const collection = this.database.collection<tipo>(path);
    return collection.doc(id).valueChanges();           // Nos permite estar atentos a todos los cambios de la base de datos.
  }

  deleteDoc(path: string, id:string) {
    const collection = this.database.collection(path);
    return collection.doc(id).delete();
  }

  updateDoc(data: any, path: string, id:string) {
    const collection = this.database.collection(path);
    return collection.doc(id).update(data);
  }

  getCollection<tipo>(path: string) {
    const collection = this.database.collection<tipo>(path);
    return collection.valueChanges();

  }

  getId() {
    return this.database.createId();
  }

  sortDocByValue<tipo>(path: string, value: string) {
    const collection = this.database.collection<tipo>(path, ref => 
      ref.orderBy(value, "desc"));
    return collection.valueChanges();
  }

  getCollectionPage<tipo>(path: string, limit: number, startAt: any) {
    if (startAt == null)
      startAt = new Date();
    const collection = this.database.collection<tipo>(path, 
      ref => ref.orderBy('fecha', 'desc')
                .limit(limit)
                .startAfter(startAt) 
    );
    return collection.valueChanges();
  }
}
