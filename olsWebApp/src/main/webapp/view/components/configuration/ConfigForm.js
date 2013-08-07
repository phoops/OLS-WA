Ext.ns('CONFIG');
var host = document.location.host;
var storeList = [];
var namespace = 'http://www.opengis.net/xls';
var namespace2 = 'http://www.opengis.net/gml';


CONFIG.ConfigForm = Ext.extend(Ext.form.FormPanel, {
	id: 'formConfigId',
					collapsible : true,
					initComponent : function() {
						var xmlhttp = null;
				        if (window.XMLHttpRequest){
				        	// code for IE7+, Firefox, Chrome, Opera, Safari
				        	xmlhttp = new XMLHttpRequest();
				        }else{
				        	// code for IE6, IE5
				        	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
				        }

				        //TODO: Da cambiare la chiamata al BE
				        var url = "http://"+host+"/geoserver/workspace";
				        xmlhttp.open("GET", url);
				        xmlhttp.onreadystatechange = function() {
				                if (xmlhttp.readyState==4){
				                        switch (xmlhttp.status)
				                            {
				                            case 200: // Do the Do
				                            	var workspaceList = xmlhttp.responseText.split(";");
				                            	
				                            	arraDataObj = [];
				                            	arraDataObj.push(["", "Default Workspace"]);
				                            	for(var i=0; i<workspaceList.length; i++){
				                            		arraDataObj.push([workspaceList[i], workspaceList[i]]);
				                            	}
				                            	storeWS.loadData(arraDataObj);
				                                break;
				                            case 404:
				                            	Ext.MessageBox.alert('Error 404', "Service not Found");
				                                break;
				                            case 500:
				                            	Ext.MessageBox.alert('Error 500', "Problematiche sul Server, riprovare più tardi");
				                                break;
				                            }
				                }
				        };
				        xmlhttp.send();
						var config = {
							labelWidth : 75, // label settings here cascade
												// unless
							collapsed:true,
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
										text : "Selezionare il nome del workspace, se non viene specificato verrà utilizzato quello di default.",
										name : 'infoLabel',
										labelStyle : 'font-weight:bold;',
										anchor : '93%'
									},{
										xtype: 'combo',
							        	  store: storeWS,
							        	  valueField: 'wsValue',
								          displayField: 'wsDisplay',
								          typeAhead: true,
								          mode: 'local',
								          forceSelection: true,
								          triggerAction: 'all',
								          emptyText:'Default Workspace...',
								          selectOnFocus:true,
							        	  fieldLabel: 'WS Name',
							        	  id: 'workspace',
							        	  listeners: {
							                  specialkey: function(f,e){
							                    if (e.getKey() == e.ENTER) {
							                    	Ext.getCmp('formConfigId').getForm().findField('workspace').setDisabled(true);
													Ext.getCmp('configSubmit').setDisabled(true);
													Ext.getCmp('editSubmit').setDisabled(false);
							                    }
							                  }
							                }
							        	  
									},
									],
							buttons : [ {
								id : 'configSubmit',
								text : 'Submit',
								handler : function() {
									Ext.getCmp('formConfigId').getForm().findField('workspace').setDisabled(true);
									Ext.getCmp('configSubmit').setDisabled(true);
									Ext.getCmp('editSubmit').setDisabled(false);
								}
							},{
								id : 'editSubmit',
								text : 'Edit',
//								disabled: true,
								handler : function() {
									Ext.getCmp('formConfigId').getForm().findField('workspace').setDisabled(false);
									Ext.getCmp('configSubmit').setDisabled(false);
									Ext.getCmp('editSubmit').setDisabled(true);
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

//create the data store
var storeWS = new Ext.data.ArrayStore({
    id: 0,
    fields: [
        'wsValue',
        'wsDisplay'
    ],
    data: [ ['ws_OTP', 'ws_OTP'],
            ['pgRouting', 'pgRouting']
    	 ]
});
// manually load local data
storeWS.loadData(myData);
