import { Button } from "flowbite-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <div className="mx-auto max-w-screen-sm flex flex-col items-center gap-2 mt-20">
        <Button color={"blue"} onClick={() => navigate("/login")}>
          login
        </Button>
        <Button color={"blue"} onClick={() => navigate("/register")}>
          register
        </Button>
      </div>
    </div>
  );
};

export default Index;
