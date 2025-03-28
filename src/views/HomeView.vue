<template>
  <div class="header d-flex justify-content-center align-items-center py-4">
    <img class="logoStar" />
  </div>

  <div class="container">
    <div class="d-flex justify-content-end">
      <button
        class="btn btn-warning mb-4"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasRight"
        aria-controls="offcanvasRight"
      >
        My favorites
      </button>

      <div
        class="offcanvas offcanvas-end"
        tabindex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <div class="offcanvas-header">
          <h4 id="offcanvasRightLabel" class="text-dark">
            My favorites characters
          </h4>
          <button
            type="button"
            class="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div class="offcanvas-body">
          <Favorites />
        </div>
      </div>
    </div>
    <div class="mb-3 row">
      <div class="col-md-6 mb-2">
        <select
          v-model="selectedSpecies"
          class="form-select bg-dark text-warning"
        >
          <option value="">All Species</option>
          <option
            v-for="species in allSpecies"
            :key="species.url"
            :value="species.url"
          >
            {{ species.name }}
          </option>
        </select>
      </div>

      <div class="col-md-6 mb-2">
        <select
          v-model="selectedVehicle"
          class="form-select bg-dark text-warning"
        >
          <option value="">All Vehicles</option>
          <option
            v-for="vehicle in allStarshipsData"
            :key="vehicle.url"
            :value="vehicle.url"
          >
            {{ vehicle.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="mb-3">
      <label for="search" class="text-warning mb-1"
        >Search Characters by name</label
      >
      <input
        v-model="searchQuery"
        type="text"
        class="form-control bg-dark text-warning"
        id="search"
      />
    </div>

    <div
      v-if="loading"
      class="row row-cols-1 row-cols-md-3 g-4 skeleton-container"
    >
      <div v-for="i in 15" :key="i" class="col">
        <div class="card bg-dark text-warning h-100 skeletonCard">
          <div class="card-body">
            <h5 class="card-title skeleton-line"></h5>
            <p class="card-text skeleton-line w-75"></p>
            <p class="card-text">
              <span class="skeleton-line w-50"></span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="text-danger">
      Error loading characters: {{ error }}
    </div>

    <div
      v-else
      class="row row-cols-1 row-cols-md-3 g-4 character-cards-container"
    >
      <div
        v-for="character in filteredCharacters"
        :key="character.url"
        class="col"
      >
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
              @click="toggleFavorite(character)"
              :class="{
                btn: true,
                'btn-warning': !isFavorite(character),
                'btn-danger': isFavorite(character),
              }"
            >
              <span v-if="isFavorite(character)">Remove from Favorites</span>
              <span v-else>Add to Favorites</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <button
      v-if="filteredCharacters.length < characters.length && !loading"
      @click="loadMore"
      class="btn btn-outline-warning mt-3"
    >
      Load More
    </button>
  </div>
  <footer
    class="footer text-white py-3 d-flex justify-content-center flex-column align-items-center"
  >
    <p class="mb-0">2025 Cristian Leiva</p>
    <p class="mb-0">cristian.leivalot@gmail.com</p>
  </footer>
</template>

<script>
import axios from "axios";
import debounce from "lodash/debounce";
import Favorites from "./FavoritesView.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    Favorites,
  },

  data() {
    return {
      characters: [],
      loading: false,
      error: null,
      allStarshipsData: [],
      allSpecies: [],
      searchQuery: localStorage.getItem("swapi_searchQuery") || "",
      selectedSpecies: localStorage.getItem("swapi_selectedSpecies") || "",
      selectedVehicle: localStorage.getItem("swapi_selectedVehicle") || "",
      itemsToLoad: 12,
      displayedCharacterCount:
        parseInt(localStorage.getItem("swapi_displayedCharacterCount"), 10) ||
        15,
    };
  },

  computed: {
    filteredCharacters() {
      const searchTerm = this.searchQuery.toLowerCase();
      return this.characters
        .filter(
          (character) =>
            character.name.toLowerCase().includes(searchTerm) &&
            (this.selectedSpecies === "" ||
              character.species.includes(this.selectedSpecies)) &&
            (this.selectedVehicle === "" ||
              character.starships.includes(this.selectedVehicle))
        )
        .slice(0, this.displayedCharacterCount);
    },
    ...mapGetters(["isFavorite"]),
  },

  watch: {
    searchQuery: {
      handler: "debouncedSearch",
      immediate: true,
    },
    selectedSpecies(newSpecies) {
      localStorage.setItem("swapi_selectedSpecies", newSpecies);
      this.displayedCharacterCount = this.itemsToLoad;
    },
    selectedVehicle(newVehicle) {
      localStorage.setItem("swapi_selectedVehicle", newVehicle);
      this.displayedCharacterCount = this.itemsToLoad;
    },
  },

  methods: {
    ...mapActions(["toggleFavorite"]),
    debouncedSearch: debounce(function (newQuery) {
      if (typeof localStorage !== "undefined") {
        try {
          localStorage.setItem("swapi_searchQuery", newQuery);
          this.displayedCharacterCount = this.itemsToLoad;
        } catch (error) {
          console.error("Error saving searchQuery to localStorage:", error);
        }
      }
    }, 300),
    async fetchStarships() {
      this.loading = true;
      try {
        let allStarships = [];
        let next = "https://swapi.dev/api/starships/";
        while (next) {
          const response = await axios.get(next);
          allStarships = allStarships.concat(response.data.results);
          next = response.data.next;
        }
        this.allStarshipsData = allStarships;
        return this.allStarshipsData;
      } catch (error) {
        console.error("Error catching starchips:", error);
        this.error = error.message;
        return [];
      } finally {
        // No desactivar loading
      }
    },
    async fetchSpecies() {
      try {
        let allSpecies = [];
        let next = "https://swapi.dev/api/species/";
        while (next) {
          const response = await axios.get(next);
          allSpecies = allSpecies.concat(response.data.results);
          next = response.data.next;
        }
        this.allSpecies = allSpecies;
      } catch (error) {
        console.error("Error catching species:", error);
        this.error = error.message;
      }
    },
    async fetchCharacters() {
      try {
        let allCharacters = [];
        let next = "https://swapi.dev/api/people/";
        while (next) {
          const response = await axios.get(next);
          allCharacters = allCharacters.concat(response.data.results);
          next = response.data.next;
        }
        this.characters = await Promise.all(
          allCharacters.map(async (char) => {
            try {
              let speciesName = "Unknown";
              if (char.species && char.species.length > 0) {
                try {
                  const speciesResponse = await axios.get(char.species[0]);
                  speciesName = speciesResponse.data.name;
                } catch (err) {
                  console.error(`Error fetching species of ${char.name}:`, err);
                }
              }
              let starshipNames = [];
              if (
                char.starships &&
                char.starships.length > 0 &&
                this.allStarshipsData.length > 0
              ) {
                starshipNames = char.starships.map((shipUrl) => {
                  const starship = this.allStarshipsData.find(
                    (ship) => ship.url === shipUrl
                  );
                  return starship ? starship.name : "Unknown ship";
                });
              }
              return {
                url: char.url,
                name: char.name,
                gender: char.gender,
                species: char.species,
                speciesName: speciesName,
                starships: char.starships,
                starshipNames: starshipNames,
              };
            } catch (error) {
              console.error(`Error processing character ${char.name}:`, error);
              return {
                url: char.url,
                name: char.name || "Unknown",
                gender: "Unknown",
                species: [],
                speciesName: "Unknown",
                starships: [],
                starshipNames: [],
              };
            }
          })
        );
        console.log("All characters obtained:", this.characters);
      } catch (err) {
        this.error = "Failed to fetch API data";
        console.error("General API error:", err);
      } finally {
        this.loading = false;
      }
    },
    loadMore() {
      this.displayedCharacterCount += this.itemsToLoad;
      localStorage.setItem(
        "swapi_displayedCharacterCount",
        this.displayedCharacterCount
      );
    },
  },

  async mounted() {
    await Promise.all([
      this.fetchStarships(),
      this.fetchSpecies(),
      this.fetchCharacters(),
    ]);
  },
};
</script>
