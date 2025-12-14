import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { PhotoModel } from '../photo-model/photo-model';

@Component({
  selector: 'app-photo-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-card.html',
  styleUrls: ['./photo-card.css']
})



export class PhotoCardComponent {

  // Convertit un #hex en rgba avec alpha
hexToRgba(hex: string, alpha: number = 0.5): string {
  if (!hex) return `rgba(0,0,0,${alpha})`; // fallback
  hex = hex.replace('#','');
  const r = parseInt(hex.substring(0,2),16);
  const g = parseInt(hex.substring(2,4),16);
  const b = parseInt(hex.substring(4,6),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

  @Input() photomodel: PhotoModel = new PhotoModel();

}
