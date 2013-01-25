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
		        	  	store: pippo,
		        	    id:"streesList",
		        	    multiSelect: true,
		        	    emptyText: 'No images to display',
		        	    handler: function(data){
		        	    	alert(data);
		        	    	alert(data[0].lastName);
		        	    },
		        	    reserveScrollOffset: true,
		        	    columns: [{
		        	        header: 'First Name',
		        	        width: .5,
		        	        height: 10,
		        	        dataIndex: 'firstName'
		        	    },{
		        	        header: 'Lasr Name',
		        	        width: .35,
		        	        height: 10,
		        	        dataIndex: 'lastName'
		        	    }]
		          },
		        ]
    	};
    	
    	//Add Listener
    	this.addListener("prova", this.prova);
    	// apply config
    	Ext.apply(this, Ext.apply(this.initialConfig, config));
    	GEO.ListGeoroutingForm.superclass.initComponent.call(this);
  }

	,prova:function(){
		alert("Chiamato Evento Prova");
	}
});
Ext.reg('listgeoroutingform', GEO.ListGeoroutingForm);

var pippo = new Ext.data.JsonStore({
    data: [
			{ "firstName":"John" , "lastName":"Doe" }, 
			{ "firstName":"Anna" , "lastName":"Smith" }, 
			{ "firstName":"Peter" , "lastName": "Jones" }
		],
//    root: 'images',
    fields: [
        'firstName', 'lastName'
    ]
});
pippo.load();

