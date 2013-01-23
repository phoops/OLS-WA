Ext.ns('GEO');
GEO.GeoroutingForm = Ext.extend(Ext.form.FormPanel, {
    initComponent:function() {
    	var config = {
		        labelWidth: 75, // label settings here cascade unless overridden
		        frame:true,
		        title: 'Form Inputs Georouting',
		        bodyStyle:'padding:5px 5px 0',
		        width: '22%',
		        cls: 'floating-form_left',
		        height: 200,
		        defaults: {width: 230},
		        defaultType: 'textfield',
		
		        items: [
		          {
		        	  fieldLabel: 'Provincia',
		        	  id: 'provincia',
		        	  validator: function(v) {
                         return validationText(v);
                      }
		          },
		          {
		        	  fieldLabel: 'Comune	',	    	   
		        	  id: 'comune',
		        	  validator: function(v) {
		        		  return validationText(v);
		        	  }
		          },
		          {
		        	  fieldLabel: 'Toponimo', 
		        	  id: 'via',
		        	  validator: function(v){
		        		 return validationText(v);
		        	  }
		          }
		        ],
		        buttons: [
		            {
		            	id: 'geoSubmit',
		            	text: 'Submit',
		            	handler: function(){
		            		if(Ext.getCmp('provincia').isValid()
		            				&& Ext.getCmp('comune').isValid()
		            				&& Ext.getCmp('via').isValid()){
		            			var pValue = Ext.getCmp('provincia').getValue(); 
			            		var cValue = Ext.getCmp('comune').getValue();
			            		var tValue = Ext.getCmp('via').getValue();
			            		
			            		alert(pValue);
			            		alert(cValue);
			            		alert(tValue);
		            		}else{
		            			return;
		            		}
		            		
		            		
		            	}
		            },
		            {	
		            	id: 'geoReset',
		            	text: 'Reset',
		            	handler: function(){
			            	Ext.MessageBox.alert('Reset', 'Reset dei parametri nella form');
			            	Ext.getCmp('provincia').setValue(null);
			            	Ext.getCmp('comune').setValue(null);
			            	Ext.getCmp('via').setValue(null);
			            }	
		            },
		        ]
		        
    	};
    	
    	// apply config
    	Ext.apply(this, Ext.apply(this.initialConfig, config));
    	GEO.GeoroutingForm.superclass.initComponent.call(this);
  }
});
Ext.reg('georoutingform', GEO.GeoroutingForm);


function validationText(v){
	if (v === "" || v == null || v.lenght == 0) {
        return "Value is incorrect";
    }
    return true;
}
