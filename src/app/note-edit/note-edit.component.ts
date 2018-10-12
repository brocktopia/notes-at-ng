import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Select, Store } from '@ngxs/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Note } from '../models/notes.model';
import {CreateNote, GetNote, UpdateNote} from '../store/notes.state';
import {AgmMarker, MapsAPILoader} from '@agm/core';

@Component({
  selector: 'app-note-edit',
  templateUrl: './note-edit.component.html',
  styleUrls: ['./note-edit.component.scss']
})
export class NoteEditComponent implements OnInit {

  @Select(state => state.notes.active) note$: Observable<any>;

  @ViewChild(AgmMarker) noteMarker: AgmMarker;

  device: string;
  note: any;
  map: any;
  isLoading = true;
  loadingMessage = 'Loading...';
  showMessage = false;
  markerDraggable = true;
  messageTitle: string;
  messageBody: string;
  mode: string;
  activeView = 'edit-name';
  placeName: string;
  placesService: any;
  places: any[];
  placesResults: any[];
  pagination: any;
  showMoreButton = false;
  showPlacesDialog = false;

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private apiLoader: MapsAPILoader
  ) { }

  ngOnInit() {
    // console.log('NoteEditComponent.ngOnInit()');
    // determine if device is mobile or desktop
    this.route.queryParamMap.subscribe(params => {
      this.device = params.get('device');
    });
    // determine if mode is new or edit
    this.route.url.subscribe(urlSegment => {
      if (urlSegment[0].path === 'note-new') {
        this.mode = 'new';
        this.note = new Note(urlSegment[1].path);
        // set initial coordinates
        this.getCurrentPosition()
          .then(position => {
            this.note.geocode = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            this.isLoading = false;
          });
      } else {
        this.mode = 'edit';
        // get reference to active note
        this.note$.subscribe(note => {
          if (!note) {
            // deep-linked first load of note-edit
            this.store.dispatch(new GetNote(urlSegment[1].path));
            // dispatch will trigger subscription above
          } else {
            // create a copy to edit
            this.note = Object.assign({}, note);
            this.isLoading = false;
          }
        });
      }
    });
  }

  onMapReady(map): void {
    // console.log(`NoteEditComponent.onMapReady() markerDraggable ${this.markerDraggable}`);
    this.map = map;
    // draggable isn't taking in the template for some reason (bug in map component?).
    this.noteMarker.draggable = true;
    this.noteMarker['_markerManager'].updateDraggable(this.noteMarker);
    this.noteMarker.dragEnd.subscribe((dropEvent) => {
      // dropEvent coords object matches note.geocode object
      this.note.geocode = dropEvent.coords;
      // clear places
      if (this.places) {
        this.clearPlaces();
      }
    });
    // get a reference to Google Places Service
    this.placesService = new window['google'].maps.places.PlacesService(map);
  }

  hasPlace(note): boolean {
    return !!(note.place && note.place._id);
  }

  closeNote() {
    // console.log('NoteEditComponent.closeNote()');
    this.location.back();
  }

  savePlace(place) {
    // console.log('NoteEditComponent.savePlace()');
    this.note.place = place;
    this.note.geocode = {
      latitude: place.lat,
      longitude: place.lng
    };
    this.showPlacesDialog = false;
  }

  saveNote() {
    // console.log('NoteEditComponent.saveNote()');
    this.loadingMessage = 'Saving Note...';
    this.isLoading = true;
    if (this.mode === 'new') {
      this.store.dispatch(new CreateNote(this.note))
        .subscribe(state => {
          this.isLoading = false;
          this.closeNote();
        });
    } else if (this.mode === 'edit') {
      this.store.dispatch(new UpdateNote(this.note))
        .subscribe(state => {
          this.isLoading = false;
          this.closeNote();
        });
    }
  }

  getCurrentPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject,
        {
          enableHighAccuracy: true
        });
    });
  }

  updateCoordinates() {
    // console.log('NoteEditComponent.updateCoordinates()');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latlonObj = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.note.geocode = latlonObj;
        // clear places
        if (this.places) {
          this.clearPlaces();
        }
      },
      (err) => {
        console.warn(`EditNoteImpl.updateCoordinates() ERROR(${err.code}): ${err.message}`);
      },
      {
        enableHighAccuracy: true
      }
    );
  }

  findPlace(): void {
    // console.log('NoteEditComponent.findPlace()');
    if (this.places && this.places.length > 0) {
      this.showPlacesDialog = true;
    } else {
      // load places
      const options: any = {
        location: {
          lat: this.note.geocode.lat,
          lng: this.note.geocode.lng
        },
        radius: 1000
      };
      if (this.placeName) {
        options.keyword = this.placeName;
      }
      this.showPlacesDialog = true;
      this.placesService.nearbySearch(options, (...results) => this.handlePlaceResults.apply(this, results));
    }
  }

