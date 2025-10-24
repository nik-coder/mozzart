<template>
  <div class="controls">
    <input v-model="q" placeholder="Pretraga po timu..." @input="emitChange" />
    <select v-model="league" @change="emitChange">
      <option value="">Svi lig</option>
      <option v-for="l in leagues" :key="l" :value="l">{{ l }}</option>
    </select>
    <select v-model="sort" @change="emitChange">
      <option value="time">Sortiraj po vremenu</option>
      <option value="alpha">Abecedno</option>
      <option value="score">Po rezultatu</option>
    </select>
    <button @click="$emit('toggle-followed')">Prikaži samo praćene</button>
    <button @click="$emit('refresh')">Osveži</button>
  </div>
</template>

<script>
export default {
  name:'ControlsBar',
  props:{
    leagues:{type:Array,default:()=>[]}
  },
  data(){ return { q:'', league:'', sort:'time' } },
  methods:{
    emitChange(){
      this.$emit('change',{ q:this.q, league:this.league, sort:this.sort })
    }
  }
}
</script>
