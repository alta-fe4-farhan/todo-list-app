import React from "react";
import LogoNotFound from "../assets/browser.png";

const TaskNotFound = () => {
  return (
    <div className="col-lg-5 d-flex flex-column align-items-center gap-4">
      <img src={LogoNotFound} alt="" style={{ width: "200px" }} />
      <h3 className="">Task Not Found!</h3>
    </div>
  );
};

export default TaskNotFound;
