import { ChangeEvent } from "react"

export const handleimage =   (e:ChangeEvent<HTMLInputElement> , fieldchange:(v:string)=>void,setfiles:any)=>{

    e.preventDefault()
  
    const filereader = new  FileReader()
  
    if(e.target?.files && e.target?.files.length > 0) {
        
        const file = e.target.files[0]
  
  
        if (!file.type.includes('image')) return
  
        setfiles(Array.from(e.target.files))
        
        filereader.readAsDataURL(file)
  
        filereader.onload   = async (event) => {
  
                    fieldchange(event.target?.result?.toString() || "")
        }
    }
  
  }


  // created by chatgpt
export function isBase64Image(imageData: string) {
    const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
    return base64Regex.test(imageData);
  }
  
  // created by chatgpt
  export function formatDateString(dateString: string) {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
  
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString(undefined, options);
  
    const time = date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  
    return `${time} - ${formattedDate}`;
  }
  
  // created by chatgpt
  export function formatThreadCount(count: number): string {
    if (count === 0) {
      return "No Threads";
    } else {
      const threadCount = count.toString().padStart(2, "0");
      const threadWord = count === 1 ? "Thread" : "Threads";
      return `${threadCount} ${threadWord}`;
    }
  }