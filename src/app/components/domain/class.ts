export class LoginUser {
  email: string;
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

export class User {
  userId?: number;
  firstName: string;
  lastName: string;
  email: string;
  profileCode: string;

  constructor(firstName: string, lastName: string, email: string, profileCode: string, userId?: number) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.profileCode = profileCode;
    if (userId) this.userId = userId;
  }
}

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
  locality: string;
  cap: string;
  address: string;
  idPark?: number;
  creationUser?: number;
  creationDate?: Date;
  modificationUser?: number;
  modificationDate?: Date;
  constructor(
    namePark: string, country: string, locality: string, cap: string, address: string,
    idPark?: number, creationUser?: number, creationDate?: Date, modificationUser?: number, modificationDate?: Date) {
    this.namePark = namePark;
    this.country = country;
    this.locality = locality;
    this.cap = cap;
    this.address = address;
    if (idPark) this.idPark = idPark;
  }
}

export class Gate {
  idGate?: number;
  gateName: string;
  idPark: number;
  constructor(gateName: string, idPark: number, idGate?: number) {
    if (idGate) this.idGate = idGate;
    this.gateName = gateName;
    this.idPark = idPark;
  }
}

