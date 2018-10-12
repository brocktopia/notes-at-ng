class Geocode {
  lat: number;
  lng: number;
}

class Place {
  _id: string;
  icon: string;
  url: string;
  name: string;
  lat?: number;
  lng?: number;
}

export class Note {

  name: string;
  note: string;
  Created_date: Date;
  notebook: string;
  _id?: string;
  geocode?: Geocode;
  place?: Place;

  constructor(
    notebook_id: string = '',
    date: Date = new Date(),
    geocode: Geocode = {lat: 0, lng: 0},
    name: string = '',
    note: string = ''
  ) {
    this.notebook = notebook_id;
    this.Created_date = date;
    this.geocode = geocode;
    this.name = name;
    this.note = note;
  }

}
