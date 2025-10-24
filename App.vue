<template>
  <div class="app">
    <div class="header">
      <img src="/src/assets/logo.svg" class="logo" alt="logo"/>
      <div class="title">Live Sports Matches</div>
    </div>

    <ControlsBar :leagues="leagues" @change="onControlsChange" @toggle-followed="toggleShowFollowed" @refresh="manualRefresh" />

    <div class="status">
      Interval: {{ pollInterval/1000 }}s • Retries: {{ retries }}
    </div>

    <MatchList
      :matches="displayedMatches"
      :filters="filters"
      :followed="new Set(followedIds)"
      @follow-change="onFollowChange"
    />
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import ControlsBar from './components/ControlsBar.vue'
import MatchList from './components/MatchList.vue'
import { fetchMatches } from './services/api'

const POLL_MS = 5000

export default {
  name:'App',
  components:{ ControlsBar, MatchList },
  setup(){
    const matches = ref([])
    const lastFetch = ref(null)
    const loading = ref(false)
    const error = ref('')
    const retries = ref(0)
    const pollInterval = ref(POLL_MS)
    const filters = reactive({ q:'', league:'', sort:'time', onlyFollowed:false })
    const followedIds = ref(JSON.parse(localStorage.getItem('followed')||'[]'))
    const leagues = ref([])

    let timer = null
    let prevMap = new Map()

    function mapById(list){
      const m = new Map()
      (list||[]).forEach(x=>m.set(x.id, x))
      return m
    }

    async function load(){
      loading.value = true
      error.value = ''
      try{
        const data = await fetchMatches()
        retries.value = 0
        lastFetch.value = new Date().toISOString()
        processNewData(data || [])
      }catch(err){
        retries.value += 1
        error.value = err.message || 'Greška pri pozivu API'
      }finally{
        loading.value = false
      }
    }

    function processNewData(newList){
      const newMap = mapById(newList)
      // detect new
      newList.forEach(item=>{
        if(!prevMap.has(item.id)){
          item.__status = 'new'
        }
      })
      // detect removed
      prevMap.forEach((val, id)=>{
        if(!newMap.has(id)){
          // mark a removed transient item and keep it visible for 1s before dropping
          const removed = {...val, __status:'removed'}
          matches.value.push(removed)
          // schedule removal after 1s
          setTimeout(()=>{
            matches.value = matches.value.filter(m=>m.id !== id)
          }, 1000)
        }
      })

      // replace/merge existing
      // keep unique by id, prefer updated items
      const merged = []
      const addedIds = new Set()
      newList.forEach(n=>{
        merged.push(n)
        addedIds.add(n.id)
      })
      // keep any existing ones that were removed transiently already added above
      matches.value.forEach(m=>{
        if(!addedIds.has(m.id) && m.__status === 'removed'){
          merged.push(m)
        }
      })

      matches.value = merged
      prevMap = mapById(merged)

      // extract leagues
      const setL = new Set(newList.map(i=>i.league).filter(Boolean))
      leagues.value = Array.from(setL).sort()
    }

    function schedule(){
      timer = setInterval(()=>{ load() }, pollInterval.value)
    }

    function stopSchedule(){ if(timer) clearInterval(timer) }

    function onControlsChange(payload){
      filters.q = payload.q
      filters.league = payload.league
      filters.sort = payload.sort
    }

    function toggleShowFollowed(){
      filters.onlyFollowed = !filters.onlyFollowed
    }

    function manualRefresh(){
      load()
    }

    function onFollowChange(list){
      followedIds.value = list
      localStorage.setItem('followed', JSON.stringify(list))
    }

    onMounted(()=>{
      load()
      schedule()
    })

    onBeforeUnmount(()=> stopSchedule())

    const displayedMatches = computed(()=> matches.value)

    return {
      displayedMatches, filters, leagues, followedIds, pollInterval, retries,
      onControlsChange, toggleShowFollowed, manualRefresh, onFollowChange,
      loading, error
    }
  }
}
</script>