import { makeAutoObservable } from "mobx"
import { User } from "../model/User"
import AuthService from "../service/AuthService"
import axios from "axios"
import { AuthRespose } from "../model/AuthResponse"
import { API_URL } from "../http"
import UserService from "../service/UserService"
import CourseService from "../service/CourseService"
import GroupService from "../service/GroupService"
import TaskService from "../service/TaskService"
import ThemeService from "../service/ThemeService"
import MemberService from "../service/MemberService"
import ComplementaryService from "../service/ComplementaryService"
import ComplementaryMessageService from "../service/ComplementaryMessageService"
import TaskMessageService from "../service/TaskMessageService"

export default class Store{
    user = {} as User
    error? = []
    isAuth = false
    isLoading = false
    constructor(){
        makeAutoObservable(this)
    }

    setAuth(bool:boolean){
        this.isAuth = bool
    }
    setUser(user: User){
        this.user = user
    }
    setLoading(bool: boolean){
        this.isLoading = bool
    }

    setError(error?: []){
        this.error = error
    }
    async login(email: string, password:string){
        try {
            this.setError([])
            const {data} = await AuthService.login(email, password)
            localStorage.setItem('token', data.accessToken)
            this.setAuth(true)
            this.setUser(data.user)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)
        }
    }

    async registration(surname:string, name:string, lastname:string, email: string, password:string, color:string){
        try {
            this.setError([])
            const {data} = await AuthService.registration(surname, name, lastname, email, password, color)
            localStorage.setItem('token', data.accessToken)
            this.setAuth(true)
            this.setUser(data.user)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)
        }
    }

    async logout(){
        try {
            await AuthService.logout()
            localStorage.removeItem('token')
            this.setAuth(false)
            this.setUser({} as User)
        } catch (e) {
            console.log(e)
        }
    }

    async checkAuth(){
        this.setLoading(true)
        try {
            const response = await axios.get<AuthRespose>(`${API_URL}auth/refresh`, {withCredentials:true})
            if(localStorage.getItem('token'))
            {this.setAuth(true)
            this.setUser(response.data.user)}
        } catch (e) {
            console.log(e)
        } finally{
            this.setLoading(false)
        }
    }

    async resetPassword(email:string){
        try {
            this.setError([])
            const data = await UserService.resetPassword(email)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)
        }
    }

    async changePassword(password:string, passwordLink:string){
        try {
            this.setError([])
            const data = await UserService.changePassword(password, passwordLink)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    
    async editAva(email:string, image:any){
        try {
            const formData = new FormData()
            formData.append('testImage', image)
            formData.append('email', email)
            const data = await axios.post(API_URL+'user/editPhoto', formData)
            return data
        } catch (e) {
            
        }
    }

    async editProfile(id:string, email:string, surname:string, name:string, lastname:string){
        try {
            this.setError([])
            const data = await UserService.editUser(id, email, surname, name, lastname)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async createClass(title:string, chapter:string, subject:string, audience:string, decor:string, user_id:string){
        try {
            this.setError([])
            const data = await CourseService.createClass(title, chapter, subject, audience, decor, user_id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async getAllClass(user_id:string){
        try {
            this.setError([])
            const data = await CourseService.viewClassList(user_id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async getAllClassArchive(user_id:string){
        try {
            this.setError([])
            const data = await CourseService.viewClassListArchive(user_id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async deleteCourse(id:string){
        try {
            this.setError([])
            const data = await CourseService.delete(id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async createGroupe(title:string, user_id:string){
        try {
            this.setError([])
            const data = await GroupService.create(title, user_id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async getAllGroup(user_id:string){
        try {
            this.setError([])
            const data = await GroupService.viewAll(user_id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async editGroupe(title:string, id:string){
        try {
            this.setError([])
            const data = await GroupService.edit(title, id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async deleteGroupe(id:string){
        try {
            this.setError([])
            const data = await GroupService.delete(id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async viewUsersInGroup(id:string){
        try {
            this.setError([])
            const data = await GroupService.viewUsers(id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async viewFreeUsersInGroup(id:string){
        try {
            this.setError([])
            const data = await GroupService.viewFreeUsers(id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async addUserToGroup(user:string, group:string){
        try {
            this.setError([])
            const data = await GroupService.addUserToGroup(user, group)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async deleteUserFromGroup(user:string, group:string){
        try {
            this.setError([])
            const data = await GroupService.deleteUserFromGroup(user, group)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async editCourse(title:string, chapter:string, subject:string, audience:string, welcomeLink:string, decor:string){
        try {
            this.setError([])
            const data = await CourseService.editClass(title, chapter, subject, audience, welcomeLink, decor)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async addArchive(id:string){
        try {
            this.setError([])
            const data = await CourseService.addArchive(id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async getCourseOne(welcomelink:string, user:string){
        try {
            this.setError([])
            const data = await CourseService.getOne(welcomelink, user)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async editCover(welcomelink:string, image:any){
        try {
            const formData = new FormData()
            formData.append('testImage', image)
            formData.append('welcomelink', welcomelink)
            const data = await axios.post(API_URL+'class/editCover', formData)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)      
        }
    }

    async addTask(files:any, deadlineDatetime:string, title:string, description:string, point:string, class_id:string, isForm:string, user_id:string){
        try {
            const formData = new FormData()
            if(files){
                files.forEach((element: any) => {
                    formData.append('files', element)
                });
            }
            formData.append('deadlineDatetime', deadlineDatetime)
            formData.append('title', title)
            formData.append('description', description)
            formData.append('point', point)
            formData.append('class_id', class_id)
            formData.append('isForm', isForm)
            formData.append('user_id', user_id)
            const data = await axios.post(API_URL+'task/create', formData)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)      
        }
    }

    async viewTasks(class_id:string){
        try {
            this.setError([])
            const data = await TaskService.viewTasks(class_id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async viewFiles(files:any){
        try {
            this.setError([])
            const data = await TaskService.viewFiles(files)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async updateTask(id:string, oldFiles:any, files:any, deadlineDatetime:string, title:string, description:string, point:string, isForm:string){
        try {
            const formData = new FormData()
            if(files){
                files.forEach((element: any) => {
                    formData.append('files', element)
                });
            }
            if(oldFiles){
                oldFiles.forEach((old:any)=>{
                    formData.append('oldFiles', old.id)
                })
            }
            formData.append('id', id)
            formData.append('deadlineDatetime', deadlineDatetime)
            formData.append('title', title)
            formData.append('description', description)
            formData.append('point', point)
            formData.append('isForm', isForm)
            const data = await axios.post(API_URL+'task/update', formData)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)      
        }
    }

    async deleteTask(id:string){
        try {
            this.setError([])
            const data = await TaskService.delete(id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async createTheme(title:string, class_id:string){
        try {
            this.setError([])
            const data = await ThemeService.create(title, class_id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async viewAllTheme(class_id:string){
        try {
            this.setError([])
            const data = await ThemeService.viewAll(class_id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async addTheme(id:string, theme_id:string){
        try {
            this.setError([])
            const data = await TaskService.addTheme(id, theme_id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async deleteFromTheme(id:string){
        try {
            this.setError([])
            const data = await TaskService.deleteTheme(id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async allTaskWithoutTheme(class_id:string){
        try {
            this.setError([])
            const data = await TaskService.allTaskWithoutTheme(class_id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async allTaskWithTheme(class_id:string){
        try {
            this.setError([])
            const data = await TaskService.allTaskWithTheme(class_id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async updateTheme(id:string, title:string){
        try {
            this.setError([])
            const data = await ThemeService.update(id, title)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async deleteTheme(id:string){
        try {
            this.setError([])
            const data = await ThemeService.delete(id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async viewTeacher(class_id:string){
        try {
            this.setError([])
            const data = await MemberService.viewTeacher(class_id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async viewStudent(class_id:string){
        try {
            this.setError([])
            const data = await MemberService.viewStudent(class_id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async freeUsers(id:string){
        try {
            this.setError([])
            const data = await MemberService.freeUsers(id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async addUsersToClass(users:any, class_id:string, role_name:string){
        try {
            this.setError([])
            const data = await MemberService.addUsersToClass(users, class_id, role_name)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async deleteFromClass(user_id:string, class_id:string){
        try {
            this.setError([])
            const data = await MemberService.deleteFromClass(user_id, class_id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async addGroupToClass(group_id:string, class_id:string){
        try {
            this.setError([])
            const data = await MemberService.addGroupToClass(group_id, class_id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async getClassStudent(user:string){
        try {
            this.setError([])
            const data = await CourseService.getClassStudent(user)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async getClassTeacher(user:string){
        try {
            this.setError([])
            const data = await CourseService.getClassTeacher(user)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async viewTaskOne(id:string, user_id:string){
        try {
            this.setError([])
            const data = await TaskService.viewTaskOne(id, user_id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async viewComplementaryOne(task_id:string, user_id:string){
        try {
            this.setError([])
            const data = await ComplementaryService.getOne(task_id, user_id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async editComplementaryStatus(id:string, status:string){
        try {
            this.setError([])
            const data = await ComplementaryService.editStatus(id, status)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async addFiles(files:any, id:string){
        try {
            const formData = new FormData()
            if(files){
                files.forEach((element: any) => {
                    console.log(element)
                    formData.append('files', element)
                });
            }
            formData.append('id', id)
            const data = await axios.post(API_URL+'complementary/addFiles', formData)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)      
        }
    }

    async deleteFile(file_id:string, id:string){
        try {
            this.setError([])
            const data = await ComplementaryService.deleteFile(file_id, id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async getAllComplementary(task_id:string){
        try {
            this.setError([])
            const data = await ComplementaryService.getAll(task_id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async addMarkComplementary(id:string, mark:string){
        try {
            this.setError([])
            const data = await ComplementaryService.addMark(id, mark)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async addMessageComplementary(user_id:string, id:string, text:string){
        try {
            this.setError([])
            const data = await ComplementaryMessageService.addMessage(user_id, id, text)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async getAllMessageComplementary(id:string){
        try {
            this.setError([])
            const data = await ComplementaryMessageService.getAllMessage(id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async addMessageTask(user_id:string, id:string, text:string){
        try {
            this.setError([])
            const data = await TaskMessageService.addMessage(user_id, id, text)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async getAllMessageTask(user_id:string, id:string){
        try {
            this.setError([])
            const data = await TaskMessageService.getAllMessage(user_id, id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async getAllUserMessage(task_id:string){
        try {
            this.setError([])
            const data = await ComplementaryMessageService.getAllUsers(task_id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async getUserMessage(user_id:string, task_id:string){
        try {
            this.setError([])
            const data = await ComplementaryMessageService.getUserMessage(user_id, task_id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }

    async getDecor(id:string){
        try {
            this.setError([])
            const data = await TaskService.getDecor(id)
            return data
        } catch (e) {
            console.log(e)
            let error: any = e;
            this.setError(error.response.data.message)        
        }
    }
}
