import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '..'
import { PropagateLoader } from 'react-spinners'
import { useParams } from 'react-router-dom'
import { MarksStatisticMap } from './MarksStatisticMap'

const MarksStatistic = () => {
    const [loading, setLoading] = useState<boolean>(true)
    const [complementary, setComplementary] = useState<any>()
    const [mark, setMark] = useState<string>()
    const [decor, setDecor] = useState<any>()
    const {store} = useContext(Context)
    const id = useParams()
    useEffect(() => {
        if(id.id)
        store.getAllComplementary(id.id).then((data) => {
            if(id.id)
            store.viewTaskOne(id.id, store.user.id).then((tsk)=>{
                setComplementary(data?.data);
                setDecor(tsk?.data.class.decor)
                const mm:string[] = [];
                data?.data.forEach((comp: any) => {
                    if (comp.mark) {
                        mm.push(comp.mark)
                    }
                });
                const sum = mm.reduce((total: any, num: any) => total + num, 0);
                const averageValue = sum / mm.length;
                setMark(averageValue.toString());
                setLoading(false);
            })
        });
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
  return (
    <div className="marks-statistic">
        <div className="marks-statistic__body">
                <table rules='rows'>
                    <tr>
                        <th style={{textAlign:'center'}}>
                            Ученик
                        </th>
                        <th style={{textAlign:'center'}}>
                            Оценки
                        </th>
                    </tr>
                    <MarksStatisticMap complementary={complementary}/>
                    <tr>
                        <td style={{paddingRight:'40px'}}>
                            <p style={{fontWeight:'600'}}>Средняя оценка по классу</p>
                        </td>
                        <td style={{textAlign:'center', fontWeight:'600', color:decor}}>
                            {mark}
                        </td>
                    </tr>
                </table>
        </div>
    </div>
  )
}
export default observer(MarksStatistic)