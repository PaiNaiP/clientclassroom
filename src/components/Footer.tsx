import React from 'react'
import logo from '../image/logo.svg'
import {FaTelegramPlane, FaGithubAlt} from 'react-icons/fa'
import {IoMail} from 'react-icons/io5'
import '../style/Footer.scss'
export const Footer = () => {
  return (
    <div className='footer'>
        <div className="footer-cont">
            <div className="left-cont-footer" style={{width:'100%'}}>
                <p>Обучение с <img src={logo} alt="logo" className='logo-image-footer'/> становится более интересным и увлекательным, а также более <br/>
                эффективным и доступным для всех ;)
                </p>
            </div>
            <div className="right-cont-footer" style={{width:'10%'}}>
                <div className="icons-cont-footer" style={{width:'10rem'}}>
                    <a href="https://t.me/rbwitch">
                        <FaTelegramPlane style={{marginLeft:'1px'}}/>
                    </a>
                    <a href="https://github.com/PaiNaiP">
                        <FaGithubAlt style={{marginLeft:'1rem'}}/>
                    </a>
                    <a href="mailto:isip_e.i.batygina@mpt.ru">
                        <IoMail style={{marginLeft:'1.2rem'}}/>
                    </a>
                </div>
                <p style={{marginTop:'-10px'}}>©EasyAssign2023</p>
            </div>
        </div>
    </div>
  )
}
