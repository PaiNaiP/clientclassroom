import React, { useRef, useEffect, useState, useContext } from 'react';
import '../style/Modal.scss';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { PropagateLoader } from 'react-spinners';
import Select from 'react-select'


type ModalProps = {
  show: boolean;
  onClose: () => void;
  course:string;
  task:any;
};

const Modal: React.FC<ModalProps> = ({ show, onClose, course, task}) => {
  const {store} = useContext(Context)
  const modalRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true)
  const [options, setOptions] = useState<any>()
  const [selected, setSelected] = useState<any>()
  useEffect(() => {
    store.viewAllTheme(course).then((data)=>{
        const option = data?.data.map((item: { id: any; title: any; }) => ({
            value: item.id,
            label: item.title
        }));
        setOptions(option)
        setLoading(false)
    })
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

  const handleClose = () => {
    onClose();
  };

  const handleChange = (option: any) => {
    setSelected(option);
  };
  const handleAddTheme = ()=>{
    store.addTheme(task.id, selected.value).then((data)=>{
        if(data)
            window.location.reload()
    })
  }
  return (
    <div className='theme-modal'>
        <div className="modal-backdrop">
            <div className="modal" ref={modalRef} style={{height:'300px'}}>
            <div className="modal-header">
                <div>
                    <h1>Добавление темы</h1>
                    <p style={{marginTop:'-10px', color:'#6D6875'}}>{task.title}</p>
                </div>
                <button className="modal-close" onClick={handleClose} style={{marginTop:'1rem', marginLeft:'-67px'}}>
                    &times;
                </button>
            </div>
            <div className="modal-body">
                {loading&&(
                    <div style={{width:'100%', paddingTop:'2rem', paddingBottom:'20rem'}}>
                    <div style={{display:'flex', width:'100%'}}>
                        <div style={{margin:'0 auto', marginTop:'5rem', textAlign:'center'}}>
                            <PropagateLoader color="#335DFF" style={{marginLeft:'-15px'}}/>
                        </div>
                    </div>
                </div>
                )}
                {!loading&&(
                    <>
                    <div className="continput">
                        <p>Темы:</p>
                        <Select
                        options={options}
                        className='select'
                        defaultValue={options[0]}
                        onChange={handleChange}
                        value={selected}/>
                    </div>
                    <div className="btn-cnt" >
                        <button className='cancel' onClick={handleClose}>Отменить</button>
                        <button className='save' onClick={handleAddTheme}>Сохранить</button>
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
