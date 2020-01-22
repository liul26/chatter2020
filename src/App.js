import React, {useState, useEffect} from 'react'
import './App.css'
import {db} from './db'
import NamePicker from './namePicker.js'

function App() {
  const [messages, setMessages] = useState([])
  const [name, setName] = useState('')
  // for a use state ALWAYS use const
  // ^ thats how a useState ALWAYS looks
  // useState([]) <-- [] is an empty array. you start with an empty array
  // messages - state variable, starts equalling []
  // setMessages - function, changes the variable

  console.log(messages)

  useEffect(()=>{
    db.listen({
      receive: m=> {
        setMessages(current=> [m, ...current])
        },
    })
  }, [])

  return <main>
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
      {messages.map((m,i)=>{
        return <div key={i} className="message-wrap">
          <div className="message">{m.text}</div>
        </div>
        // key=index of an array. its a react thing to have "key" to see which message you wnat to delete.
      })}
      {/* mapping = looping. loops through the array, funciton that takes a function as an argument 
        displays our message!!*/}
    </div>

    <TextInput onSend={(text)=> {
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
          text, name, ts: new Date()
        })
    }}/>
     {/* console.log("here is my message"m) */}
    
  </main>
}

function TextInput(props){
  const [text, setText] = useState('')

  // custom elements ALWAYS have an uppercase letter
  return (<div className="text-input">
    <input value={text} 
      placeholder="Your message here"
      onChange={e=> setText(e.target.value)}
      onKeyPress={e=> {
        if(e.key==='Enter') {
          if(text) props.onSend(text)
          setText('')
        }}}
      className="text-input"
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