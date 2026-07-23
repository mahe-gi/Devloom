import { useState } from "react";
import { Avatar } from "./BlogsCard";
import { ToggleCard } from "./ToggleCard";

export function ToggleHandleButton () {
    const [toggle, setToggle] = useState(false);
  const handleTOggle = () => {
    setToggle(!toggle);
  };



    return <div>
       <div className="cursor-pointer" onClick={handleTOggle}>
              {toggle ? (
                <div>
                   <Avatar size={35} authorName="Mahesh" />
                <ToggleCard />
                </div>
              ) : (
                <Avatar size={35} authorName="Mahesh" />
              )}
            </div>
    </div>
}