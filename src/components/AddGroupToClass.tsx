import React, { useRef, useEffect, useState, useContext } from 'react';
import '../style/Modal.scss';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { PropagateLoader } from 'react-spinners';
import { ToastContainer } from 'react-toastify';
import { BsPlus } from 'react-icons/bs';
import { useParams } from 'react-router-dom';

type ModalProps = {
  show: boolean;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ show, onClose}) => {
  const {store} = useContext(Context)
  const id = useParams()
  const modalRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState<boolean>(true)
    const [group, setGroup] = useState<any>()
    const [groupOld, setGroupOld] = useState<any>()
    const [searchValue, setSearchValue] = useState('');

      useEffect(() => {
        if (show) {
            store.getAllGroup(store.user.id).then((data)=>{
                if(data){
                    setGroup(data?.data)
                    setGroupOld(data?.data)
                }
                setLoading(false)
            })
            const handleOutsideClick = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
            document.addEventListener('mousedown', handleOutsideClick);
            return () => {
                document.removeEventListener('mousedown', handleOutsideClick);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
    const handleClose = () => {
        onClose();
    };

    const handleAdd = (group:string) =>{
        if(id.id)
        store.addGroupToClass(group, id.id).then((data)=>{
            if(data)
                window.location.reload()
        })
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
    
        const filteredUsers = group.filter((user: { [s: string]: unknown; } | ArrayLike<unknown>) =>
            // eslint-disable-next-line array-callback-return
            Object.values(user).some((field:any) =>
                field.toString().toLowerCase().includes(value.toLowerCase())
            )
        );
        if(value==="")
            setGroup(groupOld)
        else
        setGroup(filteredUsers);
    };

    return (
    <div className='group-modal'>
        <div className="modal-backdrop">
            <div className="modal" ref={modalRef} style={{height:'470px', color:'black'}}>
            <div className="modal-header" style={{marginTop:'0px'}}>
                <h1 style={{fontSize:'28px', width:'12rem', marginTop:'-10px'}}>Участники</h1>
                <button className="modal-close" onClick={handleClose} style={{marginTop:'0.8rem'}}>
                    &times;
                </button>
            </div>
            <div className="modal-body">
                {loading?(
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <PropagateLoader color="#335DFF" />
                    </div>
                ):(
                    <div className="modal-body-cont" style={{margin:'0 auto', height:'19rem'}}>
                    <div>
                    {group.length!==0&&(
                        <div className="continput" style={{width:'100%', marginLeft:'-5px'}}>
                            <p>Поиск:</p>
                            <input type="text" 
                            placeholder='&#x1F50E;&#xFE0E;' 
                            className='inputlog' 
                            autoComplete='false'
                            value={searchValue}
                            onChange={handleInputChange}/>
                        </div>
                    )}
                    {group.length===0&&(
                        <div className="continput" style={{width:'30rem', marginLeft:'-5px'}}>
                            <p>Поиск:</p>
                            <input type="text" 
                            placeholder='&#x1F50E;&#xFE0E;' 
                            className='inputlog' 
                            autoComplete='false'
                            value={searchValue}
                            onChange={handleInputChange}/>
                        </div>
                    )}
                    <div className="freeusers-cont" style={{marginLeft:'10px'}}>
                        {group&&(
                            <>
                            {group.map((user:any)=>(
                                    <div className="card-users" style={{margin:'0 auto', marginTop:'20px'}}>
                                        <ToastContainer />
                                        <div className="course-card" style={{width:'27rem', margin:'0 auto', marginBottom:'10px'}}>
                                            <div className="course-card__content" style={{width:'97%'}}>
                                                <h2 style={{fontSize:'16px', width:'100%'}} className="course-card__title">{user.title}</h2>
                                            </div>
                                            <BsPlus onClick={()=>handleAdd(user.id)}/>
                                        </div>
                                    </div>
                            ))}
                            </>
                        )}
                    </div>
                    </div>
                </div>
                )}
            </div>
            <div className="button-cont">
                <button style={{background:'#9f9da3', marginLeft:'8rem'}} onClick={handleClose}>Отмена</button>
            </div>

        </div>
        </div>
    </div>
  );
};

export default observer(Modal);