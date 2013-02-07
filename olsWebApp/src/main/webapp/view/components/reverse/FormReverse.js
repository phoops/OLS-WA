Ext.ns('RGEO');
var host = document.location.host;
var namespace = 'http://www.opengis.net/xls';
var namespace2 = 'http://www.opengis.net/gml';
RGEO.ReverseGeoroutingForm = Ext.extend(Ext.form.FormPanel, {
	initComponent:function() {
		var config = {
				id: 'formReverseId',
		        labelWidth: 75, // label settings here cascade unless 	
		        frame:true,
		        title: 'Reverse Georouting Information',
		        bodyStyle:'padding:5px 5px 0',
		        width: '22%',
		        cls: 'floating-form_left',
		        height: 180,
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

	//Si occupa di richiamare il servizio di Reverse Geocoding
	,callService:function(lat, lon, hostName){
		var xmlhttp = null;
		
		if (window.XMLHttpRequest){
			// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp = new XMLHttpRequest();
		}else{
			// code for IE6, IE5
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		var url = "http://"+host+"/geoserver/ols";
		var xml = "<?xml version='1.0' encoding='UTF-8'?>"
					+"<ReverseGeocodeRequest xmlns='http://www.opengis.net/xls' xmlns:gml='http://www.opengis.net/gml'>"
					+"	<Position>"
					+"		<gml:Point>"
					+"			<gml:pos>"+lat +" "+ lon+"</gml:pos>"
					+"		</gml:Point>"
					+"	</Position>"
					+"</ReverseGeocodeRequest>";
		
		//Handler POST request
		xmlhttp.open("POST", url);
		
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState==4)
			{
			    switch (xmlhttp.status)
			    {
			    case 200: // Do the Do
			    	
			    	xml = xmlhttp.responseXML;
			    	var streetsData  = toArrayDataReverse(xml);
			    	Ext.getCmp('streesList').handler(streetsData);
			    	
			        break;
			    case 404: // Error: 404 - Resource not found!
			    	alert("Error 404 Service Not Found!");
			        break;
			    case 500:
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

/*
 * Function to create ArrayData
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
		var placeName = "";
		if(item.getElementsByTagNameNS(namespace, "Place").item(0) != null){
			placeName = item.getElementsByTagNameNS(namespace, "Place").item(0).firstChild.nodeValue;
		}
		var postalCodeValue = "";
		if(item.getElementsByTagNameNS(namespace, "PostalCode").item(0) != null){
			postalCodeValue = item.getElementsByTagNameNS(namespace, "PostalCode").item(0).firstChild.nodeValue;
		}
		var countryCodeValue = "";
		if(item.getElementsByTagNameNS(namespace, "Address").item(0) != null){
			countryCodeValue = item.getElementsByTagNameNS(namespace, "Address").item(0).firstChild.nodeValue;
		}
		
		arraDataObj.push(
			[streetName, placeName, postalCodeValue, countryCodeValue, position]
		);
	}
	return arraDataObj;
}