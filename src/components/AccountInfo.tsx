import { observer } from 'mobx-react-lite'
import React, {useContext, useState} from 'react'
import { Context } from '..'
import {FiEdit2} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import ModalImage from './ModalImage'
import { API_URL } from '../http'

const AccountInfo:React.FC = () => {
    const {store} = useContext(Context)
    const navigate = useNavigate()
    const [openModal, setOpenModal] = useState(false)
    const handleLogout = async()=>{
        store.logout().then(()=>{
            navigate('/signin')
        })
    }

    const handleChangePassword = async()=>{
        store.resetPassword(store.user.email).then(()=>{
            toast.success('Для смены пароля перейдите по ссылке, которая была выслана на почту', {
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

    const handleCloseModal = () => {
        setOpenModal(false);
    }
  return (
    <div className="account-info">
        <ToastContainer />
        <div className="cont-account-info" style={{marginTop:'40px'}}>
            <div className="cnt-photo">
                <div className="cont-account">
                    {!store.user.file&&(
                        <div className="img-icon" style={{background:store.user.colorProfile}}>
                            <div style={{paddingTop:'10px'}}>
                                <p>{store.user.email[0]}</p>
                            </div>
                        </div>
                    )}
                    {store.user.file&&(
                        <div style={{ width: "100px", height: "100px", borderRadius: "50%", overflow: "hidden" }}>
                            <img
                                src={API_URL + 'images/' + store.user.file}
                                alt="avatar"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>
                    )}
                </div>
                <div className="addphoto" onClick={()=>setOpenModal(true)}>
                    <FiEdit2 style={{paddingTop:'9px', color:'white', fontSize:'12px'}}/>
                </div>
                {openModal&&(
                    <ModalImage show={openModal} onClose={handleCloseModal} classid=''/>
                )}
            </div>
            <div className="welcome-zone">
                <h1 className='welcomeh1'>Добро пожаловать, {store.user.lastname} {store.user.surname} {store.user.name}</h1>
                <div className="btn-cont">
                    <button className='logout-btn' onClick={handleLogout}>Выйти из аккаунта</button>
                </div>
                <div className="btn-cont">
                    <button className='change-pass-btn' onClick={handleChangePassword}>Сменить пароль</button>
                </div>
            </div>
        </div>
    </div>
  )
}
export default observer(AccountInfo)