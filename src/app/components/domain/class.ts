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

  constructor(areaName: string, idArea?: number,creationUser?: number, creationDate?: Date, modificationUser?: number, modificationDate?: Date ) {
    this.areaName = areaName;
    if (idArea) this.idArea = idArea;
  }
}


