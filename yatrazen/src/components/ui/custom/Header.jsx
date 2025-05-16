import React, { useEffect } from "react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout } from "@react-oauth/google";
import { useNavigation } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

function Header() {

  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(()=>{
    console.log(user);
  },[])

  const [openDialog, setOpenDialog] = useState(false);
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  }

  const [loading, setLoading] = useState(false);
  
  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.error('Login Failed:', error),
  })

  const GetUserProfile = (tokenInfo) => {
    console.log("Token Info: ", tokenInfo);
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'Application/json'
      }
    }).then((resp) => {
      console.log("User Info: ", resp.data);  // Added .data to access the response data
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDialog(false);
      window.location.reload();
    })
  }

  return (
    <div
     className="w-screen p-1 shadow-sm flex justify-between items-center px-1 bg-white"
     >
      <a href="/">
        <img src="/yatrazen.png" className="h-[15px] md:h-[20px]" alt="" />
      </a>
      <div>
        {user ? 
        <div className="flex items-center gap-1 md:gap-3">
          <a href="/create-trip">
          <Button variant="outline" className="rounded-full text-black ">+ Create Trip</Button>
          </a>
          <a href="/my-trips">
          <Button variant="outline" className="rounded-full text-black ">My Trips</Button>
          </a>
          <Popover>
            <PopoverTrigger><img src={user?.picture} className="h-[40px] w-[40px] rounded-full bg-white border-white" alt="" /></PopoverTrigger>
            <PopoverContent>
              <h2 className="cursor-pointer" onClick={()=>{
                 googleLogout();
                 localStorage.clear();
                 window.location.reload();
              }}>Logout</h2>
            </PopoverContent>
          </Popover>


        </div> :
        <Button onClick= {()=>{setOpenDialog(true)}} className='mr-2'>Sign In</Button>
        } 
      </div>
      <Dialog open={openDialog} onOpenChange={handleCloseDialog} > 
            <DialogContent>
              <DialogHeader>
                <DialogDescription>
                <img src="/yatrazen.png" className="h-[20px]" alt="" />
                  <h2 className='font-bold text-lg mt-7'>Sign In With Google</h2>
                  <p>Sign in to the app with google authentication securely</p>
                  <Button
                    disabled={loading}
                    onClick={login}
                    className="w-full mt-5 flex gap-4 items-center">
                      <FcGoogle  />
                      Sign In With Google
                    </Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
    </div>
  );
}

export default Header;
