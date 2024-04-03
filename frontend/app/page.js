import { useAccount } from "wagmi";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; 

export default function Home() {

  // On récupère l'adresse du compte qui est connecté à la DApp
  // On récupère aussi s'il y a qqn connecté ou pas
  const { address, isConnected } = useAccount();
  
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