const readingData = [
  {
    id: 'r01',
    title: 'Why Do We Procrastinate?',
    level: 'beginner',
    category: 'psychology',
    reading_time: '3 min',
    content: `Procrastination is something almost everyone experiences. You have an important task to do, but instead of doing it, you scroll through social media, watch videos, or clean your room — anything except the actual task.

But why do we procrastinate? Scientists say it's not about being lazy. It's about managing emotions. When a task makes us feel anxious, bored, or overwhelmed, our brain seeks immediate relief by doing something more pleasant.

Dr. Timothy Pychyl from Carleton University explains: "Procrastination is an emotion regulation problem, not a time management problem." This means that to beat procrastination, we need to deal with our feelings first.

Here are some strategies that actually work:
1. Start with just 2 minutes. Tell yourself you'll only work for 2 minutes. Usually, once you start, you keep going.
2. Break the task into tiny pieces. Instead of "write essay," try "write the first sentence."
3. Remove distractions. Put your phone in another room.
4. Forgive yourself. Research shows that self-forgiveness after procrastinating actually reduces future procrastination.

Remember: You don't have to feel motivated to start. Action creates motivation, not the other way around.`,
    vocabulary: [
      { word: 'procrastination', def_en: 'The act of delaying something you need to do', def_id: 'Tindakan menunda sesuatu yang perlu dilakukan' },
      { word: 'overwhelm', def_en: 'To have too many things to deal with', def_id: 'Kewalahan dengan terlalu banyak hal' },
      { word: 'emotion regulation', def_en: 'The ability to manage and respond to emotions', def_id: 'Kemampuan mengelola dan merespons emosi' },
      { word: 'distraction', def_en: 'Something that takes your attention away', def_id: 'Sesuatu yang mengalihkan perhatian' },
      { word: 'self-forgiveness', def_en: 'The act of being kind to yourself after making mistakes', def_id: 'Tindakan baik pada diri sendiri setelah membuat kesalahan' },
    ],
    questions: [
      { q_en: 'What does the article say procrastination is really about?', q_id: 'Menurut artikel, procrastination sebenarnya tentang apa?', answer: 'Managing emotions', options: ['Being lazy', 'Managing emotions', 'Poor planning', 'Lack of intelligence'] },
      { q_en: 'According to the article, what creates motivation?', q_id: 'Menurut artikel, apa yang menciptakan motivasi?', answer: 'Action', options: ['Rest', 'Waiting', 'Action', 'Planning'] },
      { q_en: 'What is the "2 minutes" strategy about?', q_id: 'Strategi "2 menit" itu tentang apa?', answer: 'Starting small to build momentum', options: ['Working only 2 minutes', 'Starting small to build momentum', 'Taking a 2-minute break', 'Setting a 2-minute timer'] },
    ],
    cultural_note_en: 'The concept of "procrastination as emotion regulation" is relatively new in psychology. It shifts blame from laziness to emotional self-protection.',
    cultural_note_id: 'Konsep "prokrastinasi sebagai regulasi emosi" relatif baru dalam psikologi. Ini menggeser tuduhan dari kemalasan ke perlindungan diri emosional.',
  },
  {
    id: 'r02',
    title: 'The Rise of Remote Work',
    level: 'intermediate',
    category: 'business',
    reading_time: '4 min',
    content: `The COVID-19 pandemic fundamentally changed how we work. Before 2020, only about 6% of employees in the United States worked primarily from home. By April 2020, that number had surged to 35%. Now, even as the pandemic has subsided, remote work has stuck around — but in a new form: the hybrid model.

The hybrid model typically means employees come to the office 2-3 days per week and work from home the rest. Companies like Google, Microsoft, and Spotify have adopted variations of this approach. But it's not without challenges.

Communication is the biggest hurdle. When half your team is in the office and half is remote, it's easy for remote workers to feel left out. "Proximity bias" — the tendency to favor people who are physically present — is a real concern. A Stanford study found that remote workers were 50% less likely to be promoted than their in-office colleagues.

However, there are undeniable benefits. Workers report higher satisfaction, better work-life balance, and reduced commuting stress. Companies save on office space costs. And the talent pool expands geographically — you can hire the best person for the job, not just the best person in your city.

The future of work isn't fully remote or fully in-office. It's finding the right balance for each team, each role, and each individual.`,
    vocabulary: [
      { word: 'surged', def_en: 'Increased suddenly and greatly', def_id: 'Meningkat tiba-tiba dan drastis' },
      { word: 'subsided', def_en: 'Became less intense or severe', def_id: 'Menjadi kurang intens atau parah' },
      { word: 'proximity bias', def_en: 'Preference for people who are physically nearby', def_id: 'Preferensi terhadap orang yang secara fisik dekat' },
      { word: 'talent pool', def_en: 'The group of qualified candidates available for hire', def_id: 'Kelompok kandidat berkualitas yang tersedia untuk direkrut' },
      { word: 'undeniable', def_en: 'Cannot be denied or disputed', def_id: 'Tidak dapat disangkal' },
    ],
    questions: [
      { q_en: 'What percentage worked from home before the pandemic?', q_id: 'Berapa persen yang WFH sebelum pandemi?', answer: 'About 6%', options: ['About 6%', 'About 15%', 'About 25%', 'About 35%'] },
      { q_en: 'What is "proximity bias"?', q_id: 'Apa itu "proximity bias"?', answer: 'Favoring people who are physically present', options: ['Working too close to colleagues', 'Favoring people who are physically present', 'Bias against remote tools', 'Preferring nearby offices'] },
      { q_en: 'According to the article, what is the future of work?', q_id: 'Menurut artikel, apa masa depan kerja?', answer: 'Finding the right balance', options: ['Fully remote', 'Back to office', 'Finding the right balance', 'AI replacing workers'] },
    ],
    cultural_note_en: 'Remote work culture varies globally. In Japan, WFH was rare pre-pandemic due to work culture emphasizing physical presence. In Scandinavia, flexible work was already common.',
    cultural_note_id: 'Budaya WFH berbeda-beda di setiap negara. Di Jepang, WFH jarang sebelum pandemi karena budaya kerja yang menekankan kehadiran fisik. Di Skandinavia, kerja fleksibel sudah umum.',
  },
  {
    id: 'r03',
    title: 'The Science of Sleep',
    level: 'advanced',
    category: 'science',
    reading_time: '5 min',
    content: `Sleep is one of the most important — yet most neglected — aspects of human health. Despite spending roughly one-third of our lives sleeping, many people don't understand why we need it or what happens when we don't get enough.

During sleep, the brain cycles through two main types: NREM (Non-Rapid Eye Movement) and REM (Rapid Eye Movement) sleep. NREM has three stages, each progressively deeper. Stage 1 is light sleep — the kind where you can be easily awakened. Stage 2 is when your body temperature drops and heart rate slows. Stage 3 is deep sleep, crucial for physical recovery and immune function.

REM sleep is when most dreaming occurs. Your brain is nearly as active as when you're awake. This stage is essential for memory consolidation, emotional processing, and creative problem-solving. Research by Dr. Matthew Walker at UC Berkeley has shown that REM sleep acts as "overnight therapy," helping us process difficult emotional experiences.

Chronic sleep deprivation (getting less than 7 hours regularly) has been linked to increased risks of heart disease, diabetes, obesity, and even Alzheimer's. A landmark study showed that after just one week of sleeping 6 hours per night, cognitive performance dropped to levels equivalent to someone who hadn't slept for 48 hours.

The key takeaway: sleep is not a luxury — it's a biological necessity. And the quality matters as much as the quantity.`,
    vocabulary: [
      { word: 'neglected', def_en: 'Not given enough attention or care', def_id: 'Tidak diberi cukup perhatian atau perawatan' },
      { word: 'cognitive performance', def_en: 'How well the brain processes information', def_id: 'Seberapa baik otak memproses informasi' },
      { word: 'chronic', def_en: 'Persisting for a long time or constantly recurring', def_id: 'Bertahan lama atau terus berulang' },
      { word: 'consolidation', def_en: 'The process of making something stronger or more solid', def_id: 'Proses membuat sesuatu lebih kuat atau kokoh' },
      { word: 'landmark', def_en: 'Very important and likely to be remembered', def_id: 'Sangat penting dan kemungkinan akan dikenang' },
    ],
    questions: [
      { q_en: 'How many stages does NREM sleep have?', q_id: 'Berapa tahap tidur NREM?', answer: 'Three', options: ['Two', 'Three', 'Four', 'Five'] },
      { q_en: 'What is REM sleep crucial for?', q_id: 'Tidur REM penting untuk apa?', answer: 'Memory consolidation and emotional processing', options: ['Physical recovery', 'Memory consolidation and emotional processing', 'Muscle repair', 'Digestion'] },
      { q_en: 'What happens after one week of 6 hours sleep?', q_id: 'Apa yang terjadi setelah seminggu tidur 6 jam?', answer: 'Cognitive performance drops significantly', options: ['Nothing noticeable', 'Cognitive performance drops significantly', 'You adapt and feel fine', 'Weight increases'] },
    ],
    cultural_note_en: 'In many Asian cultures, sleeping less is sometimes seen as a sign of hard work and dedication. Western science increasingly pushes back against this, advocating for 7-9 hours.',
    cultural_note_id: 'Di banyak budaya Asia, tidur lebih sedikit kadang dianggap tanda kerja keras. Sains Barat semakin menentang ini, menganjurkan 7-9 jam.',
  },
]

export default readingData
