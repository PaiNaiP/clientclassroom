import React, {useState, useContext} from 'react'
import welcome from '../image/welcome.svg'
import '../style/Login.scss'
import {BiShow, BiHide} from 'react-icons/bi'
import {useNavigate} from 'react-router-dom'
import { Context } from '..'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { observer } from 'mobx-react-lite';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('')
    const navigation = useNavigate()
    const {store} = useContext(Context)

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = () =>{
        store.login(email, password).then((data)=>{
            if(data)
                navigation('/')
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
            else if(!store.user.isActived){
                toast.error('Аккаунт не подтвержден', {
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
    <div className="login-bod">
        <div className="cont-welcome-image">
            <img className='welcome-img' src={welcome} alt="welcomeimg" />
        </div>
        <div className="cont-auth-form">
            <div className="cnt-aut">
                <h1>Авторизация</h1>
                <ToastContainer />
                <div className="continput">
                    <p>Адрес электронной почты:</p>
                    <input type="email" placeholder='Email' className='inputlog' autoComplete='false'
                    onChange={(e)=>setEmail(e.target.value)} value={email}/>
                </div>
                <div className="continput">
                    <p>Пароль:</p>
                    <div style={{display:'flex'}} className='inputlog'>
                        <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={handlePasswordChange}
                        style={{border:'none', width:'92%'}}
                        />
                        <button onClick={toggleShowPassword} style={{background:'none', border:'none', fontSize:'20px', marginTop:'5px', color:'#6D6875'}}>
                            {showPassword ? <BiHide/> : <BiShow/>}
                        </button>
                    </div>            
                </div>
                <div className="change-password">
                    <p>Забыли пароль?</p>
                    <a href="/resetpassword">Вспомнить</a>
                </div>
                <div className="btn-cont">
                    <div className="btn-auth">
                        <button onClick={handleLogin}>Авторизоваться</button>
                    </div>
                    <div className="btn-reg">
                        <button onClick={()=>navigation('/signup')}>Зарегистрироваться</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
export default observer(Login)