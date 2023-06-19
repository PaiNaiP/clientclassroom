import { AxiosResponse } from "axios";
import api from "../http";
import { TaskMessage } from "../model/TaskMessage";

export default class TaskMessageService{
    static async addMessage(user_id: string, id:string, text:string): Promise<AxiosResponse<TaskMessage>>{
        return await api.post<TaskMessage>('taskMessage/addMessage', {user_id, id, text})
    }

    static async getAllMessage(user_id: string, id:string): Promise<AxiosResponse<TaskMessage>>{
        return await api.post<TaskMessage>('taskMessage/getAllMessage', {user_id, id})
    }
}