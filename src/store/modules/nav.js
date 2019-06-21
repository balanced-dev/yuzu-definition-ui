export default {
    namespaced: true,
    state: {
        items: [
            'Blocks',
            'Context',
            'Data'
        ],
        context: 'Context'
    },
    mutations: {
        setCurrent: function (state, navContext) {
            state.context = navContext;
        }
    }
};