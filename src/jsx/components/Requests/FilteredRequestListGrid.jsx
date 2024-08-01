import React,{ useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import {getRole, saveRole} from "../../../services/AuthService";
import {
	DRAFT, PENDING, COMPLETED,
	REQUEST_EDITABLE_DRAFT,
	REQUEST_EDITABLE_PENDING, REQUEST_READABLE,
	REQUEST_READABLE_DRAFT, MANAGER,MEMBER
} from "../../../services/Request/RequestService";


const FilteredRequestListGrid = ({requestLists, request, setRequest, setFormMode, onShow}) =>{
	const [data, setData] = useState(
		document.querySelectorAll("#pending_wrapper tbody tr")
	);
	const sort = 10;
	const activePag = useRef(0);


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
      setData(document.querySelectorAll("#pending_wrapper tbody tr"));
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

	};


	const chackbox = document.querySelectorAll(".sorting_2 input");
	const motherChackBox = document.querySelector(".sorting_asc_2 input");
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

function getMode(requestStatus) {

		const role =getRole();

		if (role ==MEMBER){

			if(requestStatus==DRAFT || requestStatus=="")
			     setFormMode(REQUEST_EDITABLE_DRAFT);
			else if(requestStatus==COMPLETED)
				 setFormMode(REQUEST_READABLE);
			else if (requestStatus==PENDING)
				setFormMode(REQUEST_READABLE);


		}else if(role ==MANAGER){
			if(requestStatus==DRAFT){
				setFormMode(REQUEST_EDITABLE_DRAFT);
			}
			else if(requestStatus==PENDING){
				setFormMode(REQUEST_EDITABLE_PENDING);
			}
			else if(requestStatus==COMPLETED){
				setFormMode(REQUEST_READABLE);

			}



		}

	}

	return(
		<>
			<div className="table-responsive">
				<div id="pending_wrapper" className="dataTables_wrapper no-footer">
					<table
						id="example2"
						className="table card-table default-table display mb-4 dataTablesCard dataTable no-footer"
					>
						<thead>
							<tr role="row">
								<th className="sorting_asc_2 bg-none" >
									<div className="form-check  style-1">
										<input type="checkbox" onClick={() => chackboxFun("all")} className="form-check-input" id="checkAll" required=""/>
									</div>
								</th>
								<th className="sorting_asc">ID</th>
								<th className="sorting">requester</th>
								<th className="sorting">Project</th>
								<th className="sorting">System</th>
								<th className="sorting">Permission</th>
								<th className="sorting">Status</th>
								<th className="sorting">creationDate</th>
							</tr>
						</thead>
						<tbody>
						{ requestLists.map((localRequest, index)=> {
							const requestEntries =(<>
										<td>
											<div>
												<Link to={"#"}  onClick={()=>{

													const tempRequest= {id: localRequest.id,requesterId: localRequest.requester.id, projectId: localRequest.project.id, systemAccessId: localRequest.systemAccess.id, systemId: localRequest.systemAccess.systemName };
													setRequest(tempRequest);
													console.log("request after modification", request);
													getMode(localRequest.status);
													onShow(true);
												}}>
												<h5 className="text-nowrap">{localRequest.id}</h5>
												</Link>
											</div>
										</td>

										<td>
											<div>
												<h5 className="text-nowrap">{localRequest.requester.fullName}</h5>
											</div>
										</td>
										<td>
											<div>
												<h5 className="text-nowrap">{localRequest.project.name}</h5>
											</div>
										</td>
										<td>
											<div>
												<h5 className="text-nowrap">{localRequest.systemAccess.systemName}</h5>
											</div>
										</td>
										<td>
											<div>
												<h5 className="text-nowrap">{localRequest.systemAccess.accessPermission}</h5>
											</div>
										</td>
										<td>
											<div>
												<h5 className="text-nowrap">{localRequest.status}</h5>
											</div>
										</td>
										<td>
											<div>
												<h5 className="text-nowrap">{localRequest.creationDate}</h5>
											</div>
										</td>
							</>);

							return (<>
								<tr role="row" className={(index % 2 == 0)?"even":"odd"}>
									<td className="sorting_2">
										<div className="form-check   style-1">
											<input type="checkbox" onClick={() => chackboxFun()}
												   className="form-check-input" id="customCheckBox24" required=""
											/>
										</div>
									</td>
									{requestEntries}

								</tr>
							</>)
							}
						)
						}

						</tbody>
					</table>
				</div>
			</div>
		</>
	)
}
export default FilteredRequestListGrid;
