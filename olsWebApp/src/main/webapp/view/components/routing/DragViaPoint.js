/**
 * DraListViaPoint
 * Si occupa della gestione delle tappe, effettuando operazioni di "Move UP" , "Move Down" 
 * e "Cancellazione".
 * Ad ogni operazione viene automaticamente ricalcolato il percorso e visualizzato su mappa
 */
Ext.ns('DRAGVP');
var host = document.location.host;
var startPoint = null;
var endPoint = null;
var moveUpNumber = [];
var viaPoints = []; 
var namespace = 'http://www.opengis.net/xls';
var namespace2 = 'http://www.opengis.net/gml';
DRAGVP.DragListViaPoint = Ext.extend(Ext.grid.GridPanel, {
	id: "viaPointList",
	initComponent: function() {
		var config = {
				frame: true,
				stripeRows: true,
				width: '30%',
				height: 240,
				title: 'Destinations List',
				// config options for stateful behavior
                stateful: true,
                bodyStyle:'padding:5px',
                cls: 'floating-form_right',
                store: storeVia,
                singleSelect : true,
                reserveScrollOffset: true,
                handler: function(storeViaData){
                	storeVia.loadData(storeViaData);
                },
                columns: [
                          {
                               id       :'numeberViaPoint',
                               header   : '#',
                               width    : 20,
                               sortable : true,
                               dataIndex: 'numberViaPoint'
                           },
                           {
                               id       :'stopAt',
                               header   : 'Stop At',
                               width    : 240,
                               sortable : true,
                               dataIndex: 'stopAt'
                           },
                           {
                               xtype: 'actioncolumn',
                               width: 50,
                               items: [{
                                   icon   : '../resources/img/trash_02.png',  // Use a URL in the icon config
                                   tooltip: 'Delete Via Point',
                                   handler: function(grid, rowIndex, colIndex) {
//                                     //Create the event for Remove Via Point
                                       var evt = document.createEvent("Event");
                                       evt.initEvent("removeViaPointEvent",true,true);
                                       if(moveUpNumber.length == 0){
                                    	   evt.rowIndex = parseInt(rowIndex)+1;
                                       }else{
                                    	   evt.rowIndex = parseInt(rowIndex)+1;
//                                    	   evt.rowIndex = parseInt(moveUpNumber[rowIndex]);
                                       }
                                       document.dispatchEvent(evt);
                                   }
                               }]
                           },
                           {
                               xtype: 'actioncolumn',
                               width: 50,
                               items: [{
                                   icon   : '../resources/img/top.png',  // Use a URL in the icon config
                                   tooltip: 'Movo Up Via Point',
                                   handler: function(grid, rowIndex, colIndex){
                                	   var formR = Ext.getCmp("reverseID");
                                	   var formRN = Ext.getCmp("routingID");
                                	   dList = formR.getListDrag(); 
                                	   
                                	   	 if(dList.length == 1 || rowIndex == 0){
                                	   		 //Do nothung - non spostare il primo elemento della lista
                                	   		 return;
                                	   	 }else{
                                	   		 dList = orderingUp(dList,rowIndex);
                                	   		 formR.setListDrag(dList);
                                	   		 updateFeatureVia(rowIndex);
                                	   		 var arrayViaPoints = formRN.getViaPoints();
                                	   		 arrayViaPoints = orderingUp(arrayViaPoints,rowIndex);
                                	   		 formRN.setViaPoints(arrayViaPoints);
                                	   		 
                                	   		 updateIndex(dList,arrayViaPoints);
                                	   		 var streetList = formR.getStreetList();
                                	   		 streetList = orderingUp(streetList,rowIndex);
                                	   		 formR.setStreetList(streetList);
                                	   		 formRN.recalculateNavigation();
                                	   		 
                                	   		Ext.MessageBox.show({
                                	            msg: 'Routing calculating, please wait...',
                                	            progressText: 'Saving...',
                                	            width:300,
                                	            wait:true,
                                	            waitConfig: {interval:200},
                                	            icon:'ext-mb-download', //custom class in msg-box.html
                                	            animateTarget: 'mb7'
                                	        });
                                	         setTimeout(function(){
                                	             //This simulates a long-running operation like a database save or XHR call.
                                	             //In real code, this would be in a callback function.
                                	             Ext.MessageBox.hide();
                                	             Ext.example.msg('Done', 'Your fake data was saved!');
                                	         }, 3000);
                                	   	 }
                                   }
                               }]
                           },
                           {
                               xtype: 'actioncolumn',
                               width: 50,
                               items: [{
                                   icon   : '../resources/img/down.png',  // Use a URL in the icon config
                                   tooltip: 'Movo Down Via Point',
                                   handler: function(grid, rowIndex, colIndex) {
                                	   var formR = Ext.getCmp("reverseID");
                                	   var formRN = Ext.getCmp("routingID");
                                	   dList = formR.getListDrag();
                                	   
                                	   if(dList.length == 1 || rowIndex == (dList.length)-1){
                              	   		 //Do nothung - non spostare l'ultimo elemento della lista
                              	   		 return;
	                              	   }else{
	                                	   dList = orderingDown(dList,rowIndex);
	                           	   		   formR.setListDrag(dList);
	                           	   		   updateFeatureViaDown(rowIndex);
	                           	   		   var arrayViaPoints = formRN.getViaPoints();
	                           	   		   arrayViaPoints = orderingDown(arrayViaPoints,rowIndex);
	                           	   		   formRN.setViaPoints(arrayViaPoints);
	                            	   		 
	                           	   		   updateIndex(dList,arrayViaPoints);
	                           	   		   var streetList = formR.getStreetList();
	                           	   		   streetList = orderingDown(streetList,rowIndex);
	                           	   		   formR.setStreetList(streetList);
	                           	   		   formRN.recalculateNavigation();
	                           	   		   
	                           	   		Ext.MessageBox.show({
                            	            msg: 'Routing calculating, please wait...',
                            	            progressText: 'Saving...',
                            	            width:300,
                            	            wait:true,
                            	            waitConfig: {interval:200},
                            	            icon:'ext-mb-download', //custom class in msg-box.html
                            	            animateTarget: 'mb7'
                            	        });
                            	         setTimeout(function(){
                            	             //This simulates a long-running operation like a database save or XHR call.
                            	             //In real code, this would be in a callback function.
                            	             Ext.MessageBox.hide();
                            	             Ext.example.msg('Done', 'Your fake data was saved!');
                            	         }, 3000);
	                           	   		   
	                              	   	 }
                                   }
                               }]
                           }
                          ]
		};
		
		// apply config
        Ext.apply(this, Ext.apply(this.initialConfig, config));
        DRAGVP.DragListViaPoint.superclass.initComponent.call(this);
	}

	,updateMoveArray:function(){
		moveUpNumber = [];
	}
	
	,updateFeature:function(){
		var formR = Ext.getCmp("reverseID");
 	   	var formRN = Ext.getCmp("routingID");
 	   	dList = formR.getListDrag(); 
 	   	var arrayViaPoints = formRN.getViaPoints();
 	   var arraDataObj = [];
 		var arrayIndex 	= [];
 		for(var i=0; i<arrayViaPoints.length; i++){
 			var streetName = dList[i].toString();
 			arraDataObj.push([i,streetName.split(",")[1]]);
// 			arrayIndex.push(dList[i].toString().split(",")[0]);
 			arrayIndex.push(i);
 		}
 		
 		Ext.getCmp('viaPointList').handler(arraDataObj);
 		
 		//Lancia un evento per l'aggiornamento delle feature presenti su mappa
 		var evt = document.createEvent("Event");
 	    evt.initEvent("updateFeaturesEvent",true,true);
 	    evt.aIndex = arrayIndex;
 	    moveUpNumber = arrayIndex;
 	    document.dispatchEvent(evt);
	}
});
Ext.reg('dragListViaPoint', DRAGVP.DragListViaPoint);

