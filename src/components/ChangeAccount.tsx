import { observer } from 'mobx-react-lite'
import React, {useContext, useState, useEffect} from 'react'
import { Context } from '..'
import { FiEdit2 } from 'react-icons/fi'
import { API_URL } from '../http'
import ModalImage from './ModalImage'
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const ChangeAccount = () => {
    const {store} = useContext(Context)
    const navigation = useNavigate()
    const [surname, setSurname] = useState('')
    const [name, setName] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [emailNow, setEmailNow] = useState('')
    const [openModal, setOpenModal] = useState(false)
    useEffect(() => {
        setSurname(store.user.surname)
        setName(store.user.name)
        setLastname(store.user.lastname)
        setEmail(store.user.email)
        setEmailNow(store.user.email)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    const handleCloseModal = () => {
        setOpenModal(false);
    }

    const handleChangeInfo=async()=>{
        store.editProfile(store.user.id, email, surname, name, lastname).then((data)=>{
            if(data){
                if(email!==emailNow){
                    store.logout().then(()=>navigation('/signin'))
                }
                else{
                    window.location.reload()
                }
            }
            if(store.error){
                toast.error(store.error, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        })
    }

  return (
    <div className="change-account-info">
        <div className="change-acc-cont" style={{marginTop:'60px'}}>
            <div className="edit-photo">
            <ToastContainer />
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
                <div className="addphoto" onClick={()=>setOpenModal(true)}>
                    <FiEdit2 style={{paddingTop:'9px', color:'white', fontSize:'12px'}}/>
                </div>
                {openModal&&(
                    <ModalImage show={openModal} onClose={handleCloseModal} classid=''/>
                )}
            </div>
                <div className="continput">
                    <p>Фамилия:</p>
                    <input type="text" placeholder='Фамилия' className='inputlog' autoComplete='false'
                    onChange={(e)=>setSurname(e.target.value)} value={surname}/>
                </div>
                <div className="continput">
                    <p>Имя:</p>
                    <input type="text" placeholder='Имя' className='inputlog' autoComplete='false'
                    onChange={(e)=>{setName(e.target.value)}} value={name}/>
                </div>
                <div className="continput">
                    <p>Отчество:</p>
                    <input type="text" placeholder='Отчество' className='inputlog' autoComplete='false'
                    onChange={(e)=>{setLastname(e.target.value)}} value={lastname}/>
                </div>
                <div className="continput">
                    <p>Адрес электронной почты:</p>
                    <input type="email" placeholder='Email' className='inputlog' autoComplete='false'
                    onChange={(e)=>{setEmail(e.target.value)}} value={email}/>
                </div>
                <div className="btn-cnt">
                    <div className="btn">
                        <button onClick={handleChangeInfo}>Изменить</button>
                    </div>
                </div>
        </div>
    </div>
  )
}
export default observer(ChangeAccount)