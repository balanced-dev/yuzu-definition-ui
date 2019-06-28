import api from "../../api";
import _ from "lodash";
import bootstrap from "../../bootstrap";

export default {
  namespaced: true,
  state: {
    guesses: ['type', 'title']
  },
  actions: {
    get(context, p) {
      var f = "test";
      for(let guess of context.state.guesses) {
        if(p.item.hasOwnProperty(guess) && p.item[guess]) {
          p.action(guess, p.item);
          break;
        }
      };
    }
  }
};
