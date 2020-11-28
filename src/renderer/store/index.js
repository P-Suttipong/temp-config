import Vue from "vue";
import Vuex from "vuex";

import { createPersistedState, createSharedMutations } from "vuex-electron";

import Counter from "./modules/Counter";

Vue.use(Vuex);

export default function() {
  const Store = new Vuex.Store({
    modules: {
      Counter,
    },
    // plugins: [createPersistedState(), createSharedMutations()],
    strict: process.env.DEBUGGING,
  });
  return Store;
}
