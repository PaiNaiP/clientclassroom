import React, {useState, useContext} from 'react'
import welcome from '../image/welcome.svg'
import '../style/ResetPassword.scss'
import { Context } from '..'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { observer } from 'mobx-react-lite';
const ResetPassword = () => {
    const [email, setEmail] = useState('')
    const {store} = useContext(Context)

    const handleResetPassword = ()=>{
        store.resetPassword(email).then((data)=>{
            if(data)
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
            if(store.error)
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
        })
    }
  return (
    <div className="login-bod">
        <div className="cont-welcome-image">
            <img className='welcome-img' src={welcome} alt="welcomeimg" />
        </div>
        <div className="cont-resetpass-form">
            <div className="cnt-aut">
                <h1>Сброс пароля</h1>
                <ToastContainer />
                <div className="continput">
                    <p>Адрес электронной почты:</p>
                    <input type="email" placeholder='Email' className='inputlog' autoComplete='false'
                    value={email} onChange={(e)=>setEmail(e.target.value)}/>
                </div>
                <div className="btn-cont">
                    <div className="btn-auth">
                        <button onClick={handleResetPassword}>Сбросить пароль</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
export default observer(ResetPassword)