"use client";

import '@livekit/components-styles';
import {
  LiveKitRoom,
  VideoConference,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,

} from '@livekit/components-react';
import { useEffect, useState } from 'react';
import { Track } from 'livekit-client';
import { Loader2 } from 'lucide-react';
import { UserDocument } from '@/models/UsersModel';
import { useTheme } from 'next-themes';
import Image from 'next/image';

export default function LiveVidAud({user , chatId , audio,video}:{user:UserDocument,chatId:string,audio:boolean,video:boolean}) {

  const [token, setToken] = useState("");
const  { theme,} = useTheme()
  useEffect(() => {
    (async () => {
        const name =` ${user.username} ${user.name}`
        console.log(name , chatId)
      try {

        const resp = await fetch(
          `/api/get-participant-token?room=${chatId}&username=${name}`
        );
        const data = await resp.json();
        console.log(data)    
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [chatId, user.name, user.username]);

  if (token === "") {
    return <div className='flexcenter w-ful h-full '>
<Loader2 className=' h-32 w-32 animate-spin'/>

    </div>;
  }

  return (
    <LiveKitRoom
      video={video}
      audio={audio}
      token={token}
      connectOptions={{ autoSubscribe: false }}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      // Use the default LiveKit theme for nice styles.
      data-lk-theme="default"
      style={{ height: '100dvh' }}
      
    >
      {/* Your custom component with basic video conferencing functionality. */}
      <MyVideoConference user = {user}  />
  
      <RoomAudioRenderer />
      {/* Controls for the user to start/stop audio, video, and screen 
      share tracks and to leave the room. */}
      <ControlBar />
    </LiveKitRoom>
  );
}

function MyVideoConference({user}:{user:UserDocument}) {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
        
      <ParticipantTile/>
    </GridLayout>
  );
}