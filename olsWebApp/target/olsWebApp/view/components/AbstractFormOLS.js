//Abstract class Component
Ext.ns('OLS');

OLS.AbstractFormOLS = Ext.extend(Ext.form.FormPanel, {
		defaultType:'textfield'
		,frame:true
	    ,width:300
	    ,height:200
	    ,labelWidth:75
	    ,submitUrl:null
	    ,submitT:'Submit'
	    ,cancelT:'Cancel',
	initComponent: function(){
		//create configuration object
		var config = {
				defaults:{anchor:'-10'}
		};
		
		//build config
		this.buildConfig(config);
		
		//apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		
		//call parent
		OLS.AbstractFormPanel.superclass.initComponent.call(this);
	} // eo function initComponent

	,buildconfig:function(config){
		this.buildItems(config);
		this.buildButtons(config);
	} // eo function buildConfig
	
	,buildItems:function(config){
		config.items = undefined;
	} // function buildItems
	
	,buildButtons:function(config){
		config.buttons = [{
            text:this.submitT
           ,scope:this
           ,handler:this.onSubmit
       },{
            text:this.cancelT
           ,scope:this
           ,handler:this.onCancel
       }];
	}
	
	,onSubmit:function() {
        Ext.MessageBox.alert('Submit', this.submitUrl);
    } // eo function onSubmit
 
    ,onCancel:function() {
        this.el.mask('This form is canceled');
    } // eo function onCancel
});