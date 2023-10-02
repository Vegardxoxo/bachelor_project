import {useSetRecoilState} from 'recoil';
import {isAuthAtom} from '../../globalVariables/variables';

/*exports an array of objects named SidebarData*/
export const SidebarData = [
    {
        title: 'Mitt dashboard',
        path: '/',

        cName: 'nav-text'
    },
    {
        title: 'Lisensportalen',
        path: '/lisensportal',

        cName: 'nav-text'
    },

    {
        title: 'Ledertavle',
        path: '/leaderboard',

        cName: 'nav-text'
    },
    {
        title: 'Min side',
        path: '/minside',

        cName: 'nav-text'
    },
    {
        title: 'Ofte stilte spørsmål',
        path: '/FAQ',

        cName: 'nav-text'
    },
    {
        title: 'Logg ut',
        path: '/',
        cName: 'nav-text',
        onClick: () => {
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            const setAuth = useSetRecoilState(isAuthAtom);
            setAuth(false);
        }
    }
];
