import React from "react";

const UserIcon = () => {

    const handleUserButton = () => {
        window.location.href = "/User";
    };

    return (
      <span onClick={handleUserButton} className={"user-icon-button"} id={""}>
          <img height={"45px"} width={"auto"} src={"/user.png"} alt={"User"}/>
      </span>
    );
};

export default UserIcon
