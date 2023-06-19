/* eslint-disable jsx-a11y/alt-text */
import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { PacmanLoader } from 'react-spinners'
import { Context } from '..'
import { RxHamburgerMenu } from 'react-icons/rx'
import logo from '../image/logo.svg'
import '../style/Account.scss'
import AccountInfo from '../components/AccountInfo'
import { Footer } from '../components/Footer'
import ChangeAccount from '../components/ChangeAccount'
import { API_URL } from '../http'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
const Account = () => {
    const [loading, setLoading] = useState<boolean>(true)
    const [changeAccount, setChangeAccount] = useState<boolean>(false)
    const {store} = useContext(Context)
    const navigation = useNavigate()
    const [openDrawer, setOpenDrawer] = useState(false)

    useEffect(() => {
        store.checkAuth().then(()=>{
            setLoading(false)
        })
    })
    if(loading){
        return(
            <div style={{display:'flex'}}>
                <div style={{margin:'0 auto', marginTop:'22%'}}>
                    <PacmanLoader color="#335DFF" />
                </div>
            </div>
        )
    }
    const handleCloseDrawer = () => {
        setOpenDrawer(false);
    }
  return (
    <div className='account'>
        <div className="header-class">
        <header className="header-classroom">
          <div className="header-classroom__left">
              <RxHamburgerMenu className='hamburmenu' onClick={()=>setOpenDrawer(true)}/>
              {openDrawer&&(
                      <Sidebar isOpen={openDrawer} onClose={handleCloseDrawer}/>
              )}
              <button className="header-classroom__menu-btn">
                  <i className="fas fa-bars"></i>
              </button>
              <h1 className="header-classroom__title">
                  <img src={logo} alt="" style={{width:'90%'}}/>
              </h1>
          </div>
          <div className="header-classroom__center" style={{marginTop:'22px', color:'black'}}>
              {!changeAccount&&(
                <p className="header-classroom__center__lenta" style={{color:'#335DFF', borderBottom:`2px solid #335DFF`, 
              paddingBottom:'22px'}}>Главная</p>
              )}
              {changeAccount&&(
                <p className="header-classroom__center__lenta" onClick={()=>setChangeAccount(false)}>Главная</p>
              )}
              {changeAccount&&(
                <p className="header-classroom__center__task" style={{color:'#335DFF', borderBottom:`2px solid #335DFF`, 
                paddingBottom:'22px'}}>Личная информация</p>
              )}
              {!changeAccount&&(
                <p className="header-classroom__center__task" onClick={()=>setChangeAccount(true)}>Личная информация</p>
              )}
          </div>
          <div className="header-classroom__right" onClick={()=>navigation('/account')}>
              <button className="header-classroom__button header-classroom__button--account">
                  <span className="header-classroom__username">{store.user.email}</span>
              </button>
              <button className="header-classroom__button header-classroom__button--notifications"
              >
                      {!store.user.file&&(
                          <div className="img-iconAccount" style={{background:store.user.colorProfile, textAlign:'center', marginTop:'-15px'}}>
                              <div className='imgAccountImage'>
                                  <p style={{paddingTop:'15px'}}>{store.user.email[0].toUpperCase()}</p>
                              </div>
                          </div>
                      )}
                      {store.user.file&&(
                          <div style={{ width: "60px", height: "60px", borderRadius: "50%", overflow: "hidden" }}>
                              <img
                                  src={API_URL + 'images/' + store.user.file}
                                  alt="avatar"
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                          </div>                
                      )}
              </button>
              </div>
          </header>  
        </div>
        {!changeAccount&&(
            <AccountInfo />
        )}
        {changeAccount&&(
            <ChangeAccount/>
        )}
            <Footer/>
    </div>
  )
}
export default observer(Account)