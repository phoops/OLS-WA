Ext.ns('GEO');
var host = document.location.host;
var storeList = [];
var namespace = 'http://www.opengis.net/xls';
var namespace2 = 'http://www.opengis.net/gml';

GEO.GeoroutingForm = Ext.extend(Ext.form.FormPanel, {
	collapsible: true,	
    initComponent:function() {
    	var config = 
    	{
    			id: 'formId',
		        labelWidth: 75, // label settings here cascade unless 	
		        frame:true,
		        title: 'Geocoding Informations',
		        bodyStyle:'padding:5px 5px 0',
		        width: '22%',
		        cls: 'floating-form_left',
		        height: 180,
		        defaults: {width: 230},
		        defaultType: 'textfield',
		
		        items: [
		          {
		        	  xtype: 'combo',
		        	  store: new Ext.data.ArrayStore({
		        	        id: 0,
		        	        fields: [
		        	            'abbr',
		        	            'prov'
		        	        ],
		        	        data: [ ['AR', 'Arezzo - AR'],
		        	                ['FI', 'Firenze - FI'],
		        	                ['GR', 'Grosseto - GR'],
		        	                ['LI', 'Livorno - LI'],
		        	                ['LU', 'Lucca - LU'],
		        	                ['MS', 'Massa-Carrara - MS'],
		        	                ['PI', 'Pisa - PI'],
		        	                ['PT', 'Pistoia - PT'],
		        	                ['PO', 'Prato - PO'],
		        	                ['SI', 'Siena - SI']
		        	        	 ]
		        	    }),
		        	  valueField: 'abbr',
			          displayField: 'prov',
			          typeAhead: true,
			          mode: 'local',
			          forceSelection: true,
			          triggerAction: 'all',
			          emptyText:'Seleziona una Provincia...',
			          selectOnFocus:true,
		        	  fieldLabel: 'Provincia',
		        	  id: 'provincia'
//		        		  ,
//		        	  validator: function(v) {
//		        		  if (v === "" || v == null || v.lenght == 0) {
//		        		        return "Value is incorrect";
//		        		    }
//		        		    return true;
//                      }
		          },
		          {
		        	  fieldLabel: 'Comune	',	    	   
		        	  id: 'comune'
//		        		  ,
//		        	  validator: function(v) {
//		        		  if (v === "" || v == null || v.lenght == 0) {
//		        		        return "Value is incorrect";
//		        		    }
//		        		    return true;
//		        	  }
		          },
		          {
		        	  fieldLabel: 'Toponimo', 
		        	  id: 'via',
//		        	  enableKeyEvents: true,
//	            	  listeners: {
//	            	      keypress : function(textfield,eventObjet){
//	            	    	  alert(eventObject.getCharCode());
//	            	          if (eventObject.getCharCode() == Ext.EventObject.ENTER) {
//	            	               //enter is pressed call the next buttons handler function here.
//	            	               alert("Call the submit");
//	            	          }
//	            	      }
//	            	  },
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
		            	handler: function(toponimo){
		            		document.body.style.cursor = "wait";
		            		if(Ext.getCmp('provincia').isValid()
		            				&& Ext.getCmp('comune').isValid()
		            				&& Ext.getCmp('via').isValid()){
		            			
		            			var tValue = ""; 
		            			
		            			if(typeof toponimo == 'string'){
		            				tValue = toponimo;
		            			}else{
		            				tValue = Ext.getCmp('via').getValue();
		            			}
		            			
		            			var pValue = Ext.getCmp('provincia').getValue(); 
			            		var cValue = Ext.getCmp('comune').getValue();
			            		
//			            		createXMLRequest(pValue, cValue, tValue);
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
			            			    	var streetDataArray = toArrayData(xml);
			            			    	if(streetDataArray.length == 0){
			            			    		Ext.MessageBox.alert('Error', 'Street not found!');
			            			    		break;
			            			    	}
			            			    	Ext.getCmp('streesList').handler(streetDataArray);
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
		            		}else{
		            			document.body.style.cursor = "default";
		            			return;
		            		}
		            	}
		            },
		            {	
		            	id: 'geoReset',
		            	text: 'Reset',
		            	handler: function(){
//			            	Ext.MessageBox.alert('Reset', 'Reset dei parametri nella form');
			            	Ext.getCmp('provincia').setValue(null);
			            	Ext.getCmp('comune').setValue(null);
			            	Ext.getCmp('via').setValue(null);
			            }	
		            },
		        ],
		        
    	};
    	
    	// apply config
    	Ext.apply(this, Ext.apply(this.initialConfig, config));
        //Start init Component
    	GEO.GeoroutingForm.superclass.initComponent.call(this);
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
 * Function to create ArrayData
 */
function toArrayData(xml){
	arraDataObj = [];
	nodeAddress = xml.getElementsByTagNameNS(namespace, "GeocodedAddress");
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
