/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
var jpdbBaseURL = "https://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var empDBName = "Student";
var empRelationName = "Student-Rel";
var connToken = "90934288|-31949202650970945|90957714";


$('#stdid').focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getEmpIdAsJsonObj() {
    var empid = $("#stdid").val();
    return JSON.stringify({id: empid});
}


function executeCommandAtGivenBaseUrl(request, baseUrl, apiEndPoint) {
    var url = baseUrl + apiEndPoint;
    var jsonResponse;

    $.ajax({
        type: "POST",
        url: url,
        data: request,
        contentType: "application/json",
        async: false,
        success: function (result) {
            jsonResponse = result;
        },
        error: function (error) {
            console.error("Error executing command:", error);
            jsonResponse = error;
        }
    });

    return jsonResponse;
}



function createPUTRequest(connToken, jsonObj, dbName, relName) {
    return JSON.stringify({
        token: connToken,
        dbName: dbName,
        cmd: "PUT",
        rel: relName,
        jsonStr: JSON.parse(jsonObj) // Ensure jsonObj is parsed into a valid JSON object
    });
}


function executeCommand(reqString, dbBaseUrl, apiEndPointUrl) {
    var url = dbBaseUrl + apiEndPointUrl;
    var jsonObj;
    $.post(url, reqString, function (result) {
        jsonObj = JSON.parse(result);
    }).fail(function (result) {
        var dataJsonObj = result.responseText;
        jsonObj = JSON.parse(dataJsonObj);
    });
    return jsonObj;
}



function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#stdname").val(record.name);
    $("#class").val(record.salary);
    $("#dob").val(record.hra);
    $("#address").val(record.da);
    $("#edate").val(record.deduction);
}

function resetForm() {
    $("#stdid, #stdname, #class, #dob, #address, #edate").val("");
    $("#stdid").prop("disabled", false);
    $("#save, #change, #reset").prop("disabled", true);
    $("#stdid").focus();
}

function validateData() {
    var empid = $("#stdid").val();
    var empname = $("#stdname").val();
    var empsal = $("#class").val();
    var hra = $("#dob").val();
    var da = $("#address").val();
    var deduct = $("#edate").val();

    if (!empid) {
        alert("Student ID missing");
        $("#stdid").focus();
        return false;
    }
    if (!empname) {
        alert("Student Name missing");
        $("#stdname").focus();
        return false;
    }
    if (!empsal) {
        alert("Class missing");
        $("#class").focus();
        return false;
    }
    if (!hra) {
        alert("Address missing");
        $("#address").focus();
        return false;
    }
    if (!da) {
        alert("DOB missing");
        $("#dob").focus();
        return false;
    }
    if (!deduct) {
        alert("Enrollment date missing");
        $("#edate").focus();
        return false;
    }
    
    var jsonStrObj= {
        id: empid,
        name: empname,
        salary: empsal,
        hra: hra,
        da: da,
        deduction: deduct
    };
    
    return JSON.stringify(jsonStrObj);
}

    function getEmp() {
        var empIdJsonObj = getEmpIdAsJsonObj();
        var getRequest = CreateGET_BY_KEYRequest(connToken, empDBName, empRelationName, empIdJsonObj);
        jQuery.ajaxSetup({async: false});
        var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
        jQuery.ajaxSetup({async: true});

        if (resJsonObj.status === 400) {
            $("#save").prop("disabled", false);
            $("#reset").prop("disabled", false);
            $("#stdname").focus();
        } else if (resJsonObj.status === 200) {
            $("#stdid").prop("disabled", true);
            fillData(resJsonObj);
            $("#change").prop("disabled", false);
            $("#reset").prop("disabled", false);
            $("#stdname").focus();
        }
    }
    
    function saveData(){
        var jsonStrObj = validateData();
        if(jsonStrObj === ""){
            return "";
        }
        var putRequest = createPUTRequest(connToken,jsonStrObj,empDBName,empRelationName);
        jQuery.ajaxSetup({async : false});
        var resJsonObj = executeCommandAtGivenBaseUrl(putRequest,jpdbBaseURL, jpdbIML);
        jQuery.ajaxSetup({async : true});
        resetForm();
        $("#stdid").focus();
    }
    
    function changeData() {
        $("#change").prop("disabled", true);
        jsonChg = validateData();
        var updateRequest = createUPDATERecordRequest(connToken,jsonChg,empDBName,empRelationName, localStorage.getItem('recno'));
        jQuery.ajaxSetup({async : false});
        var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest,jpdbBaseURL, jpdbIML);
        jQuery.ajaxSetup({async : true});
        console.log(resJsonObj);
        resetForm();
        $("#stdid").focus();
         
    }
