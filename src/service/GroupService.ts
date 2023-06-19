import api from "../http";
import {AxiosResponse} from 'axios'
import { Group } from "../model/Group";
export default class GroupService{
    static async create(title: string, user_id: string): Promise<AxiosResponse<Group>>{
        return await api.post<Group>('group/create', {title, user_id})
    }

    static async viewAll(user_id: string): Promise<AxiosResponse<Group>>{
        return await api.post<Group>('group/getAll', {user_id})
    }

    static async edit(title: string, id: string): Promise<AxiosResponse<Group>>{
        return await api.post<Group>('group/edit', {title, id})
    }

    static async delete(id: string): Promise<AxiosResponse<Group>>{
        return await api.post<Group>('group/delete', {id})
    }

    static async viewUsers(id: string): Promise<AxiosResponse<any>>{
        return await api.post<any>('group/viewUsers', {id})
    }

    static async viewFreeUsers(id: string): Promise<AxiosResponse<Group>>{
        return await api.post<Group>('group/viewFreeUsers', {id})
    }

    static async addUserToGroup(user: string, group:string): Promise<AxiosResponse<Group>>{
        return await api.post<Group>('group/addUserToGroup', {user, group})
    }

    static async deleteUserFromGroup(user: string, group:string): Promise<AxiosResponse<Group>>{
        return await api.post<Group>('group/deleteUserFromGroup', {user, group})
    }
}