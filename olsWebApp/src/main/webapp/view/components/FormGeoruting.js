Ext.ns('GEO');
GEO.SorForm = Ext.extend(Ext.form.FormPanel, {
    initComponent:function() {
    	var config = {
		        labelWidth: 75, // label settings here cascade unless overridden
		        frame:true,
		        title: 'Form Inputs Georouting',
		        bodyStyle:'padding:5px 5px 0',
		        width: 350,
		        height: 200,
		        defaults: {width: 230},
		        defaultType: 'textfield',
		
		        items: [
		          {fieldLabel: 'Provincia', 	   	   id: 'provincia'},
		          {fieldLabel: 'Comune	',	    	   id: 'comune'},
		          {fieldLabel: 'Toponimo',             id: 'via'}
		        ],
		        buttons: [
		            {text: 'Submit'},
		            {text: 'Reset'},
		        ]
    	};
    	// apply config
    	Ext.apply(this, Ext.apply(this.initialConfig, config));
    	GEO.SorForm.superclass.initComponent.call(this);
  }
});
Ext.reg('sorform', GEO.SorForm);




















//var backtestTab = {
//	xtype : 'georouting'
//}
//
//var intradayTab = {
//	xtype : 'georouting'
//}
//
//GEO.FormGeorouting = Ext.extend(Ext.form.FormPanel, {
//	intiComponent : function() {
//		var config = {
//			title : "Georouting - RFC59",
//			width : 425,
//			frame : true,
//			items : [ new Ext.form.TextField({
//				hideLabel : true,
//				width : 275,
//				allowBlank : false
//			}) ],
//			buttons : [ {
//				text : "Submit"
//			} ]
//		};
//		
//		Ext.apply(this, Ext.apply(this.initialConfig, config));
//
//		GEO.FormGeorouting.superclass.initComponent.call(this);
//	}
//});
//
//Ext.reg('formgeorouting', GEO.FormGeorouting);