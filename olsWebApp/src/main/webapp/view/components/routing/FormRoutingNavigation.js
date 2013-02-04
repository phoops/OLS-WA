Ext.ns('RNGEO');
var host = document.location.host;
RNGEO.RoutinNavigationForm = Ext.extend(Ext.form.FormPanel, {
	id: 'routingID',
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
		        height: 200,
		        defaults: {width: 230},
		        defaultType: 'textfield',
		
		        items: [
		          {
		        	  fieldLabel: 'Start Point',
		        	  id: 'startPoint',
		        	  validator: function(v) {
		        		  if (v == null || v === "" || v.lenght == 0) {
		        		        return "Value is incorrect";
		        		    }
		        		    return true;
                      }
		          },
		          {
		        	  fieldLabel: 'End Point',	    	   
		        	  id: 'endPoint',
		        	  validator: function(v) {
		        		  if (v == null || v === "" || v.lenght == 0) {
		        		        return "Value is incorrect";
		        		    }
		        		    return true;
                      }
		          }
		        ],
		        buttons: [
		            {
		            	id: 'geoRNSubmit',
		            	text: 'Submit',
		            	handler: function(toponimo){
		            		alert('Chiama il servizio di routing navigation');
		            		var xmlhttp = null;
		            		
		            		if (window.XMLHttpRequest){
		            			// code for IE7+, Firefox, Chrome, Opera, Safari
		            			xmlhttp = new XMLHttpRequest();
		            		}else{
		            			// code for IE6, IE5
		            			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		            		}
		            		
		            		var startValue = Ext.getCmp('startPoint').getValue();
		            		alert(startValue);
		            		var endValue = Ext.getCmp('endPoint').getValue();
		            		alert(endValue);
		            		var url = "http://"+host+"/geoserver/solr";
		            		alert(url);
		            		
		            		
		            		//TODO: Costruzione XML POST
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
	
	//Funzione utilizzata per il ricalcolo del percorso
	//dopo aver trascinato su mappa il punto iniziale / finale / intermedio
	,recalculateNavigation: function(){
		//TODO: implemantazione
	}
});
Ext.reg('routinnavigationform', RNGEO.RoutinNavigationForm);
