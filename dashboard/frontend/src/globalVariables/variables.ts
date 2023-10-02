import {atom} from 'recoil';
import {UserInformation} from '../Interfaces';
// This fine contains all global variables used in the application.
export const orgAtom = atom<string>({
    key: 'organization',
    default: ''
});


export const isAuthAtom = atom<boolean>({
    key: 'isAuthenticated',
    default: false
})

export const userAtom = atom<UserInformation>({
    key: 'user',
    default: {
        primary_user_email: '',
        primary_user_full_name: '',
        computer_name: '',
        organization: '',
        is_unit_head: false,
    }

})

export const refreshTableAtom = atom<boolean>({
    key: 'refreshTable',
    default: false
})