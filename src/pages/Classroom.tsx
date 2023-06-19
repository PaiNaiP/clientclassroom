import { observer } from 'mobx-react-lite'
import React, {useContext, useState, useEffect} from 'react'
import logo from '../image/logo.svg'
import { Context } from '..'
import { useNavigate, useParams } from 'react-router-dom'
import { RxHamburgerMenu } from 'react-icons/rx'
import { API_URL } from '../http'
import '../style/Classroom.scss'
import Sidebar from '../components/Sidebar'
import { PacmanLoader } from 'react-spinners'
import ClassroomLenta from '../components/ClassroomLenta'
import { Footer } from '../components/Footer'
import ClassroomTask from '../components/ClassroomTask'
import ClassroomUsers from '../components/ClassroomUsers'

const Classroom = () => {
    const navigate = useNavigate()
    const [openDrawer, setOpenDrawer] = useState(false)
    const [loading, setLoading] = useState<boolean>(true)
    const {store} = useContext(Context)
    const [lenta, setLenta] = useState<boolean>(true)
    const [task, setTask] = useState<boolean>(false)
    const [users, setUsers] = useState<boolean>(false)
    const id = useParams()
    const [course, setCourse] = useState<any>()
    useEffect(() => {
        store.checkAuth().then(()=>{
          if(id.id)
          store.getCourseOne(id.id, store.user.id).then((data)=>{
              setCourse(data?.data.member[0].class)
              setLoading(false)
          })
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

    const activeLenta = () =>{
      setLenta(true)
      setUsers(false)
      setTask(false)
    }

    const activeTask = () =>{
      setTask(true)
      setLenta(false)
      setUsers(false)
    }

    const activeUsers = () =>{
      setUsers(true)
      setLenta(false)
      setTask(false)
    }
  return (
      <div className="classroom">
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
              {lenta&&(
                <p className="header-classroom__center__lenta" style={{color:course.decor, borderBottom:`2px solid ${course.decor}`, 
              paddingBottom:'22px'}}>Лента</p>
              )}
              {!lenta&&(
                <p className="header-classroom__center__lenta" onClick={activeLenta}>Лента</p>
              )}
              {task&&(
                <p className="header-classroom__center__task" style={{color:course.decor, borderBottom:`2px solid ${course.decor}`, 
                paddingBottom:'22px'}}>Задания</p>
              )}
              {!task&&(
                <p className="header-classroom__center__task" onClick={activeTask}>Задания</p>
              )}
              {users&&(
                <p className="header-classroom__center__users" style={{color:course.decor, borderBottom:`2px solid ${course.decor}`, 
                paddingBottom:'22px'}}>Пользователи</p>
              )}
              {!users&&(
                <p className="header-classroom__center__users" onClick={activeUsers}>Пользователи</p>
              )}
          </div>
          <div className="header-classroom__right" onClick={()=>navigate('/account')}>
              <button className="header-classroom__button header-classroom__button--account">
                  <span className="header-classroom__username">{store.user.email}</span>
              </button>
              <button className="header-classroom__button header-classroom__button--notifications"
              >
                      {!store.user.file&&(
                          <div className="img-icon" style={{background:store.user.colorProfile, textAlign:'center'}}>
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
        </div>
        <div className="content">
          {lenta&&(
            <ClassroomLenta/>
          )}
          {task&&(
            <ClassroomTask/>
          )}
          {users&&(
            <ClassroomUsers/>
          )}
        </div>
        <div className="footer">
            <Footer/>
        </div>
      </div>
    )
}
export default observer(Classroom)