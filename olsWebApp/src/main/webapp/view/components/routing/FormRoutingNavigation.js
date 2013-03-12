Ext.ns('RNGEO');
var host = document.location.host;
var startPoint = null;
var endPoint = null;
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
		            		var xmlhttp = null;
		            		
		            		if (window.XMLHttpRequest){
		            			// code for IE7+, Firefox, Chrome, Opera, Safari
		            			xmlhttp = new XMLHttpRequest();
		            		}else{
		            			// code for IE6, IE5
		            			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		            		}
		            		
		            		var startValue = Ext.getCmp('startPoint').getValue();
		            		var endValue = Ext.getCmp('endPoint').getValue();
		            		
		            		var url = "http://"+host+"/geoserver/ols";
		            		var xml = "<?xml version='1.0' encoding='UTF-8'?>"
		            					+"<DetermineRouteRequest xmlns='http://www.opengis.net/xls' xmlns:gml='http://www.opengis.net/gml'>"
		            					+"	<RoutePlan>"
		            					+"		<RoutePreference>Fastest</RoutePreference>"	
		            					+"		<WayPointList>"
		            					+"			<StartPoint>"
		            					+"				<Position>"
		            					+"					<gml:Point>"
		            					+"						<gml:pos>"+startPoint.lat +" "+ startPoint.lon+"</gml:pos>"
		            					+"					</gml:Point>"
		            					+"				</Position>"
		            					+"			</StartPoint>"
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
		            			    case 200: // Do the Do
		            			    	
		            			    	xml = xmlhttp.responseXML;
//		            			    	alert(xmlhttp.responseText);
//		            			    	var streetDataArray = toArrayData(xml);
//		            			    	Ext.getCmp('streesList').handler(streetDataArray);
		            			    	createMultiLineString(xml);
		            			    	//TODO: Creazione delle DESCRIZIONE (DIRECTIONS)
		            			    	
		            			    	
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
	
	//Funzione utilizzata per il ricalcolo del percorso
	//dopo aver trascinato su mappa il punto iniziale / finale / intermedio
	//sfrutta le informazione di endPoint e startPoint
	,recalculateNavigation: function(){
		//TODO: implemantazione
	}
});
Ext.reg('routinnavigationform', RNGEO.RoutinNavigationForm);

function createMultiLineString(xml){
	nodeAddress = xml.getElementsByTagNameNS(namespace2, "pos");
	var routePoint = "";
	//Inizio a ciclare da i=2 -> perche' i primi due sono quelli associati al BoundingBox
	for(var i=2; i<nodeAddress.length; i++){
		var item = nodeAddress.item(i);
		if(i == nodeAddress.length-1){
			routePoint += item.firstChild.nodeValue;
		}else{
			routePoint += item.firstChild.nodeValue+",";
		}
	}
	routePoint = routePoint + "";
	//Creo l'evento per il passaggio delle lista dei Points da disegnare su mappa tramite OpenLayers
	var evt = document.createEvent("Event");
    evt.initEvent("routePointEvent",true,true);
    evt.routeList = routePoint;
    document.dispatchEvent(evt);
	
	return routePoint;
}

function createDescDirection(xml){
	
}
