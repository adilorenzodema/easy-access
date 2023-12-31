
export class Area {
  areaName: string;
  idArea: number;
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
  areaIdList?: number[];
  idPark?: number;
  creationUser?: number;
  creationDate?: Date;
  modificationUser?: number;
  modificationDate?: Date;
  constructor(
    namePark: string, country: string, location: string, cap: string, address: string, idPark?: number) {
    this.namePark = namePark;
    this.country = country;
    this.location = location;
    this.cap = cap;
    this.address = address;
    if (idPark) this.idPark = idPark;
  }
}

export class AddEditGate {
  idGate?: number;
  parkId: number;
  gateName: string;
  gateDirection: string;
  ipAntenna: string;
  portAntenna: number;
  codeAntenna: string;
  constructor(idPark: number, gateDescription: string, gateDirection: string, ipAntenna: string, portAntenna: number, codeAntenna: string) {
    this.parkId = idPark;
    this.gateName = gateDescription;
    this.gateDirection = gateDirection;
    this.ipAntenna = ipAntenna;
    this.portAntenna = portAntenna;
    this.codeAntenna = codeAntenna;
  }
}

export class AddPermission {
  obuCode: number;
  validationDateStart: Date;
  validationDateEnd: Date;
  parkIdList: Park[];
  constructor(
    obuCode: number, validationDateStart: Date, validationDateEnd: Date, parkIdList: Park[]) {
    this.obuCode = obuCode;
    this.validationDateStart = validationDateStart;
    this.validationDateEnd = validationDateEnd;
    this.parkIdList = parkIdList;
  }
}

export class AddTemporaryPermission extends AddPermission {
  permissionTypeId: number;
  constructor(obuCode: number, validationDateStart: Date, validationDateEnd: Date, parkIdList: Park[], permissionTypeId: number) {
    super(obuCode, validationDateStart, validationDateEnd, parkIdList);
    this.permissionTypeId = permissionTypeId;
  }
}

export class AddPermanentPermission extends AddPermission {
  constructor(obuCode: number, validationDateStart: Date, validationDateEnd: Date, parkIdList: Park[]) {
    super(obuCode, validationDateStart, validationDateEnd, parkIdList);
  }
}

export class AddDailyPermission extends AddPermission {
  startTime: string;
  endTime: string;
  constructor(obuCode: number, validationDateStart: Date, validationDateEnd: Date, parkIdList: Park[], startTime: string, endTime: string) {
    super(obuCode, validationDateStart, validationDateEnd, parkIdList);
    this.startTime = startTime;
    this.endTime = endTime;
  }
}

export class AddPermissionInterporto {
  obuCode?: number;
  license?: string;
  validationDateStart: Date;
  validationDateEnd: Date;
  parkIdList: Park[];
  companyId: number;
  constructor(validationDateStart: Date, validationDateEnd: Date, parkIdList: Park[], companyId: number,obuCode?: number, license?: string) {
    if (obuCode) this.obuCode = obuCode;
    if (license) this.license = license;
    this.validationDateStart = validationDateStart;
    this.validationDateEnd = validationDateEnd;
    this.parkIdList = parkIdList;
    this.companyId = companyId;
  }
}

export class AddTemporaryPermissionInterporto extends AddPermissionInterporto {
  permissionTypeId: number;
  constructor( validationDateStart: Date, validationDateEnd: Date, parkIdList: Park[], companyId: number,permissionTypeId: number,  obuCode?: number, license?: string) {
    super(validationDateStart, validationDateEnd, parkIdList, companyId,obuCode, license);
    this.permissionTypeId = permissionTypeId;
  }
}

 export class AddPermanentPermissionInterporto extends AddPermissionInterporto {
  constructor( validationDateStart: Date, validationDateEnd: Date, parkIdList: Park[], companyId: number,obuCode?: number, license?: string ) {
    super(validationDateStart, validationDateEnd, parkIdList, companyId, obuCode, license);
  }
}

export class AddDailyPermissionInterporto extends AddPermissionInterporto {
  startTime: string;
  endTime: string;
  constructor( validationDateStart: Date, validationDateEnd: Date, parkIdList: Park[], companyId: number, startTime: string, endTime: string,  obuCode?: number, license?: string) {
    super( validationDateStart, validationDateEnd, parkIdList, companyId, obuCode, license);
    this.startTime = startTime;
    this.endTime = endTime;
  }
} 



export class AddEditTypePermission {
  idPermissionType?: number;
  permissionTypeName: string;
  list: FasciaOraria[];
  constructor(permissionTypeName: string, list: FasciaOraria[], idPermissionType?: number) {
    this.permissionTypeName = permissionTypeName;
    this.list = list;
    if (idPermissionType) this.idPermissionType = idPermissionType;
  }
}

export class FasciaOraria {
  idTimeslot: number;
  startTime: string;
  endTime: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  holiday: boolean;
  constructor(startTime: string, endTime: string,
    monday: boolean, tuesday: boolean, wednesday: boolean, thursday: boolean, friday: boolean, saturday: boolean, holiday: boolean) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.monday = monday;
    this.tuesday = tuesday;
    this.wednesday = wednesday;
    this.thursday = thursday;
    this.friday = friday;
    this.saturday = saturday;
    this.holiday = holiday;
  }

}



