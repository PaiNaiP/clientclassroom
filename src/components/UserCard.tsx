import { observer } from 'mobx-react-lite'
import React, {useState, useEffect, useContext} from 'react'
import { API_URL } from '../http';
import checkFileAvailability from '../middleware/image';
import { RxCross2 } from 'react-icons/rx';
import { Context } from '..';

const UserCard = (userList:any) => {
  const [checkFile, setCheckFile] = useState<any>()
  const {store} = useContext(Context)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleCheckImage = async() =>{
    const fileUrl = API_URL + 'images/'+userList.userList.user.file;
    const isFileAvailable = await checkFileAvailability(fileUrl);
    setCheckFile(isFileAvailable); 
  }
  useEffect(() => {
    handleCheckImage()
  }, [handleCheckImage])

  const handleDelete = () =>{
    store.deleteFromClass(userList.userList.user.id, userList.author.id)
    .then((data: any) => {
      if (data) {
        // Если удаление успешно, обновить список пользователей без удаленного пользователя

        // Получаем текущий список пользователей
        const currentUsers = userList.author;
        const updatedUsers: any[] = [];

        for (let i = 0; i < currentUsers.length; i++) {
          const user = currentUsers[i];
          if (user.id !== userList.user.id) {
            updatedUsers.push(user);
          }
        }      
        // Вызов функции userList.onRemoveUser() с обновленным списком пользователей
        userList.onRemoveUser(updatedUsers);
      }
    });
  }
  return (
    <div className="user-card" style={{border:`1px solid ${userList.author.decor}`}}>
      <div className="user-card__body">
      <div className="img-icon" 
      style={{background:userList.userList.user.colorProfile,
      color:'white', width:'50px', height:'50px'}}>
          {!checkFile&&(
            <div>
              <p style={{marginTop:'7px'}}>{userList.userList.user.email[0].toUpperCase()}</p>
            </div>
          )}
          {checkFile&&(
            <img src={API_URL + 'images/'+userList.userList.user.file} 
            alt="" 
            style={{objectFit:'cover', width:'50px'}}/>
          )}
      </div>
      <div className="user-card__body__info">
        <h1>{userList.userList.user.surname} {userList.userList.user.name} {userList.userList.user.lastname}</h1>
        <p>{userList.userList.user.email}</p>
      </div>
      {userList.role&&(
        <>
        {userList.role.name==="teacher"&&(
          <>
          {userList.author.user_id!==userList.userList.user.id&&(
            <RxCross2 style={{color:userList.author.decor, marginTop:'30px', fontSize:'24px'}} onClick={handleDelete}/>
          )}
          </>
        )}
        </>
      )}
      </div>
    </div>
  )
}
export default observer(UserCard)