export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') return res.status(200).end()
    if (req.method !== 'POST') return res.status(405).end()

    try {
        const { prompt } = req.body
        console.log('prompt received:', prompt?.slice(0, 50))
        console.log('API key exists:', !!process.env.GROQ_API_KEY)

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1000,
                temperature: 0.7,
            })
        })

        const data = await response.json()
        console.log('Groq response status:', response.status)
        console.log('Groq data:', JSON.stringify(data).slice(0, 200))

        if (!response.ok) {
            return res.status(500).json({ error: data.error?.message || 'Groq error' })
        }

        const text = data.choices?.[0]?.message?.content || ''
        res.status(200).json({ text })

    } catch (err) {
        console.log('catch error:', err.message)
        res.status(500).json({ error: err.message })
    }
}