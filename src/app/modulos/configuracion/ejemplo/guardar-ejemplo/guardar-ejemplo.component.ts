import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-guardar-ejemplo',
  templateUrl: './guardar-ejemplo.component.html'
})
export class GuardarEjemploComponent implements OnInit {
  public model = {
    id: '' as any,
    estado: '' as any
  };

  public estados = [
    {
      id: 'basic1',
      text: 'Basic 1'
    },
    {
      id: 'basic2',
      text: 'Basic 2'
    },
    {
      id: 'basic3',
      text: 'Basic 3'
    },
    {
      id: 'basic4',
      text: 'Basic 4'
    }
  ];

  constructor(private route: ActivatedRoute) {
    // Esto es intencional
  }

  ngOnInit(): void {
    this.model.id = this.route.snapshot.paramMap.get('id');
    console.log('id: ', this.route.snapshot.paramMap.get('id'));
  }
}
