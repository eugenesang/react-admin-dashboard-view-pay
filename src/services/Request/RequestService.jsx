import {ccmaInstance} from "../CcmaInstance";

export const DRAFT = "DRAFT";
export const PENDING ="PENDING";
export const COMPLETED ="COMPLETED";
export const READY ="READY";

export const MEMBER = "MEMBER"
export const MANAGER ="MANAGER"

export const REQUEST_READABLE_DRAFT = {
    editable:false,
    isSaveAsDraftActive: true,
    isSubmitActive:true,
    isReturnToRequester:false,
    isExecuteActive:false
};
export const REQUEST_EDITABLE_DRAFT = {
    editable:true,
    isSaveAsDraftActive: true,
    isSubmitActive:true,
    isReturnToRequester:false,
    isApproveActive:false
};
export const REQUEST_EDITABLE_PENDING = {
    editable:false,
    isSaveAsDraftActive: false,
    isSubmitActive:false,
    isReturnToRequester:true,
    isApproveActive:true
};
export const REQUEST_READABLE = {
    editable:false,
    isSaveAsDraftActive: false,
    isSubmitActive:false,
    isReturnToRequester:false,
    isApproveActive:false
};

export const  fetchRequestList = async ()=>{
    return ccmaInstance.get('request/')

}
export const fetchProjectList= async ()=>{
    return ccmaInstance.get('project/')
}
export const fetchRequesterList= async ()=>{
    return ccmaInstance.get('requester/')
}
export const   fetchAllSystemAccessList =async  ()=>{
    return ccmaInstance.get('systemAccess/');
}
export const   submitRequest= async (request)=>{
    return  ccmaInstance.post('requestAction/submit/',request).catch((reason)=>{console.log("Error occurs", reason)})
}
export const saveAsDraftRequest= async (request)=>{
    return  ccmaInstance.post('requestAction/saveAsDraft/',request)
}


export const approveRequest= async (request)=>{
    return  ccmaInstance.post('requestAction/execute/',request)
}

export const returnToRequester= async (request)=>{
    return ccmaInstance.post('requestAction/returnToRequester/',request)
}
export const getSystemList =(SystemAccessList)=>{
    return SystemAccessList.map((systemAccess)=>systemAccess.systemName).filter((value, index, self)=>  self.indexOf(value) === index);
    }

export const getSystemAccessList =(systemAccessList, systemName)=>{
     return systemAccessList.filter((systemAccess)=> systemAccess.systemName ===systemName);
}


