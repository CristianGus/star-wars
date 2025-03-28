import { createStore } from "vuex";

export default createStore({
  state: {
    favorites: JSON.parse(localStorage.getItem("swapi_favorites")) || [],
  },
  mutations: {
    TOGGLE_FAVORITE(state, character) {
      const index = state.favorites.findIndex(
        (fav) => fav.url === character.url
      );
      if (index === -1) {
        state.favorites.push(character);
      } else {
        state.favorites.splice(index, 1);
      }
      localStorage.setItem("swapi_favorites", JSON.stringify(state.favorites));
    },
  },
  actions: {
    toggleFavorite({ commit }, character) {
      commit("TOGGLE_FAVORITE", character);
    },
  },
  getters: {
    isFavorite: (state) => (character) => {
      return state.favorites.some((fav) => fav.url === character.url);
    },
  },
});
