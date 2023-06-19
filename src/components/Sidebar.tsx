import React, { useState, useEffect, useRef, useContext } from "react";
import "../style/Sidebar.scss";
import { AiFillHome } from "react-icons/ai";
import { BsArchiveFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Context } from "..";
import { PropagateLoader } from "react-spinners";
import { SmallCoursesMap } from "./SmallCoursesMap";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const {store} = useContext(Context)
    const navigation = useNavigate()
    const [isClosing, setIsClosing] = useState(false);
    const [coursesStudent, setCoursesStudent] = useState<any>()
    const [coursesTeacher, setCoursesTeacher] = useState<any>()
    const [loading, setLoading] = useState(true);
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        store.checkAuth().then(()=>{
            store.getClassStudent(store.user.id).then((studentData)=>{
              store.getClassTeacher(store.user.id).then((teacherData)=>{
                setCoursesStudent(studentData?.data)
                setCoursesTeacher(teacherData?.data)
                setLoading(false)
              })
            })
        })
    }, [store])
    
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleContentClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`sidebar ${isOpen ? "open" : ""} ${isClosing ? "closing" : ""}`} ref={sidebarRef}>
      <div className="sidebar-content" onClick={handleContentClick}>
        <div className="home-cont" onClick={()=>navigation('/')}>
            <AiFillHome style={{paddingTop:'18px', paddingRight:'10px', paddingLeft:'10px'}}/>
            <p>Курсы</p>
        </div>
        {loading?(
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <PropagateLoader color="#335DFF" />
          </div>
        ):(
          <div>
            <p style={{textAlign:'left'}}>Курсы, слушателем я являюсь:</p>
              {!coursesStudent.length?(
                <div className="not-found">
                  <img src="https://cdn.dribbble.com/users/902546/screenshots/6233250/11_copy.png" alt="" 
                  style={{width:'20rem', marginTop:'5rem'}}/>
                  <p style={{color:'black'}}>Ни одного не найдено</p>
              </div>
              ):(
                <div>
                  <SmallCoursesMap courses={coursesStudent}/>
                </div>
              )}
              {coursesTeacher.length&&(
                <div>
                  <p style={{textAlign:'left'}}>Курсы, которые я преподаю:</p>
                  <SmallCoursesMap courses={coursesTeacher}/>
                </div>
              )}
          </div>
        )}
        <div className="archive-cont">
            <BsArchiveFill style={{paddingTop:'18px', paddingRight:'10px', paddingLeft:'10px'}}/>
            <div style={{marginTop:'15px'}}>
            <a style={{textDecoration:'none', color:'#6D6875'}} href="/archive">Архив</a>
            </div>
        </div>
      </div>
      <div className="sidebar-overlay" onClick={handleClose} />
    </div>
  );
};

export default Sidebar;
