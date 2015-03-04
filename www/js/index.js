/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        $(document).on("pageshow","#loginPage",function(){ // When entering pagetwo
            loginInit();
        });
        $("#graDis").change(function(e){
            getRotueDetails();
        });
        $('#loadingDiv').hide();
        
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        

        console.log('Received Event: ' + id);
    }
};

app.initialize();

function changePage(page){
        $(page).bind("callback", function(e, args) {
            alert(args.mydata);
        });
        $.mobile.changePage( $(page), "pop", true, true);
        $("page").trigger("callback");
    }
function handleLogin(type) {
        var form = $("#loginForm");  
        //$("#test").text("handleLogin hit");
        //disable the button so we can't resubmit while we wait
        if(type=="Nor")
        {
            $("#submitButton").button('disable');
        }
        var u = $("#username", form).val();
        var p = $("#password", form).val();
        console.log("click");
        if(u != '' && p!= '') {
            var jsonText = JSON.stringify({Username : u,Password :p});
            $.ajax({
                type: "POST",
                url: "http://thekbsystems.com/JPEOpti/JPOpti.asmx/ValidateUser", // add web service Name and web service Method Name
                data: jsonText,  //web Service method Parameter Name and ,user Input value which in Name Variable.
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response)
                    {
                    if(response.d=="A" || response.d=="U")
                        {
                            window.localStorage["username"] = u;
                            window.localStorage["password"] = p; 
                            changePage("#Graphs");
                            window.localStorage["userId"] = response;
                        }
                        else
                        {
                            alert("failed login");
                            $("#submitButton").button('enable');
                        }
                    },
                error: function(xhr, textStatus, error){
                    console.log(xhr.statusText);
                    console.log(textStatus);
                    console.log(error);
                    $("#submitButton").button('enable');
                    alert("Login Failed");
                    }      
            });
        } else {
            alert("You must enter a username and password", function() {});
            $("#submitButton").removeAttr("disabled");
        }
        return false;
    }

$(function(ready){
    $("#graDis").change(function(e)
        {
            $('#graRoute')
            .find('option')
            .remove()
            .end()
            .append('<option selected="selected">Choose Route</option>');
            $( "#graRoute" ).val("Choose Route").change();
            var district = $("#graDis").val();
            var jsonText = JSON.stringify({district : district});
            $.ajax({
                type: "POST",
                url: "http://thekbsystems.com/JPEOpti/JPOpti.asmx/GetRoutesbyDistrict", // add web service Name and web service Method Name
                data: jsonText,  //web Service method Parameter Name and ,user Input value which in Name Variable.
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response)
                    {
                    if(response.d)
                        {
                            var data = JSON.parse(response.d);
                            $.each(data, function(index, element)   {
                                $("#graRoute").append('<option value='+element.Ls_Route+'>'+element.Ls_Route+'</option>');
                            });
                            //alert(response.d.portId);
                            //changePage("#Consumption");
                            //window.localStorage["userId"] = response;
                        }
                    },
                error: function (xhr, ajaxOptions, thrownError)
                    {
                        alert(xhr.status);
                        alert(ajaxOptions);
                        alert(thrownError);
                    }
            }); 
        });
});
$(function(ready){
    $("#graRoute").change(function(e)
        {
            $('#graLiftSt')
            .find('option')
            .remove()
            .end()
            .append('<option>Choose Lift Station</option>');
            $( "#graLiftSt" ).val("Choose Lift Station").change();
            var route = $("#graRoute").val();
            var jsonText = JSON.stringify({route : route});
            $.ajax({
                type: "POST",
                url: "http://thekbsystems.com/JPEOpti/JPOpti.asmx/GetLiftStationsByRoute", // add web service Name and web service Method Name
                data: jsonText,  //web Service method Parameter Name and ,user Input value which in Name Variable.
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response)
                    {
                    if(response.d)
                        {
                            var data = JSON.parse(response.d);
                            $.each(data, function(index, element)   {
                                $("#graLiftSt").append('<option value='+element.Ls_Id+'>'+element.Ls_Id+'</option>');
                            });
                            //alert(response.d.portId);
                            //changePage("#Consumption");
                            //window.localStorage["userId"] = response;
                        }
                    },
                error: function (xhr, ajaxOptions, thrownError)
                    {
                        alert(xhr.status);
                        alert(ajaxOptions);
                        alert(thrownError);
                    }
            }); 
        });
});
$(function(ready){
    $("#graLiftSt").change(function(e)
        {
            $('#graPump')
            .find('option')
            .remove()
            .end()
            .append('<option disabled selected value="">Choose Pump</option>');
            $( "#graPump" ).val("Choose Pump").change();
            var lift = $("#graLiftSt").val();
            var jsonText = JSON.stringify({liftstationId : lift});
            $.ajax({
                type: "POST",
                url: "http://thekbsystems.com/JPEOpti/JPOpti.asmx/GetPumpsByLiftStation", // add web service Name and web service Method Name
                data: jsonText,  //web Service method Parameter Name and ,user Input value which in Name Variable.
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response)
                    {
                    if(response.d)
                        {
                            var data = JSON.parse(response.d);
                            $.each(data, function(index, element)   {
                                $("#graPump").append('<option value='+element.P_Id+'>'+element.P_Id+'</option>');
                            });
                            //alert(response.d.portId);
                            //changePage("#Consumption");
                            //window.localStorage["userId"] = response;
                        }
                    },
                error: function (xhr, ajaxOptions, thrownError)
                    {
                        alert(xhr.status);
                        alert(ajaxOptions);
                        alert(thrownError);
                    }
            }); 
        });
});

