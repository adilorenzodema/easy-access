import { Menu } from "src/app/domain/interface";

export const MENUITEMS: Menu[] = [
  {
    id: 1, route: 'dashboard', name: 'Dashboard', icon: 'home', code: 'dashboard'
  },
  {
    id: 2, route: 'area-management', name: 'Gestione Area', icon: 'area_chart', code: 'area-management'
  },
  {
    id: 3, route: 'parking-management', name: 'Gestione Parcheggi', icon: 'area_chart', code: 'parking-management'
  },
  {
    id: 4, route: 'user-management', name: 'Gestione Utenti', icon: 'group', code: 'user-management'
  }
];
