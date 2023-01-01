import './App.css'
import io from 'socket.io-client';
import { useEffect, useState } from 'react';

const socket = io('http://localhost:5345')

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([])
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('message', message)
    const newMessage = {
      body: message,
      from: 'Me'
    }
    setChat([newMessage, ...chat])
    setMessage('')
  }

  useEffect(() => {
    const receiveMessage = message => {
      setChat([message, ...chat])
    }
    socket.on('message', receiveMessage)

    return () => {
      socket.off('message', receiveMessage)
    }
  }, [chat])

  return (
    <div className="h-screen bg-zinc-700 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-zinc-800 p-10">
        <h1 className='text-2xl font-bold my-2'>React + Nodejs Chat</h1>
        <input className='border-2 border-zinc-500 p-2 text-black w-full' type="text" value={message} onChange={e => setMessage(e.target.value)} />

        <ul className='h-80 overflow-y-auto'>
          {chat.map((message, i) => {
          return (
            <li key={i} className={`my-2 p-2 text-sm rounded-md table ${message.from === 'Me' ? 'bg-sky-700 ml-auto' : 'bg-zinc-900'}`}>
            <p>{message.from}: {message.body}</p>
          </li>
          )})}
        </ul>
      </form>
    </div>
  )
}

export default App
