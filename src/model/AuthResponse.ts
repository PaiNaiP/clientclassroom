import { User } from "./User"

export interface AuthRespose{
    accessToken: string
    refreshToken: string
    user: User
    
}