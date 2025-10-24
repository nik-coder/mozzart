import axios from 'axios'

// prije: base='http://172.235.235.11'
const BASE = '' // ili '/'
const ENDPOINT = '/api/matches'
// i u axios create ne stavljajte username header (proxy ga dodaje server-side)
const client = axios.create({ baseURL: BASE, timeout:7000 })
export async function fetchMatches(){
  const res = await client.get(ENDPOINT)
  return res.data
}
