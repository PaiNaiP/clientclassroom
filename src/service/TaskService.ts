import api from "../http";
import {AxiosResponse} from 'axios'
import { Task } from "../model/Task";
export default class TaskService{

    static async viewTasks(class_id:string): Promise<AxiosResponse<Task[]>>{
        return await api.post<Task[]>('task/view', {class_id})
    }

    static async viewFiles(files:string): Promise<AxiosResponse<any>>{
        return await api.post<any>('task/viewFile', {files})
    }

    static async delete(id:string): Promise<AxiosResponse<Task[]>>{
        return await api.post<Task[]>('task/delete', {id})
    }

    static async addTheme(id:string, theme_id:string): Promise<AxiosResponse<Task[]>>{
        return await api.post<Task[]>('task/addTheme', {id, theme_id})
    }

    static async deleteTheme(id:string): Promise<AxiosResponse<Task[]>>{
        return await api.post<Task[]>('task/deleteTheme', {id})
    }

    static async allTaskWithoutTheme(class_id:string): Promise<AxiosResponse<Task[]>>{
        return await api.post<Task[]>('task/allTaskWithoutTheme', {class_id})
    }

    static async allTaskWithTheme(class_id:string): Promise<AxiosResponse<Task[]>>{
        return await api.post<Task[]>('task/allTaskWithTheme', {class_id})
    }

    static async viewTaskOne(id:string, user_id:string): Promise<AxiosResponse<any>>{
        return await api.post<any>('task/viewTaskOne', {id, user_id})
    }

    static async getDecor(id:string): Promise<AxiosResponse<any>>{
        return await api.post<any>('task/getDecor', {id})
    }
}