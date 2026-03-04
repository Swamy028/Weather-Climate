import { useEffect, useState } from "react"


export const useDebounce=(value:string,delay:number=300)=>{
    const [debouncevalue,setDebouncevalue]=useState<string>(value)


    useEffect(()=>{
      const timer=setTimeout(()=>{
        setDebouncevalue(value);
      },delay)

      return ()=>clearTimeout(timer);
    },[value,delay]);

    return debouncevalue;
}