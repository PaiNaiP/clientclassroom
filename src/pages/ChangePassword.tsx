import { observer } from 'mobx-react-lite'
import React, {useContext, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Context } from '..';
import welcome from '../image/welcome.svg'
import {BiHide, BiShow} from 'react-icons/bi'
import '../style/ChangePassword.scss'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ChangePassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword2, setShowPassword2] = useState(false);
    const [password2, setPassword2] = useState('');
    const params = useParams();
    const navigate = useNavigate()
    const {store} = useContext(Context)

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const repeatHandlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword2(event.target.value);
    };

    const reapeatToggleShowPassword = () => {
        setShowPassword2(!showPassword2);
    };

    const handleChangePassword=()=>{
        if(password===password2){
                if(params.id)
                store.changePassword(password, params.id).then((data)=>{
                    if(data)
                        navigate('/signin')
                    if(store.error)
                        // eslint-disable-next-line array-callback-return
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
        else{
            toast.error('Пароли не совпадают', {
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
    }
  return (
    <div className="login-bod">
        <div className="cont-welcome-image">
            <img className='welcome-img' src={welcome} alt="welcomeimg" />
        </div>
        <div className="cont-chng-form">
            <div className="cnt-chgpass">
                <h1>Смена пароля</h1>
                <ToastContainer />
                <div className="continput">
                    <p>Пароль:</p>
                    <div style={{display:'flex'}} className='inputlog'>
                        <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={handlePasswordChange}
                        style={{border:'none', width:'92%'}}
                        placeholder='Пароль'
                        />
                        <button onClick={toggleShowPassword} style={{background:'none', border:'none', fontSize:'20px', marginTop:'5px', color:'#6D6875'}}>
                            {showPassword ? <BiHide/> : <BiShow/>}
                        </button>
                    </div>            
                </div>
                <div className="continput">
                    <p>Повторить пароль:</p>
                    <div style={{display:'flex'}} className='inputlog'>
                        <input
                        type={showPassword2 ? 'text' : 'password'}
                        value={password2}
                        onChange={repeatHandlePasswordChange}
                        style={{border:'none', width:'92%'}}
                        placeholder='Пароль'
                        />
                        <button onClick={reapeatToggleShowPassword} style={{background:'none', border:'none', fontSize:'20px', marginTop:'5px', color:'#6D6875'}}>
                            {showPassword2 ? <BiHide/> : <BiShow/>}
                        </button>
                    </div>            
                </div>
                <div className="btn-cont">
                    <div className="btn-auth">
                        <button onClick={handleChangePassword}>Сменить пароль</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
export default observer(ChangePassword)