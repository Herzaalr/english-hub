const contextCultureData = [
  {
    id: 'cc01',
    title: 'Small Talk in English-Speaking Countries',
    category: 'social',
    icon: '💬',
    description_en: 'Small talk is a cultural art form in English-speaking countries. It\'s not about the content — it\'s about building rapport.',
    description_id: 'Small talk adalah seni budaya di negara-negara berbahasa Inggris. Bukan tentang isinya — tapi membangun hubungan.',
    scenarios: [
      {
        situation_en: 'You meet someone at a networking event',
        situation_id: 'Kamu bertemu seseorang di acara networking',
        dialogue: [
          { speaker: 'A', en: 'Hey, how\'s it going?', id: 'Hey, apa kabar?' },
          { speaker: 'B', en: 'Pretty good, thanks! How about you?', id: 'Baik, makasih! Kamu?' },
          { speaker: 'A', en: 'Not bad! What do you do?', id: 'Lumayan! Kamu kerja apa?' },
          { speaker: 'B', en: 'I\'m in marketing. What about you?', id: 'Aku di marketing. Kamu?' },
        ],
        tips_en: 'Always ask back! "How about you?" is essential for natural conversation.',
        tips_id: 'Selalu balik bertanya! "How about you?" penting untuk percakapan natural.',
      },
      {
        situation_en: 'At a coffee shop (daily routine)',
        situation_id: 'Di kedai kopi (rutinitas harian)',
        dialogue: [
          { speaker: 'Barista', en: 'Morning! What can I get you?', id: 'Pagi! Mau pesan apa?' },
          { speaker: 'You', en: 'Can I get a large latte, please?', id: 'Satu latte besar, ya.' },
          { speaker: 'Barista', en: 'For here or to go?', id: 'Minum di sini atau dibawa?' },
          { speaker: 'You', en: 'To go, please.', id: 'Dibawa, ya.' },
        ],
        tips_en: '"Can I get..." is more natural than "I want" or "Give me." It sounds polite but casual.',
        tips_id: '"Can I get..." lebih natural dari "I want" atau "Give me." Kedengaran sopan tapi santai.',
      },
    ],
    cultural_notes: [
      { en: 'In the US/UK, asking "How are you?" is a greeting, not a genuine health inquiry. The expected answer is "Good/Fine, thanks!"', id: 'Di US/UK, bertanya "How are you?" itu sapaan, bukan pertanyaan kesehatan sungguhan. Jawaban yang diharapkan: "Good/Fine, thanks!"' },
      { en: 'Weather is the #1 small talk topic in the UK. "Lovely day, isn\'t it?" is a classic opener.', id: 'Cuaca adalah topik small talk #1 di UK. "Lovely day, isn\'t it?" adalah pembuka klasik.' },
      { en: 'Avoid controversial topics (politics, religion, salary) in casual settings.', id: 'Hindari topik kontroversial (politik, agama, gaji) di situasi kasual.' },
    ],
  },
  {
    id: 'cc02',
    title: 'Formal vs Informal English',
    category: 'register',
    icon: '👔',
    description_en: 'English speakers adjust their language based on context. Using the wrong register can sound rude or overly stiff.',
    description_id: 'Penutur bahasa Inggris menyesuaikan bahasa berdasarkan konteks. Menggunakan register yang salah bisa kedengaran kasar atau terlalu kaku.',
    scenarios: [
      {
        situation_en: 'Emailing your professor',
        situation_id: 'Email ke dosen',
        dialogue: [
          { speaker: 'Formal', en: 'Dear Professor Smith, I hope this email finds you well. I am writing to inquire about...', id: 'Dear Professor Smith, semoga email ini menemui Anda dalam keadaan baik. Saya menulis untuk menanyakan...' },
          { speaker: 'Informal', en: 'Hey, quick question about the assignment...', id: 'Hei, mau tanya soal tugas...' },
        ],
        tips_en: 'Use formal with professors, bosses, strangers. Informal is fine with friends and peers.',
        tips_id: 'Pakai formal dengan dosen, bos, orang asing. Informal oke untuk teman dan sebaya.',
      },
      {
        situation_en: 'At work — asking for help',
        situation_id: 'Di kerja — minta tolong',
        dialogue: [
          { speaker: 'Formal', en: 'Would you mind helping me with this report? I\'d really appreciate your input.', id: 'Apakah keberatan membantu saya dengan laporan ini? Saya sangat menghargai masukan Anda.' },
          { speaker: 'Informal', en: 'Hey, can you help me with this? I\'m stuck.', id: 'Hei, bisa bantu aku? Aku stuck.' },
        ],
        tips_en: '"Would you mind" and "I\'d appreciate" are polite phrases that soften requests.',
        tips_id: '"Would you mind" dan "I\'d appreciate" adalah frasa sopan yang melembutkan permintaan.' },
    ],
    cultural_notes: [
      { en: 'In Australian English, informality is the default even in professional settings. "G\'day mate" can be used by CEOs.', id: 'Dalam bahasa Inggris Australia, informalitas adalah default bahkan di lingkungan profesional.' },
      { en: 'American English tends to be more informal than British English in professional settings.', id: 'Bahasa Inggris Amerika cenderung lebih informal dari Inggris Inggris di lingkungan profesional.' },
    ],
  },
  {
    id: 'cc03',
    title: 'Indirect Communication',
    category: 'pragmatics',
    icon: '🎭',
    description_en: 'English speakers (especially British) often say the opposite of what they mean. Learning to read between the lines is crucial.',
    description_id: 'Penutur bahasa Inggris (terutama British) sering mengatakan kebalikan dari yang dimaksud. Belajar membaca antar baris itu penting.',
    scenarios: [
      {
        situation_en: 'When a British person says:',
        situation_id: 'Ketika orang Inggris bilang:',
        dialogue: [
          { speaker: 'They say', en: '"That\'s quite interesting."', id: '"Itu cukup menarik."' },
          { speaker: 'They mean', en: '"I don\'t find this interesting at all."', id: '"Aku nggak tertarik sama sekali."' },
          { speaker: 'They say', en: '"With the greatest respect..."', id: '"Dengan segara hormat..."' },
          { speaker: 'They mean', en: '"I think you\'re wrong."', id: '"Aku pikir kamu salah."' },
          { speaker: 'They say', en: '"I\'ll bear that in mind."', id: '"Aku akan mengingatnya."' },
          { speaker: 'They mean', en: '"I\'ve already forgotten what you said."', id: '"Aku udah lupa apa yang kamu bilang."' },
        ],
        tips_en: 'The more "polite" and hedged the phrase, the more likely it means the opposite.',
        tips_id: 'Semakin "sopan" dan berbelit frasanya, semakin mungkin artinya kebalikan.' },
    ],
    cultural_notes: [
      { en: 'This is called "British understatement." It\'s not dishonest — it\'s a cultural preference for indirectness and politeness.', id: 'Ini disebut "British understatement." Bukan tidak jujur — ini preferensi budaya untuk tidak langsung dan sopan.' },
      { en: 'Americans tend to be more direct but still soften criticism with "I think" or "maybe".', id: 'Orang Amerika cenderung lebih langsung tapi tetap melembutkan kritik dengan "I think" atau "maybe".' },
    ],
  },
  {
    id: 'cc04',
    title: 'Humor Across Cultures',
    category: 'social',
    icon: '😂',
    description_en: 'Understanding humor is one of the hardest parts of learning a language. Here\'s how English humor works.',
    description_id: 'Memahami humor adalah salah satu bagian tersulit belajar bahasa. Ini cara humor bahasa Inggris bekerja.',
    scenarios: [
      {
        situation_en: 'Deadpan / Dry humor (British)',
        situation_id: 'Humor datar / kering (British)',
        dialogue: [
          { speaker: 'A', en: 'Did you enjoy the 3-hour meeting?', id: 'Kamu menikmati rapat 3 jam?' },
          { speaker: 'B', en: 'Oh, absolutely. It was the highlight of my life.', id: 'Oh, tentu saja. Itu puncak hidupku.' },
        ],
        tips_en: 'Sarcasm is delivered with a completely straight face. The delivery is the joke.',
        tips_id: 'Sarkasme disampaikan dengan wajah datar. Caranya adalah leluconnya.' },
    ],
    cultural_notes: [
      { en: 'British humor: dry, sarcastic, self-deprecating. Australian humor: similar to British but more crude. American humor: more obvious, often punchline-based.', id: 'Humor British: kering, sarkastis, merendah. Humor Australia: mirip British tapi lebih kasar. Humor Amerika: lebih jelas, sering berbasis punchline.' },
      { en: 'Self-deprecating humor (making fun of yourself) is seen as likeable in English-speaking cultures.', id: 'Humor merendah (menertawakan diri sendiri) dianggap menarik di budaya berbahasa Inggris.' },
    ],
  },
]

export default contextCultureData
