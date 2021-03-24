// import React from 'react';
// import './weekly.css'
// import calendar from './Calendar';

// export default function weekly() {
//     return (
//         <div className="time-body">
//             <div className="time-column">
//             <div className="body">
//                 <div className="day-names">
//                     {["Time","SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => {
//                         if(d==="SAT" || d==="SUN"){
//                             return (<div className="week" style={{color:"red"}}>{d}</div>);
//                         }
//                         else if(d=="Time"){
//                             return (<div className="week"></div>);
//                         }
//                         return (<div className="week">{d}</div>);
//                     })}
//                 </div>
//                 {calendar.map((week) => (
//                     <div style={{display:"flex"}}>
//                         {week.map((day) => (
//                             <div className="day" onClick={() => setVal(day)}>
//                                 <div className={dayStyles(day)}>{day.format("D")}</div>
//                             </div>
//                         ))}
//                     </div>
//                 ))}
//             </div>
//             </div>
//         </div>
//     )
// }
