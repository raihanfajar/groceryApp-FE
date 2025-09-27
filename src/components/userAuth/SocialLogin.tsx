"use client";
import { FaGoogle } from "react-icons/fa";
import { Button } from "../ui/button";

const SocialLogin = () => {
  return (
    <>
      {/* Social Logins */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <Button
          onClick={() =>
            (window.location.href = "http://localhost:8000/user/google-auth")
          }
          variant="ghost"
          className="hover:bg-gray-100 cursor-pointer"
        >
          <FaGoogle /> Login with google
        </Button>
        {/* <Button variant="outline" size="icon" className="hover:bg-gray-100">
          <FaFacebookF />
        </Button>
        <Button variant="outline" size="icon" className="hover:bg-gray-100">
          <FaTwitter />
        </Button>
        <Button variant="outline" size="icon" className="hover:bg-gray-100">
          <FaGithub />
        </Button> */}
      </div>
    </>
  );
};

export default SocialLogin;
