 import React from "react";

const Footer = () => {
  var d = new Date();
  return (
    <div className="footer">
      <div className="copyright">
        <p>
          Copyright © infineon &amp; Developed by{" infineon"}
          <a href="https://www.infineon.com/" target="_blank" rel="noreferrer">
            DexignLab
          </a>{" "}
          {d.getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default Footer;
