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

  @Input() photomodel: PhotoModel = new PhotoModel();

}
