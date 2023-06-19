/* eslint-disable array-callback-return */
import React, { useRef, useEffect, useState, useContext } from 'react';
import '../style/Modal.scss';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AiOutlineFileText, AiOutlinePlus } from 'react-icons/ai';
import { RxCross2 } from 'react-icons/rx';
import { PropagateLoader } from 'react-spinners';
type ModalProps = {
  show: boolean;
  onClose: () => void;
  course_id:any;
  task:any;
};

const Modal: React.FC<ModalProps> = ({ show, onClose, course_id, task }) => {
    const {store} = useContext(Context)
    const [loading, setLoading] = useState<boolean>(true)
    const modalRef = useRef<HTMLDivElement>(null);
    const [edit, setEdit] = useState<boolean>(false);
    const [title, setTitle] = useState<string>()
    const [point, setPoint] = useState<string>()
    const [content, setContent] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<any>([]);
    const [oldFiles, setOldFiles] = useState<any>([]);
    const [isForm, setIsForm] = useState<boolean>(false)
    const [id, setId] = useState<string>('')
  
    const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files as FileList;
    setSelectedFile((prev: File[]) => {
        for (let i = 0; i < selectedFiles?.length; i++) {
        prev.push(selectedFiles[i])
        }
        return [...prev]; // Если реагировать не будет, то return [ ...prev ]
    })
    };

    function removeItemByName(name: string) {
        const filteredFiles = oldFiles.filter((fileName: any) => fileName.name !== name);
        setOldFiles(filteredFiles)
        setSelectedFile((prevItems: any[]) => prevItems.filter(item => item.name !== name));
      }
  const modules = {
    toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'code'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
        ]
    };
    useEffect(() => {
        if(task.id){
            const k: any[] =[]
            store.viewFiles(task.files).then((data)=>{
                // eslint-disable-next-line array-callback-return
                data?.data.map((dat:any)=>{
                    k.push(dat[0])
                })
                setOldFiles(k)
                setLoading(false)
                setEdit(true)
                setTitle(task.title)
                setContent(task.description)
                setPoint(task.point)
                setSelectedFile(task.files)
                setIsForm(task.isForm)
                setSelectedFile(k)
                setId(task.id)
            })
            if(task.deadlineDatetime!=='1970-01-01T00:00:00.000Z'){
                const dateDeadline = new Date(task.deadlineDatetime)
                setDate(dateDeadline)
            }
        }
        else{
            setLoading(false)
        }
        const handleOutsideClick = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            onClose();
        }
        };
        if (show) {
        document.addEventListener('mousedown', handleOutsideClick);
        }

        return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
        };
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'code',
    'color', 'background', 'font', 'align',
    'list', 'bullet',
    'link', 'image'
    ];

    function handleChange(value: string) {
    setContent(value);
    }

    const handleClose = () => {
    onClose();
    };

    const [date, setDate] = useState<Date | null>(null);
    const handleChangeDate = (date: Date | null) => {
        setDate(date);
    };

    function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
        setIsForm(event.target.checked);
    }

    const handleOnClick = () =>{
        if(id){
            store.updateTask(id, oldFiles, selectedFile, String(date), String(title), content, String(point), String(isForm)).then((data)=>{
                if(data)
                    window.location.reload()
            })
        }else{
            store.addTask(selectedFile, String(date), String(title), content, String(point), course_id, String(isForm), store.user.id).then((data)=>{
                if(data)
                    window.location.reload()
            })
        }
    }

  return (
    <div className='task-modal'>
        <div className="modal-backdrop">
            <div className="modal" ref={modalRef} style={{position:'static'}}>
            <div className="modal-header">
                {edit&&(
                <h1 style={{color:'black'}}>Изменить задание</h1>
                )}
                {!edit&&(
                <h1>Создать задание</h1>
                )}
                <button className="modal-close" onClick={handleClose} style={{marginTop:'0.5rem', marginLeft:'-60px'}}>
                    &times;
                </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', marginTop: '-20px', overflow: 'auto' }}>
                {loading ? (
                    <div style={{ width: '100%', paddingTop: '10rem', paddingBottom: '20rem' }}>
                    <div style={{ display: 'flex', width: '100%' }}>
                        <div style={{ margin: '0 auto', marginTop: '5rem', textAlign: 'center' }}>
                        <PropagateLoader color="#335DFF" style={{ marginLeft: '-15px' }} />
                        </div>
                    </div>
                    </div>
                ) : (
                    <>
                        <div className="continput">
                        <p>Название:</p>
                        <input type="text" placeholder='Название' className='inputlog' autoComplete='false'
                        value={title} onChange={(e)=>setTitle(e.target.value)}/>
                    </div>
                    <div className="continput">
                        <p>Инструкции:</p>
                        <ReactQuill
                        value={content}
                        onChange={handleChange}
                        modules={modules}
                        formats={formats}
                        style={{width:'100%'}}/>
                    </div>
                    <div className="continput">
                        <p>Добавить форму для сдачи:</p>
                        <input type="checkbox" checked={isForm} onChange={handleCheckboxChange} 
                        style={{width:'20px', height:'20px', marginTop:'-15px'}}/>
                    </div>
                    <div className="continput">
                        <p>Баллы:</p>
                        <input type="number" placeholder='Баллы' className='inputlog' autoComplete='false'
                        value={point} onChange={(e)=>setPoint(e.target.value)}/>
                    </div>
                    <div className="continput">
                        <p>Дата сдачи:</p>
                        <DatePicker
                            id="dateTimePicker"
                            className="inputlog"
                            selected={date}
                            onChange={handleChangeDate}
                            showTimeSelect
                            dateFormat="Pp"
                        />
                    </div>
                    <div className="continput">
                        <p>Дополнительные файлы: </p>
                        <div className="add-photo" style={{width:'100%', height:'60px'}}>
                        <div className="file-input" style={{marginTop:'10px'}}>
                            <label htmlFor="file-input" style={{width:'30px', height:'30px'}}>
                            <AiOutlinePlus style={{fontSize:'18px', paddingBottom:'2px'}}/>
                            </label>
                            <input
                            ref={fileInputRef}
                            id="file-input"
                            type="file"
                            onChange={handleFileSelected}
                            accept='*'
                            multiple
                            />
                        </div>
                        </div>
                        {selectedFile&&( //проверка на то пуст ли файл
                            <div style={{width:'100%'}}>
                                {selectedFile.map((t:any)=>(
                                    <div className="body-file"
                                    style={{display:'flex',
                                    border:'2px solid #AEB5C8',
                                    marginTop:'10px',
                                    width:'100%',
                                    borderRadius:'5px', 
                                    background:'#AEB5C8',
                                    color:'white'}}>
                                        <AiOutlineFileText className='file' style={{fontSize:'20px',
                                        marginTop:'16px', marginRight:'10px'}}/>
                                        <p style={{width:'90%'}}>{t.name}</p>
                                        <RxCross2 className='cross' 
                                        style={{marginTop:'20px'}}
                                        onClick={()=>removeItemByName(t.name)}/>
                                    </div>
                                ))}
                            </div>
                        )}
                        </div>
                        <div className="btn-cnt" >
                            <button className='cancel' onClick={handleClose}>Отменить</button>
                            <button className='save' onClick={handleOnClick}>Сохранить</button>
                        </div>
                    </>
                )}
            </div>
            </div>
        </div>
    </div>
  );
};

export default observer(Modal);
