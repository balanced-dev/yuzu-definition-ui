import _ from "lodash";

export default {
  namespaced: true,
  state: {
    guesses: ['type', 'title', 'placeholder', 'label']
  },
  actions: {
    get(context, p) {
      for(let guess of context.state.guesses) {
        if(p.item.hasOwnProperty(guess) && p.item[guess]) {
          p.action(guess, p.item);
          break;
        }
      };
    }
  }
};
