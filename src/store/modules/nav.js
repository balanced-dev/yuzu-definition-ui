export default {
    namespaced: true,
    state: {
        items: [
            'Blocks',
            'States',
            'Data'
        ],
        context: 'States'
    },
    mutations: {
        setCurrent: function (state, navContext) {
            state.context = navContext;
        }
    }
};