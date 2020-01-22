import React, {useState, useRef, useEffect} from 'react'
import { FiEdit, FiSave } from 'react-icons/fi'

function NamePicker(props) {
  const [name, setName] = useState('')
  const [showName, setShowName] = useState(false)
  const inputEl = useRef(null)

  function save(){
    inputEl.current.focus()
    if(name && !showName) {
      props.onSave(name)
      localStorage.setItem('name',name)
    }
    setShowName(!showName)
  }

  useEffect(()=>{
    const n = localStorage.getItem('name')
    if(n) {
      setName(n)
      save() 
    }
  }, [])

  return <div className="edit-username">
    <input value={name} ref={inputEl}
      className="name-input"
      style={{display: showName ? 'none' : 'flex'}}
      onChange={e=> setName(e.target.value)}
      onKeyPress={e=> {
        if(e.key==='Enter') save()
      }}
    />

    {showName && <div>{name}</div>}

    <button onClick={save} className="name-button">
      {showName ? <FiEdit /> : <FiSave />}
    </button>
  </div>
}

export default NamePicker










// import React, {useState} from React 
// import { useEffect } from "react"
// import {FiEdit} from 'react-icons/fi'

// function NamePicker({ changeEditName, name, editName}) {
//     if(editName) {
//         return (<div className='edit-username'>

//         </div>)
//     }
// }

// function NamePicker(props){
//     const [editName, setEditName] = useState(false)
//     const [name, setName] = useState('')
    
//     return (
//         <div className="edit-username">
//             <input value={name} 
//                 placeholder="Your name here"
//                 onChange={e=> setName(e.target.value)}
//                 onKeyPress={e=> {
//                     if(e.key==='Enter') {
//                         if(name) props.onSend(name)
//                         setName('')
//                 }}}
//                 className="edit-username"
//             />
//             <button 
//                 disabled={!name} 
//                 onClick={()=> {
//                     if(name) {
//                         props.onSend(name)
//                     }
//                     setName('')
//                 }}
//                 className="button">
//                 set name
//             </button>
//             <username 
//                 // if there is no name set, say "Set your name"
//                 // if there is a name set, say username
//                 className="username">
                
//             </username>
//         </div>
//     )
//   }

// export default NamePicker

// // after save()
// useEffect(()=>{
//     const n=localStorage.getItem('name')
//     if(n) {
//         setName(n)
//         save()
//     }
// },[])