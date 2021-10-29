
import axios from "axios"
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

export const axinstance = axios.create({ baseURL: 'https://salmpled-backend.herokuapp.com/api/v1' })

axinstance.interceptors.response.use((response) => {
    console.log(`response ${JSON.stringify(response)}`);
    return response;
}, (error) => {
    console.log(`error ${error}`);
    return Promise.reject(error);
});

axinstance.interceptors.request.use(
    async (config) => {
        const token  = await firebase.auth().currentUser.getIdToken()
        config.headers["Authorization"] = `Bearer ${token}`
        return config
    }
)