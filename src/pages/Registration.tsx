import React, {useState, useContext, useEffect} from 'react'
import welcome from '../image/welcome.svg'
import {BiHide, BiShow} from 'react-icons/bi'
import '../style/Registration.scss'
import {useNavigate} from 'react-router-dom'
import { Context } from '..'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { observer } from 'mobx-react-lite'

const getRandomHexColor = (): string => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const Registration = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword2, setShowPassword2] = useState(false);
    const [password2, setPassword2] = useState('');
    const [surname, setSurname] = useState('')
    const [name, setName] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [color, setColor] = useState<string>(getRandomHexColor());

    const navigate = useNavigate()
    const {store} = useContext(Context)

    useEffect(() => {
        setColor(getRandomHexColor());
    }, [])
    
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

    const handleRegistration=()=>{
        if(password===password2){
            store.registration(surname, name, lastname, email, password, color).then((data)=>{
                if(data){
                    toast.success('Для подтверждения регистрации подтвердите почту', {
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
    <div className="login-bod" style={{overflowY:'hidden'}}>
        <div className="cont-welcome-image">
            <img className='welcome-img' src={welcome} alt="welcomeimg" />
        </div>
        <div className="cont-auth-form">
            <div className="cnt-reg">
                <h1>Регистрация</h1>
                <ToastContainer />
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
                        <button onClick={handleRegistration}>Зарегистрироваться</button>
                    </div>
                    <div className="btn-reg">
                        <button onClick={()=>navigate('/signin')}>Авторизоваться</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
export default observer(Registration)