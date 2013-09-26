Ext.ns('RGEO');
var host = document.location.host;
var namespace = 'http://www.opengis.net/xls';
var namespace2 = 'http://www.opengis.net/gml';
var indexFeature = null;
RGEO.ReverseGeoroutingForm = Ext.extend(Ext.form.FormPanel, {
	id: 'reverseID',
	collapsible: true,
	initComponent:function() {
		var config = {
				id: 'formReverseId',
		        labelWidth: 75, // label settings here cascade unless 	
		        frame:true,
		        collapsed:true,
		        title: 'Reverse Geocoding Information',
		        bodyStyle:'padding:5px 5px 0',
		        width: '22%',
		        cls: 'floating-form_left',
		        height: 100,
		        defaults: {width: 230},
		        defaultType: 'textfield',	
		        
		        items: [
				          {
				        	  fieldLabel: 'Latitudine',
				        	  id: 'lat',
				        	  disabled: true
				          },
				          {
				        	  fieldLabel: 'Longitudine	',	    	   
				        	  id: 'lon',
				        	  disabled : true
				          }
				        ]
				
    	};
    	
		// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));
	    //Start init Component
		RGEO.ReverseGeoroutingForm.superclass.initComponent.call(this);
	}

	,setHost:function(hostName){
		host = hostName;
	}
	
	,getHostName:function(){
		return host;
	}
	
	,getStreetList:function(){
		return stretList;
	}
	
	,setStreetList:function(newList){
		return stretList = newList;
	}
	
	,getListDrag:function(){
		return listDrag;
	}
	
	,setListDrag:function(newListDrag){
		listDrag = newListDrag;
	}
	//Rimuovi il viaPoint dalla lista delle tappe
	//Aggiorna la visualizzazione delle tappe in tabell
	,removeViaPoint:function(index){
		var streetDataVia = updateArrayVP(index);
		Ext.getCmp('viaPointList').handler(streetDataVia);
	}
	
	,updateDataList:function(){
		tempList = [];
		for(var i=0; i<listDrag.length-1; i++){
			tempList.push([i,stretList[i]]);
		}
		listDrag = tempList;
		Ext.getCmp('viaPointList').handler(tempList);
	}
	
	,setIndexFeature:function(value){
		indexFeature = value;
	}
	
	//Si occupa di richiamare il servizio di Reverse Geocoding
	,callService:function(lat, lon, hostName, typeCall){
		document.body.style.cursor = "wait";
		var xmlhttp = null;
		
		if (window.XMLHttpRequest){
			// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp = new XMLHttpRequest();
		}else{
			// code for IE6, IE5
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		
		var workspaceName = Ext.getCmp('formConfigId').getForm().findField('workspace').getValue();
		//Controlli il workspaceName
   		var url = '';
   		if(workspaceName == null || workspaceName == ''){
   			url = "http://"+host+"/geoserver/ols";
   		}else{
   			url = "http://"+host+"/geoserver/ols/"+workspaceName+"/ws";
   		}
		
		var xml = "<?xml version='1.0' encoding='UTF-8'?>"
					+"<XLS version=\"1.2\" xmlns=\"http://www.opengis.net/xls\" xmlns:gml=\"http://www.opengis.net/gml\">"
					+"	<RequestHeader />" // clientName="<ArcWebServices_username>" clientPassword="<ArcWebServices_token>"
					+"	<Request methodName=\"ReverseGeocodeRequest\" version=\"1.2\" requestID=\"rte1\">"
					+"		<ReverseGeocodeRequest xmlns='http://www.opengis.net/xls' xmlns:gml='http://www.opengis.net/gml'>"
					+"			<Position>"
					+"				<gml:Point>"
					+"					<gml:pos>"+lat +" "+ lon+"</gml:pos>"
					+"				</gml:Point>"
					+"			</Position>"
					+"		</ReverseGeocodeRequest>"
					+"	</Request>"
					+"</XLS>";
		
		//Handler POST request
		xmlhttp.open("POST", url);
		
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState==4)
			{
			    switch (xmlhttp.status)
			    {
			    case 200: // Do the Do
			    	
			    	//Questo blocco di occupa di determinare quale tipologia di chiamata è stata effettata
			    	//Se per l'endPoint, viaPoint o altro -> richiama l'apposità funzionalità
			    	xml = xmlhttp.responseXML;
			    	var streetsData  = toArrayDataReverse(xml);
			    	if(typeCall == 'reverse')
			    		Ext.getCmp('streesList').handler(streetsData);
			    	else if(typeCall == 'reverseStart')
			    		Ext.getCmp('startPoint').handler(streetsData);
			    	else if(typeCall == 'reverseEnd')
			    		Ext.getCmp('endPoint').handler(streetsData);
			    	else if(typeCall == 'reverseViaPoint'){
			    		var streetDataVia = toArrayDataReverseViaPoint(xml);
			    		Ext.getCmp('viaPointList').handler(streetDataVia);
			    	}else if(typeCall == 'reverseViaPoint_drag'){
			    		var streetDataVia = toArrayDataReverseViaPointDrag(xml);
			    		Ext.getCmp('viaPointList').handler(streetDataVia);
			    	}
			    	
			    	document.body.style.cursor = "default";
			    	
			        break;
			    case 404: // Error: 404 - Resource not found!
			    	document.body.style.cursor = "default";
			    	alert("Error 404 Service Not Found!");
			        break;
			    case 500:
			    	document.body.style.cursor = "default";
			    	alert("Error 500 " + xmlhttp.responseText);
			    	break;
			    default:  // Error: Unknown!
			    }
			}    
	    };
	    
	    xmlhttp.send(xml);
	}
});
Ext.reg('reversegeoroutingform', RGEO.ReverseGeoroutingForm);

