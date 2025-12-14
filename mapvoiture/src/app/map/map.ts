import { Component, AfterViewInit, Inject, PLATFORM_ID, Input, Output, EventEmitter } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { PhotoModel } from '../photo-model/photo-model';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.html',
  styleUrls: ['./map.css']
})
export class MapComponent implements AfterViewInit {

  private map!: L.Map;

    
  @Input() photomodels: PhotoModel[] = [];

  // ⚡ Output pour envoyer la photo sélectionnée au parent
  @Output() photoSelected = new EventEmitter<PhotoModel>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    import('leaflet').then(L => {
      this.map = L.map('map').setView([45.1885, 5.7245], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map);

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

        console.log('Création du marker pour :', photo.title, 'Coords :', coords);

        const marker = L.marker(coords as L.LatLngExpression, {
          icon: photoIcon(photo.image_location),
        })
        .addTo(this.map);

        // 🔹 Détecte le clic sur le marker
        marker.on('click', () => {
          this.photoSelected.emit(photo);

          this.map.setView(coords as L.LatLngExpression, 16, { animate: true });
        });
      });
    });
  }



  // Public method to center & zoom the map on a photo
  focusOn(photo: PhotoModel, zoom: number = 16) {
    if (!this.map || !photo || !photo.location) return;
    const coords = photo.location.split(',').map(c => parseFloat(c.trim()));
    this.map.setView(coords as L.LatLngExpression, zoom, { animate: true });
  }
}
