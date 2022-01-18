import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelList,
} from 'stream-chat-react';
import Auth from './components/Auth.js'
import MessagingContainer from './components/MessagingContainer.js';
import Video from './components/Video.js';
import 'stream-chat-css/dist/css/index.css';
import { customStyles } from './styles/customStyles.js';


const client = StreamChat.getInstance('a6q2jsg9f2n9');

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user'])
  const [channel, setChannel] = useState(null);
  const [users, setUsers] = useState(null)

  const authToken = cookies.AuthToken;

  useEffect(async () => {
    if (authToken) {
      const { users } = await client.queryUsers({role: 'user'})
      setUsers(users)
    }    
  }, []);

  const setupClient = async () => {
    console.log(cookies.UserId, cookies.Name, cookies.HashedPassword)
    try {
      console.log(cookies.UserId, cookies.Name, cookies.HashedPassword)
      
      await client.connectUser(
        {
          id: cookies.UserId,
          name: cookies.Name,
          hashedPassword: cookies.HashedPassword,
        },
        authToken,
        //console.log(cookies.UserId, cookies.Name, cookies.HashedPassword)
      );
      console.log(cookies.UserId, cookies.Name, cookies.HashedPassword)
      
      const channel = await client.channel('gaming', 'gaming-demo', {
        name: 'Gaming Demo',
      })
      setChannel(channel)

      
    } catch (err) {
      console.log(err);
    }
  };

  if (authToken) setupClient();

  return (
    <>
      {!authToken && <Auth/>}
      {authToken && <Chat client={client} customStyles={customStyles} >
        <Channel channel={channel}>
          <Video/>
          <MessagingContainer users={users}/>
        </Channel>
      </Chat>}
    </>
  );
};

export default App;