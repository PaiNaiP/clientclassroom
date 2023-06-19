import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { PropagateLoader } from 'react-spinners'
import { Context } from '..'
import { useParams } from 'react-router-dom'
import { API_URL } from '../http'
import checkFileAvailability from '../middleware/image'
import { BiSend } from 'react-icons/bi'
import { io, Socket } from 'socket.io-client';

const socket: Socket = io(API_URL);

const MailComponent = () => {
    const [loading, setLoading] = useState<boolean>(true)
    const [loadingMessage, setLoadingMessage] = useState<boolean>(false)
    const {store} = useContext(Context)
    const id = useParams()
    const [users, setUsers] = useState<any>()
    const [decor, setDecor] = useState<any>()
    const [message, setMessage] = useState<any>()
    const [checkFile, setCheckFile] = useState<boolean>(false)
    const [complementaryMessageText, setComplementaryMessageText] = useState<string>()
    const [complementary, setComplementary] = useState<string>()

    const handleEvent1 = (data: any) => {
        // Обработка события 'event1'
        console.log('Received event1:', data);
    };
    
    const handleEvent2 = (data: any) => {
        // Обработка события 'event2'
        console.log('Received event2:', data);
    };
    const emitEventComplementary = () => {
        // Отправка события 'myEvent' на сервер
        socket.emit('addComplementary', { user_id: store.user.id, text:complementaryMessageText, id:complementary });
    
        // Пример получения события "пользователь добавлен"
        socket.on('complementaryAdded', (user) => {
            setMessage(user)
            console.log('Complementary added:', user);
        });    
    
        setComplementaryMessageText('')
        if(complementary)
        store.getAllMessageComplementary(complementary).then((messageComp)=>{
            setMessage(messageComp?.data)
        })
    };
    socket.on('messageCompReceived', (message) => {
        console.log('New message:', message);
        setMessage(message)
    });

    const handleCheckImage = async() =>{
        const fileUrl = API_URL + 'images/'+store.user.file;
        const isFileAvailable = await checkFileAvailability(fileUrl);
        setCheckFile(isFileAvailable); 
    }

    useEffect(() => {
        handleCheckImage()
        if(id.id)
        store.getAllUserMessage(id.id).then((data)=>{
            if(id.id)
            store.getDecor(id.id).then((decorData)=>{
                setDecor(decorData?.data.class.decor)
                setUsers(data?.data)
                setLoading(false)
            })
        })
        socket.on('event1', handleEvent1);
        socket.on('event2', handleEvent2);

        // Отписка от обработчиков событий при размонтировании компонента
        return () => {
        socket.off('event1', handleEvent1);
        socket.off('event2', handleEvent2);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id.id, store])
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

    const handleAddMessage = (user_id:string) =>{
        setLoadingMessage(true)
        if(id.id)
        store.getUserMessage(user_id, id.id).then((data)=>{
            setMessage(data?.data)
            setComplementary(data?.data[0].complementary_id)
            setLoadingMessage(false)
        })
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            if(complementary)
            socket.emit('addComplementary', { user_id: store.user.id, text:complementaryMessageText, id:complementary });
        
            // Пример получения события "пользователь добавлен"
            socket.on('complementaryAdded', (user) => {
                setMessage(user)
                console.log('Complementary added:', user);
            });    
            setComplementaryMessageText('')
            if(complementary)
            store.getAllMessageComplementary(complementary).then((messageComp)=>{
                setMessage(messageComp?.data)
            })
        }
    };

  return (
    <div className="mail-body">
        <div className="mail-body__body">
            <div className="mail-body__body__left__users">
                {users&&(
                    <div className="mail-body__body__left__users__info">
                        {users.map((user:any)=>(
                            <div className="mail-body__body__left__users__info__card"
                            onClick={()=>handleAddMessage(user.member.user.id)}>
                                <div className="mail-body__body__left__users__info__card__image"
                                style={{background:user.member.user.colorProfile}}>
                                    {user.member.user.file?(
                                        <img src={API_URL + 'images/'+user.member.user.file} 
                                        style={{objectFit:'cover', width:'41px', height:'100%'}}alt="" />
                                    ):(
                                    <div>
                                        <p style={{marginTop:'9px'}}>{user.member.user.email[0].toUpperCase()}</p>
                                    </div>
                                    )}
                                </div>
                                <div className="mail-body__body__left__users__info__card__info">
                                    <p className="mail-body__body__left__users__info__card__info__fio">
                                        {user.member.user.surname} {user.member.user.name} {user.member.user.lastname}
                                    </p>
                                    <p className="mail-body__body__left__users__info__card__info__mail">
                                        {user.member.user.email}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="mail-body__body__right">
                <div className="mail-body__body__right__info">
                    {loadingMessage?(
                        <div style={{margin:'0 auto', marginTop:'15rem'}}>
                            <div className="custom-loader"></div>
                        </div>
                    ):(
                        <div>
                            {message&&(
                                <div className="mail-body__body__right__info__message">
                                    {message.map((mes:any)=>(
                                        <>
                                        {mes.member.user.id===store.user.id?(
                                            <div className="mail-body__body__right__info__message__card"
                                            style={{background:decor, color:'white'}}>
                                                <div className="mail-body__body__right__info__message__card__image"
                                                style={{background:mes.member.user.colorProfile}}>
                                                    {mes.member.user.file?(
                                                        <img src={API_URL + 'images/'+mes.member.user.file} 
                                                            style={{objectFit:'cover', width:'41px', height:'100%'}}alt="" />
                                                        ):(
                                                        <div>
                                                            <p style={{marginTop:'9px'}}>{mes.member.user.email[0].toUpperCase()}</p>
                                                        </div>
                                                        )}
                                                </div>
                                                <div className="mail-body__body__right__info__message__card__info">
                                                    <p className="mail-body__body__right__info__message__card__info__fio">
                                                        {mes.member.user.surname} {mes.member.user.name} {mes.member.user.lastname}
                                                    </p>
                                                    <p className="mail-body__body__right__info__message__card__info__email">
                                                        {mes.member.user.email}
                                                    </p>
                                                    <p>{mes.text}</p>
                                                </div>
                                            </div>
                                        ):(
                                            <div className="mail-body__body__right__info__message__card">
                                                <div className="mail-body__body__right__info__message__card__image"
                                                style={{background:mes.member.user.colorProfile, color:"white"}}>
                                                    {mes.member.user.file?(
                                                        <img src={API_URL + 'images/'+mes.member.user.file} 
                                                            style={{objectFit:'cover', width:'41px', height:'100%'}}alt="" />
                                                        ):(
                                                        <div>
                                                            <p style={{marginTop:'9px'}}>{mes.member.user.email[0].toUpperCase()}</p>
                                                        </div>
                                                        )}
                                                </div>
                                                <div className="mail-body__body__right__info__message__card__info">
                                                    <p className="mail-body__body__right__info__message__card__info__fio">
                                                        {mes.member.user.surname} {mes.member.user.name} {mes.member.user.lastname}
                                                    </p>
                                                    <p className="mail-body__body__right__info__message__card__info__email">
                                                        {mes.member.user.email}
                                                    </p>
                                                    <p>{mes.text}</p>
                                                </div>
                                            </div>
                                        )}
                                        </>
                                    ))}
                                </div>
                            )}
                            {complementary&&(
                                <div className="input-message-comp">
                                    <div className="mail-body__body__right__info__message-input" style={{marginLeft:'40px', marginTop:'20px'}}>
                                    <div className="task-body__body__left__comment-input">
                                        <div className="task-body__body__left__comment-input__image-cont"
                                        style={{background:store.user.colorProfile, width:'40px', height:'40px'}}>
                                            {checkFile?(
                                                <img src={API_URL + 'images/'+store.user.file} 
                                                style={{objectFit:'cover', width:'41px', height:'100%'}}alt="" />
                                            ):(
                                                <div>
                                                    <p style={{marginTop:'8px'}}>{store.user.email[0].toUpperCase()}</p>
                                                </div>
                                            )}
                                        </div>
                                        <input type="text" 
                                        placeholder='Добавить комментарий' 
                                        style={{border:`1px solid ${decor}`, width:'75%'}} 
                                        onChange={(e)=>setComplementaryMessageText(e.target.value)}
                                        value={complementaryMessageText}
                                        onKeyPress={handleKeyPress}/>
                                        <BiSend style={{color:decor, fontSize:'28px', marginTop:'5px'}} onClick={emitEventComplementary}/>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  )
}
export default observer(MailComponent)