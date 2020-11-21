export const isAuthenticated = ()=> {
    if(typeof(window)=== undefined) {
        return false;
    }
    if(sessionStorage.getItem('UserName')) {
        return JSON.parse(sessionStorage.getItem('UserName'))
    }else {
        return false;
    }
}