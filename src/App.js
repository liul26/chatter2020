import React, {useState, useEffect} from 'react'
import './App.css'
import './media.css'
import {db,useDB} from './db'
import NamePicker from './namePicker.js'
import { BrowserRouter, Route } from 'react-router-dom'
import Camera from 'react-snap-pic'
import {FiCamera} from 'react-icons/fi'
import * as firebase from "firebase/app"
import "firebase/firestore"
import "firebase/storage"
import Div100vh from 'react-div-100vh'

function App(){
  useEffect(()=>{
    const {pathname} = window.location
    if(pathname.length<2) window.location.pathname='home'
  },[])
  return <BrowserRouter>
    <Route path="/:room" component={Room}/>
  </BrowserRouter>
}

function Room(props) {
  const{room} = props.match.params
  const [name, setName] = useState('')
  const messages = useDB(room)
  const [showCamera, setShowCamera] = useState(false)
  // for a use state ALWAYS use const
  // ^ thats how a useState ALWAYS looks
  // useState([]) <-- [] is an empty array. you start with an empty array
  // messages - state variable, starts equalling []
  // setMessages - function, changes the variable
  console.log(messages)

  async function takePicture(img) {
    setShowCamera(false)
    const imgID = Math.random().toString(36).substring(7)
    var storageRef = firebase.storage().ref()
    var ref = storageRef.child(imgID + '.jpg')
    await ref.putString(img, 'data_url')
    db.send({ img: imgID, name, ts: new Date(), room })
  }

  return <Div100vh>
    {showCamera && <Camera takePicture={takePicture} />} {/* && is a conditional */}
    {/* the word return enters HTML */}
    <header> 
      <img className="logo"
        alt="logo"
        src="https://seeklogo.com/images/J/Jo_Cool-logo-0465C00145-seeklogo.com.png"
      />
      Peanuts Chatter 
      <NamePicker onSave={setName} />
    </header>

    <div className="messages"> 
      {messages.map((m,i)=> <Message key={i} m={m} name={name} />)}
      {/* mapping = looping. loops through the array, funciton that takes a function as an argument 
        displays our message!!*/}
    </div>

    <TextInput 
      showCamera={()=>setShowCamera(true)}
      onSend={(text)=> {
      // blue {} is telling me we are leaving HTML and turning into JS
      // the white {} is just blocks of code
      // => means function receiving a single argument
      // (m, anothervar) for mutiple vars

      // setMessages([text, ...messages])

      // functions ALWAYS use ()
      // ... - a spread operator adds a new thing to the array each time 
      // take all the items in the array, push them into a new array, and add the var to the beginning
      // put text, then messages because you want the messages to show at the bottom. display in backwards order because the messages will hide under the scrollable area
          db.send({
            text, name, ts: new Date(), room
          })
    }}/>
     {/* console.log("here is my message"m) */}
    
  </Div100vh>
}

const bucket = 'https://firebasestorage.googleapis.com/v0/b/chatter2020-4c4cc.appspot.com/o/'
const suffix = '.jpg?alt=media'

function Message({m, name}){
  return <div className="message-wrap"
    from={m.name===name?'me':'you'}
    onClick={()=>console.log(m)}>
    <div className="message">
      <div className="msg-name">{m.name}</div>
      <div className="msg-text">{m.text}
        {m.img && <img src={bucket+m.img+suffix} alt="pic"/>}
      </div>
    </div>
  </div>
// key=index of an array. its a react thing to have "key" to see which message you wnat to delete.
}

function TextInput(props){
  const [text, setText] = useState('')

  // custom elements ALWAYS have an uppercase letter
  return (<div className="text-input">
    <button className="button" 
      onClick={props.showCamera}
      style={{position:'absolute', left:2, top:10}}>
      <FiCamera style={{height:15, width:15}} />
    </button>
    <input value={text} 
      placeholder="Your message here"
      onChange={e=> setText(e.target.value)}
      onKeyPress={e=> {
        if(e.key==='Enter') {
          if(text) props.onSend(text)
          setText('')
        }}}
      className="input-field"
    />
    <button disabled={!text} 
      onClick={()=> {
        if(text) {
          props.onSend(text)
        }
        setText('')
      }}
      className="button">
      <span　role="img">👆📨</span>
    </button>
  </div>)
}

export default App