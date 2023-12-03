"use client";
import { useState, useEffect } from 'react';
import { Web5 } from "@web5/api";
import { webcrypto } from "node:crypto";
// @ts-ignore
if (!globalThis.crypto) globalThis.crypto = webcrypto;

export function useWeb5Hook() {
   const [web5, setWeb5] = useState(null);
   const [did, setDid] = useState(null);
    

  useEffect(() => {
    async function connectWeb5() {
      try {
        const { web5, did: userDid } = await Web5.connect();
        setWeb5(web5);
        setDid(userDid);
      }
      catch(err) {
        console.log(err);
      }
    }
    connectWeb5();
   
  }, []);

  return { web5, did };
}