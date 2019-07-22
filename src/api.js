import axios from "axios";
import store from "./store/store";
import bootstrap from "./bootstrap";

let rootUrl = "http://localhost:3000/api/"

export default {
  getPreviews: () => {
    return axios.get(rootUrl + "getPreviews");
  },
  get: (state) => {
    return axios.get(rootUrl + "get/"+ bootstrap.removePrefix(state))
  },
  getChildStates: (state) => {
    return axios.get(rootUrl + "getChildStates/"+  bootstrap.removePrefix(state))
  },
  getRefPaths: (block) => {
    return axios.get(rootUrl + "getRefPaths/"+ bootstrap.removePrefix(block));
  },
  getEmpty: (blockName, path) => {
    var url = rootUrl + "getEmpty/" +
    bootstrap.blockFromState(blockName, true);
    if(path) {
      url = url +"/"+ encodeURIComponent(path);
    }
    return axios.get(url);
  },
  setActive: (path, active) => {
    axios.get(
      rootUrl + "setActive/" +
        store.state.ws.id +
        "/" +
        encodeURIComponent(path) +
        "/" +
        active
    );
  },
  preview: (data) => {
    return axios.post(rootUrl + "preview", data);
  },
  save: (data) => {
    return axios.post(rootUrl + "save", data);
  }
};


