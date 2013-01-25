Ext.ns('GEO');
GEO.ListGeoroutingForm = Ext.extend(Ext.form.FormPanel, {
	initComponent:function() {
    	var config = {
		        labelWidth: 75, // label settings here cascade unless overridden
		        frame:true,
		        title: 'List Result Georouting',
		        bodyStyle:'padding:5px',
		        cls: 'floating-form_right',
		        width: '78%',
		        height: 200,
		        defaults: {width: 230},
		        defaultType: 'listview',
		
		        items: [
		          {
		        	  	store: storeStreets,
		        	    id:"streesList",
		        	    itemId: "aadadadad",
		        	    singleSelect : true,
		        	    emptyText: 'No images to display',
		        	    width: '100%',
// height: '100%',
// width:425,
		                height:250,
		                collapsible:true,
// viewConfig: {
// emptyText: 'No Streets to display'
// },
		        	    handler: function(storeData){
		        	    	var storeStreets = new Ext.data.JsonStore({
		        	    	    data: storeData,
		        	    	    fields: [
		        	    	             'street', 'place', 'postalcode', 'countrycode', 'pos'
		        	    	    ]
		        	    	});
// storeStreets.load();
// this.getStore().loadRecords(storeStreets);
		        	    	this.setStore(storeStreets);
		        	    	
		        	    },
		        	    reserveScrollOffset: true,
		        	    columns: [{
		        	        header: 'Street Name',
		        	        width: '40%',
		        	        height: '100%',
		        	        flex: 50,
		        	        dataIndex: 'street'
		        	    },{
		        	        header: 'Place',
		        	        width: '20%',
		        	        height: '100%',
		        	        flex: 50,
		        	        dataIndex: 'place'
		        	    },{
		        	        header: 'Postal Code',
		        	        width: '20%',
		        	        height: '100%',
		        	        flex: 50,
		        	        dataIndex: 'postalcode'
		        	    },{
		        	        header: 'Country Code',
		        	        width: '20%',
		        	        height: '100%',
		        	        flex: 50,
		        	        dataIndex: 'countrycode'
		        	    }
		        	    ],
		        	    listeners:{
		        	    	render: function(e, record){
		        	    		this.on('click', function(){
		        	    			element = this.getSelectedRecords();
		        	    			position = element[0].json.pos;
		        	    			// Create the event for zoom
		        	    			var evt = document.createEvent("Event");
		        	    			evt.initEvent("georoutingEvent",true,true);
		        	    			evt.pos = position;
		        	    			document.dispatchEvent(evt);
		        	    		})
		        	    		}
		        	    }
		          }
		        ]
    	};
    	
    	// Add Listener
    	this.addListener("prova", this.prova);
    	// apply config
    	Ext.apply(this, Ext.apply(this.initialConfig, config));
    	GEO.ListGeoroutingForm.superclass.initComponent.call(this);
	}
});
Ext.reg('listgeoroutingform', GEO.ListGeoroutingForm);

var storeStreets = new Ext.data.JsonStore({
//    data: 
//    	[
//			{ "street":"PIPPO" , "place":"Doe", "postalcode":"1" ,"countrycode":"sss", "pos":"1 13"},
//			{ "street":"PROVA" , "place":"Doe", "postalcode":"1" ,"countrycode":"sss", "pos":"1 13"}
// { "firstName":"Anna" , "lastName":"Smith", "surname":"2" },
// { "firstName":"Alessio" , "lastName": "Casini", "surname":"3" },
// { "firstName":"Peter" , "lastName": "Jones", "surname":"4" }
//		],
// root: 'images',
    fields: [
        'street', 'place', 'postalcode', 'pos', 'countrycode'
    ]
});
storeStreets.load();

var position;
