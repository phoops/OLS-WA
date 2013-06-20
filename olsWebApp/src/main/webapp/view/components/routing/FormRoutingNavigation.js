Ext.ns('RNGEO');
var host = document.location.host;
var startPoint = null;
var endPoint = null;
var viaPoints = []; 
var namespace = 'http://www.opengis.net/xls';
var namespace2 = 'http://www.opengis.net/gml';
RNGEO.RoutinNavigationForm = Ext.extend(Ext.form.FormPanel, {
	id: 'routingID',
	collapsible: true,
    initComponent:function() {
    	var config = 
    	{
    			id: 'formRNId',
		        labelWidth: 75, // label settings here cascade unless 	
		        frame:true,
		        title: 'Routing Navigation',
		        bodyStyle:'padding:5px 5px 0',
		        width: '22%',
		        cls: 'floating-form_left',
		        height: 180,
		        defaults: {width: 230},
//		        defaultType: 'textfield',
		
		        items: [
		          {
		        	  xtype: 'textfield',
		        	  fieldLabel: 'Start Point',
		        	  id: 'startPoint',
		        	  disabled: true,
		        	  handler: function(storeData){
		        		  	var store = storeData.toString();
		        		  	var values=store.split(",");
				        	this.setValue(values[0]);
		        	  },
		        	  validator: function(v) {
		        		  if (v == null || v === "" || v.lenght == 0) {
		        		        return "Value is incorrect";
		        		    }
		        		    return true;
                      },
		          },
		          {
		        	  xtype: 'textfield',
		        	  fieldLabel: 'End Point',	    	   
		        	  id: 'endPoint',
		        	  disabled: true,
		        	  handler: function(storeData){
		        		  	var store = storeData.toString();
		        		  	var values=store.split(",");
				        	this.setValue(values[0]);
		        	  },
		        	  validator: function(v) {
		        		  if (v == null || v === "" || v.lenght == 0) {
		        		        return "Value is incorrect";
		        		    }
		        		    return true;
                      }
		          },
		          {
		        	  xtype: 'combo',
		        	  store: new Ext.data.ArrayStore({
		        	        id: 0,
		        	        fields: [
		        	            'met',
		        	        ],
		        	        data: [ ['Fastest'],
		        	                ['Shortest'],
		        	                ['Pedestrian']
		        	        	 ]
		        	    }),
			          displayField: 'met',
			          typeAhead: true,
			          mode: 'local',
			          forceSelection: true,
			          triggerAction: 'all',
			          value: 'Fastest',
//			          emptyText:'Seleziona un Metodo...',
			          selectOnFocus:true,
		        	  fieldLabel: 'Method',
		        	  id: 'method'
//		        		  ,
//		        	  validator: function(v) {
//		        		  if (v === "" || v == null || v.lenght == 0) {
//		        		        return "Value is incorrect";
//		        		    }
//		        		    return true;
//                      }
		          },
		          {
		        	  	xtype:'label',
	                    text: "Pulsante destro del mouse sulla mappa o selezione dalla lista per definire l'inizio e la fine del viaggio.",
	                    name: 'infoLabel',
	                    labelStyle: 'font-weight:bold;',
	                    anchor:'93%'	    	   
		          }
		        ],
		        buttons: [
		            {
		            	id: 'geoRNSubmit',
		            	text: 'Submit',
		            	handler: function(toponimo){
		            		document.body.style.cursor = "wait";
		            		var xmlhttp = null;
		            		var methodSearch = Ext.getCmp('method').getValue();
		            		
		            		if(methodSearch != ""){
		            		
			            		if (window.XMLHttpRequest){
			            			// code for IE7+, Firefox, Chrome, Opera, Safari
			            			xmlhttp = new XMLHttpRequest();
			            		}else{
			            			// code for IE6, IE5
			            			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			            		}
			            		
			            		var startValue = Ext.getCmp('startPoint').getValue();
			            		var endValue = Ext.getCmp('endPoint').getValue();
			            		var xmlVia = "";
			            		for(var i=0; i<viaPoints.length; i++){
			            			xmlVia += "			<ViaPoint>"
			            					+"				<Position>"
			            					+"					<gml:Point>"
			            					+"						<gml:pos>"+viaPoints[i].lat +" "+ viaPoints[i].lon+"</gml:pos>"
			            					+"					</gml:Point>"
			            					+"				</Position>"
			            					+"			</ViaPoint>";
			            		}
			            		
			            		var url = "http://"+host+"/geoserver/ols";
			            		var xml = "<?xml version='1.0' encoding='UTF-8'?>"
			            					+"<DetermineRouteRequest xmlns='http://www.opengis.net/xls' xmlns:gml='http://www.opengis.net/gml'>"
			            					+"	<RoutePlan>"
			            					+"		<RoutePreference>"+methodSearch+"</RoutePreference>"	
			            					+"		<WayPointList>"
			            					+"			<StartPoint>"
			            					+"				<Position>"
			            					+"					<gml:Point>"
			            					+"						<gml:pos>"+startPoint.lat +" "+ startPoint.lon+"</gml:pos>"
			            					+"					</gml:Point>"
			            					+"				</Position>"
			            					+"			</StartPoint>"
			            					+xmlVia
			            					+"			<EndPoint>"
			            					+"				<Position>"
			            					+"					<gml:Point>"
			            					+"						<gml:pos>"+endPoint.lat +" "+ endPoint.lon+"</gml:pos>"
			            					+"					</gml:Point>"
			            					+"				</Position>"
			            					+"			</EndPoint>"
			            					+"		</WayPointList>"
			            					+"	</RoutePlan>"
			            					+"	<RouteInstructionsRequest format='text/plain' provideGeometry='false'/>"
			            					+"	<RouteMapRequest>"
			            					+"		<Output format='png8' height='400' width='400'/>"
			            					+"	</RouteMapRequest>"
			            					+"</DetermineRouteRequest>";
			            		
			            		//Handler POST request
			            		xmlhttp.open("POST", url);
			            		
			            		xmlhttp.onreadystatechange = function() {
			            			if (xmlhttp.readyState==4)
			            			{
			            			    switch (xmlhttp.status)
			            			    {
			            			    case 200: 
			            			    	xml = xmlhttp.responseXML;
			            			    	createMultiLineString(xml);
			            			    	
//			            			    	alert(xmlhttp.responseText);
			            			    	var streetDataNavArray = toArrayDataNavigation(xml);
			            			    	if(streetDataNavArray.length == 0){
			            			    		Ext.MessageBox.alert('Error', 'No Novigation Found!');
			            			    		break;
			            			    	}
			            			    	Ext.getCmp('navigationList').handler(streetDataNavArray);
			            			    	
			            			    	document.body.style.cursor = "default";
			            			        break;
			            			    case 404: // Error: 404 - Resource not found!
			            			    	document.body.style.cursor = "default";
			            			    	alert("Error 404 Service Not Found!");
			            			        break;
			            			    case 500:
			            			    	document.body.style.cursor = "default";
			            			    	if(xmlhttp.responseXML == null)
			            			    		Ext.MessageBox.alert("Error", "Path not found!");
			            			    	else
			            			    		alert(xmlhttp.responseText);
//			            			    	alert("Error 500 " + xmlhttp.responseText);
			            			    	break;
			            			    default:  // Error: Unknown!
			            			    }
			            			}    
			            	    };
			            	    
			            	    xmlhttp.send(xml);
			            	}else{
			            		document.body.style.cursor = "default";
			            		return Ext.MessageBox.alert('Error', 'Selected a Method!');;
			            	}
		            	}
		            },
		            {	
		            	id: 'geoRNReset',
		            	text: 'Reset',
		            	handler: function(){
			            	Ext.getCmp('startPoint').setValue("");
			            	Ext.getCmp('endPoint').setValue("");
			            }	
		            },
		        ],
		        
    	};
    	
    	// apply config
    	Ext.apply(this, Ext.apply(this.initialConfig, config));
        //Start init Component
    	RNGEO.RoutinNavigationForm.superclass.initComponent.call(this);
    }

	,setHost:function(hostName){
		host = hostName;
	}
	
	,getHostName:function(){
		return host;
	}

	,validationText:function(v){
		if (v === "" || v == null || v.lenght == 0) {
	        return "Value is incorrect";
	    }
	    return true;
	}
	
	,setStartPoint:function(sPoint){
		startPoint = sPoint;
	}
	
	,setEndPoint:function(ePoint){
		endPoint = ePoint;
	}
	
	,addToViaPoint:function(vPoint){
		viaPoints.push(vPoint);
//		alert(vPoint);
	}
	
	,getViaPoints:function(){
		return viaPoints;
	}
	
	,setViaPoints:function(newList){
		viaPoints = newList;
	}
	
	,updateViaPoint:function(index, location){
		for(var i=0; i<viaPoints.length; i++){
			if(i == (index-1)){
				viaPoints[i] = location;
			}
		}
	}
	
	,removeViaPointOrigin:function(indexLess){
		tempVia = [];
		streets = [];
		index = parseInt(indexLess) -1;
		var formR = Ext.getCmp("reverseID");
		var streetListR = formR.getStreetList();
		for(var i=0; i<viaPoints.length; i++){
//			alert("XX"+viaPoints[i]);
			if(i != (parseInt(index))){
				tempVia.push(viaPoints[i]);
				streets.push(streetListR[i]);
			}
		}
//		for(var i=0; i<tempVia.length; i++){
//			alert("YY"+tempVia[i]);
//		}
		viaPoints = tempVia;
		formR.setStreetList(streets);
//		alert("AAA");
		var evt = document.createEvent("Event");
	    evt.initEvent("indexViaUpdateEvent",true,true);
	    evt.indexViaUp = (viaPoints.length+1);
	    evt.indexDeleted = indexLess;
	    document.dispatchEvent(evt);
	}
	
	,removeViaPoint:function(index){
		tempVia = [];
		streets = [];
		var formR = Ext.getCmp("reverseID");
		var streetListR = formR.getStreetList();
		for(var i=0; i<viaPoints.length; i++){
			if(i != (parseInt(index))){
				tempVia.push(viaPoints[i]);
				streets.push(streetListR[i]);
			}
		}
		viaPoints = tempVia;
		formR.setStreetList(streets);
		var evt = document.createEvent("Event");
	    evt.initEvent("indexViaUpdateEvent",true,true);
	    evt.indexViaUp = (viaPoints.length+1);
	    evt.indexDeleted = (index+1);
	    document.dispatchEvent(evt);
	}
	
//	,removeViaPointOrigin:function(index){
//		alert("Remove Via Point in RN");
//		var formR = Ext.getCmp("reverseID");
//		var streets = [];
//		var streetListR = formR.getStreetList();
//		for(var i=0; i<streetListR.length; i++){
//			streets.push(streetListR[i]);
//		}
//		if(viaPoints.length == 1){
//			viaPoints = [];
//		}else{
//			viaPoints.splice(index-1,1);
//			streets.splice(index-1,1);
//			formR.setStreetList(streets);
//		}
//		var evt = document.createEvent("Event");
//	    evt.initEvent("indexViaUpdateEvent",true,true);
//	    evt.indexViaUp = (viaPoints.length + 1);
//	    evt.indexDeleted = index;
//	    document.dispatchEvent(evt);
//	}
	
	//Funzione utilizzata per il ricalcolo del percorso
	//dopo aver trascinato su mappa il punto iniziale / finale / intermedio
	//sfrutta le informazione di endPoint e startPoint
	,recalculateNavigation: function(){
		document.body.style.cursor = "wait";
		var xmlhttp = null;
		var methodSearch = Ext.getCmp('method').getValue();
		
		if(methodSearch != ""){
		
    		if (window.XMLHttpRequest){
    			// code for IE7+, Firefox, Chrome, Opera, Safari
    			xmlhttp = new XMLHttpRequest();
    		}else{
    			// code for IE6, IE5
    			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    		}
    		
    		var startValue = Ext.getCmp('startPoint').getValue();
    		var endValue = Ext.getCmp('endPoint').getValue();
    		var xmlVia = "";
    		for(var i=0; i<viaPoints.length; i++){
    			xmlVia += "			<ViaPoint>"
    					+"				<Position>"
    					+"					<gml:Point>"
    					+"						<gml:pos>"+viaPoints[i].lat +" "+ viaPoints[i].lon+"</gml:pos>"
    					+"					</gml:Point>"
    					+"				</Position>"
    					+"			</ViaPoint>";
    		}
    		
    		var url = "http://"+host+"/geoserver/ols";
    		var xml = "<?xml version='1.0' encoding='UTF-8'?>"
    					+"<DetermineRouteRequest xmlns='http://www.opengis.net/xls' xmlns:gml='http://www.opengis.net/gml'>"
    					+"	<RoutePlan>"
    					+"		<RoutePreference>"+methodSearch+"</RoutePreference>"	
    					+"		<WayPointList>"
    					+"			<StartPoint>"
    					+"				<Position>"
    					+"					<gml:Point>"
    					+"						<gml:pos>"+startPoint.lat +" "+ startPoint.lon+"</gml:pos>"
    					+"					</gml:Point>"
    					+"				</Position>"
    					+"			</StartPoint>"
    					+xmlVia			
    					+"			<EndPoint>"
    					+"				<Position>"
    					+"					<gml:Point>"
    					+"						<gml:pos>"+endPoint.lat +" "+ endPoint.lon+"</gml:pos>"
    					+"					</gml:Point>"
    					+"				</Position>"
    					+"			</EndPoint>"
    					+"		</WayPointList>"
    					+"	</RoutePlan>"
    					+"	<RouteInstructionsRequest format='text/plain' provideGeometry='false'/>"
    					+"	<RouteMapRequest>"
    					+"		<Output format='png8' height='400' width='400'/>"
    					+"	</RouteMapRequest>"
    					+"</DetermineRouteRequest>";
    		//Handler POST request
//    		alert(xml);
    		xmlhttp.open("POST", url);
    		
    		xmlhttp.onreadystatechange = function() {
    			if (xmlhttp.readyState==4)
    			{
    			    switch (xmlhttp.status)
    			    {
    			    case 200: // Do the Do
    			    	
    			    	xml = xmlhttp.responseXML;
//    			    	alert(xmlhttp.responseText);
    			    	//Chiama la funzione per la creazione dei POINTS
    			    	createMultiLineString(xml);
    			    	//Chiama la funzione per il caricamento delle informazioni relative al percorso
    			    	//popola la lista Navigation
    			    	var streetDataNavArray = toArrayDataNavigation(xml);
    			    	if(streetDataNavArray.length == 0){
    			    		Ext.MessageBox.alert('Error', 'No Novigation Found!');
    			    		break;
    			    	}
    			    	Ext.getCmp('navigationList').handler(streetDataNavArray);
    			    	document.body.style.cursor = "default";
    			        break;
    			    case 404: // Error: 404 - Resource not found!
//    			    	alert("Error 404 Service Not Found!");
    			    	document.body.style.cursor = "default";
    			    	Ext.MessageBox.alert('Error 404', 'Service Not Found!');
    			        break;
    			    case 500:
    			    	document.body.style.cursor = "default";
    			    	if(xmlhttp.responseXML == null)
    			    		Ext.MessageBox.alert("Error", "Path not found!");
    			    	else
    			    		alert(xmlhttp.responseText);
//    			    	Ext.MessageBox.alert('Error', xmlhttp);
//    			    	alert("Error 500 " + xmlhttp.responseText);
    			    	break;
    			    default:  // Error: Unknown!
    			    }
    			}    
    	    };
    	    
    	    xmlhttp.send(xml);
    	}else{
    		document.body.style.cursor = "default";
    		return Ext.MessageBox.alert('Error', 'Selected a Method!');
    	}
	}
});
Ext.reg('routinnavigationform', RNGEO.RoutinNavigationForm);

