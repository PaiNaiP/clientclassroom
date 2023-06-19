import api from "../http";
import {AxiosResponse} from 'axios'
import { User } from "../model/User";
export default class UserService{

    static async resetPassword(email:string): Promise<AxiosResponse<User[]>>{
        return await api.post<User[]>('user/resetPassword', {email})
    }

    static async changePassword(password:string,passwordLink:any): Promise<AxiosResponse<User[]>>{
        return await api.post<User[]>('user/changePassword', {password, passwordLink})
    }
    static async editUser(id:string, email:string, surname:string, name:string, lastname:string): Promise<AxiosResponse<User[]>>{
        return api.post<User[]>('user/editProfile', {id, email, surname, name, lastname})
    }
}