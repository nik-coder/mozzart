// api/matches.js
import fetch from 'node-fetch'

export default async function handler(req, res) {
  try {
    const upstream = 'http://172.235.235.11/api/matches'
    const upstreamRes = await fetch(upstream, {
      method: 'GET',
      headers: {
        'username': 'nikposao@gmail.com'
      },
      // timeout/other options can be added
    })

    const data = await upstreamRes.text()
    res.status(upstreamRes.status)
    // forward content-type
    const ct = upstreamRes.headers.get('content-type') || 'application/json'
    res.setHeader('content-type', ct)
    res.send(data)
  } catch (err) {
    res.status(500).json({ error: 'Proxy error', detail: err.message })
  }
}