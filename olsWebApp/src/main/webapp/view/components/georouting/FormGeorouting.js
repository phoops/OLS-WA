Ext.ns('GEO');
var host = document.location.host;
var storeList = [];
var namespace = 'http://www.opengis.net/xls';
var namespace2 = 'http://www.opengis.net/gml';

GEO.GeoroutingForm = Ext.extend(Ext.form.FormPanel, {
	
    initComponent:function() {
    	var config = 
    	{
    			id: 'formId',
		        labelWidth: 75, // label settings here cascade unless 	
		        frame:true,
		        title: 'Form Inputs Georouting',
		        bodyStyle:'padding:5px 5px 0',
		        width: '22%',
		        cls: 'floating-form_left',
		        height: 200,
		        defaults: {width: 230},
		        defaultType: 'textfield',
		
		        items: [
		          {
		        	  fieldLabel: 'Provincia',
		        	  id: 'provincia',
		        	  validator: function(v) {
		        		  if (v === "" || v == null || v.lenght == 0) {
		        		        return "Value is incorrect";
		        		    }
		        		    return true;
                      }
		          },
		          {
		        	  fieldLabel: 'Comune	',	    	   
		        	  id: 'comune',
		        	  validator: function(v) {
		        		  if (v === "" || v == null || v.lenght == 0) {
		        		        return "Value is incorrect";
		        		    }
		        		    return true;
		        	  }
		          },
		          {
		        	  fieldLabel: 'Toponimo', 
		        	  id: 'via',
		        	  validator: function(v){
		        		  if (v === "" || v == null || v.lenght == 0) {
		        		        return "Value is incorrect";
		        		    }
		        		    return true;
		        	  }
		          }
		        ],
		        buttons: [
		            {
		            	id: 'geoSubmit',
		            	text: 'Submit',
		            	handler: function(){
		            		if(Ext.getCmp('provincia').isValid()
		            				&& Ext.getCmp('comune').isValid()
		            				&& Ext.getCmp('via').isValid()){
		            			var pValue = Ext.getCmp('provincia').getValue(); 
			            		var cValue = Ext.getCmp('comune').getValue();
			            		var tValue = Ext.getCmp('via').getValue();
			            		
//			            		createXMLRequest(pValue, cValue, tValue);
			            		var xmlhttp = null;
//			            		var parseXml;
//			            		var xmlResponde;
			            		
			            		
			            		if (window.XMLHttpRequest){
			            			// code for IE7+, Firefox, Chrome, Opera, Safari
			            			xmlhttp = new XMLHttpRequest();
			            		}else{
			            			// code for IE6, IE5
			            			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			            		}
			            		
			            		
			            		var url = "http://"+host+"/geoserver/ols";
			            		var xml = "<?xml version='1.0' encoding='UTF-8'?>"
			            					+"<GeocodeRequest xmlns='http://www.opengis.net/xls'>"
			            					+"	<Address countryCode='IT'>"
			            					+"		<StreetAddress>"
			            					+"			<Street>" + tValue + "</Street>"
			            					+"		</StreetAddress>"
			            					+"		<Place type='Municipality'>" + cValue + "</Place>"
			            					+"		<Place type='CountrySecondarySubdivision'>" + pValue + "</Place>"
			            					+"		<PostalCode></PostalCode>"
			            					+"	</Address>"
			            					+"</GeocodeRequest>";
			            		
			            		//Handler POST request
			            		xmlhttp.open("POST", url);
			            		
			            		xmlhttp.onreadystatechange = function() {
			            			if (xmlhttp.readyState==4)
			            			{
			            			    switch (xmlhttp.status)
			            			    {
			            			    case 200: // Do the Do
			            			    	
			            			    	xml = xmlhttp.responseXML;
			            			    	var streetsData  = toJSON(xml);
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
		            		}else{
		            			return;
		            		}
		            	}
		            },
		            {	
		            	id: 'geoReset',
		            	text: 'Reset',
		            	handler: function(){
			            	Ext.MessageBox.alert('Reset', 'Reset dei parametri nella form');
			            	Ext.getCmp('provincia').setValue(null);
			            	Ext.getCmp('comune').setValue(null);
			            	Ext.getCmp('via').setValue(null);
			            }	
		            },
		        ],
		        
    	};
    	
    	//Add custom event
    	this.addEvents('prova');
    	// apply config
    	Ext.apply(this, Ext.apply(this.initialConfig, config));
        //Start init Component
    	GEO.GeoroutingForm.superclass.initComponent.call(this);
    }

	,provaEvento:function(store) {
		alert(store);
        // do whatever is necessary to assign the employee to position
 
        // fire assigned event
        this.fireEvent('prova', this, store);
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
});
Ext.reg('georoutingform', GEO.GeoroutingForm);

/*
 * Function to create a JSON array
 */
function toJSON(xml){
	jsonObj = [];
	nodeAddress = xml.getElementsByTagNameNS(namespace, "GeocodedAddress");
	for(var i=0; i<nodeAddress.length; i++){
		var position = xml.getElementsByTagNameNS(namespace2, "pos").item(i).firstChild.nodeValue;
		var streetName = xml.getElementsByTagNameNS(namespace, "Street").item(i).firstChild.nodeValue;
		var placeName = xml.getElementsByTagNameNS(namespace, "Place").item(i).firstChild.nodeValue;
		var postalCodeValue = xml.getElementsByTagNameNS(namespace, "PostalCode").item(i).firstChild.nodeValue;
		var countryCodeValue = xml.getElementsByTagNameNS(namespace, "Address").item(i).firstChild.nodeValue;
		
		jsonObj.push(
			{street: streetName, place: placeName,  postalcode: postalCodeValue, countrycode: countryCodeValue, pos: position}
		);
	}
	return jsonObj;
}