/**
 * Funzione per il parsing e la creazione dei dati dalla risposta del servizio 
 * di reverseGeocoding
 * @param xml
 * @returns
 */
function toArrayDataReverse(xml){
	arraDataObj = [];
	nodeAddress = xml.getElementsByTagNameNS(namespace, "ReverseGeocodedLocation");
	for(var i=0; i<nodeAddress.length; i++){
		var item = nodeAddress.item(i);
		var position = "";
		if(item.getElementsByTagNameNS(namespace2, "pos").item(0) != null){
			position = item.getElementsByTagNameNS(namespace2, "pos").item(0).firstChild.nodeValue;
		}
		if(item.getElementsByTagNameNS(namespace, "Street").item(0) == null){
			Ext.MessageBox.alert('Error', 'Street not found!');
			return;
		}
		var streetName = "";
		if(item.getElementsByTagNameNS(namespace, "Street").item(0) != null){
			streetName = item.getElementsByTagNameNS(namespace, "Street").item(0).firstChild.nodeValue;
		}
//		var placeName = "";
//		if(item.getElementsByTagNameNS(namespace, "Place").item(0) != null){
//			placeName = item.getElementsByTagNameNS(namespace, "Place").item(0).firstChild.nodeValue;
//		}
		var postalCodeValue = "";
		if(item.getElementsByTagNameNS(namespace, "PostalCode").item(0) != null){
			postalCodeValue = item.getElementsByTagNameNS(namespace, "PostalCode").item(0).firstChild.nodeValue;
		}
		var countryCodeValue = "";
		if(item.getElementsByTagNameNS(namespace, "Address").item(0) != null){
			countryCodeValue = item.getElementsByTagNameNS(namespace, "Address").item(0).getAttribute("countryCode");
		}
		var countrySubdivisionValue = "";
		var municipalityValue = "";
		var countrySecondarySubdivisioValue = "";
		for(var j=0; j<item.getElementsByTagNameNS(namespace, "Place").length; j++){
			if(item.getElementsByTagNameNS(namespace, "Place").item(j).getAttribute("type") != null
					|| item.getElementsByTagNameNS(namespace, "Place").item(j).getAttribute("type") != ""){
				if(item.getElementsByTagNameNS(namespace, "Place").item(j).getAttribute("type") == 'Municipality'){
					municipalityValue = item.getElementsByTagNameNS(namespace, "Place").item(j).firstChild.nodeValue;
				}else if(item.getElementsByTagNameNS(namespace, "Place").item(j).getAttribute("type") == 'CountrySubdivision'){
					countrySubdivisionValue = item.getElementsByTagNameNS(namespace, "Place").item(j).firstChild.nodeValue;
				}else if(item.getElementsByTagNameNS(namespace, "Place").item(j).getAttribute("type") == 'CountrySecondarySubdivision'){
					countrySecondarySubdivisioValue = item.getElementsByTagNameNS(namespace, "Place").item(j).firstChild.nodeValue;
				}
			}
		}
		
		arraDataObj.push(
				[streetName, municipalityValue, postalCodeValue, countryCodeValue, countrySubdivisionValue, countrySecondarySubdivisioValue, position]
		);
	}
	return arraDataObj;
}

