Ext.ns('CONFIG');
var host = document.location.host;
var storeList = [];
var namespace = 'http://www.opengis.net/xls';
var namespace2 = 'http://www.opengis.net/gml';

CONFIG.ConfigForm = Ext
		.extend(
				Ext.form.FormPanel,
				{
					collapsible : true,
					initComponent : function() {
						var config = {
							id : 'formConfigId',
							labelWidth : 75, // label settings here cascade
												// unless
							frame : true,
							title : 'Workspace Config',
							bodyStyle : 'padding:5px 5px 0',
							width : '22%',
							cls : 'floating-form_left',
							height : 125,
							defaults : {
								width : 230
							},
							defaultType : 'textfield',

							items : [
									{
										xtype : 'label',
										text : "Inserire il nome del workspace, se non viene specificato verrà utilizzato quello di default.",
										name : 'infoLabel',
										labelStyle : 'font-weight:bold;',
										anchor : '93%'
									}, {
										fieldLabel : 'WS Name',
										id : 'workspase'
									// ,
									// validator: function(v) {
									// if (v === "" || v == null || v.lenght ==
									// 0) {
									// return "Value is incorrect";
									// }
									// return true;
									// }
									}, ],
							buttons : [ {
								id : 'configSubmit',
								text : 'Submit',
								handler : function() {
									alert("Configurazione");
								}
							} ],

						};

						// apply config
						Ext.apply(this, Ext.apply(this.initialConfig, config));
						// Start init Component
						CONFIG.ConfigForm.superclass.initComponent.call(this);
					}

					,
					setHost : function(hostName) {
						host = hostName;
					}

					,
					getHostName : function() {
						return host;
					}

					,
					validationText : function(v) {
						if (v === "" || v == null || v.lenght == 0) {
							return "Value is incorrect";
						}
						return true;
					}
				});
Ext.reg('configForm', CONFIG.ConfigForm);
