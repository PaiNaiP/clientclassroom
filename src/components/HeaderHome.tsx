import { observer } from 'mobx-react-lite'
import React, {useContext, useState} from 'react'
import logo from '../image/logo.svg'
import { Context } from '..'
import {RxHamburgerMenu} from 'react-icons/rx'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../http'
import Sidebar from './Sidebar'
export const HeaderHome = () => {
    const {store} = useContext(Context)
    const navigate = useNavigate()
    const [openDrawer, setOpenDrawer] = useState(false)

    const handleCloseDrawer = () => {
        setOpenDrawer(false);
    }
  return (
    <header className="header">
      <div className="header__left">
        <RxHamburgerMenu className='hamburmenu' onClick={()=>setOpenDrawer(true)}/>
        {openDrawer&&(
            <Sidebar isOpen={openDrawer} onClose={handleCloseDrawer}/>
        )}
        <button className="header__menu-btn">
          <i className="fas fa-bars"></i>
        </button>
        <h1 className="header__title">
            <img src={logo} alt="" style={{width:'90%'}}/>
        </h1>
      </div>
      <div className="header__right" onClick={()=>navigate('/account')}>
        <button className="header__button header__button--account">
          <span className="header__username">{store.user.email}</span>
        </button>
        <button className="header__button header__button--notifications">
                {!store.user.file&&(
                    <div className="img-icon" style={{background:store.user.colorProfile}}>
                        <div style={{paddingTop:'3px'}}>
                            <p>{store.user.email[0]}</p>
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
  )
}
export default observer(HeaderHome)