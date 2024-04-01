'use client';
import Layout from "@/components/Layout";

import { useAccount } from "wagmi";

import NotConnected from "@/components/NotConnected";
import DefiStripAppli from "@/components/DefiStripAppli";
import Mint from "@/components/Mint";
import Stake from "@/components/Stake";
import home from "@/app/home/page.js";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; 

import { Flex } from "@chakra-ui/react";

export default function Home() {

  // On récupère l'adresse du compte qui est connecté à la DApp
  // On récupère aussi s'il y a qqn connecté ou pas
  const { address, isConnected } = useAccount();

  //const root = ReactDOM.createRoot(document.getElementById("root"));


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<Navigate to='/home' />} />
       </Routes>
     </BrowserRouter>
    </>
  );
}