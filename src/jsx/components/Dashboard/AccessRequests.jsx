import React,{ useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import moment from 'moment';
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav, Modal } from "react-bootstrap";
import RequestForm from "../Requests/RequestForm";
import {RequestsListGrid} from "../Requests/RequestsListGrid";
import {
	COMPLETED,
	DRAFT, MANAGER,
	MEMBER, PENDING,
	REQUEST_EDITABLE_DRAFT, REQUEST_EDITABLE_PENDING,
	REQUEST_READABLE
} from "../../../services/Request/RequestService";
import {getId, getRole} from "../../../services/AuthService";


const DropdownBlog = (props) =>{
	return(
		<>
			<Dropdown className="dropdown">
				<Dropdown.Toggle as="div" className="btn-link i-false" data-bs-toggle="dropdown" aria-expanded="false">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12Z" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
						<path d="M18 12C18 12.5523 18.4477 13 19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12Z" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
						<path d="M4 12C4 12.5523 4.44772 13 5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12Z" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
					</svg>
				</Dropdown.Toggle>
				<Dropdown.Menu className="dropdown-menu">
					<Dropdown.Item className="dropdown-item" >Approve</Dropdown.Item>
					<Dropdown.Item className="dropdown-item">Execute</Dropdown.Item>
					<Dropdown.Item className="dropdown-item">Edit</Dropdown.Item>
					<Dropdown.Item className="dropdown-item">Archive</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
		</>
	)
}

const AccessRequests = () =>{


	const [showAddRequest, onShowAddRequest] = useState(false);

	function getInitialRequestState() {
		return {

			requesterId: getId(),
			projectId: 1,
			systemId: "JIRA",
			systemAccessId: 1,
			status: DRAFT,
			role: getRole()

		};
	}

	const [request, setRequest] =useState(getInitialRequestState());
	const [formMode, setFormMode]=useState(REQUEST_EDITABLE_DRAFT);

	const [selectBtn, setSelectBtn] = useState("Newest");

	const [data, setData] = useState(
		document.querySelectorAll("#example2_wrapper tbody tr")
	);
	const sort = 8;
	const activePag = useRef(0);
	//const [test, settest] = useState(0);

	// Active data
	const chageData = (frist, sec) => {
		for (var i = 0; i < data.length; ++i) {
			if (i >= frist && i < sec) {
				data[i].classList.remove("d-none");
			} else {
				data[i].classList.add("d-none");
			}
		}
	};
   // use effect
   useEffect(() => {
      setData(document.querySelectorAll("#example2_wrapper tbody tr"));
      //chackboxFun();
	}, []);


   // Active pagginarion
   activePag.current === 0 && chageData(0, sort);
   // paggination
   let paggination = Array(Math.ceil(data.length / sort))
      .fill()
      .map((_, i) => i + 1);

   // Active paggination & chage data
	const onClick = (i) => {
		activePag.current = i;
		chageData(activePag.current * sort, (activePag.current + 1) * sort);
		//settest(i);
	};


	const chackbox = document.querySelectorAll(".sorting_1 input");
	const motherChackBox = document.querySelector(".sorting_asc input");
   // console.log(document.querySelectorAll(".sorting_1 input")[0].checked);
	const chackboxFun = (type) => {
      for (let i = 0; i < chackbox.length; i++) {
         const element = chackbox[i];
         if (type === "all") {
            if (motherChackBox.checked) {
               element.checked = true;
            } else {
               element.checked = false;
            }
         } else {
            if (!element.checked) {
               motherChackBox.checked = false;
               break;
            } else {
               motherChackBox.checked = true;
            }
         }
      }
   };

	   const [state, setState] = useState({
		  start: moment().subtract(29, 'days'),
		  end: moment(),
		});
		const { start, end } = state;
		const handleCallback = (start, end) => {
		  setState({ start, end });
		};
		const label =
      start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY');

	function draftMode() {
		setFormMode(REQUEST_EDITABLE_DRAFT);
		setRequest(getInitialRequestState());
		onShowAddRequest(true)
	}
	return(
		<>
			<div className="mb-sm-5 mb-3 d-flex flex-wrap align-items-center text-head">
				<div className=" mb-2 me-auto">
				<Link to={"#"} className="btn btn-primary font-w600" onClick={()=> {draftMode() }}>+ New Request</Link>
				</div>
				{/* <!-- Modal --> */}
				<RequestForm  show={showAddRequest} onShow={onShowAddRequest} formMode={formMode} setFormMode={setFormMode} request={request} setRequest={setRequest}/>
			</div>
			<RequestsListGrid onShow={onShowAddRequest} request={request} setRequest={setRequest} setFormMode={setFormMode} refresh={showAddRequest}/>
		</>
	)
}
export {DropdownBlog};
export default AccessRequests;
