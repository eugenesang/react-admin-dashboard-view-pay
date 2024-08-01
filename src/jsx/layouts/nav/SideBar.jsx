/// Menu
import Metismenu from "metismenujs";
import React, { Component, useContext, useEffect, useState } from "react";
/// Scroll
import PerfectScrollbar from "react-perfect-scrollbar";
/// Link
import { Link } from "react-router-dom";

import {useScrollPosition} from "@n8tb1t/use-scroll-position";
import { ThemeContext } from "../../../context/ThemeContext";

import profile from "../../../images/user.jpg";


class MM extends Component {
	componentDidMount() {
		this.$el = this.el;
		this.mm = new Metismenu(this.$el);
	}
  componentWillUnmount() {
  }
  render() {
    return (
      <div className="mm-wrapper">
        <ul className="metismenu" ref={(el) => (this.el = el)}>
          {this.props.children}
        </ul>
      </div>
    );
  }
}

const SideBar = () => {
	const {
		iconHover,
		sidebarposition,
		headerposition,
		sidebarLayout,
	} = useContext(ThemeContext);
	
	//console.log(sidebarposition);
	//console.log(sidebarLayout);
	
  useEffect(() => {
    var btn = document.querySelector(".nav-control");
    var aaa = document.querySelector("#main-wrapper");
    function toggleFunc() {
      return aaa.classList.toggle("menu-toggle");
    }
    btn.addEventListener("click", toggleFunc);

  }, []);
 //For scroll
 const [hideOnScroll, setHideOnScroll] = useState(true)
	useScrollPosition(
		({ prevPos, currPos }) => {
		  const isShow = currPos.y > prevPos.y
		  if (isShow !== hideOnScroll) setHideOnScroll(isShow)
		},
		[hideOnScroll]
	)


  return (
    <div
      className={`dlabnav ${iconHover} ${
        sidebarposition.value === "fixed" &&
        sidebarLayout.value === "horizontal" &&
        headerposition.value === "static"
          ? hideOnScroll > 120
            ? "fixed"
            : ""
          : ""
      }`}
    >
      <PerfectScrollbar className="dlabnav-scroll">
        <MM className="metismenu" id="menu">
		  <li className="mm-active" >
            <Link className="has-arrow" to="/requests-list" >
              <i className="fas fa-home"></i>
              <span className="nav-text">Access requests</span>
            </Link>
          </li>

        </MM>
		<div className="dropdown header-profile2 ">
			<div className="header-info2 text-center">
				<img src={profile} alt="" />
				<div className="sidebar-info">
					<div>
						<h5 className="font-w500 mb-0">System Admin</h5>
						<span className="fs-12">raghavan.chakravarthy@infineon.com</span>
					</div>	
				</div>
				<div>
                  <a href = "mailto:raghavan.chakravarthy@infineon.com" className="btn btn-md text-secondary">Contact Us</a>
				</div>
			</div>
		</div>

      </PerfectScrollbar>
    </div>
  );
};

export default SideBar;
