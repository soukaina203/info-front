/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';


export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'Dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:rocket-launch',
        link: '/user'
    },




];
export const compactNavigation: FuseNavigationItem[] = [
   {
        id: 'Dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:rocket-launch',
        link: '/user/dashboard'
    },

    {
        id: 'Profile',
        title: 'Profile',
        type: 'basic',
        icon: 'heroicons_outline:user',
        link: '/user/profile'
    },

    {
        id: 'Planification',
        title: 'Planification',
        type: 'basic',
        icon: 'heroicons_outline:document-chart-bar',
        link: '/user/planification'
    },
    {
        id: 'cours',
        title: 'Classes virtuelles',
        type: 'basic',
        icon: 'heroicons_outline:clipboard-document-list',
        link: '/user/classes'
    },

    {
        id: 'users',
        title: 'Utilisateurs',
        type: 'basic',
        icon: 'heroicons_outline:users',
        link: 'user/users'
    },


];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
