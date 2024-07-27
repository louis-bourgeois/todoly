"use client";
import FormMenu from "@/ui/FormMenu";
import Blur from "@/ui/app/Blur";
import LoginHeroe from "@/ui/app/LoginHeroe";
import { useState } from "react";
export default function Page() {
  const [showComponent, setShowComponent] = useState(false);
  const formDataArray = {
    fName: "",
    lName: "",
    age: "",
    email: "",
    password: "",
  };
  const action = "Sign up";
  const inputs = [
    {
      type: "text",
      name: "fName",
      autoComplete: "given-name",
      placeholder: "First Name",
    },
    {
      type: "text",
      name: "lName",
      autoComplete: "family-name",
      placeholder: "Last Name",
    },
    {
      type: "text",
      name: "username",
      autoComplete: "username",
      placeholder: "Username",
    },
    {
      type: "text",
      name: "age",
      placeholder: "Age",
      pattern: "[0-9]{1,3}",
      inputMode: "numeric",
    },
    {
      type: "email",
      name: "email",
      autoComplete: "email",
      placeholder: "Email",
    },
  ];
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
        msDuration="1000"
        bg="bg-blue/[.05]"
        fullscreen={true}
      />
      <FormMenu
        display={showComponent}
        absolute
        mainTitle="Welcome to Todoly !"
        libelle="User data"
        inputs={inputs}
        password
        confirmPassword
        formDataArray={formDataArray}
        action={action}
        submitValue="Start the adventure"
        bottomMessage="Already registered?"
        bottomMessageHREF="/auth/login"
        termsConditions
        succeedRedirect="/app"
        newUser
      />
      <LoginHeroe h1="Welcome to Todoly" handle={handleClick} button={action} />
    </>
  );
}
