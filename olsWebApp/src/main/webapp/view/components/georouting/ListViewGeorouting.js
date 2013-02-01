Ext.ns('GEO');
GEO.ListGeoroutingForm = Ext.extend(Ext.form.FormPanel, {
	initComponent:function() {
    	var config = {
		        labelWidth: 75, // label settings here cascade unless overridden
		        frame:true,
		        title: 'List Result OLS',
		        bodyStyle:'padding:5px',
		        cls: 'floating-form_right',
		        width: '78%',
		        height: 200,
		        defaults: {width: 230},
		        defaultType: 'grid',
		
		        items: [
		        {
			        	stripeRows: true,
//	        	          autoExpandColumn: 'street',
	        	          height: 250,
	        	          width: 600,
	        	          title: 'Results',
	        	          // config options for stateful behavior
	        	          stateful: true,
	        	          
		        		store: store,
		        	    id:"streesList",
		        	    singleSelect : true,
		        	    emptyText: 'No Streets to display',
		        	    width: '100%',
		                height:250,
		        	    reserveScrollOffset: true,
		        	    handler: function(storeData){
		        	    	store.loadData(storeData);
		        	    },
		        	    columns: [
								{
								    xtype: 'actioncolumn',
								    width: 25,
								    items: [{
								        icon   : '../resources/img/MapMarker.png',  // Use a URL in the icon config
								        tooltip: 'Zoom into map',
								        handler: function(grid, rowIndex, colIndex) {
								            var rec = store.getAt(rowIndex);
								            position = rec.get('pos');
								            //Create the event for zoom
								            var evt = document.createEvent("Event");
								            evt.initEvent("georoutingEvent",true,true);
								            evt.pos = position;
								            document.dispatchEvent(evt);
								        }
								    }]
								},
		        	              {
		        	                  id       :'street',
		        	                  header   : 'Street Name', 
		        	                  width    : 300, 
		        	                  sortable : true, 
		        	                  dataIndex: 'street'
		        	              },
		        	              {
		        	                  header   : 'Place', 
		        	                  width    : 60, 
		        	                  sortable : true, 
		        	                  dataIndex: 'place'
		        	              },
		        	              {
		        	                  header   : 'Postal Code', 
		        	                  width    : 80, 
		        	                  sortable : true, 
		        	                  dataIndex: 'postalcode'
		        	              },
		        	              {
		        	                  header   : 'Country Code', 
		        	                  width    : 80, 
		        	                  sortable : true, 
		        	                  dataIndex: 'country'
		        	              },
		        	              {
		        	                  header   : 'Coordinates', 
		        	                  width    : 120, 
		        	                  sortable : true, 
		        	                  dataIndex: 'pos'
		        	              },
		        	              {
		        	                  xtype: 'actioncolumn',
		        	                  width: 50,
		        	                  items: [{
		        	                      icon   : '../resources/img/start.png',  // Use a URL in the icon config
		        	                      tooltip: 'Start Point',
		        	                      handler: function(grid, rowIndex, colIndex) {
		        	                          var rec = store.getAt(rowIndex);
		        	                          alert("Start Point " + rec.get('street'));
		        	                      }
		        	                  }]
		        	              },
		        	              {
		        	                  xtype: 'actioncolumn',
		        	                  width: 50,
		        	                  items: [{
		        	                      icon   : '../resources/img/stop.png',  // Use a URL in the icon config
		        	                      tooltip: 'End Point',
		        	                      handler: function(grid, rowIndex, colIndex) {
		        	                          var rec = store.getAt(rowIndex);
		        	                          alert("End Point " + rec.get('street'));
		        	                      }
		        	                  }]
		        	              }
		        	          ]
		          }
		        ]
    	};
    	
    	// apply config
    	Ext.apply(this, Ext.apply(this.initialConfig, config));
    	GEO.ListGeoroutingForm.superclass.initComponent.call(this);
	}
});
Ext.reg('listgeoroutingform', GEO.ListGeoroutingForm);

/**
 * Set the start point for Routing Navigation
 * @param {Object} val , the name of start point
 */
function setStartPoint(val) {
//    if (val > 0) {
//        return '<span style="color:green;">' + val + '</span>';
//    } else if (val < 0) {
//        return '<span style="color:red;">' + val + '</span>';
//    }
//    return val;
}

/**
 * Set the end poitn for Routing Navigation
 * @param {Object} val - the name of end point
 */
function setEndPoint(val) {
//    if (val > 0) {
//        return '<span style="color:green;">' + val + '%</span>';
//    } else if (val < 0) {
//        return '<span style="color:red;">' + val + '%</span>';
//    }
//    return val;
}

// create the data store
var store = new Ext.data.ArrayStore({
    fields: [
       {name: 'street'},
       {name: 'place'},
       {name: 'postalcode'},
       {name: 'country'},
       {name: 'pos'}
    ]
});
// manually load local data
store.loadData();

var position;