function createMultiLineString(xml){
	//Calcolo del BoundingBox
	bBox = xml.getElementsByTagNameNS(namespace, "BoundingBox");
	var BBoxPoints = "";
	
	for(var i=0; i<bBox.length; i++){
		item = bBox.item(i);
		bBoxPOS = item.getElementsByTagNameNS(namespace2, "pos");
		//Ciclo sui POS per il recupero del BBox
		for(var j=0; j<bBoxPOS.length; j++){
			itemPos = bBoxPOS.item(j);
			if(j == bBoxPOS.length-1){
				BBoxPoints += itemPos.firstChild.nodeValue;
			}else{
				BBoxPoints += itemPos.firstChild.nodeValue+",";
			}
		}
	}
	
	//Calcolo della Route
	var routePoint = "";
	routeGeo = xml.getElementsByTagNameNS(namespace, "RouteGeometry");
	for(var i=0; i<routeGeo.length; i++){
		item = routeGeo.item(i);
		lineString = item.getElementsByTagNameNS(namespace2, "LineString");
		for(var j=0; j<lineString.length; j++){
			itemLine= lineString.item(j);
			posPoint = itemLine.getElementsByTagNameNS(namespace2, "pos");
			for(var k=0; k<posPoint.length; k++){
				itemPos= posPoint.item(k);
				if(k == posPoint.length-1){
					routePoint += itemPos.firstChild.nodeValue;
				}else{
					routePoint += itemPos.firstChild.nodeValue+",";
				}
			}
		}
	}
	
	routePoint = routePoint + "";
	//Creo l'evento per il passaggio delle lista dei Points da disegnare su mappa tramite OpenLayers
	var evt = document.createEvent("Event");
    evt.initEvent("routePointEvent",true,true);
    //Aggiunta delle informazioni relative alla Route
    evt.routeList = routePoint;
    //Aggiunta delle informazioni relative al BBox
    evt.BBox = BBoxPoints;
    document.dispatchEvent(evt);
}

