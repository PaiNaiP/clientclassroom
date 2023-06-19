import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '..'
import { useNavigate, useParams } from 'react-router-dom'
import HeaderHome from '../components/HeaderHome'
import { PacmanLoader } from 'react-spinners'
import { Footer } from '../components/Footer'
import StudentTaskIsForm from '../components/StudentTaskIsForm'
import '../style/Task.scss'
import { RxHamburgerMenu } from 'react-icons/rx'
import Sidebar from '../components/Sidebar'
import logo from '../image/logo.svg'
import { API_URL } from '../http'
import TaskStudentWork from '../components/TaskStudentWork'
import MarksStatistic from '../components/MarksStatistic'

const Task = () => {
    const navigate = useNavigate()
    const {store} = useContext(Context)
    const [instructions, setInstructions] = useState<boolean>(true)
    const [openDrawer, setOpenDrawer] = useState(false)
    const [studentWork, setStudentWork] = useState<boolean>(false)
    const [marks, setMarks] = useState<boolean>(false)
    const id = useParams()
    const [role, setRole] = useState<any>()
    const [course, setCourse] = useState<any>()
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        store.checkAuth().then(()=>{
            if(id.id)
                store.viewTaskOne(id.id, store.user.id).then((data)=>{
                    setRole(data?.data.role)
                    setCourse(data?.data.class)
                    setLoading(false)
                })
        })
    }, [id.id, store])
    
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

    const activeInstructions = () =>{
        setInstructions(true)
        setMarks(false)
        setStudentWork(false)
    }

    const activeMarks = () =>{
        setInstructions(false)
        setMarks(true)
        setStudentWork(false)
    }

    const activeStudentWork = () =>{
        setInstructions(false)
        setMarks(false)
        setStudentWork(true)
    }
  return (
    <>
    {role.name==="student"?(
        <>
        <HeaderHome />
        </>        
    ):(
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
              {instructions&&(
                <p className="header-classroom__center__lenta" style={{color:course.decor, borderBottom:`2px solid ${course.decor}`, 
              paddingBottom:'22px'}}>Инструкции</p>
              )}
              {!instructions&&(
                <p className="header-classroom__center__lenta" onClick={activeInstructions}>Инструкции</p>
              )}
              {studentWork&&(
                <p className="header-classroom__center__users" style={{color:course.decor, borderBottom:`2px solid ${course.decor}`, 
                paddingBottom:'22px'}}>Работы учащихся</p>
              )}
              {!studentWork&&(
                <p className="header-classroom__center__users" onClick={activeStudentWork}>Работы учащихся</p>
              )}
              {marks&&(
                <p className="header-classroom__center__task" style={{color:course.decor, borderBottom:`2px solid ${course.decor}`, 
                paddingBottom:'22px'}}>Оценки</p>
              )}
              {!marks&&(
                <p className="header-classroom__center__task" onClick={activeMarks}>Оценки</p>
              )}
          </div>
          <div className="header-classroom__right" onClick={()=>navigate('/account')}>
              <button className="header-classroom__button header-classroom__button--account">
                  <span className="header-classroom__username">{store.user.email}</span>
              </button>
              <button className="header-classroom__button header-classroom__button--notifications">
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
        </div>
    )}
    {role.name==="student"?(
        <StudentTaskIsForm/>
    ):(
        <>
        {instructions&&(
            <StudentTaskIsForm/>
        )}
        {studentWork&&(
            <TaskStudentWork/>
        )}
        {marks&&(
            <MarksStatistic/>
        )}
        </>
    )}
    <Footer />
    </>
  )
}
export default observer(Task)