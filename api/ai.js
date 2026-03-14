export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const { moneySaved, daysFree, type } = req.body;

        const prompt = `Atuo como um treinador mental e hipnoterapeuta do 'Método Respira'. O aluno acabou de usar nossa calculadora. Ele está há ${daysFree} dias sem usar ${type} e já economizou R$ ${moneySaved}. Escreva uma mensagem curta (máximo 2 a 3 frases) e de alto impacto parabenizando-o. Fale sobre como o subconsciente dele está sendo curado, sobre a liberdade e saúde conquistadas. Tom premium, acolhedor e encorajador.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 150,
                temperature: 0.7
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        const message = data.choices[0].message.content.trim();

        res.status(200).json({ message });

    } catch (error) {
        console.error('Erro na API da IA:', error);
        res.status(500).json({ message: "Sua liberdade não tem preço e sua mente já entendeu que você não precisa mais desse veneno. Continue respirando fundo, um dia de cada vez!" });
    }
}
