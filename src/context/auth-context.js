import {createContext} from 'react';

export const AuthContext=createContext({
    regNo:null,
    isLoggedin:false,
    token:null,
    route:null,
    login:()=>{},
});