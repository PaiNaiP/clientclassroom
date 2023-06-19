import { AxiosResponse } from "axios";
import api from "../http";
import { ComplementaryMessage } from "../model/ComplementaryMessage";

export default class ComplementaryMessageService{
    static async addMessage(user_id: string, id:string, text:string): Promise<AxiosResponse<ComplementaryMessage>>{
        return await api.post<ComplementaryMessage>('complemetaryMessage/addMessage', {user_id, id, text})
    }

    static async getAllMessage(id:string): Promise<AxiosResponse<ComplementaryMessage>>{
        return await api.post<ComplementaryMessage>('complemetaryMessage/getAllMessage', {id})
    }

    static async getAllUsers(task_id:string): Promise<AxiosResponse<any>>{
        return await api.post<any>('complemetaryMessage/allUsers', {task_id})
    }

    static async getUserMessage(user_id:string, task_id:string): Promise<AxiosResponse<any>>{
        return await api.post<any>('complemetaryMessage/getUserMessage', {user_id, task_id})
    }
}