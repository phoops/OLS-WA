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
				height: 200,
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
                                    	   evt.rowIndex = parseInt(moveUpNumber[rowIndex]);
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
                                	   		 //Do nothung
                                	   		 return;
                                	   	 }else{
                                	   		 dList = orderingUp(dList,rowIndex);
                                	   		 formR.setListDrag(dList);
                                	   		 var arrayViaPoints = formRN.getViaPoints();
                                	   		 arrayViaPoints = orderingUp(arrayViaPoints,rowIndex);
                                	   		 formRN.setViaPoints(arrayViaPoints);
                                	   		 
                                	   		 updateIndex(dList,arrayViaPoints);
                                	   		 var streetList = formR.getStreetList();
                                	   		 streetList = orderingUp(streetList,rowIndex);
                                	   		 formR.setStreetList(streetList);
                                	   		 formRN.recalculateNavigation();
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
                                   handler: function() {
                                	   	 alert("Move Down	 Via Point");
//                                       var rec = store.getAt(rowIndex);
//                                       Ext.getCmp('routingID').getForm().findField('startPoint').setValue(rec.get('street'));
//                                       position = rec.get('pos');
//                                       //Create the event for Start Point
//                                       var evt = document.createEvent("Event");
//                                       evt.initEvent("startPointEvent",true,true);
//                                       evt.pos = position;
//                                       document.dispatchEvent(evt);
                                   }
                               }]
                           }
                          ]
		};
		
		// apply config
        Ext.apply(this, Ext.apply(this.initialConfig, config));
        DRAGVP.DragListViaPoint.superclass.initComponent.call(this);
	}
});
Ext.reg('dragListViaPoint', DRAGVP.DragListViaPoint);
//create the data store
var storeVia = new Ext.data.ArrayStore({
    fields: [
       {name: 'numberViaPoint'},
       {name: 'stopAt'}
    ]
});

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

function updateIndex(dList,arrayViaPoints){
	var arraDataObj = [];
	var arrayIndex 	= [];
	for(var i=0; i<arrayViaPoints.length; i++){
		var streetName = dList[i].toString();
		arraDataObj.push([i,streetName.split(",")[1]]);
		arrayIndex.push(dList[i].toString().split(",")[0]);
	}
	
	Ext.getCmp('viaPointList').handler(arraDataObj);
	
//	for(var i=0; i<arrayIndex.length; i++){
//		alert(arrayIndex[i]);
//	}
	
	//Lancia un evento per l'aggiornamento delle feature presenti su mappa
	var evt = document.createEvent("Event");
    evt.initEvent("updateFeaturesEvent",true,true);
    evt.aIndex = arrayIndex;
    moveUpNumber = arrayIndex;
    document.dispatchEvent(evt);
}

//manually load local data
storeVia.loadData();

