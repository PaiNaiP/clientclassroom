import React, {useState, useContext} from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { TiGroup } from 'react-icons/ti'
import ModalCreateGroup from './ModalCreateGroup'
import { Context } from '..'
import ModalUsersGroups from './ModalUsersGroups'

export const GroupsCard = (groups:any) => {
    const {store} = useContext(Context)
    const [openModalGroup, setOpenModalGroup] = useState(false)
    const [openModalUsers, setOpenModalUsers] = useState(false)

    const handleCloseModalGroup = () => {
        setOpenModalGroup(false);
    }

    const handleCloseModelUsers = () => {
        setOpenModalUsers(false);
    }

    const handleDeleteGroup = () =>{
        store.deleteGroupe(groups.groups.id).then((data)=>{
            if(data)
                window.location.reload()
        })
    }
  return (
    <div className="card-group" style={{width:'20rem'}}>
        <div className="course-card-cont">
            <div className="course-card__icon">
                <TiGroup/>
            </div>
            <div className="course-card__content" style={{width:'47%'}}>
                <h2 className="course-card__title" style={{width:'100%'}}>{groups.groups.title}</h2>
            </div>
            <div className="dropdown">
                <button className='dropdown__button__normal'>
                    <BsThreeDotsVertical/>
                </button>
                <div className="dropdown__content">
                <div className="dropdownline" onClick={()=>setOpenModalGroup(true)}>Изменить группу</div>
                <div className="dropdownline" onClick={handleDeleteGroup}>Удалить группу</div>
                <div className="dropdownline" onClick={()=>setOpenModalUsers(true)}>Участники</div>
            </div>
            {openModalGroup&&(
                <ModalCreateGroup show={openModalGroup} onClose={handleCloseModalGroup} titleGroup={groups.groups.title} idGroup={groups.groups.id}/>
            )}
            {openModalUsers&&(
                <ModalUsersGroups show={openModalUsers} onClose={handleCloseModelUsers} id={groups.groups.id}/>
            )}
        </div>
    </div>
</div>
  )
}

