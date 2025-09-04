import Constants from "../config/Constants";
import StorageService from "./StorageService";
import { jwtDecode } from "jwt-decode";

const ApiService = {
    upload: async (endpoint: string, data: any) => {
        let parsedData = data;
        parsedData.token = await StorageService.getJwtCookie();
        const formData = new FormData();
        Object.keys(parsedData).forEach((key: string) => {
            formData.append(key, parsedData[key]);
        });
        try {
            const result = await fetch(`${Constants.API_BASE_URL + endpoint}`
                , {
                    method: 'POST',
                    body: formData
                }
            );
            const response = await result.json();
            return response;
        }
        catch (error) {
            return {
                status: 'n',
                msg: `API Call Failed:${error}`
            };
        }
    },
    get: async (endpoint: string, data: any | null = null) => {
        const token = await StorageService.getJwtCookie();
        var headers = {
            'Content-Type': 'application/json'
        };
        if (token && token !== 'undefined') {
            Object.assign(headers, { 'Authorization': `Bearer ${token}` });
        }
        let parsedData = data ? JSON.parse(data) : {};
        try {
            const result = await fetch(`${Constants.API_BASE_URL + endpoint}`, {
                method: 'POST',
                headers: headers,
                credentials: 'include',
                body: JSON.stringify(parsedData)
            });
            const response = await result.json();
            return response;
        }
        catch (error) {
            return {
                status: 'n',
                msg: `API Call Failed:${error}`
            };
        }
    },
    register: async (endpoint: string, data: any) => {
        try {
            const result = await fetch(`${Constants.API_BASE_URL + endpoint}`
                , {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: data
                }
            );
            const response = await result.json();
            return response;
        }
        catch (error) {
            return {
                status: 'n',
                msg: `API Call Failed:${error}`
            };
        }

    },
    decodePayload: async (data: any) => {
        const decoded = jwtDecode(data);
        return decoded;
    },
    postForm: async (endpoint: string, data: any) => {
        const token = await StorageService.getJwtCookie();

        try {
            const result = await fetch(`${Constants.API_BASE_URL + endpoint}`, {
                method: "POST",
                headers: token && token !== "undefined" ? {
                    Authorization: `Bearer ${token}`,
                } : undefined,
                body: data,
            });

            return await result.json();
        } catch (error) {
            return {
                status: "n",
                msg: `API Call Failed: ${error}`,
            };
        }
    }
};

export default ApiService;