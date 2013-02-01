Ext.ns('RGEO');
var host = document.location.host;
RGEO.ReverseGeoroutingForm = Ext.extend(Ext.form.FormPanel, {
	initComponent:function() {
		var config = {
				id: 'formReverseId',
		        labelWidth: 75, // label settings here cascade unless 	
		        frame:true,
		        title: 'Reverse Georouting Information',
		        bodyStyle:'padding:5px 5px 0',
		        width: '22%',
		        cls: 'floating-form_left',
		        height: 200,
		        defaults: {width: 230},
		        defaultType: 'textfield',	
		        
		        items: [
				          {
				        	  fieldLabel: 'Latitudine',
				        	  id: 'lat',
				        	  disabled: true
				          },
				          {
				        	  fieldLabel: 'Longitudine	',	    	   
				        	  id: 'lon',
				        	  disabled : true
				          }
				        ]
				
    	};
    	
		// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));
	    //Start init Component
		RGEO.ReverseGeoroutingForm.superclass.initComponent.call(this);
	}
});
Ext.reg('reversegeoroutingform', RGEO.ReverseGeoroutingForm);