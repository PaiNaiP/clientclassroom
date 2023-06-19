/* eslint-disable react-hooks/exhaustive-deps */
import { observer } from 'mobx-react-lite'
import React, {useState, useEffect, useContext} from 'react'
import { Context } from '..'
import { BsPlus } from 'react-icons/bs'
import ModalCreateClass from './ModalCreateClass'
import '../style/Dropdown.scss'
import { PropagateLoader } from 'react-spinners'
import ModalCreateGroup from './ModalCreateGroup'
import { GroupsMap } from './GroupsMap'
import { CourseMap } from './CourseMap'
import { AuthError } from './AuthError'
const MainHomeIsAuth = () => {
    const {store} = useContext(Context)
    const [openModalClass, setOpenModalClass] = useState(false)
    const [openModalGroup, setOpenModalGroup] = useState(false)
    const [courseInfo, setCourseInfo] = useState<any>()
    const [group, setGroup] = useState<any>()
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        store.checkAuth().then(()=>{
            store.getAllClass(store.user.id).then((data)=>{
                store.getAllGroup(store.user.id).then((dataGroup)=>{
                    setCourseInfo(data?.data)
                    setGroup(dataGroup?.data)
                    setLoading(false)
                })
            })
        })
    }, [])

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
    const handleCloseModal = () => {
        setOpenModalClass(false);
    }

    const handleCloseModalGroup = () => {
        setOpenModalGroup(false);
    }
  return (
    <div className="main">
        <div className="main__content-home">
            <div className="main__content-home__cont" style={{display:'flex'}}>
                <div className="dropdown">
                    <button className="dropbtn">
                        <BsPlus/>
                    </button>
                    <div className="dropdown-content">
                        <div className="dropdownline" onClick={()=>setOpenModalClass(true)}>Создать курс</div>
                        <div className="dropdownline" onClick={()=>setOpenModalGroup(true)}>Создать группу</div>
                    </div>
                    {openModalClass&&(
                        <ModalCreateClass show={openModalClass} onClose={handleCloseModal} course=''/>
                    )}
                    {openModalGroup&&(
                        <ModalCreateGroup show={openModalGroup} onClose={handleCloseModalGroup} titleGroup='' idGroup=''/>
                    )}
                </div>
            </div>
            {group&&(
            <div className="courses" style={{display:'flex', margin:'0 auto'}}>
                <div className="courses-div" style={{margin: '0 auto'}}>
                    <GroupsMap groups={group} />
                </div>
            </div>
            )}
            <div style={{margin:'0 auto', display:'flex', width:'100%'}}>
                <div style={{margin:'0 auto', width:'100%'}} className='courseCont'>
                {courseInfo&&(
                <div className="course" style={{margin:'0 auto'}}>
                    <div className="course__cont" style={{margin:'0 auto'}}>
                        <CourseMap courses={courseInfo} />
                    </div>
                </div>
                )}
                </div>
            </div>
            {courseInfo.length===0 && group.length===0&&(
                <AuthError/>
            )}
        </div>
    </div>
  )
}
export default observer(MainHomeIsAuth)