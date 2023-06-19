import api from "../http";
import {AxiosResponse} from 'axios'
import { AuthRespose } from "../model/AuthResponse";
export default class AuthService{
    static async login(email: string, password: string): Promise<AxiosResponse<AuthRespose>>{
        return await api.post<AuthRespose>('auth/login', {email, password})
    }

    static async registration(surname:string, name:string, lastname:string, email: string, password: string, color:string): Promise<AxiosResponse<AuthRespose>>{
        return await api.post<AuthRespose>('auth/registration', {surname, name, lastname, email, password, color})
    }

    static async logout(): Promise<void>{
        return await api.post('auth/logout')
    }
}