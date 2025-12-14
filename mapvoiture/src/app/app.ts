import { Component, signal, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common'; 
import { HttpClient } from '@angular/common/http';
import { MapComponent } from './map/map'; // <-- import du composant map
import {PhotoCardComponent} from './photo-card/photo-card';
import { PhotoModel } from './photo-model/photo-model';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MapComponent, PhotoCardComponent, CommonModule], // <-- on ajoute MapComponent ici
  templateUrl: './app.html',
  styleUrls: ['./app.css'] // <-- petit fix : c'était styleUrl au singulier
})

export class App implements OnInit {

  protected readonly title = signal('mapvoiture');

  photos: PhotoModel[] = [];
  selectedPhoto: PhotoModel | null = null; // ← photo sélectionnée pour le panneau droit
  @ViewChild('mapComponent') mapComponent!: MapComponent;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCSV();
  }

  loadCSV() {
    this.http.get('data.csv', { responseType: 'text' })
      .subscribe(csv => {
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            this.photos = result.data.map((row: any) => ({
              image_location: `photos/${row.image_name}`,
              title: row.image_name,
              location: row.location,
              color: row.color,
              date: row.date_taken,
              description: row.description
            }));
          }
        });
      });
  }

  // Méthode appelée depuis le composant map lorsqu'un marker est cliqué
  onMarkerClick(photo: PhotoModel) {
    this.selectedPhoto = photo;
  }

  // Méthode appelée depuis la liste de photo (PhotoCard) lorsqu'une carte est cliquée
  onPhotoCardClick(photo: PhotoModel) {
    this.selectedPhoto = photo;
    if (this.mapComponent && typeof this.mapComponent.focusOn === 'function') {
      this.mapComponent.focusOn(photo, 16);
    }
  }
}


// export class App {
//   protected readonly title = signal('mapvoiture');

//   photo1: PhotoModel = {
//   image_location: 'photos/photo1.jpg',
//   title: 'Photo 1',
//   location: 'Paris',
//   color: '#ff0000'
// };
//   photo2!: PhotoModel;

//   constructor() {
//     this.photo2 = new PhotoModel();
//     this.photo2.image_location = 'photos/photo2.jpg';
//     this.photo2.title = 'Photo 2';
//     this.photo2.location = 'Lyon';
//     this.photo2.color = '#00ff00';
//   }
// }
