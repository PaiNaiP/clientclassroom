import api from "../http";
import {AxiosResponse} from 'axios'
import { Course } from "../model/Course";
export default class CourseService{
    static async createClass(title:string, chapter:string, subject:string, audience:string, decor:string, user_id:string): Promise<AxiosResponse<Course>>{
        return await api.post<Course>('class/create', {title, chapter, subject, audience, decor, user_id})
    }

    static async viewClassList(user:string): Promise<AxiosResponse<Course>>{
        return await api.post<Course>('class/getAll', {user})
    }

    static async viewClassListArchive(user:string): Promise<AxiosResponse<Course>>{
        return await api.post<Course>('class/getAllArchive', {user})
    }

    static async editClass(title:string, chapter:string, subject:string, audience:string, welcomeLink:string, decor:string): Promise<AxiosResponse<Course>>{
        return await api.post<Course>('class/edit', {title, chapter, subject, audience, welcomeLink, decor})
    }

    static async addArchive(id:string): Promise<AxiosResponse<Course>>{
        return await api.post<Course>('class/addArchive', {id})
    }

    static async getOne(welcomelink:string, user:string): Promise<AxiosResponse<any>>{
        return await api.post<any>('class/getOne', {welcomelink, user})
    }

    static async getClassStudent(user:string): Promise<AxiosResponse<Course>>{
        return await api.post<Course>('class/getClassStudent', {user})
    }

    static async getClassTeacher(user:string): Promise<AxiosResponse<Course>>{
        return await api.post<Course>('class/getClassTeacher', {user})
    }

    static async delete(id:string): Promise<AxiosResponse<Course>>{
        return await api.post<Course>('class/delete', {id})
    }
}