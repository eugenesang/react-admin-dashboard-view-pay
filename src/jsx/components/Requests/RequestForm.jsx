import React, {useEffect, useState} from 'react';
import {Modal} from "react-bootstrap";
import user from "../../../images/task/user.jpg";
import swal from "sweetalert";
import {
    fetchRequesterList,
    fetchProjectList,
    fetchAllSystemAccessList,
    getSystemList,
    getSystemAccessList,
    submitRequest,
    saveAsDraftRequest,
    DRAFT,
    MEMBER,
    REQUEST_EDITABLE_DRAFT,
    REQUEST_READABLE,
    approveRequest,
    returnToRequester,
    REQUEST_EDITABLE_PENDING,
    MANAGER
} from "../../../services/Request/RequestService";
import requestTemplate from "../../../template/request.json";
import {getRole} from "../../../services/AuthService";

const RequestForm = ({show, onShow, request, setRequest, formMode, setFormMode})=>{

    const [file, setFile] = React.useState(null);
    const [requesterList, setRequesterList]=useState([{}]);
    const [projectList, setProjectList]=useState([{}]);
    const [allSystemAccessList, setAllSystemAccessList]=useState([{}]);
    const [systemList, setSystemList]=useState([]);
    const [systemAccessList, setSystemAccessList]=useState([{}]);

    useEffect(async ()=>{
        let response = await fetchRequesterList();
        let responseList = response.data;
        setRequesterList(responseList);

        response = await fetchProjectList();
        responseList = response.data;
        setProjectList(responseList);

        response = await fetchAllSystemAccessList();
        responseList = response.data;
        setAllSystemAccessList(responseList);
        let systemList= getSystemList(responseList);
        setSystemList(systemList);
        let systemAccessList = getSystemAccessList(responseList ,responseList[0].systemName );
        setSystemAccessList(systemAccessList);

    },[show])
    useEffect(async ()=>{
        let response = await fetchAllSystemAccessList();
        let responseList = response.data;
        setAllSystemAccessList(responseList);
        let systemList= getSystemList(responseList);
        setSystemList(systemList);
        let systemAccessList = getSystemAccessList(responseList ,responseList[0].systemName );
        setSystemAccessList(systemAccessList);
    },[request])

    function updateRequestTemplate() {
        console.log("Request before sending", request);
        if (request.id) {
            requestTemplate.id = request.id;
        }
        requestTemplate.requester.id = request.requesterId;
        requestTemplate.project.id = request.projectId;
        requestTemplate.systemAccess.id = request.systemAccessId;
    }

//Add Submit data
    const submitHandler = async (event)=> {
        event.preventDefault();
        updateRequestTemplate();
        await submitRequest(requestTemplate);
        onShow(false);
        await swal('Good job!', 'Successfully submitted', "success");

    };

    const approveHandler= async (event)=> {
        event.preventDefault();
        updateRequestTemplate();
        await approveRequest(requestTemplate);
        onShow(false);
        await swal('Good job!', 'Successfully approve', "success");

    };
    const returnToRequesterHandler= async (event)=> {
        event.preventDefault();
        updateRequestTemplate();
        await returnToRequester(requestTemplate);
        onShow(false);
        await swal('Good job!', 'Successfully return to requester', "success");
    };
    const saveAsDraftHandler = async (event)=> {
        event.preventDefault();
        updateRequestTemplate();
        console.log("Template request before sending", requestTemplate);
        await saveAsDraftRequest(requestTemplate);
        onShow(false);
        await swal('Good job!', 'Successfully save as draft', "success");
    };

    function closeForm() {
        onShow(false);
    }

    function requesterOption() {
        return !(formMode.editable && getRole() === MANAGER);
    }

    return (
        <Modal className="modal fade"  show={show} onHide={onShow} >
            <div className="" role="document">
                <div className="">

                    <form >
                        <div className="modal-header">
                            <h4 className="modal-title fs-20">Access Request</h4>
                            <button type="button" className="btn-close" onClick={()=> closeForm()
                            } data-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <i className="flaticon-cancel-12 close"></i>
                            <div className="add-contact-box">
                                <div className="add-contact-content">
                                    <div className="image-placeholder">
                                        <div className="avatar-edit">
                                            <label htmlFor="imageUpload" name=''  ></label>
                                        </div>
                                        <div className="avatar-preview">
                                            <div id="imagePreview">
                                                <img id="saveImageFile" src={file? URL.createObjectURL(file) : user}
                                                     alt={file? file.name : null}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="text-black font-w500">Requester</label>
                                        <div className="contact-occupation">
                                            <select className="form-control" disabled={requesterOption()} value={request.requesterId} onChange={(event)=>setRequest((prev)=>({...prev, requesterId:event.target.value}))}>
                                                {requesterList.map((requester) => <option key={requester.id} value={requester.id}>{requester.fullName}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="text-black font-w500">Project</label>
                                        <div className="contact-occupation">
                                            <select className="form-control" disabled={!formMode.editable} value={request.projectId} onChange={(event)=>setRequest((prev)=>({...prev, projectId:event.target.value}))}>
                                                {projectList.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group mb-3">
                                        <label className="text-black font-w500">Systems</label>
                                        <div className="contact-occupation">
                                            <select
                                                className="form-control" disabled={!formMode.editable} value={request.systemId} onChange={(event)=>{
                                                    const selectedSystemAccessList = getSystemAccessList(allSystemAccessList, event.target.value);
                                                    setRequest((prev)=>({...prev, systemId:event.target.value, systemAccessId: selectedSystemAccessList[0].id}));
                                                    setSystemAccessList(selectedSystemAccessList);}}
                                            >
                                                {systemList.map((system) => <option key={system} value={system}>{system}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="text-black font-w500">Access</label>
                                        <div className="contact-occupation">
                                            <select  className="form-control" disabled={!formMode.editable} value={request.systemAccessId} onChange={(event)=>setRequest((prev)=>({...prev, systemAccessId:event.target.value}))}>
                                                {systemAccessList.map((systemAccess) => <option key={systemAccess.id} value={systemAccess.id}>{systemAccess.accessPermission}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className=" modal-footer">
                            <div className="container" >
                                <div className="row">
                                    <button type="submit" className="btn btn-secondary  m-2 col" hidden={!formMode.isSaveAsDraftActive} onClick={saveAsDraftHandler}>save as draft</button>
                                    <button type="button"  onClick={submitHandler} className="btn btn-secondary  m-2 col " hidden={!formMode.isSubmitActive} > <i className="flaticon-delete-1"></i>submit</button>
                                    <button type="button" onClick={(e)=> {onShow(false); returnToRequesterHandler(e);}} className="btn btn-secondary m-2 col " hidden={!formMode.isReturnToRequester} > <i className="flaticon-delete-1"></i>Return to Requester</button>
                                    <button type="submit" className="btn btn-secondary m-2 col "  hidden={!formMode.isApproveActive}  onClick={approveHandler}>Approve</button>
                                    <button type="submit" className="btn btn-danger m-2 col " onClick={(event)=> {event.preventDefault(); onShow(false);}}>cancel</button>
                                </div>
                            </div>
                        </div>
                    </form>

                </div>
            </div>
        </Modal>
    )
}

export default RequestForm;
