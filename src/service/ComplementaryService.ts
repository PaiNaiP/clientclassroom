import { AxiosResponse } from "axios";
import { Complementary } from "../model/Complementary";
import api from "../http";

export default class ComplementaryService{
    static async getOne(task_id: string, user_id: string): Promise<AxiosResponse<Complementary>>{
        return await api.post<Complementary>('complementary/getOne', {task_id, user_id})
    }

    static async editStatus(id: string, status: string): Promise<AxiosResponse<Complementary>>{
        return await api.post<Complementary>('complementary/editStatus', {id, status})
    }

    static async deleteFile(file_id: string, id: string): Promise<AxiosResponse<Complementary>>{
        return await api.post<Complementary>('complementary/deleteFile', {file_id, id})
    }

    static async getAll(task_id:string): Promise<AxiosResponse<any>>{
        return await api.post<any>('complementary/getAll', {task_id})
    }

    static async addMark(id:string, mark:string): Promise<AxiosResponse<Complementary>>{
        return await api.post<Complementary>('complementary/addMark', {id, mark})
    }
}