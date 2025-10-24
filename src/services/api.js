import axios from 'axios'

const BASE = 'http://172.235.235.11'
const ENDPOINT = '/api/matches'
const USERNAME = 'nikposao@gmail.com' // obavezan header

const client = axios.create({
  baseURL: BASE,
  timeout: 7000,
  headers: {
    'username': USERNAME
  }
})

export async function fetchMatches(){
  const res = await client.get(ENDPOINT)
  return res.data
}
