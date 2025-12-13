import { Component, signal, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common'; 
import { HttpClient } from '@angular/common/http';
import { MapComponent } from './map/map'; // <-- import du composant map
import {PhotoCardComponent} from './photo-card/photo-card';
import { PhotoModel } from './photo-model/photo-model';
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
              color: '#0000ff', // couleur par défaut
              date: row.date_taken
            }));
            //console.log('Photos chargées :', this.photos);
          }
        });
      });
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
