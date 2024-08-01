import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent {

  urlGraphic: string;

  constructor() {
    this.urlGraphic = environment.urlGraphic;
  }

  ngOnInit() {
    console.log(this.urlGraphic);
  }
}
