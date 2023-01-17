import { Menu } from "src/app/components/domain/interface";

export const MENUITEMS: Menu[]  = [
  {
    id: 1, route: 'dashboard', name: 'Dashboard', icon: 'home', code: 'dashboard'
  },
  {
    id: 4, route: 'user-management', name: 'Gestione Utenti', icon: 'group', code: 'user-management'
  },
  {
    id:6, route: 'area-management', name: 'Gestione Area', icon: 'area_chart', code: 'area-management'
  }
];
