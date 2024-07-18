import React, { useState } from 'react'

const initialFriends = [
  {
    id: 118836,
    name: "Assumpchi",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Nini",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Phocuz",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({children,onClick}){
  return(
    <button className='button' onClick={onClick}>{children}</button>
  )
}


function App() {
  const[addFriend,setAddFriend]=useState(false)
  const [friends,setFriends]= useState(initialFriends);
  const [selectedFriends,setSelectedFriends]= useState(null);

  function handleAddFriends(friend){
    setFriends((friends)=>[...friends,friend])
    setAddFriend(false);
  }

  function handleAddFriend(){
    setAddFriend((show)=>!show)
  }

  function handleSelection(friend){
    // setSelectedFriends(friend);
    setSelectedFriends((cur)=>(cur?.id ===friend.id? null:friend));

    setAddFriend(false)
  }

  function handleSplitBill(value){
      setFriends((friends)=> friends.map(friend =>friend.id===selectedFriends.id? {...friend,balance:friend.balance +value }: friend));

      setSelectedFriends(null);
  }
  return (
    <div className='app'>
      <div className="sidebar">
        <FriendList 
        friends={friends}
         onSelection={handleSelection}
         selectedFriends={selectedFriends}
         />
       { addFriend &&<FormAddFriend onAddFriend={handleAddFriends} />}
        <Button onClick={handleAddFriend}>{ addFriend? "close": "Add friend"}</Button>
      </div>
  {selectedFriends && <FormSplitBill onSplitBill={handleSplitBill} selectedFriends={selectedFriends} />}
    </div>
  )
}

function FriendList({friends, onSelection,selectedFriends}){
  
  return(
    <ul>
      {friends.map((friend)=> <Friend friend={friend} selectedFriends={selectedFriends} onSelection={onSelection}/>)}
    </ul>
  )
}

function Friend({friend,onSelection,selectedFriends}){

  const isSelected = selectedFriends?.id===friend.id;

  console.log(selectedFriends,friend);
const{image,name,balance}=friend;
return(
    <li className={isSelected? "selected": ""}>
      <img src={image} alt={name} />
      <h3>{name}</h3>
     {balance<0 && <p className='red'>you owe {name} {Math.abs(balance)}$</p>}
     {balance>0 && <p className='green'>{name} owe you  {Math.abs(balance)} $</p>}
     {balance ===0 && <p >you and {name} are even</p>}

     <Button onClick={()=>onSelection(friend)}>{isSelected? "closed": "select"}</Button>
    </li>
  
)
}

function FormAddFriend({onAddFriend}){
  const[addNewFriend,setAddNewFriend]=useState("");
  const[imageURL,setImageURL]=useState("https://i.pravatar.cc/48");

  function handleSubmit(e){
    
    e.preventDefault();

    if(!addNewFriend||!imageURL) return;

    const id=crypto.randomUUID();

     const newFriend ={
      id,
      name: addNewFriend,
      image:`${imageURL}?=${id}`,
      balance: 0,
    };

onAddFriend(newFriend)
console.log(newFriend)
  setAddNewFriend('');    
  setImageURL('https://i.pravatar.cc/48');
        
  }
  return(
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👭Friend Name</label>
      <input type="text" value={addNewFriend} onChange={(e)=>setAddNewFriend(e.target.value)} />

      <label>image URL</label>
      <input type="text" value={imageURL}  onChange={(e)=>setImageURL(e.target.value)}/>
      <Button>Add</Button>
    </form>
  )
}


function FormSplitBill({selectedFriends, onSplitBill}){

  const [bill,setBill]= useState(" ");
  const[paidByUser,setPaidByUser]=useState(" ");

  const paidByFriend = bill? bill-paidByUser : " ";

  const[whoIsPaying,setWhoIsPaying]=useState("user")


function handleSubmit(e){
  e.preventDefault();

  if(!bill||!paidByUser) return;

    onSplitBill(whoIsPaying=== 'user'? paidByFriend : -paidByUser)
}

  return(
    <form className="form-split-bill" onSubmit={handleSubmit} >
      <h2>Split a bill with { selectedFriends.name }</h2>


      <label>💰Bill value</label>
      <input type="text" value={bill} onChange={(e)=>setBill(Number(e.target.value))} />

      <label>👩🏾‍🤝‍👩🏽your expenses</label>
      <input type="text" value={paidByUser} onChange={(e)=>setPaidByUser(Number(e.target.value)> bill? paidByUser :Number(e.target.value))} />


      <label>{ selectedFriends.name }'s expenses</label>
      <input type="text" value={paidByFriend}  disabled/>

      <label >🤑who's paying the bill?</label>
      <select value={whoIsPaying} onChange={(e)=>setWhoIsPaying(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{ selectedFriends.name }</option>
      </select>


      <Button>Split Bill</Button>
    </form>
  )
}
export default App



