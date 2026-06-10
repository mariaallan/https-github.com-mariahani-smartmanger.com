const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;  // مهم: خليها تقرأ من Render

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// 
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        console.log("📨 رسالة:", userMessage);

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'أنت مساعد مدرسة ذكي، أجب باللغة العربية دائماً وبأسلوب تربوي بسيط.' },
                { role: 'user', content: userMessage }
            ],
            max_tokens: 500,
        });

        const reply = completion.choices[0].message.content;
        console.log("🤖 رد:", reply);
        res.json({ reply: reply });
    } catch (error) {
        console.error("❌ خطأ:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 الخادم شغال على http://localhost:${PORT}`);
});