$(function(ready){
    $("#cosDis").change(function(e)
        {
            $('#cosRoute')
            .find('option')
            .remove()
            .end()
            .append('<option selected="selected">Choose Route</option>');
            $( "#cosRoute" ).val("Choose Route").change();
            var district = $("#cosDis").val();
            var jsonText = JSON.stringify({district : district});
            $.ajax({
                type: "POST",
                url: "http://thekbsystems.com/JPEOpti/JPOpti.asmx/CostGetRoutesbyDistrict", // add web service Name and web service Method Name
                data: jsonText,  //web Service method Parameter Name and ,user Input value which in Name Variable.
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response)
                    {
                    if(response.d)
                        {
                            var data = JSON.parse(response.d);
                            $.each(data, function(index, element)   {
                                $("#cosRoute").append('<option value='+element.Route+'>'+element.Route+'</option>');
                            });
                            //alert(response.d.portId);
                            //changePage("#Consumption");
                            //window.localStorage["userId"] = response;
                        }
                    },
                error: function (xhr, ajaxOptions, thrownError)
                    {
                        alert(xhr.status);
                        alert(ajaxOptions);
                        alert(thrownError);
                    }
            }); 
        });
});
$(function(ready){
    $("#cosRoute").change(function(e)
        {
            $('#cosLiftSt')
            .find('option')
            .remove()
            .end()
            .append('<option>Choose Lift Station</option>');
            $( "#cosLiftSt" ).val("Choose Lift Station").change();
            var route = $("#cosRoute").val();
            var jsonText = JSON.stringify({route : route});
            $.ajax({
                type: "POST",
                url: "http://thekbsystems.com/JPEOpti/JPOpti.asmx/CostGetLiftStationsByRoute", // add web service Name and web service Method Name
                data: jsonText,  //web Service method Parameter Name and ,user Input value which in Name Variable.
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response)
                    {
                    if(response.d)
                        {
                            var data = JSON.parse(response.d);
                            $.each(data, function(index, element)   {
                                $("#cosLiftSt").append('<option value='+element.Ls_Id+'>'+element.Ls_Id+'</option>');
                            });
                            //alert(response.d.portId);
                            //changePage("#Consumption");
                            //window.localStorage["userId"] = response;
                        }
                    },
                error: function (xhr, ajaxOptions, thrownError)
                    {
                        alert(xhr.status);
                        alert(ajaxOptions);
                        alert(thrownError);
                    }
            }); 
        });
});
$(function(ready){
    $("#cosLiftSt").change(function(e)
        {
            $('#cosPump')
            .find('option')
            .remove()
            .end()
            .append('<option disabled selected value="">Choose Pump</option>');
            $( "#cosPump" ).val("Choose Pump").change();
            var lift = $("#cosLiftSt").val();
            var jsonText = JSON.stringify({liftstationId : lift});
            $.ajax({
                type: "POST",
                url: "http://thekbsystems.com/JPEOpti/JPOpti.asmx/CostGetPumpsByLiftStation", // add web service Name and web service Method Name
                data: jsonText,  //web Service method Parameter Name and ,user Input value which in Name Variable.
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response)
                    {
                    if(response.d)
                        {
                            var data = JSON.parse(response.d);
                            $.each(data, function(index, element)   {
                                $("#cosPump").append('<option value='+element.PId+'>'+element.PId+'</option>');
                            });
                            //alert(response.d.portId);
                            //changePage("#Consumption");
                            //window.localStorage["userId"] = response;
                        }
                    },
                error: function (xhr, ajaxOptions, thrownError)
                    {
                        alert(xhr.status);
                        alert(ajaxOptions);
                        alert(thrownError);
                    }
            }); 
        });
});

