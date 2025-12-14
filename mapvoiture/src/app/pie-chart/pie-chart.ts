import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pie-chart.html',
  styleUrls: ['./pie-chart.css'],
})
export class PieChartComponent {
  @Input() items: Array<{ color: string; value: number }> = [];

  // returns an SVG path for the slice at index i
  arcPath(i: number) {
    const items = this.items || [];
    const total = items.reduce((s, it) => s + (it.value || 0), 0);
    if (!total || items[i].value <= 0) return '';

    let start = 0;
    for (let j = 0; j < i; j++) start += items[j].value;
    const a0 = (start / total) * Math.PI * 2 - Math.PI / 2; // start angle (shift so top is 12 o'clock)
    const a1 = ((start + items[i].value) / total) * Math.PI * 2 - Math.PI / 2; // end angle

    const r = 24; // radius inside 50x50 viewBox
    const cx = 25;
    const cy = 25;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);

    const largeArc = a1 - a0 <= Math.PI ? 0 : 1;

    return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${largeArc} 1 ${x1} ${y1} Z`;
  }
}
