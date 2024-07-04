import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { loadModules } from 'esri-loader';

import { MapStateService } from './mapa-state.service';
import { Subscription } from 'rxjs';

import { ICapaMapa, IInformacionCapa } from 'src/app/modelo/mapa/capa-mapa';

@Component({
  selector: 'app-esri-map',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
})
export class EsriMapComponent implements OnInit, OnChanges {
  @Input() capas?: Array<ICapaMapa>;
  @Input() center?: Array<any>;
  @Input() basemap?: String;
  @Input() zoom?: Number;

  @Output() clickMapa: EventEmitter<any> = new EventEmitter();
  @Output() seleccionMapa: EventEmitter<any> = new EventEmitter();

  public mapView: __esri.MapView;
  private sub: Subscription = new Subscription();

  private polygonGraphicsLayer: any;
  private sketch: any;
  private viewSketch: boolean = false;
  private featureLayerList: Array<any> = [];

  // this is needed to be able to create the MapView at the DOM element in this component
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  constructor(private msService: MapStateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // this.capas = changes.capas.currentValue;
  }
  
  public ngOnInit() {
    
    // use esri-loader to load JSAPI modules
    return loadModules([
      'esri/Map',
      'esri/views/MapView',
      'esri/layers/FeatureLayer',
      'esri/widgets/LayerList',
      'esri/Graphic',
      'esri/layers/GraphicsLayer',
      'esri/widgets/Sketch',
    ])
      .then(
        ([
          Map,
          MapView,
          FeatureLayer,
          LayerList,
          Graphic,
          GraphicsLayer,
          Sketch,
        ]) => {
          const map: __esri.Map = new Map({
            basemap: this.basemap ?? 'topo-vector',
          });

          this.mapView = new MapView({
            container: this.mapViewEl.nativeElement,
            center: this.center ?? [-73.994, 4.555],
            zoom: this.zoom ?? 8,
            map: map,
          });

          this.featureLayerList = this.capas?.map((capa) => {
            return new FeatureLayer({
              url: capa.url,
              id: capa.id,
              title: capa.titulo,
              visible: capa.visible,
              outFields: ['*'],
              opacity: 0.35
            });
          }) as Array<any>;

          this.featureLayerList?.forEach((fl: any) => {
            map.add(fl);
          });

          // Set up a click event handler and retrieve the screen x, y coordinates
          this.mapView.on('click', (event) => {
            if (!this.viewSketch) {
              console.log('click en el mapa -> evento');
              // the hitTest() checks to see if any graphics in the view
              // intersect the given screen x, y coordinates
              this.mapView.hitTest(event).then((response: any) => {
                let informacion = response.results.map((punto: any) => {
                  let puntoCapa: IInformacionCapa = {
                    idCapa: punto.graphic.layer.id,
                    atributos: punto.graphic.attributes,
                  };
                  return puntoCapa;
                });

                this.onClick(informacion);
              });
            }
          });

          const layerList = new LayerList({
            view: this.mapView,
            container: "layerListPanel",
            listItemCreatedFunction: function (event: any) {
              const item = event.item;
              item.panel = {
                content: "legend"
              };
              item.title =  item.layer.title;
            },
          });

          
          this.mapView.ui.add('selectByRectangle', 'top-left');

          this.polygonGraphicsLayer = new GraphicsLayer();
          this.polygonGraphicsLayer.id = 'seleccion';
          this.polygonGraphicsLayer.title = 'Selección';
          map.add(this.polygonGraphicsLayer);

          this.sketch = new Sketch({
            layer: this.polygonGraphicsLayer,
            view: this.mapView,
            creationMode: 'update', // Auto-select
          });

          this.sketch.on('update', (event: any) => {
            if (event.state === 'start') {
              console.log('start');

              let promesas = this.featureLayerList.map((fl: any) =>
                this.queryFeaturelayer(event.graphics[0].geometry, fl)
              );

              Promise.all(promesas)
                .then((respuestas) => {
                  console.log('respuestas', respuestas);
                  this.seleccionMapa.emit({ seleccion: respuestas, ubicacion: event.graphics[0].geometry });
                })
                .catch(console.log);
            }
            if (event.state === 'complete') {
              this.polygonGraphicsLayer.remove(event.graphics[0]);
            }
            if (
              event.toolEventInfo &&
              (event.toolEventInfo.type === 'scale-stop' ||
                event.toolEventInfo.type === 'reshape-stop' ||
                event.toolEventInfo.type === 'move-stop')
            ) {
              console.log('change sketch');
              
              let promesas = this.featureLayerList.map((fl: any) =>
                this.queryFeaturelayer(event.graphics[0].geometry, fl)
              );

              Promise.all(promesas)
                .then((respuestas) => {
                  console.log('respuestas', respuestas);
                  this.seleccionMapa.emit({ seleccion: respuestas, ubbicacion: event.graphics[0].geometry });
                })
                .catch(console.log);
            }
          });
        }
      )
      .catch((err) => {
        console.error(err);
      });
  }

  onClick(data: any) {
    this.clickMapa.emit({ data: data });
  }

  seleccionar() {
    console.log('view map ui', this.mapView.ui);
    this.viewSketch
      ? this.mapView.ui.remove(this.sketch)
      : this.mapView.ui.add(this.sketch, 'top-right');

    this.viewSketch = !this.viewSketch;
  }

  queryFeaturelayer(geometry: any, layer: any) {
    const parcelQuery = {
      spatialRelationship: 'intersects', // Relationship operation to apply
      geometry: geometry, // The sketch feature geometry
      outFields: ['*'], // Attributes to return
      returnGeometry: true,
    };

    return layer
      .queryFeatures(parcelQuery)
      .then((results: any) => {
        console.log(
          'Feature count: ' + results.features.length,
          results.features.map((f: any) => f.attributes)
        );
        if (results.features) {
          return results.features.map((f: any) => {
            return { idCapa: layer.id, atributos: f.attributes };
          });
        } else {
          return null;
        }
      })
      .catch((error: any) => {
        console.log(error);
        return null;
      });
  }

}
