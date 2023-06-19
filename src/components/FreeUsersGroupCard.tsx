/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useEffect, useState} from 'react'
import { API_URL } from '../http'
import { BsPlus } from 'react-icons/bs'
import { Context } from '..'
import { RxCross2 } from 'react-icons/rx'
import { ToastContainer, toast } from 'react-toastify'

export const FreeUsersGroupCard = (users:any) => {
    const {store} = useContext(Context)
    const [user, setUser] = useState<any>()
    const [loading, setLoading] = useState<boolean>(true)
    const [marginLeft, setMarginLeft] = useState<string>('')
    const handleAddUserToGroup=()=>{
        store.addUserToGroup(users.users.id, users.group).then((data)=>{
            if(data?.data)
            toast.success(`Пользователю ${user.surname} ${user.name} ${user.lastname} отправлено приглашение на почту` , {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            }); 
        })
    }
    const handleDelete = () =>{
        store.deleteUserFromGroup(users.users.id, users.group)
        .then((data: any) => {
          if (data) {
            // Если удаление успешно, обновить список пользователей без удаленного пользователя
    
            // Получаем текущий список пользователей
            const currentUsers = users;
            const updatedUsers: any[] = [];
            for (let i = 0; i < currentUsers.length; i++) {
                const user = currentUsers[i];
                if (user.id !== users.users.id) {
                    updatedUsers.push(user);
                }
            }      
            // Вызов функции userList.onRemoveUser() с обновленным списком пользователей
            users.onRemoveUser(updatedUsers);
          }
        });
      }

    useEffect(() => {
        if(users.users.surname){
            setUser(users.users)
            setMarginLeft('50px')
            setLoading(false)
        }
        else if(users.users.user.id)
        {
            setUser(users.users.user)
            setMarginLeft('10px')
            setLoading(false)
        }
    }, [])
    if(loading){
        return(
            <div>...loading</div>
        )
    }
  return (
    <div className="card-users" style={{marginLeft:marginLeft, marginTop:'20px'}}>
        <ToastContainer />
        <div className="course-card" style={{width:'27rem', margin:'0 auto'}}>
            <div className="course-card__icon">
                {users.users.file&&(
                    <img src={API_URL + 'images/' + users.users.file} alt="" style={{width:'49px', height:'49px', objectFit:'cover', borderRadius:'50%'}}/>
                )}
                {!users.users.file&&(
                    <div style={{background:users.users.colorProfile, width:'49px', height:'49px', borderRadius:'50%', textAlign:'center'}}>
                        <p style={{color:'white', marginTop:'7px'}} >{users.users.email[0].toUpperCase()}</p>
                    </div>
                )}
            </div>
            <div className="course-card__content" style={{width:'90%'}}>
                <h2 style={{fontSize:'16px', width:'100%'}} className="course-card__title">{users.users.surname} {users.users.name} {users.users.lastname}</h2>
                <p className="course-card__subtitle" style={{color:'black'}}>{users.users.email}</p>
            </div>
            {!users.cross&&(
                <BsPlus style={{fontSize:'20px'}} onClick={handleAddUserToGroup}/>
            )}
            {users.cross&&(
                <RxCross2 style={{fontSize:'20px'}} onClick={handleDelete}/>
            )}
        </div>
    </div>
  )
}
