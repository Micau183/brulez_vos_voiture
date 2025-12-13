import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';
import { PhotoModel } from '../photo-model/photo-model';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.html',
  styleUrls: ['./map.css']
})
export class MapComponent implements AfterViewInit {
    
  @Input() photomodels: PhotoModel[] = [];



  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    import('leaflet').then(L => {
      const map = L.map('map').setView([45.1885, 5.7245], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const photoIcon = (url: string) =>
  L.icon({
    iconUrl: url,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
  });

 // Parcours le tableau de photos
  console.log('Photomodels reçus dans MapComponent :', this.photomodels);
    this.photomodels.forEach(photo => {
      const coords = photo.location.split(',').map(c => parseFloat(c.trim()));

      // 🔹 debug : afficher dans la console
      console.log('Création du marker pour :', photo.title, 'Coords :', coords, 'Image :', photo.image_location);

      L.marker(coords as L.LatLngExpression, {
        icon: photoIcon(photo.image_location),
      })
      .addTo(map)
      .bindPopup(`${photo.title} : ${photo.location}`);
    });


  
// const photos = [
//   {
//     coords: [45.18968, 5.71313],
//     icon: 'photos/photo1.jpg',
//     popup: 'Photo 1 : Paris',
//   },
//   {
//     coords: [45.1850, 5.7300],
//     icon: 'photos/photo2.jpg',
//     popup: 'Photo 2 : Lyon',
//   },
//   {
//     coords: [45.1885, 5.7200],
//     icon: 'photos/photo3.jpg',
//     popup: 'Photo 3 : Marseille',
//   },
// ];
// photos.forEach(photo => {
//   L.marker(photo.coords as L.LatLngExpression, {
//     icon: photoIcon(photo.icon),
//   })
//     .addTo(map)
//     .bindPopup(photo.popup);
// });
      
      });
    };
  }

