const listeningData = [
  {
    id: 'l01',
    title: 'Ordering Food at a Restaurant',
    level: 'beginner',
    category: 'daily',
    duration: '2 min',
    transcript: `Waiter: Good evening! Welcome to Bella's. Do you have a reservation?
Customer: Yes, under the name Johnson. Table for two, please.
Waiter: Right this way. Here's your menu. Can I start you off with some drinks?
Customer: I'll have a glass of water, and she'll have a lemonade, please.
Waiter: Excellent choice. Are you ready to order, or do you need a few more minutes?
Customer: We need a couple more minutes, thank you.
Waiter: No problem. Take your time.`,
    questions: [
      { q_en: 'What is the name on the reservation?', q_id: 'Atas nama siapa reservasinya?', answer: 'Johnson', options: ['Johnson', 'Jackson', 'Jameson', 'Jordan'] },
      { q_en: 'What does the customer drink?', q_id: 'Apa yang diminum pelanggan?', answer: 'Water', options: ['Water', 'Lemonade', 'Coffee', 'Tea'] },
      { q_en: 'Are they ready to order?', q_id: 'Apakah mereka siap memesan?', answer: 'No, they need more time', options: ['Yes, immediately', 'No, they need more time', 'Yes, they order quickly', 'No, they leave'] },
    ],
    vocabulary_focus: ['reservation', 'menu', 'excellent', 'take your time'],
    cultural_note_en: 'In Western restaurants, it\'s common to make reservations. "Take your time" is a polite phrase meaning there\'s no rush.',
    cultural_note_id: 'Di restoran Barat, reservasi itu umum. "Take your time" adalah frasa sopan yang artinya tidak perlu buru-buru.',
  },
  {
    id: 'l02',
    title: 'Job Interview Introduction',
    level: 'intermediate',
    category: 'business',
    duration: '3 min',
    transcript: `Interviewer: Good morning. Please, have a seat. Tell me a little about yourself.
Candidate: Good morning. Thank you for having me. My name is Sarah, and I recently graduated from the University of Manchester with a degree in Computer Science. During my studies, I completed two internships — one at a startup where I worked on front-end development, and another at a larger company focusing on data analytics.
Interviewer: That's interesting. What would you say is your greatest strength?
Candidate: I'd say my greatest strength is my ability to adapt quickly. In my last internship, the project scope changed dramatically halfway through, and I was able to pick up new technologies on the fly and still deliver on time.
Interviewer: And what about areas you're working to improve?
Candidate: I'm working on being more concise in my communication. I tend to over-explain, so I've been practicing being more direct and structured in how I present information.`,
    questions: [
      { q_en: 'What did Sarah study?', q_id: 'Apa yang dipelajari Sarah?', answer: 'Computer Science', options: ['Computer Science', 'Business', 'Engineering', 'Marketing'] },
      { q_en: 'How many internships did she complete?', q_id: 'Berapa banyak internship yang diselesaikannya?', answer: 'Two', options: ['One', 'Two', 'Three', 'None'] },
      { q_en: 'What is she working to improve?', q_id: 'Apa yang sedang dia perbaiki?', answer: 'Being more concise in communication', options: ['Technical skills', 'Being more concise in communication', 'Time management', 'Leadership'] },
    ],
    vocabulary_focus: ['internship', 'strength', 'adapt', 'concise', 'deliver on time'],
    cultural_note_en: 'In English-speaking job interviews, it\'s standard to be honest about weaknesses — but frame them as areas of active improvement.',
    cultural_note_id: 'Di wawancara kerja bahasa Inggris, penting untuk jujur tentang kelemahan — tapi framing sebagai area yang sedang diperbaiki.',
  },
  {
    id: 'l03',
    title: 'Casual Conversation Between Friends',
    level: 'beginner',
    category: 'social',
    duration: '2 min',
    transcript: `Alex: Hey! Long time no see. How have you been?
Jordan: Hey! I've been good, just super busy with work. How about you?
Alex: Same here. I just started a new project, so it's been crazy. Did you end up going to that concert last weekend?
Jordan: I did! It was honestly amazing. The singer's voice was incredible live.
Alex: Nice! I'm so jealous. I wanted to go but I couldn't get tickets.
Jordan: Oh no! Well, they're coming back in September. I can let you know when tickets go on sale.
Alex: That would be awesome, thanks!`,
    questions: [
      { q_en: 'Why haven\'t they seen each other?', q_id: 'Kenapa mereka belum bertemu?', answer: 'Both have been busy', options: ['One moved away', 'Both have been busy', 'They had a fight', 'One was sick'] },
      { q_en: 'What did Jordan do last weekend?', q_id: 'Apa yang Jordan lakukan akhir pekan lalu?', answer: 'Went to a concert', options: ['Went to a concert', 'Stayed home', 'Traveled', 'Worked'] },
      { q_en: 'Why didn\'t Alex go to the concert?', q_id: 'Kenapa Alex tidak pergi ke konser?', answer: 'Couldn\'t get tickets', options: ['Didn\'t like the band', 'Was working', 'Couldn\'t get tickets', 'Was out of town'] },
    ],
    vocabulary_focus: ['long time no see', 'super busy', 'end up', 'jealous', 'on sale'],
    cultural_note_en: '"Long time no see" is a casual greeting for someone you haven\'t seen in a while. Grammatically informal but universally understood.',
    cultural_note_id: '"Long time no see" adalah sapaan kasual untuk orang yang sudah lama tidak bertemu. Secara grammar informal tapi dipahami semua orang.',
  },
  {
    id: 'l04',
    title: 'TED Talk: The Power of Introverts',
    level: 'advanced',
    category: 'academic',
    duration: '5 min',
    transcript: `When I was nine years old, I went off to summer camp for the first time. And my mother packed me a suitcase full of books, which to me seemed like a perfectly natural thing to do. But when I got to camp, I noticed that the other kids had packed things like footballs and hiking boots. And I started to worry that I might be doing something wrong.

Camp was... not what I expected. There was a lot of emphasis on being outgoing and social. The counselors would lead us in cheer after cheer, and I just wanted to read my books. At the end of camp, they gave out a spirit award, and I didn't get it. I went home worried that I had failed at the most important thing about being a kid — having fun with other kids.

Now, this is a story about introverts, and I think the world has gotten so biased toward extroversion that introverts are constantly being made to feel like something is wrong with them. But there's nothing wrong with being quiet, thoughtful, and preferring deep conversations over small talk.`,
    questions: [
      { q_en: 'What did the mother pack?', q_id: 'Apa yang dibawakan ibunya?', answer: 'Books', options: ['Books', 'Toys', 'Clothes', 'Food'] },
      { q_en: 'What award is mentioned at camp?', q_id: 'Penghargaan apa yang disebutkan di kamp?', answer: 'Spirit award', options: ['Best reader', 'Spirit award', 'Leadership award', 'Camp award'] },
      { q_en: 'What is the main argument?', q_id: 'Apa argumen utamanya?', answer: 'The world is biased toward extroversion', options: ['Summer camp is important', 'Books are better than sports', 'The world is biased toward extroversion', 'Introverts should change'] },
    ],
    vocabulary_focus: ['extroversion', 'introverts', 'biased', 'outgoing', 'spirit'],
    cultural_note_en: 'Susan Cain\'s "Quiet" revolution changed how society views introversion. Many workplaces now value "deep work" over constant collaboration.',
    cultural_note_id: 'Revolusi "Quiet" dari Susan Cain mengubah cara masyarakat memandang introvert. Banyak tempat kerja sekarang menghargai "deep work" daripada kolaborasi terus-menerus.',
  },
]

export default listeningData
