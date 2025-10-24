<template>
  <div class="app-container">
    <h1>Uživo Sportski Mečevi</h1>
    <p v-if="loading">Učitavanje podataka...</p>
    <p v-if="error" class="error">{{ error }}</p>
    <MatchList :matches="matches" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import MatchList from './components/MatchList.vue';

const matches = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchMatches = async () => {
  try {
    const response = await axios.get('http://172.235.235.11/api/matches', {
      headers: { username: 'nikposao@gmail.com' }
    });
    matches.value = response.data;
    loading.value = false;
  } catch (err) {
    error.value = 'Greška pri učitavanju podataka.';
  }
};

onMounted(() => {
  fetchMatches();
  setInterval(fetchMatches, 10000);
});
</script>

<style>
.app-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  font-family: Arial, sans-serif;
}

.error {
  color: red;
}
</style>
