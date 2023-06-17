<template>
  <div class="container">
    <v-card width="500">
    <v-card-actions class="footer">
      <input type="text" v-model="chooseCity" placeholder="Введите название города" >
       <v-btn text @click="addCity">
         Добавить город
       </v-btn>
     </v-card-actions>
   </v-card>

   <v-card
    v-for="city in cities"
    :key="city.name"
    class="mx-auto"
    width="500"
   >
   <v-btn
      class="mx-2 btn"
      color="red"
    >
      <v-icon dark>
        X
      </v-icon>
    </v-btn>

     <v-list-item two-line>
       <v-list-item-content>
         <v-list-item-title class="text-h5">
           {{ city.name }} 
           <span> {{ (new Date).toLocaleDateString() }}</span>
         </v-list-item-title>
       </v-list-item-content>
     </v-list-item>
 
     <v-card-text @click="showCelsiy = !showCelsiy">
       <v-row align="center">
         <v-col v-if="!showCelsiy" class="text-h2">
          {{ kelvinToFarengete(city.weatherData.temperature) + ' ℉' }}
         </v-col>
         <v-col  v-if="showCelsiy" class="text-h2">
          {{ kelvinToCelsius(city.weatherData.temperature) + ' °C'}}
         </v-col>
       </v-row>
     </v-card-text>
 
     <v-list-item>
       <v-list-item-subtitle> Скорость ветра: {{ city.weatherData.windSpeed }} km/h</v-list-item-subtitle>
       <v-list-item-subtitle> Влажность воздуха: {{ city.weatherData.humidity }} %</v-list-item-subtitle>
     </v-list-item>

   </v-card>
  
  </div>
 </template>

<script>

import { mapState } from 'vuex';

export default {
 computed: mapState([
    'cities'
  ]),
  data () {
    return {
      time: 0,
      chooseCity: '',
      showCelsiy: true,
    }
  },
  watch: {
    cities(newCities) {
      console.log('Cities', newCities);
    }
  },
  mounted() {
    this.$store.dispatch('requestCityByName', 'Novosibirsk');
    console.log('sit', this.cities)
  },
  methods: {
    addCity() {
      this.$store.dispatch('requestCityByName', this.chooseCity);
      this.chooseCity = ''
    },
    kelvinToCelsius(k) {
      return Math.round(k - 273.15)
    },
    kelvinToFarengete(k) {
      return Math.round((k - 273.15) * 9/5 + 32)
    }

    
  }
}
</script>

<style>
.footer{
  display: flex;
  justify-content: space-between;
}
input{
  padding: 10px;
  height: 30px;
  width: 270px;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.btn {
  font-size: 14px;
  font-family: serif;
  float: right;
  margin: 10px;
}

</style>