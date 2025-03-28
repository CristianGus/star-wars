<template>
  <div class="container mt-5">
    <div v-if="favorites.length === 0" class="alert alert-warning" role="alert">
      Add characters to favorites
    </div>
    <div v-else class="row row-cols-1 g-4">
      <div v-for="character in favorites" :key="character.url" class="col">
        <div class="card bg-dark text-warning h-100">
          <div class="card-body">
            <h4 class="card-title">{{ character.name }}</h4>
            <p class="card-text">
              <strong>Gender:</strong> {{ character.gender || "Unknown" }}
            </p>
            <p class="card-text">
              <strong>Species:</strong>
              {{ character.speciesName || "Unknown" }}
            </p>
            <p class="card-text">
              <strong>Vehicles:</strong>
              <span v-if="character.starshipNames.length > 0">
                {{ character.starshipNames.join(", ") }}
              </span>
              <span v-else> None </span>
            </p>
            <button
              @click="removeFromFavorites(character)"
              class="btn btn-danger"
            >
              Remove from Favorites
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState(["favorites"]),
  },
  methods: {
    ...mapActions(["toggleFavorite"]),
    removeFromFavorites(character) {
      this.toggleFavorite(character);
    },
  },
};
</script>
