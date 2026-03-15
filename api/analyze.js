export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') return res.status(200).end()
    if (req.method !== 'POST') return res.status(405).end()

    try {
        // Parse body manual kalau perlu
        let body = req.body
        if (typeof body === 'string') {
            body = JSON.parse(body)
        }

        const prompt = body?.prompt
        console.log('prompt length:', prompt?.length)

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt kosong' })
        }

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
        const text = data.choices?.[0]?.message?.content || ''
        console.log('text length:', text.length)

        res.status(200).json({ text })

    } catch (err) {
        console.log('error:', err.message)
        res.status(500).json({ error: err.message })
    }
}