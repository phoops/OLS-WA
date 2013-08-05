Ext.ns('RNGEO');
RNGEO.ListNavigationDirection = Ext.extend(Ext.grid.GridPanel, {
    id:"navigationList",
    collapsible: true,
    initComponent:function() {
        var config = {
        		frame:true,
            	stripeRows: true,
//                autoExpandColumn: 'street',
//            	width: '78%',
            	width: '22%',
                height: 185,
                title: 'Navigation Information',
                // config options for stateful behavior
                stateful: true,
                bodyStyle:'padding:5px 5px 0',
                cls: 'floating-form_left',
                store: storeNav,

                singleSelect : true,
                reserveScrollOffset: true,
                handler: function(storeNavData){
                	storeNav.loadData(storeNavData);
                },
                        columns: [
                                 {
                                      id       :'navigation',
                                      header   : 'Navigation Info',
                                      width    : 300,
                                      sortable : true,
                                      dataIndex: 'navigation'
                                  }
                              ]
        };

        // apply config
        Ext.apply(this, Ext.apply(this.initialConfig, config));
        RNGEO.ListNavigationDirection.superclass.initComponent.call(this);
    }
});
Ext.reg('listNavigationDirection', RNGEO.ListNavigationDirection);

// create the data store
var storeNav = new Ext.data.ArrayStore({
    fields: [
       {name: 'navigation'}
    ]
});
// manually load local data
storeNav.loadData();

var position;
