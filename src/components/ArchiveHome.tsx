/* eslint-disable react-hooks/exhaustive-deps */
import { observer } from 'mobx-react-lite'
import React, {useState, useEffect, useContext} from 'react'
import { Context } from '..'
import '../style/Dropdown.scss'
import { PropagateLoader } from 'react-spinners'
import { CourseMap } from './CourseMap'
import { AuthError } from './AuthError'
const ArchiveHome = () => {
    const {store} = useContext(Context)
    const [courseInfo, setCourseInfo] = useState<any>()
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        store.checkAuth().then(()=>{
            store.getAllClassArchive(store.user.id).then((data)=>{
                    setCourseInfo(data?.data)
                    setLoading(false)
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
  return (
    <div className="main">
        <div className="main__content-home">
            <div className="main__content-home__cont" style={{display:'flex'}}>
            </div>
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
            {courseInfo.length===0 &&(
                <AuthError/>
            )}
        </div>
    </div>
  )
}
export default observer(ArchiveHome)