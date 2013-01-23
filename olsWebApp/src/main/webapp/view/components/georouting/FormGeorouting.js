Ext.ns('GEO');
var host = document.location.host;

GEO.GeoroutingForm = Ext.extend(Ext.form.FormPanel, {
	
    initComponent:function() {
    	var config = 
    	{
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
                         return validationText(v);
                      }
		          },
		          {
		        	  fieldLabel: 'Comune	',	    	   
		        	  id: 'comune',
		        	  validator: function(v) {
		        		  return validationText(v);
		        	  }
		          },
		          {
		        	  fieldLabel: 'Toponimo', 
		        	  id: 'via',
		        	  validator: function(v){
		        		 return validationText(v);
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
			            		
			            		createXMLRequest(pValue, cValue, tValue);
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

});
Ext.reg('georoutingform', GEO.GeoroutingForm);



function validationText(v){
	if (v === "" || v == null || v.lenght == 0) {
        return "Value is incorrect";
    }
    return true;
}

function createXMLRequest(pValue, cValue, tValue){
	var xmlhttp = null;
	if (window.XMLHttpRequest){
		// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	}else{
		// code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	
	var url = "http://"+host+"/geoserver/ols";
	alert(url);
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
		    	alert(xmlhttp.responseXML);
		        break;
		    case 404: // Error: 404 - Resource not found!
		    	alert("Error 404");
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
