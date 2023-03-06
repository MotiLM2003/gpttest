import { useState, useEffect, useRef } from 'react';
import { Configuration, OpenAIApi } from 'openai';
import Image from 'next/image';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Home() {
	const chatBoxRef = useRef(null);
	const [url, setURL] = useState(null);
	const [prompt, setPrompt] = useState('');
	const [question, setQuestion] = useState('');
	const [loading, setLoading] = useState(false);
	const [lodingQuestion, setLodingQuestion] = useState(false);
	const [chat, setChat] = useState([]);
	const configuration = new Configuration({
		apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
	});
	// test
	const openai = new OpenAIApi(configuration);
	useEffect(() => {
		console.log('key', process.env.NEXT_PUBLIC_OPENAI_API_KEY);
	});
	const generateImage = async () => {
		setLoading(true);
		const response = await openai.createImage({
			// model: 'text-davinci-003',
			prompt: prompt,
			// temperature: 0,
			// max_tokens: 7,
			n: 1,
			size: '512x512',
		});
		setURL(response.data.data[0].url);
		setLoading(false);
	};

	const generateQustion = async () => {
		setQuestion('');
		setLodingQuestion(true);
		const response = await openai.createCompletion({
			model: 'text-davinci-003',
			prompt: question,
			temperature: 0,
			max_tokens: 100,
			top_p: 1,
			frequency_penalty: 0.2,
			presence_penalty: 0,
		});
		setChat((prev) => [...prev, { from: 'user', message: question }]);

		const botMessage = response.data.choices[0].text;
		setChat((prev) => [...prev, { from: 'bot', message: botMessage }]);
		setLodingQuestion(false);
	};

	useEffect(() => {}, []);
	const handleKeyDown = (event) => {
		if (event.key === 'Enter') {
			generateQustion();
		}
	};

	useEffect(() => {
		if (chatBoxRef && chatBoxRef.current)
			chatBoxRef.current.scrollTop = chatBoxRef.current?.scrollHeight;
	}, [chat]);
	return (
		<div className='max-w-5xl m-7 mx-auto bg-gray-800 '>
			<div className='flex justify-center gap-5'>
				<div className=''>
					<div className='flex gap-2'>
						<Input
							type='text'
							placeholder='ask a question'
							value={question}
							className='h-1'
							onChange={(e) => setQuestion(e.target.value)}
							onKeyDown={handleKeyDown}
							disabled={lodingQuestion ? 'disabled' : ''}
						/>
						<Button value='Ask question ' onClick={generateQustion} />
					</div>
					<div
						className='bg-white mt-5  rounded-xl p-1'
						placeholder='chatbot answer'
					>
						{chat.length > 1 ? (
							<div className='max-h-[400px] overflow-scroll' ref={chatBoxRef}>
								{loading && <div>getting data...</div>}
								{chat.map((item, index) => {
									return (
										<div key={index} className='flex flex-col p-2'>
											<div
												className={`p-2 max-w-[300px] rounded-xl  border shadow  ${
													item.from == 'user'
														? 'bg-green-500 text-white self-end'
														: 'bg-gray-300'
												}`}
											>
												{item.message}
											</div>
										</div>
									);
								})}
								{lodingQuestion && (
									<div className='bg-red-400 p-1 justify-center max-w-[200px] rounded m-auto text-center text-white my-3 shadow shadow-black'>
										Generting anser
									</div>
								)}
							</div>
						) : (
							<div className='text-gray-400 text-sm min-h-[400px]'>
								Waiting for your question...
							</div>
						)}
					</div>
				</div>
				<div className=' '>
					<div className='flex gap-4 mb-5 justify-center'>
						<Input
							placeholder={'Enter image description'}
							type='text'
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
						/>
						<Button value='Generate image' onClick={generateImage} />
					</div>
					<div className='flex justify-center'>
						{!loading && url && <img src={url} alt={prompt} />}
						{loading && <div>Loading...</div>}
					</div>
				</div>
			</div>
		</div>
	);
}
