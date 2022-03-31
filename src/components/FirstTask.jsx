import React from "react";
import LogoTask from "../assets/clipboard.png";

const FirstTask = () => {
  return (
    <div className="col-lg-5 d-flex flex-column align-items-center gap-4">
      <img src={LogoTask} alt="" style={{ width: "200px" }} />
      <h3 className="text-muted">Add First Task!</h3>
    </div>
  );
};

export default FirstTask;