function toArrayDataNavigation(xml){
	//Informazioni di navigazione
	arraDataObjNav 		= [];
	arrayRouteInfo 		= [];
	arrayRoutePos  		= [];
	var instruction 	= "";
	
	routeInstructionsList = routeGeo = xml.getElementsByTagNameNS(namespace, "RouteInstructionsList");
	for(var i=0; i<routeInstructionsList.length; i++){
		item = routeInstructionsList.item(i);
		routeInstruction = item.getElementsByTagNameNS(namespace, "RouteInstruction");
		for(var j=0; j<routeInstruction.length; j++){
			item2 = routeInstruction.item(j);
			instructionNode = item2.getElementsByTagNameNS(namespace, "Instruction");
				instruction = instructionNode.item(0).firstChild.nodeValue;;
				arraDataObjNav.push([instruction]);
			instructionGeom = item2.getElementsByTagNameNS(namespace, "RouteInstructionGeometry");
			item3 = instructionGeom.item(0);
			lineString = item3.getElementsByTagNameNS(namespace2, "LineString");
			
			for(var k=0; k<lineString.length; k++){
				itemLine= lineString.item(k);
				posInfoPoint = itemLine.getElementsByTagNameNS(namespace2, "pos");
				infoPointRoute = posInfoPoint.item(0).firstChild.nodeValue;
				var pos = infoPointRoute;
				var navigationInfo = instruction;
				arrayRouteInfo.push(navigationInfo);
				arrayRoutePos.push(pos);
			}
		}
	}
	
	//Defnizione dell'evento per la visualizzazione su mappa delle 
	//features relative alle indicazioni stradali delle svolte
    var evt = document.createEvent("Event");
    evt.initEvent("geoNavigationInfoEvent",true,true);
    evt.navigationInfo = arrayRouteInfo;
    evt.pos = arrayRoutePos;
    document.dispatchEvent(evt);
    
	return arraDataObjNav;
}

function createDescDirection(xml){
	var instruction = "";
	
	routeInstructionsList = routeGeo = xml.getElementsByTagNameNS(namespace, "RouteInstructionsList");
	for(var i=0; i<routeInstructionsList.length; i++){
		item = routeInstructionsList.item(i);
		routeInstruction = item.getElementsByTagNameNS(namespace, "RouteInstruction");
		for(var j=0; j<routeInstruction.length; j++){
			item2 = routeInstruction.item(j);
			instructionNode = item2.getElementsByTagNameNS(namespace, "Instruction");
			if(j == routeInstruction.length-1){
				instruction += instruction = instructionNode.item(0).firstChild.nodeValue;;
			}else{
				instruction += instruction = instructionNode.item(0).firstChild.nodeValue;+",";
			}
		}
	}
	var evt = document.createEvent("Event");
    evt.initEvent("navigationEvent",true,true);
    //Aggiunta delle informazioni per navigazione
    evt.instruction = instruction;
    document.dispatchEvent(evt);
}
