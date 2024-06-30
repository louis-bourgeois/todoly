"use client";
import FormMenu from "@/ui/FormMenu";
import Blur from "@/ui/app/Blur";
import LoginHeroe from "@/ui/app/LoginHeroe";
import { useState } from "react";
export default function Page() {
  const [showComponent, setShowComponent] = useState(false);
  const inputs = [
    {
      type: "email",
      name: "email",
      autoComplete: "email",
      placeholder: "Email",
    },
  ];
  const formDataArray = {
    email: "",
    password: "",
  };
  const action = "Log in";

  const handleClick = () => {
    setShowComponent(!showComponent);
  };

  return (
    <>
      <Blur
        trigger={handleClick}
        show={showComponent}
        showZ="30"
        hideZ="0"
        bg="bg-blue/[.05]"
        fullscreen={true}
      ></Blur>
      <FormMenu
        display={showComponent}
        absolute
        mainTitle="Welcome back to Taskly"
        libelle="User data"
        inputs={inputs}
        password
        formDataArray={formDataArray}
        action={action}
        bottomMessage="Not registered?"
        bottomMessageHREF="/auth/signup"
        submitValue="Log in"
      ></FormMenu>
      <LoginHeroe
        handle={handleClick}
        h1="Welcome to Taskly"
        button={action}
      />
    </>
  );
}
