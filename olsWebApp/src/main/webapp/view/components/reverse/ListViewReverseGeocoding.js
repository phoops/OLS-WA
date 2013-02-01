Ext.ns('RGEO');
RGEO.ListReverseGeoroutingForm = Ext.extend(Ext.form.FormPanel, {
	initComponent:function() {
    	var config = {
		        labelWidth: 75, // label settings here cascade unless overridden
		        frame:true,
		        title: 'List Result Reverse Georouting',
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
	        	          height: 350,
	        	          width: 600,
	        	          title: 'Array Grid',
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
		        	    	alert('sono arrivato nel handler');
//		        	    	var storeStreets = new Ext.data.JsonStore({
//		        	    	    data: storeData,
//		        	    	    fields: [
//		        	    	             'street', 'place', 'postalcode', 'countrycode', 'pos'
//		        	    	    ]
//		        	    	});
		        	    	store.loadData(storeData);
//		        	    	this.setStore(storeStreets);
		        	    	
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
//		        	                  renderer : 'usMoney', 
		        	                  dataIndex: 'place'
		        	              },
		        	              {
		        	                  header   : 'Postal Code', 
		        	                  width    : 80, 
		        	                  sortable : true, 
//		        	                  renderer : change, 
		        	                  dataIndex: 'postalcode'
		        	              },
		        	              {
		        	                  header   : 'Country Code', 
		        	                  width    : 80, 
		        	                  sortable : true, 
//		        	                  renderer : pctChange, 
		        	                  dataIndex: 'country'
		        	              },
		        	              {
		        	                  header   : 'Coordinates', 
		        	                  width    : 100, 
		        	                  sortable : true, 
//		        	                  renderer : Ext.util.Format.dateRenderer('m/d/Y'), 
		        	                  dataIndex: 'pos'
		        	              },
		        	              {
		        	                  xtype: 'actioncolumn',
		        	                  width: 60,
		        	                  items: [{
		        	                      label   : '../resources/img/MapMarker.png',  // Use a URL in the icon config
		        	                      tooltip: 'Partenza',
		        	                      handler: function(grid, rowIndex, colIndex) {
		        	                          var rec = store.getAt(rowIndex);
		        	                          alert("Sell " + rec.get('pos'));
		        	                          position = rec.get('pos');
		        	                          
		        	                          //Create the event for zoom
		        	                          var evt = document.createEvent("Event");
		        	                          evt.initEvent("georoutingEvent",true,true);
		        	                          evt.pos = position;
		        	                          document.dispatchEvent(evt);
		        	                      }
		        	                  }, {
		        	                      getClass: function(v, meta, rec) {          // Or return a class from a function
		        	                          if (rec.get('postalcode') < 0) {
		        	                              this.items[1].tooltip = 'Do not buy!';
		        	                              return 'alert-col';
		        	                          } else {
		        	                              this.items[1].tooltip = 'Buy stock';
		        	                              return 'buy-col';
		        	                          }
		        	                      },
		        	                      handler: function(grid, rowIndex, colIndex) {
		        	                          var rec = store.getAt(rowIndex);
		        	                          alert("Buy " + rec.get('pos'));
		        	                      }
		        	                  }]
		        	              }
		        	          ]
		          }
		        ]
    	};
    	
    	// apply config
    	Ext.apply(this, Ext.apply(this.initialConfig, config));
    	RGEO.ListReverseGeoroutingForm.superclass.initComponent.call(this);
	}
});
Ext.reg('listreversegeoroutingform', RGEO.ListReverseGeoroutingForm);

//sample static data for the store
var myData = [
//    ['3m Co','71.72', '0.02',  '0.03',  '9/1 12:00am'],
//    ['Alcoa Inc','29.01', '0.42',  '1.47',  '9/1 12:00am']
];

/**
 * Custom function used for column renderer
 * @param {Object} val
 */
function change(val) {
    if (val > 0) {
        return '<span style="color:green;">' + val + '</span>';
    } else if (val < 0) {
        return '<span style="color:red;">' + val + '</span>';
    }
    return val;
}

/**
 * Custom function used for column renderer
 * @param {Object} val
 */
function pctChange(val) {
    if (val > 0) {
        return '<span style="color:green;">' + val + '%</span>';
    } else if (val < 0) {
        return '<span style="color:red;">' + val + '%</span>';
    }
    return val;
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
store.loadData(myData);

var position;
