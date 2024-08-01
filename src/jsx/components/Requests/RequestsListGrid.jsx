import React, {useEffect, useRef, useState} from 'react';
import {Dropdown, Nav, Tab} from "react-bootstrap";
import DateRangePicker from "react-bootstrap-daterangepicker";
import moment from "moment/moment";
import FilteredRequestListGrid from "./FilteredRequestListGrid";
import {COMPLETED, DRAFT, fetchRequestList, PENDING, READY} from "../../../services/Request/RequestService";

const RequestsListGrid = ({request, setRequest, setFormMode, refresh, onShow})=>{

    const [selectBtn, setSelectBtn] = useState("Newest");

    const [requestsList, setRequestsList] = useState([]);
    const [requestsDraftList, setRequestsDraftList] = useState([]);
    const [requestsPendingList, setRequestsPendingList] = useState([]);
    const [requestsCompletedList, setRequestsCompletedList] = useState([]);

    const [data, setData] = useState(
        document.querySelectorAll("#example2_wrapper tbody tr")
    );
    const sort = 8;
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
    useEffect(async () => {
        setData(document.querySelectorAll("#example2_wrapper tbody tr"));
        let response = await fetchRequestList();
        const responseList = response.data;
        setRequestsList(responseList);
        setRequestsDraftList(responseList.filter((request)=> request.status === DRAFT));
        setRequestsPendingList(responseList.filter((request)=> request.status === PENDING));
        setRequestsCompletedList(responseList.filter((request)=> request.status === COMPLETED));

    },[refresh]);


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

    return(
        <Tab.Container defaultActiveKey="All">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div className="card-action coin-tabs mb-2">
                    <Nav as="ul" className="nav nav-tabs">
                        <Nav.Item as="li" className="nav-item">
                            <Nav.Link className="nav-link" eventKey="All">All Requests</Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li" className="nav-item">
                            <Nav.Link className="nav-link" eventKey="Draft">Draft</Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li" className="nav-item">
                            <Nav.Link className="nav-link" eventKey="Pending">Pending</Nav.Link>
                        </Nav.Item>

                        <Nav.Item as="li" className="nav-item">
                            <Nav.Link className="nav-link" eventKey="Completed">Completed</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </div>
                <div className="d-flex align-items-center mb-2 flex-wrap">
                    <div className="guest-calendar">
                        <DateRangePicker
                            initialSettings={{
                                startDate: start.toDate(),
                                endDate: end.toDate(),
                                ranges: {
                                    Today: [moment().toDate(), moment().toDate()],
                                    Yesterday: [
                                        moment().subtract(1, 'days').toDate(),
                                        moment().subtract(1, 'days').toDate(),
                                    ],
                                    'Last 7 Days': [
                                        moment().subtract(6, 'days').toDate(),
                                        moment().toDate(),
                                    ],
                                    'Last 30 Days': [
                                        moment().subtract(29, 'days').toDate(),
                                        moment().toDate(),
                                    ],
                                    'This Month': [
                                        moment().startOf('month').toDate(),
                                        moment().endOf('month').toDate(),
                                    ],
                                    'Last Month': [
                                        moment().subtract(1, 'month').startOf('month').toDate(),
                                        moment().subtract(1, 'month').endOf('month').toDate(),
                                    ],
                                },
                            }}
                            onCallback={handleCallback}
                        >
                            <div
                                id="reportrange"
                                className="pull-right reportrange"
                                style={{
                                    width: '100%',
                                }}
                            >
                                {/* <i className="fa fa-calendar"></i>&nbsp;&nbsp; */}
                                <span>{label}</span> <i className="fas fa-chevron-down ms-3"></i>
                            </div>
                        </DateRangePicker>

                    </div>
                    <div className="newest ms-3">
                        <Dropdown>
                            <Dropdown.Toggle as="div" className=" btn-select-drop default-select btn i-false">
                                {selectBtn} <i className="fas fa-angle-down ms-2 "></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={()=>setSelectBtn("Oldest")} eventKey="All">Oldest</Dropdown.Item>
                                <Dropdown.Item onClick={()=>setSelectBtn("Newest")} eventKey="All">Newest</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-body p-0">
                            <Tab.Content>
                                <Tab.Pane eventKey="All">
                                    <FilteredRequestListGrid requestLists = {requestsList} request={request} setRequest={setRequest} setFormMode={setFormMode} onShow={onShow}/>
                                </Tab.Pane>
                                <Tab.Pane eventKey="Draft">
                                    <FilteredRequestListGrid requestLists = {requestsDraftList} request={request} setRequest={setRequest} setFormMode={setFormMode} onShow={onShow}/>
                                </Tab.Pane>
                                <Tab.Pane eventKey="Pending">
                                    <FilteredRequestListGrid requestLists = {requestsPendingList} request={request} setRequest={setRequest} setFormMode={setFormMode} onShow={onShow}/>
                                </Tab.Pane>
                                <Tab.Pane eventKey="Completed">
                                    <FilteredRequestListGrid requestLists = {requestsCompletedList} request={request} setRequest={setRequest} setFormMode={setFormMode} onShow={onShow}/>
                                </Tab.Pane>
                            </Tab.Content>
                        </div>
                    </div>
                </div>
            </div>
        </Tab.Container>
    );
}
export    {RequestsListGrid};
