import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineFileText } from 'react-icons/ai'
import { Context } from '..'
import { useParams } from 'react-router-dom'
import { PropagateLoader } from 'react-spinners'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { decode } from 'html-entities';
import { API_URL } from '../http'
import checkFileAvailability from '../middleware/image'
import { BiSend } from 'react-icons/bi'
import { BsFillFileTextFill, BsPlus, BsThreeDotsVertical } from 'react-icons/bs'
import hexToRgb from '../middleware/colorToRGBA'
import ModalFileComplementary from './ModalFileComplementary'
import { FilesMap } from './FilesMap'
import ModalCreateTask from './ModalCreateTask'
import ModalAddToTheme from './ModalAddToTheme'
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:5000');

const StudentTaskIsForm = () => {
    const [openModalFile, setOpenModalFile] = useState(false)
    const {store} = useContext(Context)
    const id = useParams()
    const [isHovered, setIsHovered] = useState(false);
    const [course, setCourse] = useState<any>()
    const [task, setTask] = useState<any>()
    const [role, setRole] = useState<any>()
    const [loading, setLoading] = useState<boolean>(true)
    const [checkFile, setCheckFile] = useState<boolean>(false)
    const [complementary, setComplementary] = useState<any>()
    const [complementaryMessage, setComplementaryMessage] = useState<any>()
    const [taskMessage, setTaskMessage] = useState<any>()
    const [dateNow, setDateNow] = useState<any>()
    const [openModalTask, setOpenModalTask] = useState(false)
    const [openModalTheme, setOpenModalTheme] = useState(false)
    const [complementaryMessageText, setComplementaryMessageText] = useState<string>()
    const [taskMessageText, setTaskMessageText] = useState<string>()

    const handleEvent1 = (data: any) => {
      // Обработка события 'event1'
      console.log('Received event1:', data);
    };
  
    const handleEvent2 = (data: any) => {
      // Обработка события 'event2'
      console.log('Received event2:', data);
    };
  
    async function emitEventTask(){
      // Отправка события 'myEvent' на сервер
      socket.emit('addTask', { user_id: store.user.id, text:taskMessageText, id:task.id });     // Пример получения события "пользователь добавлен"
      socket.on('taskAdded', (user) => {
        setTaskMessage(user)
        console.log('Task added:', user);
      });    
      setTaskMessageText('')
    };
    socket.on('messageReceived', (message) => {
      console.log('New message:', message);
      setTaskMessage(message)
    });

    const emitEventComplementary = () => {
      // Отправка события 'myEvent' на сервер
      socket.emit('addComplementary', { user_id: store.user.id, text:complementaryMessageText, id:complementary.id });

      // Пример получения события "пользователь добавлен"
      socket.on('complementaryAdded', (user) => {
        setComplementaryMessage(user)
        console.log('Complementary added:', user);
      });    

      setComplementaryMessageText('')
      store.getAllMessageComplementary(complementary.id).then((messageComp)=>{
        setComplementaryMessage(messageComp?.data)
      })
    };
    socket.on('messageCompReceived', (message) => {
      console.log('New message:', message);
      setComplementaryMessage(message)
    });

    useEffect(() => {
        if(id.id)
        store.viewTaskOne(id.id, store.user.id).then((data)=>{
          setRole(data?.data.role.name)
          if(id.id)
            store.getAllMessageTask(store.user.id, id.id).then((taskComm)=>{
              setTaskMessage(taskComm?.data)
              if(data?.data.role.name==='student'){
                if(id.id)
                store.viewComplementaryOne(id.id, store.user.id).then((compData)=>{
                  if(compData?.data.id)
                  store.getAllMessageComplementary(compData?.data.id).then((messageComp)=>{
                    setComplementaryMessage(messageComp?.data)
                    setComplementary(compData?.data)
                    setCourse(data?.data.class)
                    setTask(data?.data.class.task[0])
                    handleCheckImage()
                    const currentDate = new Date(Date.now());
                    setDateNow(currentDate.toISOString())
                    setLoading(false)
                  })
                })
              }else{
                  setCourse(data?.data.class)
                  setTask(data?.data.class.task[0])
                  handleCheckImage()
                  setLoading(false)
              }
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
    const handleCheckImage = async() =>{
      const fileUrl = API_URL + 'images/'+store.user.file;
      const isFileAvailable = await checkFileAvailability(fileUrl);
      setCheckFile(isFileAvailable); 
  }
    const currentDate = new Date();
    let myDate = new Date()
    if(task){
        myDate = new Date(task.date);
    }
    function formatTime(date: Date) {
        const hours = date.getHours().toString().padStart(2, '0'); 
        const minutes = date.getMinutes().toString().padStart(2, '0'); 
        return `${hours}:${minutes}`;
      }
    
      function formatDate(date: Date) {
        const options: Intl.DateTimeFormatOptions = { 
          day: 'numeric', 
          month: 'short' 
        };
        return date.toLocaleDateString('ru-RU', options);
      }
    
      let displayText: string;
    
      if (
        myDate.getDate() === currentDate.getDate() &&
        myDate.getMonth() === currentDate.getMonth() &&
        myDate.getFullYear() === currentDate.getFullYear()
      ) {
        displayText = formatTime(myDate);
      } else {
        displayText = formatDate(myDate);
      }

    const currentDateDeadline = new Date();
    let myDateDeadline = new Date()
    if(task){
        myDateDeadline = new Date(task.deadlineDatetime);
    }
    function formatTimeDeadline(date: Date) {
        const hours = date.getHours().toString().padStart(2, '0'); 
        const minutes = date.getMinutes().toString().padStart(2, '0'); 
        return `${hours}:${minutes}`;
      }
    
      function formatDateDeadline(date: Date) {
        const options: Intl.DateTimeFormatOptions = { 
          day: 'numeric', 
          month: 'short' 
        };
        return date.toLocaleDateString('ru-RU', options);
      }
    
      let displayTextDeadline: string;
    
      if (
        myDateDeadline.getDate() === currentDateDeadline.getDate() &&
        myDateDeadline.getMonth() === currentDateDeadline.getMonth() &&
        myDateDeadline.getFullYear() === currentDateDeadline.getFullYear()
      ) {
        displayTextDeadline = formatTimeDeadline(myDateDeadline);
      } else {
        displayTextDeadline = formatDateDeadline(myDateDeadline);
      }

      const removeCodeTags = (htmlString: string) => {
        return htmlString.replace(/<code>.*?<\/code>/gs, '');
      };

    const handleCloseModalTask = () => {
      setOpenModalTask(false);
    }

    const handleCloseModalTheme = () => {
      setOpenModalTheme(false);
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
    let modifiedHtmlString = ''
    if(task){
        modifiedHtmlString = removeCodeTags(task.description);
    }

    const extractCode = (htmlString: string) => {
        const regex = /<code>(.*?)<\/code>/s;
        const match = htmlString.match(regex);
        return match ? match[1] : '';
      };
    let codeString = ''
    if(task){
        codeString = decode(extractCode(task.description)); // Decode the HTML entities
    }

    const buttonStyle = {
      backgroundColor: isHovered ? hexToRgb(course.decor, 0.2) : 'transparent',
      border:`1px solid ${isHovered? course.decor : '#E2E4EB'}`,
      color:course.decor
    };

    const handleEditStatus = () =>{
      store.editComplementaryStatus(complementary.id, complementary.status).then((data)=>{
        if(data)
          window.location.reload()
      })
    }

    const handleCloseModalFile = () => {
      setOpenModalFile(false);
  }

  const handleRemoveFile = () => {    
    if(id.id)
    store.viewComplementaryOne(id.id, store.user.id).then((compData)=>{
    setComplementary(compData?.data)
    })
  }
    
  const handleDeleteTask=()=>{
    store.deleteTask(task.id).then(()=>{
        window.location.reload()
    })
  }

  const handleDeleteFromTheme=()=>{
    store.deleteFromTheme(task.id).then((data)=>{
      if(data)
        window.location.reload()
    })
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      socket.emit('addComplementary', { user_id: store.user.id, text:complementaryMessageText, id:complementary.id });

      // Пример получения события "пользователь добавлен"
      socket.on('complementaryAdded', (user) => {
        setComplementaryMessage(user)
        console.log('Complementary added:', user);
      });    
      setComplementaryMessageText('')
      store.getAllMessageComplementary(complementary.id).then((messageComp)=>{
        setComplementaryMessage(messageComp?.data)
      })
    }
  };

  const handleKeyPressTask = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      socket.emit('addTask', { user_id: store.user.id, text:taskMessageText, id:task.id });

      // Пример получения события "пользователь добавлен"
      socket.on('taskAdded', (user) => {
        setTaskMessage(user)
        console.log('Task added:', user);
      });    

      setTaskMessageText('')
      if(id.id)
      store.getAllMessageTask(store.user.id, id.id).then((taskComm)=>{
        setTaskMessage(taskComm?.data)
      })
    }
  };

  return (
    <div className="task-body">
        <div className="task-body__body">
                {complementary?(
                  <div className="task-body__body__subleft">
                    <div className="task-body__body__subleft__circle" style={{background:course.decor}}>
                      <AiOutlineFileText style={{marginTop:'13px', marginLeft:'2px'}}/>
                    </div>
                  </div>
                ):(
                  <div className="task-body__body__subleft" style={{width:'3%'}}>
                    <div className="task-body__body__subleft__circle" style={{background:course.decor}}>
                      <AiOutlineFileText style={{marginTop:'13px', marginLeft:'2px'}}/>
                    </div>
                  </div>
                )}
            <div className="task-body__body__left">
                <div className="task-body__body__left__header">
                    <h1 style={{color:course.decor}}>{task.title}</h1>
                    {role==='teacher'&&(
                      <div className="dropdown" style={{marginTop:'5px'}}>
                      <button className='dropdown__button__normal'>
                        <BsThreeDotsVertical style={{color:course.decor, marginTop:'18px'}}/>
                      </button>
                        <div className="dropdown__content">
                        <div className="dropdownline" onClick={()=>setOpenModalTask(true)}>Изменить</div>
                        {!task.theme_id&&(
                          <div className="dropdownline" onClick={()=>setOpenModalTheme(true)}>Добавить тему</div>
                        )}
                        {task.theme_id&&(
                          <div className="dropdownline" onClick={handleDeleteFromTheme}>Удалить тему</div>
                        )}
                        <div className="dropdownline" onClick={handleDeleteTask}>Удалить</div>
                      </div>
                      {openModalTask&&(
                        <ModalCreateTask show={openModalTask} onClose={handleCloseModalTask} task={task} course_id={course.id}/>
                      )}
                      {openModalTheme&&(
                        <ModalAddToTheme show={openModalTheme} onClose={handleCloseModalTheme} course={course.id} task={task}/>
                      )}
                    </div>  
                    )}
                </div>
                <div className="task-body__body__left__subheader">
                    <p>{task.member.user.surname} {task.member.user.name} {task.member.user.lastname}</p>
                    <p>•</p>
                    <p>{displayText}</p>
                </div>
                <div className="task-body__body__left__point" 
                style={{borderBottom:`2px solid ${course.decor}`}}>
                    {complementary?(
                      <>
                        {complementary.mark?(
                          <>
                          {task.point!==0?(
                            <p style={{width:'85%'}}>{task.point} из {complementary.mark}</p>
                          ):(
                            <div style={{width:'85%'}}></div>
                          )}
                          </>
                        ):(
                          <>
                          {task.point!==0?(
                            <p style={{width:'85%'}}>{task.point} баллов</p>
                          ):(
                            <div style={{width:'85%'}}></div>
                          )}
                          </>
                        )}
                      </>
                    ):(
                      <>
                        {task.point!==0?(
                          <p style={{width:'85%'}}>{task.point} баллов</p>
                        ):(
                          <div style={{width:'85%'}}></div>
                        )}
                      </>
                    )}
                    {task.deadlineDatetime&&(
                        <p style={{whiteSpace:'nowrap'}}>Срок сдачи: {displayTextDeadline}</p>
                    )}
                </div>
                {task.description&&(
                <div className="task-body__body__left__decription"
                style={{borderBottom:`1px solid ${course.decor}`, paddingBottom:'10px'}}>
                    <div dangerouslySetInnerHTML={{ __html: modifiedHtmlString }} />
                    {codeString&&(
                    <SyntaxHighlighter language="html" style={vscDarkPlus}>
                        {codeString}
                    </SyntaxHighlighter>
                    )}
                  <div className="task-body__body__left__description__files">
                    {task.files.map((file:any)=>(
                      <>
                      {file.length!==0&&(
                        <div className='task-body__body__left__description__files__file'>
                        <BsFillFileTextFill style={{paddingTop:'12px'}}/>
                        <a href={`${API_URL}files/${file[0].id}`} 
                        style={{padding:'10px'}}>{file[0].name}</a>
                      </div>
                      )}
                      </>
                    ))}
                  </div>
                </div>
                )}
                <p style={{fontWeight:'600'}}>Комментарии</p>
                {taskMessage&&(
                  <>
                    {taskMessage.map((comp:any)=>(
                      <div className='comment'>
                        <div style={{display:'flex'}}>
                          <div className="task-body__body__left__comment-input__image-cont"
                          style={{background:comp.member.user.colorProfile, width:'41px', height:'40px', textAlign:'center', color:'white',
                          fontWeight:'600'}}>
                            {checkFile?(
                              <img src={API_URL + 'images/'+comp.member.user.file} 
                              style={{objectFit:'cover', width:'41px', height:'100%'}}alt="" />
                            ):(
                              <div>
                                <p style={{marginTop:'8px'}}>{comp.member.user.email[0].toUpperCase()}</p>
                              </div>
                            )}
                          </div>
                          <div style={{marginTop:'-15px', marginLeft:'5px'}}>
                            <div className='task-info-bio'>
                              <p style={{fontWeight:'600', fontSize:'16px'}}>{comp.member.user.surname} {comp.member.user.name} {comp.member.user.lastname}</p>
                              <p style={{color:'#AEB5C8', fontSize:'14px', marginTop:'-15px'}}>{comp.member.user.email}</p>
                            </div>
                            {/* <p style={{fontSize:'14px', marginTop:'-10px', color:'#9A9A9A'}}>{displayTextCommentComp}</p> */}
                            <p className='message-text-task' style={{marginTop:'-5px'}}>{comp.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
                <div className="task-body__body__left__comment-input">
                  <div className="image"
                  style={{background:store.user.colorProfile, width:'45px', height:'40px'}}>
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
                  style={{border:`1px solid ${course.decor}`}} onChange={(e)=>{setTaskMessageText(e.target.value)}}
                  value={taskMessageText} onKeyPress={handleKeyPressTask}/>
                  <BiSend style={{color:course.decor, fontSize:'28px', marginTop:'5px'}} onClick={emitEventTask}/>
                </div>
            </div>
            {complementary&&(
              <div className="task-body__body__right">
                <div className="task-body__body__right__body">
                  {!Boolean(complementary.status)&&task.deadlineDatetime<dateNow &&(
                    <div className="task-body__body__right__header">
                      <h1>Мои задания</h1>
                        <p style={{color:'#e63946',  
                        paddingRight:'10px',
                        marginTop:'-20px',
                        fontWeight:'600'}}>Пропущен срок сдачи</p>
                    </div>
                  )}
                  {!Boolean(complementary.status)&&task.deadlineDatetime>dateNow&&(
                    <div className="task-body__body__right__header" style={{display:'flex'}}>
                      <h1 style={{width:'74%'}}>Мои задания</h1>
                        <p>Не сдано</p>
                    </div>
                  )}
                  {Boolean(complementary.status)&&task.deadlineDatetime<dateNow&&(
                    <div className="task-body__body__right__header">
                      <h1>Мои задания</h1>
                        <p style={{color:'#9A9A9A',  
                        paddingRight:'10px',
                        paddingLeft:'0px',
                        marginTop:'-20px',
                        fontWeight:'600'}}>Сдано с опозданием</p>
                    </div>
                  )}
                  {Boolean(complementary.status)&&task.deadlineDatetime>dateNow&&(
                    <div className="task-body__body__right__header" style={{display:'flex'}}>
                      <h1 style={{width:'82.5%'}}>Мои задания</h1>
                        <p style={{color:'#9A9A9A'}}>Сдано</p>
                    </div>
                  )}
                  {Boolean(!complementary.status)&&complementary.file.length>0&&(
                    <>
                      <div className='task-body__body__right__file' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <FilesMap files={complementary.file} id={complementary.id} onUpdate={handleRemoveFile}/>
                      </div>
                      <div className='task-body__body__right__file__add-file'
                        style={buttonStyle}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)} onClick={()=>setOpenModalFile(true)}>
                          <BsPlus style={{marginTop:'15px', fontSize:'24px',
                          fontWeight:'700'}}/>
                          <p>Добавить файл</p>
                        </div>
                        <div style={{background:course.decor}}
                        className='task-body__body__right__pass'
                        onClick={handleEditStatus}>Сдать</div>
                    </>
                  )}
                  {Boolean(complementary.status)&&complementary.file.length>0&&(
                    <>
                      <div className='task-body__body__right__file' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        {complementary.file.map((file:any)=>(
                        <div className='task-body__body__right__file__file' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding:'10px' }}>
                                <div>
                                    <BsFillFileTextFill style={{ fontSize: '24px' }} />
                                </div>
                                <a href={`${API_URL}files/${file[0].id}`}>{file[0].name}</a>
                            </div>
                        </div>
                        ))}
                      </div>
                      <div className='task-body__body__right__cancel-btn'
                        style={buttonStyle}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={handleEditStatus}>
                          Открепить решение
                      </div>
                    </>
                  )}
                  {!Boolean(complementary.status)&&complementary.file.length===0&&(
                    <>
                      <div style={{display:'flex', margin:'0 auto'}}>
                        <div className='task-body__body__right__add-file'
                        style={buttonStyle}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)} onClick={()=>setOpenModalFile(true)}>
                          <BsPlus style={{marginTop:'15px', fontSize:'24px',
                          fontWeight:'700'}}/>
                          <p>Добавить файл</p>
                        </div>
                      </div>
                      <div style={{background:course.decor}}
                      className='task-body__body__right__pass'
                      onClick={handleEditStatus}>Отметить как выполненное</div>
                    </>
                  )}
                  {Boolean(complementary.status)&&complementary.file.length===0&&(
                    <>
                      <div className='task-body__body__right__not-file'>
                        Задание не прикреплено
                      </div>
                      <div className='task-body__body__right__cancel-btn'
                        style={buttonStyle}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={handleEditStatus}>
                          Открепить решение
                      </div>
                    </>
                  )}
                </div>
                <p style={{fontWeight:'600'}}>Комментарии</p>
                {complementaryMessage&&(
                  <>
                    {complementaryMessage.map((comp:any)=>(
                      <div className='comment'>
                        <div style={{display:'flex'}}>
                          <div className="task-body__body__left__comment-input__image-cont"
                          style={{background:comp.member.user.colorProfile, width:'41px', height:'40px',
                          textAlign:'center', color:'white', fontWeight:'600'}}>
                            {checkFile?(
                              <img src={API_URL + 'images/'+comp.member.user.file} 
                              style={{objectFit:'cover', width:'41px', height:'100%'}}alt="" />
                            ):(
                              <div>
                                <p style={{marginTop:'8px'}}>{comp.member.user.email[0].toUpperCase()}</p>
                              </div>
                            )}
                          </div>
                          <div style={{marginTop:'-15px', marginLeft:'5px'}}>
                            <div>
                              <p style={{fontWeight:'600', fontSize:'16px'}}>{comp.member.user.surname} {comp.member.user.name} {comp.member.user.lastname}</p>
                              <p style={{color:'#AEB5C8', fontSize:'14px', marginTop:'-15px'}}>{comp.member.user.email}</p>
                            </div>
                            {/* <p style={{fontSize:'14px', marginTop:'-10px', color:'#9A9A9A'}}>{displayTextCommentComp}</p> */}
                            <p style={{marginTop:'-5px'}}>{comp.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
                <div className="task-body__body__left__comment-input">
                  <div className="task-body__body__left__comment-input__image-cont"
                  style={{background:store.user.colorProfile, width:'49px', height:'40px'}}>
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
                  style={{border:`1px solid ${course.decor}`}} onChange={(e)=>setComplementaryMessageText(e.target.value)} 
                  value={complementaryMessageText} onKeyPress={handleKeyPress}/>
                  <BiSend style={{color:course.decor, fontSize:'28px', marginTop:'5px', marginRight:'-40px'}} onClick={emitEventComplementary}/>
                </div>
            </div>
            )}
            {openModalFile&&(
              <ModalFileComplementary show={openModalFile} onClose={handleCloseModalFile} id={complementary.id}/>
            )}
        </div>  
    </div>
  )
}
export default observer(StudentTaskIsForm)