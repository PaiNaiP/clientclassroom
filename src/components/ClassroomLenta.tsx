/* eslint-disable react-hooks/exhaustive-deps */
import { observer } from 'mobx-react-lite'
import React, {useContext, useEffect, useState} from 'react'
import { Context } from '..'
import { useNavigate, useParams } from 'react-router-dom'
import { PropagateLoader } from 'react-spinners'
import { AiFillInfoCircle, AiOutlineInfoCircle } from 'react-icons/ai'
import {BsThreeDotsVertical } from 'react-icons/bs'
import ModalCreateClass from './ModalCreateClass'
import ModalImage from './ModalImage'
import checkFileAvailability from '../middleware/image'
import { API_URL } from '../http'
import { ToastContainer, toast } from 'react-toastify'
import ModalCreateTask from './ModalCreateTask'
import { TaskMap } from './TaskMap'

const ClassroomLenta = () => {
    const {store} = useContext(Context)
    const [course, setCourse] = useState<any>()
    const [task, setTask] = useState<any>()
    const [loading, setLoading] = useState<boolean>(true)
    const [openModal, setOpenModal] = useState(false)
    const [openModalTask, setOpenModalTask] = useState(false)
    const [checkFile, setCheckFile] = useState<boolean>(false)
    const [info, setInfo] = useState<boolean>(false)
    const [role, setRole] = useState<any>()
    const id = useParams()
    const navigation = useNavigate()
    useEffect(() => {
        if(id.id)
        store.getCourseOne(id.id, store.user.id).then((data)=>{
            if(id.id)
                store.viewTasks(id.id).then((tsk:any)=>{
                    setCourse(data?.data.member[0].class)
                    setTask(tsk?.data)
                    setRole(data?.data.member[0].role)
                    setLoading(false)
                })
        }).finally(()=>{
            handleCheckImage()
        })
    }, [])

    setTimeout(() => {
        handleCheckImage()
    }, 1000);
    const [openModalClass, setOpenModalClass] = useState(false)
    const handleCloseClassModal = () => {
        setOpenModalClass(false);
    }

    const handleCheckImage = async() =>{
        const fileUrl = API_URL + 'images/'+course.cover;
        const isFileAvailable = await checkFileAvailability(fileUrl);
        setCheckFile(isFileAvailable); 
    }
    const handleCloseModal = () => {
        setOpenModal(false);
    }

    const handleCloseModalTask = () => {
        setOpenModalTask(false);
    }

    const handleAddArchive = () =>{
        if(id.id)
        store.addArchive(id.id).then((data)=>{
            if(data)
                navigation('/')
        })
    }
    if(loading){
        return(
            <div style={{width:'100%', paddingTop:'10rem', paddingBottom:'20rem'}}>
                <div style={{display:'flex', width:'100%'}}>
                    <div style={{margin:'0 auto', marginTop:'5rem', textAlign:'center'}}>
                        <PropagateLoader color="#335DFF" style={{marginLeft:'-15px'}}/>
                    </div>
                </div>
            </div>
        )
    }

    const handleCopyLink = () =>{
        navigator.clipboard.writeText(`http://localhost:3000/c/${course.id}`);
        toast.success('Ссылка скопирована в буфер обмена', {
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

  return (
    <div className="lenta">
        <div className="lenta__cont">
            <div className="lenta__cont__cover" style={{background: course.decor}}>
                {checkFile&&(
                    <img src={API_URL + 'images/' + course.cover} alt="" className='image-cover'/>
                )}
                <div className="lenta__cont__cover__info">
                <div className="lenta__cont__cover__info__three-dots">
                    {role.name==='teacher'&&(
                    <div className="dropdown">
                            <button className='dropdown__button__normal'>
                                <BsThreeDotsVertical style={{color:'white', marginTop:'18px'}}/>
                            </button>
                            <div className="dropdown__content">
                            <div className="dropdownline" onClick={()=>setOpenModal(true)}>Изменить обложку</div>
                            <div className="dropdownline" onClick={()=>setOpenModalClass(true)}>Изменить информацию</div>
                            <div className="dropdownline" onClick={handleAddArchive}>Архивировать</div>
                        </div>
                        {openModalClass&&(
                            <ModalCreateClass show={openModalClass} onClose={handleCloseClassModal} course={course}/>
                        )}
                        {openModal&&(
                            <ModalImage show={openModal} onClose={handleCloseModal} classid={id.id}/>
                        )}
                    </div>  
                    )}
                </div>
                    {role.name==='teacher'?(
                        <div className="lenta__cont__cover__info__flex">
                            <div className="lenta__cont__cover__info__flex__title">
                                <h1>{course.title}</h1>
                                <p>{course.chapter}</p>
                            </div>
                            {!info&&(
                                <AiFillInfoCircle className='lenta__cont__cover__info__flex__circle'
                                onClick={()=>setInfo(!info)}/>
                            )}
                            {info&&(
                                <AiOutlineInfoCircle className='lenta__cont__cover__info__flex__circle'
                                onClick={()=>setInfo(!info)}/>
                            )}
                        </div>
                    ):(
                        <div className="lenta__cont__cover__info__flex" style={{marginTop:'13rem'}}>
                            <div className="lenta__cont__cover__info__flex__title">
                                <h1>{course.title}</h1>
                                <p>{course.chapter}</p>
                            </div>
                            {!info&&(
                                <AiFillInfoCircle className='lenta__cont__cover__info__flex__circle'
                                onClick={()=>setInfo(!info)}/>
                            )}
                            {info&&(
                                <AiOutlineInfoCircle className='lenta__cont__cover__info__flex__circle'
                                onClick={()=>setInfo(!info)}/>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {info&&(
                <div className="lenta__cont__subinfo" style={{border:`1px solid ${course.decor}`}}>
                    <div className="lenta__cont__subinfo__welcomelink">
                        <h1 style={{color:course.decor}}>Пригласительная ссылка: </h1>
                        <p className='lenta__cont__subinfo__welcomelink__id'>{course.id}</p>
                        <button className='lenta__cont__subinfo__welcomelink__copy'
                        style={{background:course.decor}}
                        onClick={handleCopyLink}>COPY</button>
                        <ToastContainer />
                    </div>
                    <div className="lenta__cont__subinfo__subject">
                        <h1 style={{color:course.decor}}>Предмет: </h1>
                        <p>{course.subject}</p>
                    </div>
                    <div className="lenta__cont__subinfo__chapter">
                        <h1 style={{color:course.decor}}>Раздел: </h1>
                        <p>{course.chapter}</p>
                    </div>
                    <div className="lenta__cont__subinfo__audience">
                        <h1 style={{color:course.decor}}>Аудитория: </h1>
                        <p>{course.audience}</p>
                    </div>
                </div>
            )}
            <div className="lenta__cont__task-content" style={{marginBottom:'15px'}}>
                {role.name==='teacher'&&(
                    <button className="lenta__cont__task-content__btn-add"
                    style={{background:course.decor}} onClick={()=>setOpenModalTask(true)}>
                        <p className='lenta__cont__task-content__btn-add__bs-plus'>+</p> Добавить задание
                    </button>
                )}
                {openModalTask&&(
                    <ModalCreateTask show={openModalTask} onClose={handleCloseModalTask} course_id={id.id} task=''/>
                )}
                <TaskMap task={task} role={role}/>
            </div>
        </div>
    </div>
  )
}
export default observer(ClassroomLenta)