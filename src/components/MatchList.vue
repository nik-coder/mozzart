<template>
  <div>
    <div class="status">
      <span v-if="loading">Učitavanje...</span>
      <span v-else>Poslednje osvežavanje: {{ lastUpdated | timeAgo }}</span>
      <span v-if="error" style="color:#ff9b9b"> • Greška: {{ error }}</span>
    </div>

    <div class="list">
      <MatchItem
        v-for="m in visibleMatches"
        :key="m.id"
        :match="m"
        :isFav="followedIds.has(m.id)"
        :status="statuses[m.id] || ''"
        @toggle-fav="toggleFav"
      />
      <div v-if="visibleMatches.length===0" class="empty">Nema mečeva za prikaz</div>
    </div>
  </div>
</template>

<script>
import MatchItem from './MatchItem.vue'
import { ref, reactive, computed } from 'vue'

export default {
  name:'MatchList',
  components:{ MatchItem },
  props:{
    matches:{type:Array,default:()=>[]},
    filters:{type:Object,default:()=>({})},
    followed:{type:Set,default:()=>new Set()}
  },
  emits:['follow-change'],
  setup(props, { emit }){
    const statuses = reactive({})
    const followedIds = new Set(props.followed)

    function clearStatusLater(id, delay=1000){
      setTimeout(()=>{ if(statuses[id]) delete statuses[id] }, delay)
    }

    // Watch for new/removed detection is done in parent; parent may pass matches list already processed.
    // Here we just show statuses provided in statuses reactive (set by parent using events), but
    // for simplicity we'll compute new by checking a transient property on match: __status (set by parent)
    const visibleMatches = computed(()=>{
      let list = props.matches.slice()

      // filter by league
      if(props.filters.league){
        list = list.filter(m=>m.league === props.filters.league)
      }

      // search by team
      if(props.filters.q){
        const q = props.filters.q.toLowerCase()
        list = list.filter(m=> (m.home + ' ' + m.away).toLowerCase().includes(q))
      }

      // only followed toggle
      if(props.filters.onlyFollowed){
        list = list.filter(m=> followedIds.has(m.id))
      }

      // sort
      if(props.filters.sort === 'alpha'){
        list.sort((a,b)=> (a.home + a.away).localeCompare(b.home + b.away))
      } else if(props.filters.sort === 'score'){
        list.sort((a,b)=>{
          const sa = (a.score?.home||0)+(a.score?.away||0)
          const sb = (b.score?.home||0)+(b.score?.away||0)
          return sb - sa
        })
      } else {
        // assume time available as ISO or numeric
        list.sort((a,b)=> new Date(a.time).getTime() - new Date(b.time).getTime())
      }

      // apply transient statuses if present on matches
      list.forEach(m=>{
        if(m.__status){
          statuses[m.id] = m.__status
          clearStatusLater(m.id, 1000)
        }
      })

      return list
    })

    function toggleFav(id){
      if(followedIds.has(id)) followedIds.delete(id)
      else followedIds.add(id)
      emit('follow-change', Array.from(followedIds))
    }

    return { visibleMatches, statuses, toggleFav, followedIds }
  },
  filters: {
    timeAgo(value){
      if(!value) return '-'
      try{
        const d = new Date(value)
        return d.toLocaleString()
      }catch(e){return value}
    }
  }
}
</script>