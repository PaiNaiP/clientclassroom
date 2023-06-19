import React, { useRef, useEffect, useState, useContext } from 'react';
import '../style/Modal.scss';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { PropagateLoader } from 'react-spinners';
import { ToastContainer } from 'react-toastify';
import { API_URL } from '../http';
import { BsPlus } from 'react-icons/bs';
import checkFileAvailability from '../middleware/image';
import { RxCross2 } from 'react-icons/rx';

type ModalProps = {
  show: boolean;
  onClose: () => void;
  id:any;
  role:string;
};

const Modal: React.FC<ModalProps> = ({ show, onClose, id, role }) => {
  const {store} = useContext(Context)
  const modalRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState<boolean>(true)
    const [selectedUser, setSelectedUser] = useState<any>([]);
    const [users, setUsers] = useState<any>()
    const [usersOld, setUsersOld] = useState<any>()
    const [searchValue, setSearchValue] = useState('');

    const fetchData = async () => {
        try {
          const data = await store.freeUsers(id);
          if (data?.data) {
            setUsersOld(data?.data);
            const images = await Promise.all(
                data.data.map(async (user: any) => {
                  const fileUrl = API_URL + 'images/' + user.file;
                  const isFileAvailable = await checkFileAvailability(fileUrl);
                  return {
                    images: isFileAvailable,
                    id: user.id,
                  };
                })
              );
              const userData = await Promise.all(
                data.data.map(async(user:any)=>{
                    const check = images.find((file: any) => file.id === user.id)
                    if(check?.images){
                        return {
                            email: user.email,
                            colorProfile: user.colorProfile,
                            file: user.file,
                            id: user.id,
                            lastname: user.lastname,
                            name: user.name,
                            surname: user.surname
                        };                    
                    }
                    else{
                        return {
                            email: user.email,
                            colorProfile: user.colorProfile,
                            file: '',
                            id: user.id,
                            lastname: user.lastname,
                            name: user.name,
                            surname: user.surname
                        };
                    }
                })
                )
                setUsers(userData)
                setLoading(false);
          }
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      };
      
      useEffect(() => {
        if (show) {
          fetchData();
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
    const handleDivClick = (email:string) => {
        // Добавление новых данных в массив
        const newData = [...selectedUser, email];
        setSelectedUser(newData);
    };
    
    const handleClose = () => {
        onClose();
    };

    const handleAdd = () =>{
        store.addUsersToClass(selectedUser, id, role).then((data)=>{
            if(data)
                window.location.reload()
        })
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
    
        const filteredUsers = users.filter((user: { [s: string]: unknown; } | ArrayLike<unknown>) =>
            // eslint-disable-next-line array-callback-return
            Object.values(user).some((field:any) =>
                field.toString().toLowerCase().includes(value.toLowerCase())
            )
        );
        if(value==="")
            setUsers(usersOld)
        else
        setUsers(filteredUsers);
      };
    
    const handleRemoveClick = (email: string) => {
        const updatedArray = selectedUser.filter((item:any) => item !== email);
        setSelectedUser(updatedArray);
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
                    {users.length!==0&&(
                        <>
                        {selectedUser.length<3?(
                            <div className="continput" style={{width:'100%', marginLeft:'-5px'}}>
                                <p>Поиск:</p>
                                <input type="text" 
                                placeholder='&#x1F50E;&#xFE0E;' 
                                className='inputlog' 
                                autoComplete='false'
                                value={searchValue}
                                onChange={handleInputChange}/>
                            </div>
                        ):(
                            <div className="continput" style={{marginLeft:'60px'}}>
                                <p>Поиск:</p>
                                <input type="text" placeholder='&#x1F50E;&#xFE0E;' className='inputlog' autoComplete='false'/>
                            </div>
                        )}
                        </>
                    )}
                    {users.length===0&&(
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
                    {selectedUser.length<3?(
                        <div className="selected-users" style={{marginLeft:'-5px'}}>
                            {selectedUser&&(
                                <>
                                    {selectedUser.map((user:any)=>(
                                        <div className="selected-users__card">
                                            <p>{user}</p>
                                            <RxCross2 style={{marginTop:'10.5px',
                                            fontSize:'12px'}} onClick={()=>handleRemoveClick(user)}/>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    ):(
                        <div className="selected-users" style={{marginLeft:'60px'}}>
                            {selectedUser&&(
                                <>
                                    {selectedUser.map((user:any)=>(
                                        <div className="selected-users__card">
                                            <p>{user}</p>
                                            <RxCross2 style={{marginTop:'10.5px',
                                            fontSize:'12px'}} onClick={()=>handleRemoveClick(user)}/>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    )}
                    <div className="freeusers-cont" style={{marginLeft:'10px'}}>
                        {users&&(
                            <>
                            {users.map((user:any)=>(
                                    <div className="card-users" style={{margin:'0 auto', marginTop:'20px'}}>
                                        <ToastContainer />
                                        <div className="course-card" style={{width:'27rem', margin:'0 auto', marginBottom:'10px'}}>
                                            <div className="course-card__icon">
                                            {user?.file ? (
                                                <img
                                                    src={API_URL + 'images/' + user.file}
                                                    alt=""
                                                    style={{
                                                    width: '49px',
                                                    height: '49px',
                                                    objectFit: 'cover',
                                                    borderRadius: '50%',
                                                    }}
                                                />
                                                ) : (
                                                <div
                                                    style={{
                                                    background: user.colorProfile,
                                                    width: '49px',
                                                    height: '49px',
                                                    borderRadius: '50%',
                                                    textAlign:'center'
                                                    }}
                                                >
                                                    <p
                                                    style={{
                                                        color: 'white',
                                                        marginTop: '7px'
                                                    }}
                                                    >
                                                    {user.email[0].toUpperCase()}
                                                    </p>
                                                </div>
                                                )}
                                            </div>
                                            <div className="course-card__content" style={{width:'90%'}}>
                                                <h2 style={{fontSize:'16px', width:'100%'}} className="course-card__title">{user.surname} {user.name} {user.lastname}</h2>
                                                <p className="course-card__subtitle" style={{color:'black'}}>{user.email}</p>
                                            </div>
                                            {!selectedUser.includes(user.email) ? (
                                            <BsPlus style={{fontSize:'20px'}} onClick={()=>handleDivClick(user.email)} />
                                            ) : null}
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
                <button style={{background:'#9f9da3'}} onClick={handleClose}>Отмена</button>
                <button style={{background:'#335DFF'}} onClick={handleAdd}>Пригласить</button>
            </div>

</div>
        </div>
    </div>
  );
};

export default observer(Modal);