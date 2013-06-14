Ext.ns('DRAGVP');
var host = document.location.host;
var startPoint = null;
var endPoint = null;
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
                                       evt.rowIndex = rowIndex+1;
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
                                   handler: function() {
                                	   	 alert("Move Up Via Point");
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
//manually load local data
storeVia.loadData();

