import { observer } from 'mobx-react-lite'
import React, { useContext, useState } from 'react'
import { BsFillFileTextFill } from 'react-icons/bs'
import { RxCross2 } from 'react-icons/rx'
import { API_URL } from '../http'
import { Context } from '..'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const FilesCard = (files:any) => {
    const {store} = useContext(Context)
    const [loading, setLoading] = useState<boolean>(false)
    const handleDelete = ()=>{
        setLoading(true)
        store.deleteFile(files.files[0].id, files.id).then((data)=>{
            if(data){
                files.onUpdate(data.data)
                setLoading(false)
            }
        })
    }
  return (
    <>
    {loading?(
        <Skeleton style={{height:'60px', marginBottom:'10px'}}/>
    ):(
    <div className='task-body__body__right__file__file' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding:'10px' }}>
            <div>
                <BsFillFileTextFill style={{ fontSize: '24px' }} />
            </div>
            <a href={`${API_URL}files/${files.files[0].id}`}>{files.files[0].name}</a>
            <div style={{paddingTop:'5px'}} className='task-body__body__right__file__delete'>
                <RxCross2 style={{ fontSize: '20px' }} onClick={handleDelete}/>
            </div>
        </div>
    </div>
    )}
    </>
  )
}
export default observer(FilesCard)