function enePageDataCheck()
{

}
function graCosDataCheck(page)
{
    if((page=="gra") && ($("#"+page+"Var").val() == "ebill_get") && ($("#"+page+"LiftSt").val() != "Choose Lift Station"))
    {
        return true;
    }
    else
    {
        var pumps = $("#"+page+"Pump").val() || [];
        if(page =="gra")
        {
            
              if((pumps.length==0) || ($("#"+page+"Var").val() == "Choose Variable"))
              {
                    return false;
              }
              else
              {
                return true;
              }
        }
        else if(page == "cos")
        {   
            if(pumps.length==0)
            {
                return false;
            } 
            else
            {
                return true;
            }
        }
        else
        {
            return true;
        }
    }
}
function GetDataForGraph(page)
{
    var graphDataCheck = graphDataValidation(page);
    if((graCosDataCheck(page)==true) && (graphDataCheck ==true))
        {
            if(page!="ene")
            {
                var pumps = $("#"+page+"Pump").val() || [];
                var pumpsList = "";
                if(pumps.length>1)
                {
                    for(var i=0;i<pumps.length;i++)
                    {
                        if(i==(pumps.length-1))
                        {
                            pumpsList += pumps[i];
                        }
                        else
                        {
                            pumpsList += pumps[i]+",";
                        }
                    }
                }
                else
                {
                    pumpsList = pumps[0]+",";
                }
            }
            if(page!="ene")
            {
                var fromDate = ($("#"+page+"fromDate").val()).split("-");
                var toDate = ($("#"+page+"toDate").val()).split("-");
                var varSelected = $("#"+page+"Var").val();
            }
            if(page == "cos")
            {
                varSelected = "Cost";
            }
            var jsonText1;
            var urlSelected;
            if(page == "gra")
            {
                if(varSelected == "ebill_get")
                {
                    var lifSt = $("#"+page+"LiftSt").val();
                    jsonText1 = JSON.stringify({frommonth: fromDate[1],fromyear:fromDate[0],tomonth:toDate[1],toyear:toDate[0],SelectedValue:varSelected,pumps:lifSt});
                    urlSelected = "http://thekbsystems.com/JPEOpti/JPOpti.asmx/eneWebService"; // add web service Name and web service Method Name
                }
                else
                {
                    jsonText1 = JSON.stringify({frommonth: fromDate[1],fromyear:fromDate[0],tomonth:toDate[1],toyear:toDate[0],SelectedValue:varSelected,pumps:pumpsList});
                    urlSelected = "http://thekbsystems.com/JPEOpti/JPOpti.asmx/BindGraphData"; // add web service Name and web service Method Name
                }
            }
            else if(page == "ene")
            {
                var limit = $("#"+page+"Limit").val();
                var year = $("#"+page+"Year").val();
                var dis = $("#"+page+"Dis").val();
                var cir = $("#"+page+"Sort").val();
                
                jsonText1 = JSON.stringify({limit: limit,year:year,district:dis,criteria:cir});
                urlSelected = "http://thekbsystems.com/JPEOpti/JPOpti.asmx/EneBindGraphData"; // add web service Name and web service Method Name
            }
            else
            {
                jsonText1 = JSON.stringify({frommonth: fromDate[1],fromyear:fromDate[0],tomonth:toDate[1],toyear:toDate[0],pumps:pumpsList});
                urlSelected = "http://thekbsystems.com/JPEOpti/JPOpti.asmx/CostBindGraphData"; // add web service Name and web service Method Name
            }

            $.ajax({
                    type: "POST",
                    url: urlSelected,
                    data: jsonText1,  //web Service method Parameter Name and ,user Input value which in Name Variable.
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response)
                        {
                        if(response.d)
                            {
                                var data = JSON.parse(response.d);
                                /*$.each(data, function(index, element)     {
                                        $("#conCategory").append('<option value='+element.categoryId+'>'+element.categoryName+'</option>');
                                    });*/
                                //alert(response.d.portId);
                                //changePage("#Consumption");
                                //window.localStorage["userId"] = response;
                                if(data.length>0)
                                {
                                    var rawData = data;

                                    if(page=="ene")
                                    {
                                        $("#eneLoadingDiv").css("display","inline");
                                        var costSum = 0;
                                        var eleSum = 0;
                                        for(i=0;i<rawData.length;i++)
                                        {
                                            costSum += rawData[i]["Electricity_Cost_$"];
                                            eleSum += rawData[i]["Energy_Consumption_KWH"];
                                        }
                                        jsonText1 = JSON.stringify({year:year,district:dis,criteria:cir});
                                        urlSelected = "http://thekbsystems.com/JPEOpti/JPOpti.asmx/EneSumingData"; // add web service Name and web service Method Name
                                        $.ajax({
                                            type: "POST",
                                            url: urlSelected,
                                            data: jsonText1,  //web Service method Parameter Name and ,user Input value which in Name Variable.
                                            contentType: "application/json; charset=utf-8",
                                            dataType: "json",
                                            success: function (response)
                                                {
                                                if(response.d)
                                                    {
                                                        var data = JSON.parse(response.d);
                                                        if(data.length>0)
                                                        {
                                                            if(page=="ene")
                                                            {
                                                                var ratio;
                                                                if(cir=="cost")
                                                                {
                                                                    sum = data[0]["sum(Dl_ElectricityCost)"];
                                                                    ratio = (costSum / sum) * 100;
                                                                    //alert(sum);
                                                                }
                                                                else
                                                                {    
                                                                    sum = data[0]["sum(Dl_Energy)"];
                                                                    ratio = (eleSum / sum) * 100;
                                                                    //alert(sum);
                                                                }
                                                                drawEnePieChart(dis,limit,cir,costSum,eleSum,sum,ratio)
                                                            }
                                                            else
                                                            {
                                                                igniteChart(data,pumps,pumps.length,varSelected,page);
                                                            }
                                                        }
                                                        else
                                                        {
                                                            return data;
                                                        }
                                                    }
                                                },
                                            error: function (xhr, ajaxOptions, thrownError)
                                                {
                                                    alert(xhr.status);
                                                    alert(ajaxOptions);
                                                    alert(thrownError);
                                                    alert("Data unavailable");
                                                }
                                        });
                                    }
                                    else
                                    {
                                        if($("#"+page+"Var").val() == "ebill_get")
                                        {
                                            igniteChart(data,pumps,1,varSelected,page);
                                        }
                                        else
                                        {
                                            igniteChart(data,pumps,pumps.length,varSelected,page);
                                        }
                                    }
                                }
                                else
                                {
                                    alert("Data unavailable");
                                    return data;
                                }
                            }
                        },
                    error: function (xhr, ajaxOptions, thrownError)
                        {
                            alert(xhr.status);
                            alert(ajaxOptions);
                            alert(thrownError);
                            alert("Data unavailable");
                        }
                });
        }
    else
    {
        if(page == "ene")
        {
            alert("Enter Valid data");
        }
        else
        {
            if(graphDataCheck == false)
            {
                alert("Enter Valid dates");
            }
            else
            {
                alert("Enter Valid data");
            }
        }
    }    
}
function drawEnePieChart(dis,limit,cir,costSum,eleSum,sum,ratio)
{
    $("#eneLoadingDiv").css("display","none");
    google.load("visualization", "1", {packages:["corechart"]});


        var data2 = [
          ['Task', 'Hours per Day'],
          ['Work',     11],
          ['Eat',      2],
          ['Commute',  2],
          ['Watch TV', 2],
          ['Sleep',    7]
        ];
        var data1;
        if(cir=="cost")
        {
            data1= [["Key","Value"],
            ["Top "+limit+" Stations", costSum],
            ["Remaining Stations",sum]];
        }
        else
        {
            data1= [["Key","Value"],
            ["Top "+limit+" Stations", eleSum],
            ["Remaining Stations",sum]];
        }
        
        var data = google.visualization.arrayToDataTable(data1);
        var title = dis;
        if(cir == "cost")
        {
            title += " Cost Comparision";
        }
        else
        {
            title += " Energy Consumption Comparision";
        }
        var options = {
          legend: 'center',  
          title: title,
          is3D: true,
          backgroundColor: { fill:'transparent' }
        };

        var chart = new google.visualization.PieChart(document.getElementById('eneChart'));

        chart.draw(data, options);
      
}
function graphDataValidation(Page)
    {
        if(Page == "ene")
        {
            var limit = $("#"+Page+"Limit").val();
            var year = $("#"+Page+"Year").val();
            var dis = $("#"+Page+"Dis").val();
            var cir = $("#"+Page+"Sort").val();
            if((limit == "") || (year == "Choose Year") || (dis == "Choose District") || (cir == "Choose Criteria"))
            {
                return false;
            }
            else
            {
                return true;
            }
        }
else
{
        if($("#"+Page+"fromDate").val() != "")
        {
            var fromDate = ($("#"+Page+"fromDate").val()).split("-");
            if($("#"+Page+"toDate").val() != "")
            {
                var toDate = ($("#"+Page+"toDate").val()).split("-");
                if(fromDate[0]<=toDate[0])
                {
                    if(fromDate[0]==toDate[0])
                    {
                        if(fromDate[1]<=toDate[1])
                        {
                            if(fromDate[1]==toDate[1])
                            {
                                if(fromDate[2]<=toDate[2])
                                {
                                    return true;
                                }
                                else
                                {
                                    return false;
                                }
                            }
                            else
                            {
                                return true;
                            }
                        }
                        else
                        {
                            return false;
                        }
                            
                    }
                    else
                    {
                        return true;
                    }
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }
    }
function getVariableName(varSel)
    {
        if(varSel=="flowrate_get")
        {
            return "FlowRate";
        }
        else if(varSel=="head_get")
        {
            return "TotalHead";
        }
        else if(varSel=="runtime_get")
        {
            return "Runtime";
        }
        else if(varSel=="amperage_get")
        {
            return "CurrentFlow";
        }
        else if(varSel=="ebill_get")
        {
            return "ElectricityCost";
        }
        else if(varSel=="electricalworkdone_get")
        {
            return "EnergyConsumed";
        }
        else if(varSel=="mechanicalworkdone_get")
        {
            return "WorkDone";
        }
        else if(varSel=="costperwork")
        {
            return "costperwork";
        }
        else
        {
            return "PumpEfficiency";
        }
    }

function igniteChart(rawData,pumpIds,numOfPumps,varSel,Page)
    {
            $(function () {
                $("#"+Page+"Chart").igDataChart();
                $("#"+Page+"Chart").igDataChart( "destroy" );
                $("#"+Page+"HorizontalZoomSlider").val(1);
                $("#"+Page+"HorizontalZoomSlider").slider('refresh');
                //var varSelName = getVariableName(varSel);
                var varSelName = $("#"+Page+"Var option:selected").val();
                varSelName = getVariableName(varSelName);
                var varTitle = $("#"+Page+"Var option:selected").text();
                if(Page == "cos")
                {
                    varSelName = "cost";
                    varTitle = "Cost";
                }
                var tempNumOfPorts = numOfPumps;
                var graphData = [];
                var avgData = [];
                var maxData = [];
                var minData = [];
                var emiAvgSeriesSet = false;
                var emiMinSeriesSet = false;
                var emiMaxSeriesSet = false;
                var wasAvgSeriesSet = false;
                var wasMinSeriesSet = false;
                var wasMaxSeriesSet = false;
                var avg = rawData[0].Column1;
                var monthsCount = (rawData.length)/numOfPumps;
                var startDate = rawData[0].Date;
                var endDate;
                //var catName = portName = $("#"+Page+"Category option[value='"+catId+"']").text();
                //var subCatName = portName = $("#"+Page+"SubCategory option[value='"+subCatId+"']").text();
                var marker = "none";
                var thickness = 5;
                var seriesType = $("#"+Page+"SeriesType").val();
                if (seriesType == "area" ||
                    seriesType == "splineArea" ||
                    seriesType == "column" ||
                    seriesType == "waterfall" ||
                    seriesType == "point" ||
                    seriesType == "stepArea") 
                    {
                        thickness = 1;
                    }
                if (seriesType == "point") 
                    {
                        marker = "circle";
                    }
                if(numOfPumps == 1)
                {
                    for(i=0;i<rawData.length;i++)
                    {
                        var portValue;
                        if(varSel == "ebill_get")
                        {
                            portValue = "Port"+rawData[i].LiftStationID+"Value";
                        }
                        else
                        {
                            portValue = "Port"+rawData[i].PumpID+"Value";   
                        }
                        graphData[i] = {Date: rawData[i].Date};
                        graphData[i][portValue] = rawData[i][varSelName];
                        if(avg>rawData[i][varSelName])
                        {
                            avg = rawData[i][varSelName];
                        }
                    }
                    endDate = rawData[i-1].Date;
                }
                else
                {
                    for(i=0;i<monthsCount;i++)
                        {
                            graphData[i] = {Date: rawData[i].Date};
                            //maxData[i] =  rawData[i][varSelName];
                            //minData[i] =  rawData[i][varSelName];
                        }
                    i=0;
                    while(i<rawData.length)
                    {
                        var portValue = "Port"+rawData[i].PumpID+"Value";
                        for(j=0;j<monthsCount;j++)
                        {
                            /*if(i>=monthsCount)
                            {
                                if(maxData[j]<rawData[i].Column1)
                                {
                                    maxData[j] =  rawData[i].Column1;
                                }
                                if(minData[j]>rawData[i].Column1)
                                {
                                    minData[j] =  rawData[i].Column1;
                                }
                            }*/
                            graphData[j][portValue] = rawData[i][varSelName];
                            if(avg>rawData[i].Column1)
                            {
                                avg = rawData[i][varSelName];
                            }
                            i++;
                        }
                    }
                    /*for(j=0;j<monthsCount;j++)
                        {
                            graphData[j]["min"] = minData[j];
                            graphData[j]["max"] = maxData[j];
                            graphData[j]["avg"] = (maxData[j] + minData[j])/2;
                        }*/
                    endDate = rawData[i-1].Date;
                }
                var series = [];
                for(i=0;i<numOfPumps;i++)
                {
                    var portName;
                    var portValue;
                    if(varSel == "ebill_get")
                    {
                        portName = $("#"+Page+"LiftSt").val();
                        portValue = "Port"+$("#"+Page+"LiftSt").val()+"Value";
                    }
                    else
                    {
                        portName = pumpIds[i];
                        portValue = "Port"+portName+"Value";
                    }
                    series[i]= {
                                name: portName,
                                    type: $("#"+Page+"SeriesType").val(),
                                    title: portName,
                                    xAxis: "DateAxis",
                                    yAxis: "CatAxis",
                                    showTooltip: true,
                                    valueMemberPath: portValue,
                                    markerType: marker,
                                    isTransitionInEnabled: true,
                                    isHighlightingEnabled: true,
                                    thickness: thickness
                                }
                }
                i--;

                /*if($("#"+Page+"graphCompOptions-max").is(':checked'))
                {
                    series[++i]= {
                                name: "Maximum",
                                    type: $("#"+Page+"SeriesType").val(),
                                    title: "Max",
                                    xAxis: "DateAxis",
                                    yAxis: "CatAxis",
                                    valueMemberPath: "max",
                                    markerType: marker,
                                    isTransitionInEnabled: true,
                                    isHighlightingEnabled: true,
                                    thickness: thickness
                                }
                    if(Page == "emi")
                    {           
                        emiMaxSeriesSet = true;
                    }
                    else
                    {
                        wasMaxSeriesSet = true;
                    }   
                }
                if($("#"+Page+"graphCompOptions-min").is(':checked'))
                {
                    series[++i]= {
                                name: "Minimum",
                                    type: $("#"+Page+"SeriesType").val(),
                                    title: "Min",
                                    xAxis: "DateAxis",
                                    yAxis: "CatAxis",
                                    valueMemberPath: "min",
                                    markerType: marker,
                                    isTransitionInEnabled: true,
                                    isHighlightingEnabled: true,
                                    thickness: thickness
                                }
                    if(Page == "emi")
                    {           
                        emiMinSeriesSet = true;
                    }
                    else
                    {
                        wasMinSeriesSet = true;
                    }
                }
                if($("#"+Page+"graphCompOptions-avg").is(':checked'))
                {
                    series[++i]= {
                                name: "Average",
                                    type: $("#"+Page+"SeriesType").val(),
                                    title: "Avg",
                                    xAxis: "DateAxis",
                                    yAxis: "CatAxis",
                                    valueMemberPath: "avg",
                                    markerType: marker,
                                    isTransitionInEnabled: true,
                                    isHighlightingEnabled: true,
                                    thickness: thickness
                                }
                    if(Page == "emi")
                    {           
                        emiAvgSeriesSet = true;
                    }
                    else
                    {
                        wasAvgSeriesSet = true;
                    }
                }*/

                var data = [
                    { "CountryName": "China", "Pop1995": 1216, "Pop2005": 1297, "Pop2015": 1361, "Pop2025": 1394 },
                    { "CountryName": "India", "Pop1995": 920, "Pop2005": 1090, "Pop2015": 1251, "Pop2025": 1396 },
                    { "CountryName": "United States", "Pop1995": 266, "Pop2005": 295, "Pop2015": 322, "Pop2025": 351 },
                    { "CountryName": "Indonesia", "Pop1995": 197, "Pop2005": 229, "Pop2015": 256, "Pop2025": 277 },
                    { "CountryName": "Brazil", "Pop1995": 161, "Pop2005": 186, "Pop2015": 204, "Pop2025": 218 }
                ];

                var title;
                var subtitle
                if(numOfPumps>1)
                    {
                        title = varTitle+" in Pumps";
                    }
                else
                    {
                        title = varTitle+" in Pump";
                    }
                $("#"+Page+"Chart").igDataChart({
                    legend: { element: Page+"LineLegend" },
                    title: title,
                    horizontalZoomable: true,
                    verticalZoomable: true,
                    dataSource: graphData,
                    axes: [
                        {
                            name: "DateAxis",
                            type: "categoryX",
                            label: "Date"
                        },
                        {
                            name: "CatAxis",
                            type: "numericY", 
                            minimumValue: avg-1000,
                            title: "Units",
                        }
                    ],
                    series: series
                        
                });
                $("#"+Page+"Chart").igDataChart("resetZoom");

                $("#"+Page+"Chart").igDataChart({defaultInteraction: "dragPan"});
                
                $("#"+Page+"SeriesType").change(function (e) {
                    $("#"+Page+"HorizontalZoomSlider").val(1);
                    $("#"+Page+"HorizontalZoomSlider").slider('refresh');
                
                    var marker = "none";
                    var thickness = 5,
                    seriesType = $(this).val();
                    if (seriesType == "area" ||
                        seriesType == "splineArea" ||
                        seriesType == "column" ||
                        seriesType == "waterfall" ||
                        seriesType == "point" ||
                        seriesType == "stepArea") {
                        thickness = 1;
                    }
                    if (seriesType == "point") {
                        marker = "circle";
                    }
                    for(i=0;i<tempNumOfPorts;i++)
                    {
                        var portName;
                        var portValue;
                        if(varSel == "ebill_get")
                        {
                            portName = $("#"+Page+"LiftSt").val();
                            portValue = "Port"+$("#"+Page+"LiftSt").val()+"Value";
                        }
                        else
                        {
                            portName = pumpIds[i];
                            portValue = "Port"+portName+"Value";
                        }
                        try
                        {
                            $("#"+Page+"Chart").igDataChart("option", "series", [{ name: portName,remove: true}]);
                        }
                        catch(err)
                        {
                            portName = pumpIds[i];
                            //$("#chart").igDataChart("option", "series", [{ name: portName,remove: true}]);
                            //var pLen = pumpIds.length;
                            //igniteChart(rawData,pumpIds[(pLen-1)],1,catId);
                            GetDataforGraph(Page);
                            break;
                        }
                    }
                    /*if(numOfPumps>1)
                    {
                        if(Page == "emi")
                        {
                            if(emiMaxSeriesSet)
                            {
                                $("#"+Page+"Chart").igDataChart("option", "series", [{ name: "Maximum",remove: true}]);
                                emiMaxSeriesSet = false;
                            }
                            if(emiMinSeriesSet)
                            {
                                $("#"+Page+"Chart").igDataChart("option", "series", [{ name: "Minimum",remove: true}]);
                                emiMinSeriesSet = false;
                            }
                            if(emiAvgSeriesSet)
                            {
                                $("#"+Page+"Chart").igDataChart("option", "series", [{ name: "Average",remove: true}]);
                                emiAvgSeriesSet = false;
                            }
                        }
                        else
                        {
                            if(wasMaxSeriesSet)
                            {
                                $("#"+Page+"Chart").igDataChart("option", "series", [{ name: "Maximum",remove: true}]);
                                wasMaxSeriesSet = false;
                            }
                            if(wasMinSeriesSet)
                            {
                                $("#"+Page+"Chart").igDataChart("option", "series", [{ name: "Minimum",remove: true}]);
                                wasMinSeriesSet = false;
                            }
                            if(wasAvgSeriesSet)
                            {
                                $("#"+Page+"Chart").igDataChart("option", "series", [{ name: "Average",remove: true}]);
                                wasAvgSeriesSet = false;
                            }
                        }
                    }*/
                    for(i=0;i<numOfPumps;i++)
                    {
                        var portName;
                        var portValue;
                        if(varSel == "ebill_get")
                        {
                            portName = $("#"+Page+"LiftSt").val();
                            portValue = "Port"+$("#"+Page+"LiftSt").val()+"Value";
                        }
                        else
                        {
                            portName = pumpIds[i];
                            portValue = "Port"+portName+"Value";
                        }
                        $("#"+Page+"Chart").igDataChart("option", "series", [{
                                    name: portName,
                                    type: $(this).val(),
                                    title: portName,
                                    xAxis: "DateAxis",
                                    yAxis: "CatAxis",
                                    valueMemberPath: portValue,
                                    markerType: marker,
                                    isTransitionInEnabled: true,
                                    isHighlightingEnabled: true,
                                    thickness: thickness
                                    }]);
                    }
                /*if($("#"+Page+"graphCompOptions-max").is(':checked'))
                {
                    $("#"+Page+"Chart").igDataChart("option", "series", [{
                                name: "Maximum",
                                    type: $(this).val(),
                                    title: "Max",
                                    xAxis: "DateAxis",
                                    yAxis: "CatAxis",
                                    valueMemberPath: "max",
                                    markerType: marker,
                                    isTransitionInEnabled: true,
                                    isHighlightingEnabled: true,
                                    thickness: thickness
                                }]);
                    if(Page == "emi")
                    {           
                        emiMaxSeriesSet = true;
                    }
                    else
                    {
                        wasMaxSeriesSet = true;
                    }
                }
                if($("#"+Page+"graphCompOptions-min").is(':checked'))
                {
                    $("#"+Page+"Chart").igDataChart("option", "series", [{
                                name: "Minimum",
                                    type: $(this).val(),
                                    title: "Min",
                                    xAxis: "DateAxis",
                                    yAxis: "CatAxis",
                                    valueMemberPath: "min",
                                    markerType: marker,
                                    isTransitionInEnabled: true,
                                    isHighlightingEnabled: true,
                                    thickness: thickness
                                }]);
                    if(Page == "emi")
                    {           
                        emiMinSeriesSet = true;
                    }
                    else
                    {
                        wasMinSeriesSet = true;
                    }
                }
                if($("#"+Page+"graphCompOptions-avg").is(':checked'))
                {
                    $("#"+Page+"Chart").igDataChart("option", "series", [{
                                name: "Average",
                                    type: $(this).val(),
                                    title: "Avg",
                                    xAxis: "DateAxis",
                                    yAxis: "CatAxis",
                                    valueMemberPath: "avg",
                                    markerType: marker,
                                    isTransitionInEnabled: true,
                                    isHighlightingEnabled: true,
                                    thickness: thickness
                                }]);
                    if(Page == "emi")
                    {           
                        emiAvgSeriesSet = true;
                    }
                    else
                    {
                        wasAvgSeriesSet = true;
                    }
                }*/ 
                $("#"+Page+"Chart").igDataChart("resetZoom");
                });
                $("#"+Page+"HorizontalZoomSlider").change(function (e) {
                    var val = $("#"+Page+"HorizontalZoomSlider").val();
                    val = Math.abs(val-101);
                    val = val/100;
                    $("#"+Page+"Chart").igDataChart("option", "windowScaleVertical", 1);
                    $("#"+Page+"Chart").igDataChart("option", "windowScaleHorizontal", val);
                });
            }); 
    }    
function checkPreAuth() {
        var form = $("#loginForm");
        if((window.localStorage["username"] != undefined && window.localStorage["password"] != undefined)&&(window.localStorage["username"] != "" && window.localStorage["password"] != "")) {
            $("#username", form).val(window.localStorage["username"]);
            $("#password", form).val(window.localStorage["password"]);
            handleLogin("Pre");
        }
    }
function deviceReady() 
    {
        $("#loginForm").on("submit",handleLogin);
        //getPortNamesAndCat();
        
    }
function loginInit()
    {
        $('#password').val("");
        $('#username').val("");
        $("#submitButton").button('enable');
        $("#submitButton").removeClass('active');
        $("#submitButton").trigger("create");
    }
function search(page)
    {
        var loc = lif ="";
        loc = $("#"+page+"SeaLoc").val();
        lif = $("#"+page+"SeaLif").val();
        if(loc!='')
        {
             //alert("Values: "+loc+" "+lif);
             $("#graSearch").popup("close");
             var jsonText = JSON.stringify({location : loc});
            $.ajax({
                type: "POST",
                url: "http://thekbsystems.com/JPEOpti/JPOpti.asmx/GetLiftStationByLocation", // add web service Name and web service Method Name
                data: jsonText,  //web Service method Parameter Name and ,user Input value which in Name Variable.
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response)
                    {
                    if(response.d)
                        {
                            var data = JSON.parse(response.d);
                            if(data.length>0 && (!(data[0].hasOwnProperty('Error'))))
                            {
                                $('#graLiftSt')
                                    .find('option')
                                    .remove()
                                    .end();
                                    $.each(data, function(index, element)   {
                                        $("#graLiftSt").append('<option value='+element.Ls_Id+'>'+element.Ls_Id+'</option>');
                                    });
                                    $("#graLiftSt").val($("#graLiftSt option:first").val()).change();
                            }
                            else
                            {
                                alert("No matching Lift Station Id in this location.");
                            }
                        }
                    },
                error: function (xhr, ajaxOptions, thrownError)
                    {
                        alert(xhr.status);
                        alert(ajaxOptions);
                        alert(thrownError);
                    }
            }); 
             //changePage("Graphs");
        }
        else if(lif!='')
        {
             //alert("Values: "+loc+" "+lif);
             $("#graSearch").popup("close");
             var jsonText = JSON.stringify({ liftStationId : lif});
             $.ajax({
                type: "POST",
                url: "http://thekbsystems.com/JPEOpti/JPOpti.asmx/GetPumpIdsByLiftstation", // add web service Name and web service Method Name
                data: jsonText,  //web Service method Parameter Name and ,user Input value which in Name Variable.
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response)
                    {
                    if(response.d)
                        {
                            var data = JSON.parse(response.d);
                            if(data.length>0)
                            {
                                $('#graLiftSt')
                                    .find('option')
                                    .remove()
                                    .end();
                                $("#graLiftSt").append('<option value='+lif+'>'+lif+'</option>');
                                $("#graLiftSt").val($("#graLiftSt option:first").val()).change();
                                $('#graPump')
                                    .find('option')
                                    .remove()
                                    .end();
                                $.each(data, function(index, element)   {
                                    $("#graPump").append('<option value='+element.Ls_Id+'>'+element.P_Id+'</option>');
                                });
                            }
                            else
                            {
                                alert("No matching Pumps for this Lift Station Id.");
                            }

                        }
                    },
                error: function (xhr, ajaxOptions, thrownError)
                    {
                        alert(xhr.status);
                        alert(ajaxOptions);
                        alert(thrownError);
                    }
            }); 
        }
        else
        {
            alert("Enter Valid Data.");
        }
    }