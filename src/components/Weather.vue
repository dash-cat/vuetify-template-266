<template>
  <div class="container">
    <v-card width="500">
      <v-card-actions class="footer">
        <input type="text" v-model="chooseCity" placeholder="Введите название города" />
        <v-btn text @click="addCity" :disabled="isLoading || !chooseCity"> Добавить город </v-btn>
      </v-card-actions>
    </v-card>

    <v-card v-for="city in cities" :key="city.name" class="mx-auto" width="500">
      <v-btn @click="dialogStates.push(city)" class="mx-2 btn" color="red">
        <v-icon dark> X </v-icon>
      </v-btn>

      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title class="text-h5">
            {{ city.locationData.cityName }} <br>
            <span> {{ new Date().toLocaleDateString() }}</span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-card-text @click="showCelsiy = !showCelsiy">
        <v-row align="center">
          <v-col v-if="!showCelsiy" class="text-h2">
            {{ kelvinToFarengete(city.weatherData.temperature) + ' ℉' }}
          </v-col>
          <v-col v-if="showCelsiy" class="text-h2">
            {{ kelvinToCelsius(city.weatherData.temperature) + ' °C' }}
          </v-col>
        </v-row>
      </v-card-text>

      <v-list-item>
        <v-list-item-subtitle @click="kmPeerHours = !kmPeerHours">
          Скорость ветра:
          {{ kmPeerHours
            ? windToKilometersHours(city.weatherData.windSpeed)
            : windToMilePeerHours(city.weatherData.windSpeed) }}
          {{ kmPeerHours
            ? "km/h"
            : "miles/h" }}
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          Облачность: {{ city.weatherData.clouds }} %</v-list-item-subtitle>
      </v-list-item>
      <v-list-item>
        <v-list-item-subtitle v-if="!showCelsiy">
          Ощущается как:
          {{ kelvinToFarengete(city.weatherData.temperatureFeelsLike) + ' ℉' }}
        </v-list-item-subtitle>
        <v-list-item-subtitle v-if="showCelsiy">
          Ощущается как:
          {{ kelvinToCelsius(city.weatherData.temperatureFeelsLike) + ' °C' }}
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          Влажность воздуха:
          {{ city.weatherData.humidity }} %</v-list-item-subtitle>
      </v-list-item>
      <div v-if="dialogStates.includes(city)" class="warning">
        <v-sheet class="px-7 pt-7 pb-4 mx-auto text-center d-inline-block" color="blue-grey darken-3" dark>
          <div class="grey--text text--lighten-1 text-body-2 mb-4">
            Удалить виджет погоды для {{ city.locationData.cityName }} ?
          </div>

          <v-btn @click="dialogStates = dialogStates.filter(s => s !== city)" class="ma-1" color="grey" plain>
            Отмена
          </v-btn>

          <v-btn class="ma-1" color="error" plain @click="remove(city)">
            Удалить
          </v-btn>
        </v-sheet>
      </div>
    </v-card>
    <v-progress-circular v-if="isLoading" class="loader" indeterminate color="primary"></v-progress-circular>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState(['cities']),
  data() {
    return {
      isDelete: false,
      chooseCity: '',
      showCelsiy: true,
      deleteCity: true,
      isLoading: false,
      dialogStates: [],
      kmPeerHours: true,
    }
  },
  watch: {
    cities(newCities) {
      console.log('Cities', newCities)
    }
  },
  mounted() {
    this.$store.dispatch('requestCityByName', 'Новосибирск')
  },
  methods: {
    addCity() {
      this.isLoading = true
      this.$store
        .dispatch('requestCityByName', this.chooseCity)
        .catch(() => alert('Не удалось загрузить город: ' + this.chooseCity))
        .finally(() => {
          this.isLoading = false;
          this.chooseCity = '';
        })

    },
    kelvinToCelsius(k) {
      return Math.round(k - 273.15)
    },
    kelvinToFarengete(k) {
      return Math.round(((k - 273.15) * 9) / 5 + 32)
    },
    async remove(city) {
      this.$store
        .commit('deleteCity', city)
    },
    windToKilometersHours(t) {
      return Math.round(t * 3.6 * 100) / 100
    },
    windToMilePeerHours(t) {
      return Math.round(t * 2.237 * 100) / 100
    }
  }
}
</script>

<style>
.footer {
  display: flex;
  justify-content: space-between;
}

input {
  padding: 10px;
  height: 30px;
  width: 270px;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.btn {
  font-size: 14px;
  font-family: serif;
  float: right;
  margin: 10px;
}

.warning {
  position: absolute;
  top: 50px;
  left: 50px;
}

.loader {
  margin: 20px;
}
</style>
