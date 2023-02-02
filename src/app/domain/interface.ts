import { Park, User } from "./class";


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
  obu: Obu;
  validationStartDate: Date;
  issueValidationDate: Date;
  flagCanceled: boolean;
  cancelationUser: number;
  cancelationDate: Date;
  creationUser: number;
  creationDate: Date;
  modificationUser: number;
  modificationDate: Date;

}

export interface PermissionType {
  idPermissionType: number;
  permissionTypeDesc: string;
  creationUser: number;
  creationDate: Date;
  modificationUser: number;
  modificationDate: Date;
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
