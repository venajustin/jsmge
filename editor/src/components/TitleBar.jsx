
import React from "react";
import UserIcon from "./UserIcon.jsx";

const TitleBar = () => {


    return (
            <div className="user-and-title">
                <UserIcon/>
                <div className="title-display">
                  <span className='colorBlue'>J</span>
                  <span className='colorBlue'>S</span>
                  <span className='colorRed'>M</span>
                  <span className='colorYellow'>G</span>
                  <span className='colorYellow'>E</span>
                </div>
            </div>
    );
};

export default TitleBar
