import React, { useEffect, useRef, useState } from 'react'
import "../../assets/styles/Home/home.scss";
import ProfilePhoto from "../../assets/images/profile.svg"
import { ArrowBackIcon, EditIcon, LinkIcon } from '@chakra-ui/icons';
import {  Menu, MenuButton, MenuItem, MenuList, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger } from '@chakra-ui/react';



export default function Home() {
  const chatBodyRef = useRef(null);
  const [switchScreen, setSwitchScreen] = useState(true);
  const [messagesData, setMessagesData] = useState([]);
  const [messageDate, setMessageDate] = useState('');
  const [groupData, setGroupData] = useState({});
  const [viewChatList, setViewChatlist] = useState(true);
  const [currPage, setCurrPage] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  const fetchMoreMessages = async () => {
    if (isFetching) return;
    setIsFetching(true);
    console.log("fetching");
    let url = `https://qa.corider.in/assignment/chat?page=${currPage + 1}`;
    console.log(url);
    setCurrPage(currPage + 1);
    console.log(currPage);
    const response = await (await fetch(url)).json();
    const receivedMessages = response.chats;
    setMessagesData(prevMessages => [...receivedMessages, ...prevMessages]);
    setIsFetching(false);
  }


  const fetchData = async () => {
    try {
      let url = `https://qa.corider.in/assignment/chat?page=0`;
      const data = await (await fetch(url)).json();

      setGroupData({
        name: data.name,
        from: data.from,
        to: data.to,
        message: data.message,
        status: data.status
      });
      setMessagesData(data.chats);
    }
    catch (err) {
      console.log(err);
    }
  }



  function convertToAmPm(dateTime) {
    if (!messageDate.length) {
      let temp = dateTime.split(' ')[0];
      setMessageDate(temp);
      console.log(temp);
    }

    let time24 = dateTime.split(' ')[1];

    let [hours, minutes] = time24.split(':').map(Number);

    let period = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;

    return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${period}`;
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      console.log(chatBodyRef.current);
    }
  }, [messagesData.length === 10]);

  useEffect(() => {
    const chatBodyNode = chatBodyRef.current;

    if (!chatBodyNode) {
      return;
    }

    const handleScroll = () => {
      if (chatBodyNode.scrollTop === 0 && !isFetching) {
        fetchMoreMessages();
      }
    };

    chatBodyNode.addEventListener('scroll', handleScroll);

    return () => {
      chatBodyNode.removeEventListener('scroll', handleScroll);
    };
  });

  return (
    <>

      {messagesData.length > 0 ? <div className=' flex'>
        {viewChatList && <div className='plr5 container'>
          <h1 className='m10'>Chats</h1>

          <div className='chat-list-container flex outer-container mt10' onClick={() => {

            if (window.innerWidth <= 690) {
              setViewChatlist(false);
              let ChatScreen = document.querySelector('.chat-screen');
              ChatScreen.style.visibility = 'visible';
              ChatScreen.style.display = 'block';
            }
            setSwitchScreen(true);

          }}>
            <div>
              <img src={ProfilePhoto} alt="profilePhoto" />
            </div>
            <div className='chat-title-container '>
              <div className='chat-title'>
                {groupData.name}
              </div>
              <div className='last-message'>
                {messagesData[messagesData.length - 1].message.slice(0, 25)}..
              </div>
            </div>
          </div>

        </div>
        }
        <div className='chat-container'>
          {!switchScreen ?
            <div className='home-screen'>
              <h1 className='text-center'>Chats</h1>
              <p className='text-center'>Send and receive messages.</p>
            </div>
            :
            <div className='chat-screen'>
              <div className='flex apart'>

                <div className='chat-name'>
                  <ArrowBackIcon onClick={() => { 
                    if(window.innerWidth <= 690){
                      setViewChatlist(true);
              let ChatScreen = document.querySelector('.chat-screen');
              ChatScreen.style.visibility = 'hidden';
              ChatScreen.style.display = 'none';
                  }
                  else{
                    
                    setSwitchScreen(false);
                  }
                   }} /> {groupData.name}
                </div>
                <div style={{marginRight:"20px"}}>
                  <EditIcon />
                </div>
              </div>
              <div className='flex apart align-center'>
                <div className='chat-name-container flex mt10'>
                  <div>
                    <img src={ProfilePhoto} alt="profilePhoto" />
                  </div>
                  <div className='chat-title-container'>
                    <div>
                      <p><span className='span-text'>From</span> <b>{groupData.from}</b></p>
                    </div>
                    <div>
                      <p><span className='span-text'>To</span> <b>{groupData.to}</b></p>
                    </div>
                  </div>
                </div>
                <div style={{zIndex:"2"}}>
                  <Menu >
                    <MenuButton style={{marginRight:"25px", border:"0", cursor:"pointer"}}><i className="fa-solid fa-ellipsis-vertical"></i></MenuButton>
                    <MenuList style={{borderRadius:"8px", border:"1px solid gray"}}>
                      <MenuItem style={{padding:"10px",  border:"none",borderBottom:"1px solid gray",fontWeight:"550", background:"white", cursor:"pointer", borderTopRightRadius:"8px", borderTopLeftRadius:"8px"}}><i className="fa-solid fa-user-group"></i>&nbsp; Members</MenuItem>
                      <MenuItem style={{padding:"10px", border:"none",borderBottom:"1px solid gray",fontWeight:"550", background:"white", cursor:"pointer"}}><i className="fa-solid fa-phone"></i>&nbsp; Share Number</MenuItem>
                      <MenuItem style={{padding:"10px", border:"none",fontWeight:"550", background:"white", cursor:"pointer", borderBottomLeftRadius:"8px", borderBottomRightRadius:"8px"}}><i className="fa-regular fa-comment-dots"></i>&nbsp; Report</MenuItem>
                    </MenuList>
                  </Menu>
                </div>
              </div>
              <hr className='hr' />
              <div className='chat-body' ref={chatBodyRef}>
                {messageDate.length > 0 &&
                  <div className='date-container'>
                    <div>
                      <hr />
                    </div>
                    <div>
                      <span>&nbsp;{messageDate.split('-')[2]}, {month[messageDate.split('-')[1] - 1]} {messageDate.split('-')[0]}&nbsp;</span>
                      </div>

                  </div>}
                {messagesData.map((item, index) => {
                  let messageClassName = 'flex align-top ';
                  let messageClassName2 = 'chat-user-message ';
                  let self = false;

                  if (item.sender.self) {

                    self = true;
                    messageClassName += 'justify-right';
                    messageClassName2 += 'self-msg'

                  }



                  return (
                    <div key={index} id={index} className={messageClassName}>
                      {!self && <div className='chat-user-icon'><img className='user-img' src={item.sender.image} alt="img" /> </div>}
                      <div className={messageClassName2}>
                        <div>{item.message}</div>
                        <div className='text-right msg-time'>{convertToAmPm(item.time)} {self && <i className="fa-solid fa-check-double"></i>}</div>
                      </div>
                    </div>
                  )
                })}

              </div>
              <div className='footer-container'>

                <div className='footer'>
                  <div>

                    <input type="text" className='typing-box' placeholder='Reply to @Rohit Yadav' />
                  </div>
                  <div>

                    <Popover>
                      <PopoverTrigger>
                        <LinkIcon style={{cursor:"pointer"}} />
                      </PopoverTrigger>
                      <PopoverContent  style={{backgroundColor:"#008000", padding:"10px", borderRadius:"20px"}}>
                        <PopoverArrow style={{position:"absolute"}}/>
                        <PopoverBody><i style={{color:"white"}} className="fa-solid fa-camera"></i> <i style={{color:'white'}} className="fa-solid fa-video"></i> <i style={{color:"white"}} className="fa-solid fa-file-lines"></i></PopoverBody>
                      </PopoverContent>
                    </Popover>
                    <i className="fa-regular fa-paper-plane"></i>
                  </div>
                </div>
              </div>
            </div>}

        </div>
      </div> : "Loading..."}
    </>
  )
}