<template>
   <v-app>
    <Weather/>
   </v-app>
</template>

<script>
import Weather from './components/Weather.vue'

export default {
  components: { Weather },
   name: 'App',
   data: () => ({
      //
   })
}
</script>
