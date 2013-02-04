Ext.ns('GEO');
GEO.ListGeoroutingForm = Ext.extend(Ext.grid.GridPanel, {
    id:"streesList",
    initComponent:function() {
        var config = {
        		frame:true,
            	stripeRows: true,
//                autoExpandColumn: 'street',
//            	width: '78%',
            	width: '100%',
                height: 200,
                title: 'Open LS Results',
                // config options for stateful behavior
                stateful: true,
                bodyStyle:'padding:5px',
                cls: 'floating-form_right',
                store: store,

                singleSelect : true,
                reserveScrollOffset: true,
                handler: function(storeData){
                    store.loadData(storeData);
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
                                      dataIndex: 'place'
                                  },
                                  {
                                      header   : 'Postal Code',
                                      width    : 80,
                                      sortable : true,
                                      dataIndex: 'postalcode'
                                  },
                                  {
                                      header   : 'Country Code',
                                      width    : 80,
                                      sortable : true,
                                      dataIndex: 'country'
                                  },
                                  {
                                      header   : 'Coordinates',
                                      width    : 120,
                                      sortable : true,
                                      dataIndex: 'pos'
                                  },
                                  {
                                      xtype: 'actioncolumn',
                                      width: 50,
                                      items: [{
                                          icon   : '../resources/img/start.png',  // Use a URL in the icon config
                                          tooltip: 'Start Point',
                                          handler: function(grid, rowIndex, colIndex) {
                                              var rec = store.getAt(rowIndex);
                                              Ext.getCmp('routingID').getForm().findField('startPoint').setValue(rec.get('street'));
                                          }
                                      }]
                                  },
                                  {
                                      xtype: 'actioncolumn',
                                      width: 50,
                                      items: [{
                                          icon   : '../resources/img/stop.png',  // Use a URL in the icon config
                                          tooltip: 'End Point',
                                          handler: function(grid, rowIndex, colIndex) {
                                        	  var rec = store.getAt(rowIndex);
                                              Ext.getCmp('routingID').getForm().findField('endPoint').setValue(rec.get('street'));
                                          }
                                      }]
                                  },
                                  {
                                      xtype: 'actioncolumn',
                                      width: 50,
                                      items: [{
                                          icon   : '../resources/img/recalculate.png',  // Use a URL in the icon config
                                          tooltip: 'Recalculate',
                                          handler: function(grid, rowIndex, colIndex) {
                                              var rec = store.getAt(rowIndex);
                                              var value = rec.get('street');
                                              //TODO: da eliminare lo split quando verrà restituito il nomero senza civico
                                              var tValue = value.split(",")[0];
                                              Ext.getCmp('geoSubmit').handler(tValue);
                                          }
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

/**
 * Set the start point for Routing Navigation
 * @param {Object} val , the name of start point
 */
function setStartPoint(val) {
//    if (val > 0) {
//        return '<span style="color:green;">' + val + '</span>';
//    } else if (val < 0) {
//        return '<span style="color:red;">' + val + '</span>';
//    }
//    return val;
}

/**
 * Set the end poitn for Routing Navigation
 * @param {Object} val - the name of end point
 */
function setEndPoint(val) {
//    if (val > 0) {
//        return '<span style="color:green;">' + val + '%</span>';
//    } else if (val < 0) {
//        return '<span style="color:red;">' + val + '%</span>';
//    }
//    return val;
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
store.loadData();

var position;
