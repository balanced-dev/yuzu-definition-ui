const getNavItems = function() {
    let items = [
        'Blocks',
        'Context'
    ];

    if(location.hostname === "localhost") {
        items.push('Data');
    }

    return items;
};

export default {
    namespaced: true,
    state: {
        items: getNavItems(),
        context: 'Context'
    },
    mutations: {
        setCurrent: function (state, navContext) {
            state.context = navContext;
        }
    }
};