var index = 0;
var stretList = [];
var listDrag = [];

/**
 * Funzione per la creazione delle tappe visualizzate
 * all'interno dell oggetto @see DragViaPoint.js
 * @param xml
 * @returns {Array}
 */
function toArrayDataReverseViaPoint(xml){
	var formRN = Ext.getCmp("routingID");
	var arrayViaPoints = formRN.getViaPoints();
	var arraDataObj = [];
	var streetName = "";
	nodeAddress = xml.getElementsByTagNameNS(namespace, "ReverseGeocodedLocation");
	if(arrayViaPoints.length > 0){
		for(var i=0; i<1; i++){
			var item = nodeAddress.item(i);
			
			if(item.getElementsByTagNameNS(namespace, "Street").item(0) != null){
				streetName = item.getElementsByTagNameNS(namespace, "Street").item(0).firstChild.nodeValue;
			}
		}
		stretList.push(streetName);
	}
	
	for(var i=0; i<arrayViaPoints.length; i++){
		arraDataObj.push([i,stretList[i]]);
	}
	listDrag = arraDataObj;
	return arraDataObj;
}

/**
 * Funzione per la creazione delle tappe visualizzate
 * all'interno dell oggetto @see DragViaPoint.js
 * @param xml di risposta del servizio di reverseGeocoding
 * @returns {Array}
 */
function toArrayDataReverseViaPointDrag(xml){
	var formRN = Ext.getCmp("routingID");
	var arrayViaPoints = formRN.getViaPoints();
	var arraDataObj = [];
	var streetName = "";
	nodeAddress = xml.getElementsByTagNameNS(namespace, "ReverseGeocodedLocation");
	if(arrayViaPoints.length > 0){
		for(var i=0; i<1; i++){
			var item = nodeAddress.item(i);
			
			if(item.getElementsByTagNameNS(namespace, "Street").item(0) != null){
				streetName = item.getElementsByTagNameNS(namespace, "Street").item(0).firstChild.nodeValue;
			}
		}
		stretList[indexFeature-1] = streetName;
	}
	for(var i=0; i<arrayViaPoints.length; i++){
		if(i == (indexFeature-1)){
			arraDataObj.push([i,streetName]);
		}else{
			arraDataObj.push([i,stretList[i]]);
		}
	}
	listDrag = arraDataObj;
	return arraDataObj;
}

/**
 * Aggiorna la visualizzazione delle tappe
 * all'interno della tabella
 *  @see DragViaPoint.js
 *  @return arraDataObj - lista aggiornata delle tappa
 */
function updateArrayVP(index){
	var formRN = Ext.getCmp("routingID");
	var arrayViaPoints = formRN.getViaPoints();
	var arraDataObj = [];
	
		for(var i=0; i<arrayViaPoints.length; i++){
			arraDataObj.push([i,stretList[i]]);
		}
	
	if(arrayViaPoints.length == 0){
		stretList = [];
	}
	
	return arraDataObj;
}

