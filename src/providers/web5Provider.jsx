import { createContext, useEffect, useState } from "react";
import { configurePrescriptionProtocol } from '@/protocols/prescription';
import { useWeb5Hook } from "@/hooks/useWeb5";

export const Web5Context = createContext(null);

export default function Web5Provider ({children}) {

    const [isProtocolConfigured, setIsProtocolConfigured] = useState(false);
    const { web5 } = useWeb5Hook();

    useEffect(() => {
        const setUpProtocol = async ()  => {
            await configurePrescriptionProtocol(web5);
            setIsProtocolConfigured(true);
        }
        if(web5) {
            setUpProtocol();
        }

    }, [web5])

    return (
        <Web5Context.Provider value={{isProtocolConfigured}}>
            {children}
        </Web5Context.Provider>
    )
};