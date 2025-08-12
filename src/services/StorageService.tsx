import Cookies from "universal-cookie";
// import { JwtPayload } from "jwt-decode";
import { jwtDecode } from "jwt-decode";
const cookies = new Cookies();

const StorageService = {
    getJwtCookie: () => {
        return cookies.get('jwt_authorization');
    },
    jwtSave: async (data: any) => {
        cookies.set('jwt_authorization', data);
    },
    jwtRemove: async () => {
        cookies.remove('jwt_authorization');
    },
    getJwtCookieData: (token: any) => {
        if(!token) {
            return [];
        }
        const decodedToken = jwtDecode(token);

        // console.log(decodedToken.role_id);
        return decodedToken;
    },
    jwtPayloadSave: async (data: any) => {
        cookies.set('payload', data);
    },
    jwtPayloadRemove: async () => {
        cookies.remove('payload');
    },
    getJwtPayload: () => {
        return cookies.get('payload');
    }
};

export default StorageService;