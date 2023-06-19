import React, { useRef, useEffect, useState, useContext } from 'react';
import '../style/Modal.scss';
import {BsCheck} from 'react-icons/bs'
import {BiPlus} from 'react-icons/bi'
import { ChromePicker } from 'react-color'
import { Context } from '..';
import { observer } from 'mobx-react-lite';

interface Color {
    code: string;
}

const colors: Color[] = [
    { code: "#AEB5C8" },
    { code: "#F92929" },
    { code: "#FA6E42" },
    { code: "#FBCD57" },
    { code: "#82BF5C" },
    { code: "#657DFC" },
    { code: "#89F0EA" },
    { code: "#A957FB" },
    { code: "#2A2E31" },
    { code: "#EC59B1" },
    { code: "#FB576B" },
  ];
type ModalProps = {
  show: boolean;
  onClose: () => void;
  course:any;
};

const Modal: React.FC<ModalProps> = ({ show, onClose, course }) => {
  const {store} = useContext(Context)
  const modalRef = useRef<HTMLDivElement>(null);
  const [colorz, setColorz] = useState<any>();
  const [edit, setEdit] = useState<boolean>(false);
  const [colorHex, setColorHex] = useState<any>();
  const [colorPicker, setColorPicker] = useState<boolean>(false);
  const [titleClass, setTitleClass] = useState<string>()
  const [chapter, setChapter] = useState<string>()
  const [object, setObject] = useState<string>()
  const [audience, setAudience] = useState<string>()
  useEffect(() => {
    handleRandomColorClick()
    setColorHex('#EBB893')
    if(course.decor){
      setColorz(course.decor)
      setTitleClass(course.title)
      setChapter(course.chapter)
      setObject(course.subject)
      setAudience(course.audience)
      setEdit(true)
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

  const handleColorChange = (color: any) => {
    setColorHex(color.hex);
    setColorz(color.hex)
  };

  const handleClose = () => {
    onClose();
  };
  const handleRandomColorClick = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    setColorz(colors[randomIndex]);
  };
  const handleCreateClass=async()=>{
    if(edit){
      if(titleClass&&chapter&&object&&audience)
      store.editCourse(titleClass, chapter, object, audience, course.id, colorz).then((data)=>{
        if(data)
          window.location.reload()
      })
    }
    else{
      if(titleClass&&chapter&&object&&audience)
      store.createClass(titleClass, chapter, object, audience, colorz, store.user.id).then((data)=>{
        if(data)
          window.location.reload()
      })
    }
  }
  return (
    <div className='class-modal'>
        <div className="modal-backdrop">
          <div className="modal" ref={modalRef}>
            <div className="modal-header">
              {edit&&(
                <h1 style={{color:'black'}}>Изменить курс</h1>
              )}
              {!edit&&(
                <h1>Создать курс</h1>
              )}
                <button className="modal-close" onClick={handleClose} style={{marginTop:'0.8rem'}}>
                    &times;
                </button>
            </div>
            <div className="modal-body">
                <div className="continput">
                    <p>Название курса:</p>
                    <input type="text" placeholder='Название' className='inputlog' autoComplete='false'
                    value={titleClass} onChange={(e)=>setTitleClass(e.target.value)}/>
                </div>
                <div className="continput">
                    <p>Раздел:</p>
                    <input type="text" placeholder='Раздел' className='inputlog' autoComplete='false'
                    value={chapter} onChange={(e)=>setChapter(e.target.value)}/>
                </div>
                <div className="continput">
                    <p>Предмет:</p>
                    <input type="text" placeholder='Предмет' className='inputlog' autoComplete='false'
                    value={object} onChange={(e)=>setObject(e.target.value)}/>
                </div>
                <div className="continput">
                    <p>Аудитория:</p>
                    <input type="text" placeholder='Аудитория' className='inputlog' autoComplete='false'
                    value={audience} onChange={(e)=>setAudience(e.target.value)}/>
                </div>
                <div className="continput">
                    <p>Цвет темы:</p>
                    <div className="colors">
                      <div style={{background:colorHex}} className="colorBtn" onClick={()=>setColorPicker(!colorPicker)}>
                        <BiPlus style={{marginLeft:'2.5px', marginTop:'2.5px'}}/>
                      </div>
                      {colors.map((item) => (
                          <div key={item.code} style={{background:item.code}} className="color"
                          onClick={()=>setColorz(item.code)}>
                              {colorz?.code===item.code&&(
                                  <BsCheck style={{marginLeft:'2px', marginTop:'2.5px'}}/>
                              )}
                              {colorz===item.code&&(
                                  <BsCheck style={{marginLeft:'2px', marginTop:'2.5px'}}/>
                              )}
                          </div>
                      ))}
                    </div>
                    {colorPicker&&(
                      <div style={{marginTop:'10px'}}>
                        <ChromePicker color={colorHex} onChange={handleColorChange} />
                      </div>
                    )}
                </div>
                <div className="btn-cnt" >
                  <button className='cancel' onClick={handleClose}>Отменить</button>
                  <button className='save' onClick={handleCreateClass}>Сохранить</button>
                </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default observer(Modal);
