import React, {useState, useContext} from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { API_URL } from '../http'
import ModalCreateClass from './ModalCreateClass'
import { Context } from '..'
import { useNavigate } from 'react-router-dom'
import checkFileAvailability from '../middleware/image'

export const CourseCard = (courses:any) => {
    const navigation = useNavigate()
    const {store} = useContext(Context)
    const [checkFile, setCheckFile] = useState<boolean>(false)
    const [checkAva, setCheckAva] = useState<boolean>(false)
    const [openModalClass, setOpenModalClass] = useState(false)
    const handleCloseModal = () => {
        setOpenModalClass(false);
    }

    const handleAddArchive = () =>{
        store.addArchive(courses.courses.id).then((data)=>{
            if(data)
                window.location.reload()
        })
    }
    setTimeout(() => {
        handleCheckImage()
        handleCheckAva()
    }, 1000);

    const handleCheckImage = async() =>{
        const fileUrl = API_URL + 'images/'+courses.courses.cover;
        const isFileAvailable = await checkFileAvailability(fileUrl);
        setCheckFile(isFileAvailable); 
    }

    const handleCheckAva = async() =>{
        const fileUrl = API_URL + 'images/'+courses.courses.user.file;
        const isFileAvailable = await checkFileAvailability(fileUrl);
        setCheckAva(isFileAvailable); 
    }

    const handleDelete = () =>{
        store.deleteCourse(courses.courses.id).then((data)=>{
            if(data)
                window.location.reload()
        })
    }
  return (
    <div className="courser-card">
        <div className="courser-card__header" style={{background:courses.courses.decor, overflow:'hidden', 
        position:'relative'}}>
            {checkFile&&(
                <img src={API_URL + 'images/' + courses.courses.cover} 
                alt="" className='image-cover'/>
            )}
            <div className="courser-card__header__info" 
            style={{zIndex:'0'}} onClick={()=>navigation(`/c/${courses.courses.id}`)}>
                <h1 className="courser-card__header__info__title">{courses.courses.title}</h1>
                <p className="courser-card__header__info__subtitle">{courses.courses.chapter}</p>
            </div>
            {store.user.id===courses.courses.user_id&&(
                <div className="dropdown" style={{position:'absolute', right:'0'}}>
                        <button className='dropdown__button__normal'>
                            <BsThreeDotsVertical style={{color:'white', marginTop:'18px'}}/>
                        </button>
                        <div className="dropdown__content" style={{marginLeft:'-145px'}}>
                        {courses.courses.isArchive?(
                            <>
                            <div className="dropdownline" onClick={handleDelete}>Удалить</div>
                            <div className="dropdownline" onClick={handleAddArchive}>Разрахивировать</div>
                            </>
                        ):(
                            <>
                                <div className="dropdownline" onClick={()=>setOpenModalClass(true)}>Изменить</div>
                                <div className="dropdownline" onClick={handleAddArchive}>Архивировать</div>
                            </>
                        )}
                    </div>
                    {openModalClass&&(
                        <ModalCreateClass show={openModalClass} onClose={handleCloseModal} course={courses.courses}/>
                    )}
                </div>
            )}        
        </div>
        <div className="courser-card__body">
            <p className="courser-card__body__author">
                {courses.courses.user.surname} {courses.courses.user.name} {courses.courses.user.lastname}
            </p>
            <div className="courser-card__body__avatar" style={{overflow: "hidden", 
            background:courses.courses.user.colorProfile, textAlign:'center'}}>
                        {!checkAva?(
                            <p style={{color:'white', fontSize:'24px', marginTop:'15px'}}>{courses.courses.user.email[0].toUpperCase()}</p>
                        ):(
                            <img src={API_URL + 'images/' + courses.courses.user.file} alt="" 
                            style={{width:'60.5px', height:'60.5px', objectFit:'cover'}} />
                        )}
            </div>
        </div>
    </div>
  )
}
