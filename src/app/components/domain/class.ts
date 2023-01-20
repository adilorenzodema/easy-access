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
  nomeArea: string;
  idArea?: number;
  creationUser?: number;
  creationDate?: Date;
  modificationUser?: number;
  modificationDate?: Date;

  constructor(nomeArea: string, idArea?: number, creationUser?: number, creationDate?: Date, modificationUser?: number, modificationDate?: Date) {
    this.nomeArea = nomeArea;
    if (idArea) this.idArea = idArea;
  }
}

export class Park {
  nomeParcheggio: string;
  paese: string;
  localita: string;
  cap: string;
  indirizzo: string;
  idParcheggio?: number;
  creationUser?: number;
  creationDate?: Date;
  modificationUser?: number;
  modificationDate?: Date;
  constructor(
    nomeParcheggio: string, paese: string, localita: string, cap: string, indirizzo: string,
    idParcheggio?: number, creationUser?: number, creationDate?: Date, modificationUser?: number, modificationDate?: Date) {
    this.nomeParcheggio = nomeParcheggio;
    this.paese = paese;
    this.localita = localita;
    this.cap = cap;
    this.indirizzo = indirizzo;
    if (idParcheggio) this.idParcheggio = idParcheggio;
  }
}


