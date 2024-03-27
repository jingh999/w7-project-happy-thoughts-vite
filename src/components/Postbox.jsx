import { useEffect, useState } from 'react'
import "./Postbox.css"

export const Postbox =({thoughts, setThoughts}) => {  
  useEffect(()=>{
    fetch('https://happy-thoughts-ux7hkzgmwa-uc.a.run.app/thoughts')
    .then(res=>res.json())
    .then(
      json=>{
        const sortedThoughts =json.sort((a,b)=>b.createdAt-a.createdAt);
        setThoughts(sortedThoughts);
      }
    )
    .catch(error=>{
      console.error('Error:', error);
    })
  },[])

  const handleHeartClick = (thoughtId) => {
    const updatedThoughts = thoughts.map(thought => {
      if (thought._id === thoughtId) {
        return { ...thought, hearts: thought.hearts + 1 };
      }
      return thought;
    });

    setThoughts(updatedThoughts);

    // TODO patch the updated thoughts to remote server
    const updatedThought = updatedThoughts.find(thought => thought._id === thoughtId);
    fetch(`https://happy-thoughts-ux7hkzgmwa-uc.a.run.app/thoughts/${thoughtId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        hearts: updatedThought.hearts
      })
    })
      .then(res => res.json())
      .then(json => {
        console.log('Thought updated:', json);
      })
      .catch(error => {
        console.error('Error:', error);
      }); 
  }

  
  return (
    <div className='postbox'>
      {thoughts?.map(thought=>(
        <div className='boxContainer' key={thought._id+"&"+thought.createdAt} >
          <h4 className='message'>{thought.message}</h4>
          <div className='hearts'> 
            <button className='heartButton' onClick={() => handleHeartClick(thought._id)}>❤️</button>
            <div className='heartNumber'> x {thought.hearts}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

