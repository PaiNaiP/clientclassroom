import React from 'react'
import logo from '../image/logo.svg'
import { useNavigate } from 'react-router-dom'

export const HeaderHomeNoneAuth = () => {
    const navigate = useNavigate()

  return (
    <header className="header">
      <div className="header__left">
        <button className="header__menu-btn">
          <i className="fas fa-bars"></i>
        </button>
        <h1 className="header__title">
            <img src={logo} alt="" style={{width:'90%'}}/>
        </h1>
      </div>
      <div className="header__right">
        <button className="header__button header__button--notifications">
          <i className="fas fa-bell"></i>
        </button>
        <button className="header__button header__button--account">
          <i className="fas fa-user-circle"></i>
          <span onClick={()=>navigate('/signin')}>Авторизоваться</span>
        </button>
      </div>
    </header>
  )
}
