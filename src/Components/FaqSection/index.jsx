import React from "react";
import Collapsible from "react-collapsible";

const FaqSection = () => {
  return (
    <div>
      <Collapsible trigger="What is the RECRUIT collection">
        <p className="desc">
          Its a Free mint collection to give you access to the AstroMust Ecosystem <br /><br />
          You will be able to mint a recruit through our Play to Mint game and via the AstroMust website 
        </p>
      </Collapsible>
    </div>
  );
};

export default FaqSection;
