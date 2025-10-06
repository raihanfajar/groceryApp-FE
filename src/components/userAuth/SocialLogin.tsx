"use client";
import { FaGoogle } from "react-icons/fa";
import { Button } from "../ui/button";

const SocialLogin = () => {
  return (
    <>
      {/* Social Logins */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <Button
          onClick={() => {
            const baseUrl =
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            window.location.href = `${baseUrl}/user/google-auth`;
          }}
          variant="ghost"
          className="cursor-pointer hover:bg-gray-100"
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
