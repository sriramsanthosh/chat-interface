import React, { useEffect, useState } from 'react'
import "../../assets/styles/Home/home.scss";
import ProfilePhoto from "../../assets/images/profile.svg"
import { ArrowBackIcon, EditIcon, LinkIcon } from '@chakra-ui/icons';
import { Button, Input, Menu, MenuButton, MenuItem, MenuList, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger } from '@chakra-ui/react';
import progressFullScreen from '../chakraUI/progressFullScreen';


export default function Home() {

  const [switchScreen, setSwitchScreen] = useState(true);
  const [messagesData, setMessagesData] = useState([]);
  const [groupData, setGroupData] = useState({});

  const fetchData = async () => {
    let url = `https://qa.corider.in/assignment/chat?page=0`;
    const data = await (await fetch(url)).json();
    console.log(data);
    setGroupData({
      name: data.name,
      from: data.from,
      to: data.to,
      message: data.message,
      status: data.status
    });
    setMessagesData(data.chats);
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <>

      {messagesData.length > 0 ? <div className=' flex'>
        <div className='plr5 container'>
          <h1 className=''>Chats</h1>

          <div className='chat-list-container flex outer-container mt10' onClick={() => { setSwitchScreen(true); }}>
            <div>
              <img src={ProfilePhoto} alt="profilePhoto" />
            </div>
            <div className='chat-title-container'>
              <div className='chat-title'>
                {groupData.name}
              </div>
              <div className='last-message'>
                {messagesData[messagesData.length - 1].message.slice(0, 25)}..
              </div>
            </div>
          </div>


        </div>
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
                  <ArrowBackIcon onClick={() => { setSwitchScreen(false); }} /> {groupData.name}
                </div>
                <div>
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
                <div>
                  <Menu isLazy>
                    <MenuButton><i className="fa-solid fa-ellipsis-vertical"></i></MenuButton>
                    <MenuList>
                      {/* MenuItems are not rendered unless Menu is open */}
                      <MenuItem><i className="fa-solid fa-user-group"></i> Members</MenuItem>
                      <MenuItem><i className="fa-solid fa-phone"></i> Share Number</MenuItem>
                      <MenuItem><i className="fa-regular fa-comment-dots"></i> Report</MenuItem>
                    </MenuList>
                  </Menu>
                </div>
              </div>
              <hr className='hr' />
              <div className='chat-body'>

                {messagesData.map((item, index) => {
                  let messageClassName = 'flex align-top ';
                  let messageClassName2 = 'chat-user-message ';
                  let self = false;

                  if (item.sender.self) {
                    console.log(index);
                    self = true;
                    messageClassName += 'justify-right';
                    messageClassName2 += 'self-msg'
                    console.log(messageClassName);
                  }

                  return (
                    <div key={index} id='index' className={messageClassName}>
                      {!self && <div className='chat-user-icon'><img className='user-img' src={item.sender.image} alt="img" /> </div>}
                      <div className={messageClassName2}>{item.message}</div>
                    </div>
                  )
                })}

              </div>
              <div className='footer flex apart'>
                <div>
                  <Input variant='unstyled' placeholder='Unstyled' />
                </div>
                <div>
                  <Popover>
                    <PopoverTrigger>
                      <Button>Trigger</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverBody><i className="fa-solid fa-camera"></i> <i className="fa-solid fa-video"></i> <i className="fa-solid fa-file-contract"></i></PopoverBody>
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <LinkIcon />
                </div>
                <div><i className="fa-regular fa-paper-plane"></i></div>
              </div>
            </div>}

        </div>
      </div> : "Loading..."}
    </>
  )
}
