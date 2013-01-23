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
//		        	  store: store,
		        	    multiSelect: true,
		        	    emptyText: 'No images to display',
		        	    reserveScrollOffset: true,
		        	    columns: [{
		        	        header: 'Toponimo',
		        	        width: .5,
		        	        dataIndex: 'toponimo'
		        	    },{
		        	        header: 'Numero Civico',
		        	        width: .35,
		        	        dataIndex: 'numciv'
//		        	        tpl: '{lastmod:date("m-d h:i a")}'
		        	    },{
		        	        header: 'Note',
		        	        dataIndex: 'note',
//		        	        tpl: '{size:fileSize}', // format using Ext.util.Format.fileSize()
		        	        align: 'right'
		        	    }]
		          }
		        ]
    	};
    	
    	// apply config
    	Ext.apply(this, Ext.apply(this.initialConfig, config));
    	GEO.ListGeoroutingForm.superclass.initComponent.call(this);
  }
});
Ext.reg('listgeoroutingform', GEO.ListGeoroutingForm);

