import api from "../http";
import {AxiosResponse} from 'axios'
import { Member } from "../model/Member";
export default class MemberService{

    static async viewTeacher(class_id:string): Promise<AxiosResponse<Member[]>>{
        return await api.post<Member[]>('member/viewTeacher', {class_id})
    }

    static async viewStudent(class_id:string): Promise<AxiosResponse<Member[]>>{
        return await api.post<Member[]>('member/viewStudent', {class_id})
    }

    static async freeUsers(id:string): Promise<AxiosResponse<Member[]>>{
        return await api.post<Member[]>('member/viewFreeUsers', {id})
    }

    static async addUsersToClass(users:any, class_id:string, role_name:string): Promise<AxiosResponse<Member[]>>{
        return await api.post<Member[]>('member/addUsersToClass', {users, class_id, role_name})
    }

    static async deleteFromClass(user_id:string, class_id:string): Promise<AxiosResponse<Member[]>>{
        return await api.post<Member[]>('member/deleteFromClass', {user_id, class_id})
    }

    static async addGroupToClass(group_id:string, class_id:string): Promise<AxiosResponse<Member[]>>{
        return await api.post<Member[]>('member/addGroupToClass', {group_id, class_id})
    }
}