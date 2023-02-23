import { Area, Park, FasciaOraria } from "./class";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profileCode: string;
  profileName: string;
}

export interface UserAssociated extends User {
  granted: boolean;
}

export interface ParkAssociated {
  idPark: number;
  namePark: string;
  associated: boolean;
}

export interface AreaAssociated {
  idArea: number;
  areaName: string;
  associated: boolean;
}


export interface Menu {
  id: number;
  code: string;
  name: string;
  route: string;
  icon: string;
}

export interface UserPermission {
  user: User;
  token: string;
  refreshToken: string;
  menu: Menu[];
}

export interface Transit {
  idTransit: number;
  codeObu: string;
  idGate: Gate;
  startDate: Date;
  flagAcknowledge: boolean;
  validationType: string;
  nackReason: string;
  flagPassed: boolean;
  endDate: Date;
  creationUser: number;
  creationDate: Date;
}

export interface Permission {
  idPermission: number;
  permissionType: PermissionType;
  category: Category;
  obu: Obu;
  validationStartDate: Date;
  issueValidationDate: Date;
  flagActive: boolean;
  startTime: string;
  endTime: string;
  validationDateStart: Date;
  validationDateEnd: Date;
  cancelationUser: number;
  cancelationDate: Date;
  creationUser: number;
  creationDate: Date;
  modificationUser: number;
  modificationDate: Date;
  areaList: Area[];
}

export type Category = 'P' | 'T';

export interface PermissionType {
  permissionTypeId: number;
  permissionTypeDesc: string;
  creationUser: number;
  creationDate: Date;
  modificationUser: number;
  modificationDate: Date;
  timeslotList: FasciaOraria[];
}

export interface Obu {
  idObu: number;
  obuCode: string;
  nameReferenceObu: string;
  plate: string;
  creationUser: number;
  creationDate: Date;
  modificationUser: number;
  modificationDate: Date;
}

export interface Gate {
  idGate: number;
  park: Park;
  gateDescription: string;
  flagActive: boolean;
  gateDirection: string;
  gateType: string;
  ipAntenna: string;
  portAntenna: number;
  userAntenna: string;
  passwordAntenna: string;
  idUserDeactivation: number;
  deactivationDate: Date;
  creationUser: number;
  creationDate: Date;
  modificationUser: number;
  modificationDate: Date;
}

export interface GateAssociated {
  idGate: number;
  gateDescription: string;
  associated: boolean;
}

export interface Incident {
  startDate: Date;
  endDate: Date;
  gate: Gate;
  park: Park;
  device: String;
  errorCode: String;

}
