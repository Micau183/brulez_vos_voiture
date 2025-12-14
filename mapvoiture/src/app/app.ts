import { Component, signal, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common'; 
import { HttpClient } from '@angular/common/http';
import { MapComponent } from './map/map'; // <-- import du composant map
import {PhotoCardComponent} from './photo-card/photo-card';
import { PieChartComponent } from './pie-chart/pie-chart';
import { PhotoModel } from './photo-model/photo-model';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MapComponent, PhotoCardComponent, CommonModule, PieChartComponent], // <-- on ajoute MapComponent ici
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

  // Distribution simple par couleur pour la pie chart
  get colorDistribution() {
    const map = new Map<string, number>();
    for (const p of this.photos) {
      const c = (p && p.color) ? p.color : '#cccccc';
      map.set(c, (map.get(c) || 0) + 1);
    }

    // convert to array and sort by hue so similar colors are adjacent in the pie chart
    return Array.from(map.entries())
      .map(([color, value]) => ({ color, value, hue: this.colorStringToHue(color) }))
      .sort((a, b) => a.hue - b.hue)
      .map(({ color, value }) => ({ color, value }));
  }

  // extract hue (0-360) from hex color string like #RRGGBB or #RRGGBBAA or short #RGB
  private colorStringToHue(col?: string): number {
    if (!col) return 0;
    const s = col.trim();
    if (s[0] === '#') {
      let hex = s.slice(1);
      if (hex.length === 3 || hex.length === 4) {
        hex = hex.split('').map(c => c + c).join('');
      }
      if (hex.length === 6 || hex.length === 8) {
        const r = parseInt(hex.slice(0, 2), 16) / 255;
        const g = parseInt(hex.slice(2, 4), 16) / 255;
        const b = parseInt(hex.slice(4, 6), 16) / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        if (max === min) return 0;
        let h = 0;
        const d = max - min;
        if (max === r) {
          h = (g - b) / d + (g < b ? 6 : 0);
        } else if (max === g) {
          h = (b - r) / d + 2;
        } else {
          h = (r - g) / d + 4;
        }
        return Math.round((h / 6) * 360);
      }
    }
    // fallback for unsupported formats
    return 0;
  }

  // Distribution with percent (for legend display)
  get colorDistributionWithPercent() {
    const dist = this.colorDistribution;
    const total = dist.reduce((s, it) => s + it.value, 0) || 1;
    return dist.map(it => ({ color: it.color, value: it.value, percent: Math.round((it.value / total) * 100) }));
  }

  // Télécharge l'image (simple fallback)
  download(photo: PhotoModel | null) {
    if (!photo) return;
    try {
      const link = document.createElement('a');
      link.href = photo.image_location;
      link.download = photo.title || 'photo';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      console.warn('Download not available', e);
    }
  }

  // Partage via Web Share API si disponible, sinon copie le lien
  async share(photo: PhotoModel | null) {
    if (!photo) return;
    const url = location.origin + '/' + photo.image_location;
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({ title: photo.title, url });
      } catch (e) {
        console.warn('Share cancelled or failed', e);
      }
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url);
      alert('Lien copié dans le presse-papier');
    } else {
      prompt('Copiez ce lien', url);
    }
  }

  toggleFavorite(photo: PhotoModel | null) {
    if (!photo) return;
    // add property dynamically if absent
    (photo as any).favorite = !(photo as any).favorite;
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
              // select the first photo by default so the detail panel shows on init
              if (this.photos && this.photos.length > 0) {
                this.onPhotoCardClick(this.photos[0]);
              }
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