/**
 Was having a lot of trouble with the nearbySearch() service call. It seemed to be blocking reactive UI updates.
 I simplified the collection used to build the UI thinking maybe it was a large object reference in the results data.
 That didn't help and complicated the application logic but I think it makes enough sense that I'd like to just put
 all of the data I need into the constructed places collection to not need to maintain a reference to the results data.

 Never did figure out the root cause of the issue I was having. It seems to be functioning more normally now though. I
 was getting about a 20-30 second delay in rendering update after this process completed.
*/
  handlePlaceResults(res: any[], status: string, pagination: any): void {
    // console.log(`NoteEditComponent.handlePlaceResults()`);
    if (status !== 'OK') {
      return;
    }
    if (!!this.placesResults) {
      this.placesResults.concat(res);
    } else {
      this.placesResults = res;
    }
    const places = this.places ? this.places : [];
    let index = places.length;
    res.forEach((place) => {
      places.push({
        name: place.name,
        icon: place.icon,
        index: index++
      });
    });
    if (pagination.hasNextPage) {
      this.pagination = pagination;
    } else {
      this.pagination = null;
    }
    this.showPlaces(places, !!this.pagination);
  }

  showPlaces(places: any, pagination: boolean): void {
    // console.log(`NoteEditComponent.showPlaces() pagination: ${pagination} places [${places.length}]`);
    this.places = places;
    this.showMoreButton = pagination;
    this.showPlacesDialog = true;
  }

  clearPlaces(): void {
    // console.log(`NoteEditComponent.clearPlaces()`);
    this.places = null;
    this.placesResults = null;
  }

  onShowMorePlaces(): void {
    // console.log(`NoteEditComponent.onShowMorePlaces()`);
    if (this.pagination) {
      this.pagination.nextPage();
    }
  }

  onPlacesFilter(name): void {
    // console.log(`NoteEditComponent.onPlacesFilter() ${name}`);
    this.clearPlaces();
    this.placeName = name;
    this.findPlace();
  }

  onPlaceSelect(p: any) {
    // console.log(`NoteEditComponent.onPlaceSelect()`);
    const place = this.placesResults[p.index];
    const options = {
      placeId: place.place_id,
      fields: ['name', 'url']
    };
    const placeData: any = {
      name: place.name,
      icon: place.icon,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      _id: place.place_id
    };
    this.note.geocode.lat = place.geometry.location.lat();
    this.note.geocode.lng = place.geometry.location.lng();
    this.placesService.getDetails(options, (placeDetail, status) => {
      console.log(`NoteEditComponent.onPlaceSelect() place details [${status}]`);
      if (status === 'OK') {
        placeData.url = placeDetail.url;
        this.note.place = placeData;
      } else {
        console.warn(`EditNoteImpl.placeSelected() Error [${status}] getting Place details`);
      }
    });
  }

  removePlace(): void {
    // console.log('NoteEditComponent.removePlace()');
    this.note.place = null;
  }

}
