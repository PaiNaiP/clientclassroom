import api from "../http";
import {AxiosResponse} from 'axios'
import { Theme } from "../model/Theme";
export default class ThemeService{

    static async create(title:string, class_id:string): Promise<AxiosResponse<Theme[]>>{
        return await api.post<Theme[]>('theme/create', {title, class_id})
    }

    static async viewAll(class_id:string): Promise<AxiosResponse<Theme[]>>{
        return await api.post<Theme[]>('theme/viewAll', {class_id})
    }

    static async update(id:string,title:string): Promise<AxiosResponse<Theme[]>>{
        return await api.post<Theme[]>('theme/update', {id, title})
    }

    static async delete(id:string): Promise<AxiosResponse<Theme[]>>{
        return await api.post<Theme[]>('theme/delete', {id})
    }
}