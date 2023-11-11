import Picker from "@emoji-mart/react"
import data from "@emoji-mart/data"
import { Popover, PopoverContent ,PopoverTrigger} from "../ui/popover"

import { Smile } from "lucide-react"
import { useTheme } from "next-themes"
const EmojiPicker = ({onemojichange}:{onemojichange:any}) => {
  const {theme} = useTheme()

  return (<>        <Popover  >
          <PopoverTrigger>
          <Smile/>

          </PopoverTrigger>
      <PopoverContent className="!w-fit !p-0" side="right" sideOffset={100}>
          <Picker  data={data} theme={theme} onEmojiSelect={(e:any)=>onemojichange(e.native)}/>
      </PopoverContent>
        </Popover>
  </>

    

    
    
  )
}

export default EmojiPicker