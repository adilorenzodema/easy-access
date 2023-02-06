
export class Area {
  areaName: string;
  idArea?: number;
  creationUser?: number;
  creationDate?: Date;
  modificationUser?: number;
  modificationDate?: Date;

  constructor(areaName: string, idArea?: number, creationUser?: number, creationDate?: Date, modificationUser?: number, modificationDate?: Date) {
    this.areaName = areaName;
    if (idArea) this.idArea = idArea;
  }
}

export class Park {
  namePark: string;
  country: string;
  location: string;
  cap: string;
  address: string;
  idPark?: number;
  creationUser?: number;
  creationDate?: Date;
  modificationUser?: number;
  modificationDate?: Date;
  constructor(
    namePark: string, country: string, locality: string, cap: string, address: string,
    idPark?: number) {
    this.namePark = namePark;
    this.country = country;
    this.location = locality;
    this.cap = cap;
    this.address = address;
    if (idPark) this.idPark = idPark;
  }
}

