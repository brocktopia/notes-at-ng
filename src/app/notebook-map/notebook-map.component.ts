import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Note} from '../models/notes.model';
import {Store, Select} from '@ngxs/store';
import {SetActiveNotebookMapState} from '../store/notebooks.state';
import {Observable} from 'rxjs';
import {MapsAPILoader} from '@agm/core';

@Component({
  selector: 'app-notebook-map',
  templateUrl: './notebook-map.component.html',
  styleUrls: ['./notebook-map.component.scss']
})
export class NotebookMapComponent implements OnInit {

  @Input() notes: Note[];

  @Output() showNote: EventEmitter<any> = new EventEmitter();

  // mapState$ is used to remember the state of notebook map when returning from note views
  @Select(state => state.notebooks.mapState) mapState$: Observable<any>;

  notebookMapBounds: any;
  mapCenter: any;
  map: any;
  mapAPI: any;
  noteMarkers: any[] = [];
  placeMarkers: any[] = [];

  constructor(
    private store: Store,
    private apiLoader: MapsAPILoader
  ) { }

  ngOnInit() {
    // console.log(`notebook-map.ngOnInit()`);
    this.apiLoader.load()
      .then((api) => {
        this.mapAPI = window['google'].maps;
    });
  }

  onMapReady(gmap): void {
    // console.log(`notebook-map.onMapReady() map`);
    this.map = gmap;
    this.initMap();
  }

  initMap() {
    // console.log(`notebook-map.initMap()`);
    // create markers and get bounding data
    this.placeMarkers = [];
    this.noteMarkers = [];
    let minLat = 360, maxLat = -360, minLon = 360, maxLon = -360;
    this.notes.forEach(note => {
      // Create markers
      const marker = {
        note: note,
        title: note.name,
        date: note.Created_date,
        snippit: (note.note.length > 200) ? note.note.substr(0, 200) + '...' : note.note,
        latitude: note.geocode.lat,
        longitude: note.geocode.lng,
        hasPlace: false,
        place: {}
      };
      if (note.place && note.place.name) {
        marker.hasPlace = true;
        marker.place = {
          placeId: note.place._id
        };
        this.placeMarkers.push(marker);
      } else {
        this.noteMarkers.push(marker);
      }
      // Calculate Bounds mins & maxes
      if (note.geocode.lat > maxLat) { maxLat = note.geocode.lat; }
      if (note.geocode.lat < minLat) { minLat = note.geocode.lat; }
      if (note.geocode.lng > maxLon) { maxLon = note.geocode.lng; }
      if (note.geocode.lng < minLon) { minLon = note.geocode.lng; }
    });
    // listen for changes in mapState$
    this.mapState$.subscribe((state) => {
      if (state) {
        // set map using state data
        this.map.setCenter(state.center);
        this.map.setZoom(state.zoom);
      } else {
        // Create map bounds
        const sw = new this.mapAPI.LatLng(minLat, minLon);
        const ne = new this.mapAPI.LatLng(maxLat, maxLon);
        this.notebookMapBounds = new this.mapAPI.LatLngBounds(sw, ne);
        // Get Map Center
        this.mapCenter = this.notebookMapBounds.getCenter().toJSON(); //
        // update map
        this.map.fitBounds(this.notebookMapBounds);
        this.map.setCenter(this.mapCenter);
      }
    });
  }

  setMapState(): Observable<any> {
    // console.log(`notebook-map.setMapState()`);
    const mapState: any = {};
    mapState.center = this.map.getCenter().toJSON();
    mapState.zoom = this.map.getZoom();
    return this.store.dispatch(new SetActiveNotebookMapState(mapState));
  }

  onShowNote(marker): void {
    // console.log(`notebook-map.showNote()`);
    this.setMapState()
      .subscribe(() => {
        this.showNote.emit(marker.note);
      });
  }

}
