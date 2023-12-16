"use client";

import '@livekit/components-styles';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,

} from '@livekit/components-react';
import { useEffect, useState } from 'react';

import { Loader2 } from 'lucide-react';
import { UserDocument } from '@/models/UsersModel';



export default function LiveVidAud({user , chatId , audio,}:{user:UserDocument,chatId:string,audio:boolean,}) {

  const [token, setToken] = useState("");

  useEffect(() => {
    (async () => {
        const name =` ${user.username} ${user.name}`

      try {

        const resp = await fetch(
          `/api/get-participant-token?room=${chatId}&username=${name}`
        );
        const data = await resp.json();

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
      video={true}
      audio={audio}
      token={token}
      connectOptions={{ autoSubscribe: false }}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      // Use the default LiveKit theme for nice styles.
      data-lk-theme="default"
      style={{ height: '100dvh' }}
      
    >
      
      <VideoConference/>
  
      <RoomAudioRenderer />
    
   
    </LiveKitRoom>
  );
}

// function MyVideoConference() {
//   // `useTracks` returns all camera and screen share tracks. If a user
//   // joins without a published camera track, a placeholder track is returned.
//   const tracks = useTracks(
//     [
//       { source: Track.Source.Camera, withPlaceholder: true },
//       { source: Track.Source.ScreenShare, withPlaceholder: false },
//     ],
//     { onlySubscribed: false },
//   );
//   return (
//     <GridLayout tracks={tracks} 
//     style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
  
//         <VideoConference/>
//       <ParticipantTile/>
//     </GridLayout>
//   );
// }