<template>
  <div :class="cardClass" class="match-card">
    <div class="match-info">
      <div>
        <div class="teams">{{ match.home }} vs {{ match.away }}</div>
        <div class="meta">{{ match.league }} • {{ match.time }}</div>
      </div>
    </div>
    <div class="actions">
      <div class="meta">{{ scoreText }}</div>
      <button @click="$emit('toggle-fav', match.id)" :class="['fav', isFav ? 'active' : '']">
        {{ isFav ? 'Praćen' : 'Prati' }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name:'MatchItem',
  props:{
    match:{type:Object,required:true},
    isFav:{type:Boolean,default:false},
    status:{type:String,default:''} // '', 'new', 'removed'
  },
  computed:{
    cardClass(){
      return {
        new: this.status === 'new',
        removed: this.status === 'removed'
      }
    },
    scoreText(){
      return this.match.score ? `${this.match.score.home} - ${this.match.score.away}` : '-'
    }
  }
}
</script>