/**
 * Creazione del data source da visualizzare all'interno della lista
 */
var storeVia = new Ext.data.ArrayStore({
    fields: [
       {name: 'numberViaPoint'},
       {name: 'stopAt'}
    ]
});

/**
 * Funzione di Ordinamento verso il basso - Move Down
 * @param dList
 * @param rowIndex
 */
function orderingDown(dList,rowIndex){
	var tempList = [];
	var temp;
	for(var i=0; i<dList.length; i++){
		if(i == rowIndex){
			temp = dList[i];
			tempList[i] = dList[rowIndex+1]; 
		}else if(i == rowIndex+1){
			tempList[i] = temp;
		}else{
			tempList[i] = dList[i];
		}
	}
	
	return tempList;
}

/**
 * Funzione di Ordinamento verso l'alto - Move UP
 * @param dList, lista da aggiornare
 * @param rowIndex, indice da aggiornare
 * @returns {Array} aggiornato
 */
function orderingUp(dList,rowIndex){
	var tempList = [];
	var temp;
	for(var i=0; i<dList.length; i++){
		if(i == rowIndex-1){
			temp = dList[i];
			tempList[i] = dList[rowIndex]; 
		}else if(i == rowIndex){
			tempList[i] = temp;
		}else{
			tempList[i] = dList[i];
		}
	}
	
	return tempList;
}

function updateFeatureVia(rowIndex){
	var evt = document.createEvent("Event");
    evt.initEvent("orderUpFeaturesEvent",true,true);
    evt.rowIndex = rowIndex;
    document.dispatchEvent(evt);
}

function updateFeatureViaDown(rowIndex){
	var evt = document.createEvent("Event");
    evt.initEvent("orderDownFeaturesEvent",true,true);
    evt.rowIndex = rowIndex;
    document.dispatchEvent(evt);
}
/**
 * 
 * Aggiorna l'indice delle due liste
 *
 * @param dList, lista delle tappe ed identify
 * @param arrayViaPoints, Lista dei viaPoint -> contengono solamente l'informazione geometrica
 */
function updateIndex(dList,arrayViaPoints){
	dragList = Ext.getCmp("viaPointList");
	dragList.updateFeature();
}

//Caricamento manuale dei dati
storeVia.loadData();

