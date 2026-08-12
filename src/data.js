export const profile = {
  name: 'Erik Lindstedt',
  role: 'Junior Software Developer',
  bio: 'IT tradenomi (BBA) graduate in software production. Over the past year I’ve been building real mobile apps end to end — React Native, Firebase, and AI APIs — to turn classroom knowledge into shipped products. Looking for an internship or junior role on a professional engineering team.',
  history:
    '• Graduated 2025 — IT Tradenomi (BBA), Software Production, Haaga-Helia\n• Since graduating — Independent development: UI/UX, React Native, Firebase, AI API integration\n• Based in Helsinki · Finnish (native), English (fluent), Russian (conversational)',
  stack: [
    'JavaScript',
    'React',
    'React Native',
    'Swift',
    'Firebase',
    'AI APIs',
  ],
  mvpNote:
    'The apps below were built as MVPs — focused on proving the core flow end to end, not production hardening.',
};

export const projects = [
  {
    id: 'notemate',
    title: 'NoteMate',
    role: 'Solo — mobile app + Cloud Functions',
    description:
      'AI study companion. Feed it notes, a web or YouTube link, a photo, a PDF, or a lecture recording — it builds a study set with summary, flashcards, quizzes, and written practice questions.',
    stack: [
      'Expo 54',
      'Firebase Auth',
      'Cloud Functions',
      'Firestore',
      'OpenAI',
      'Whisper',
    ],
    stackFocus: [
      {
        label: 'Expo + Paper',
        detail: 'React Native client with navigation and study-set UI',
      },
      {
        label: 'Cloud Functions',
        detail: 'One HTTPS path normalizes every input type to text',
      },
      {
        label: 'OpenAI',
        detail: 'GPT for study assets, Whisper for audio, Vision for images',
      },
    ],
    image: '/projects/notemate1.jpg',
    images: [
      '/projects/notemate1.jpg',
      '/projects/notemate2.jpg',
      '/projects/notemate3.jpg',
      '/projects/notemate4.jpg',
      '/projects/notemate5.jpg',
    ],
    layout: 'phone',
    defaultView: 'product',
    highlights: [
      'Multi-input → one text pipeline',
      'YouTube audio streamed to /tmp → Whisper',
      'Partial AI failures don’t kill the whole set',
    ],
    snippets: [
      {
        id: 'normalize',
        tab: 'Normalize',
        file: 'functions/index.js',
        label: 'Normalize every input to text',
        blurb:
          'One path for text, URL, YouTube, image, audio, and PDF — instead of five separate products.',
        snippet: `async function processInput(input) {
  const { content, imageBase64, audioBase64, fileBase64, url } = input;

  if (url) {
    const videoId = extractYouTubeVideoId(url);
    if (videoId) {
      const { transcript } = await getYouTubeAudioAndTranscribe(url);
      return { type: 'youtube', content: transcript };
    }
    return { type: 'web', content: await scrapePageText(url) };
  }

  if (content) return { type: 'text', content };
  if (imageBase64) return processImageBase64(imageBase64);
  if (audioBase64) return processAudioBase64(audioBase64);
  if (fileBase64) return processFileBase64(fileBase64);
}`,
      },
      {
        id: 'youtube',
        tab: 'YouTube',
        file: 'functions/index.js',
        label: 'YouTube → audio → Whisper',
        blurb:
          'Cloud Functions can only write to /tmp. Stream audio there, transcribe, then always clean up.',
        snippet: `const workingDir = os.tmpdir();
process.chdir(workingDir); // Firebase FS is read-only elsewhere

const bestAudio = ytdl.chooseFormat(info.formats, {
  quality: 'highestaudio',
  filter: 'audioonly',
});

tempFilePath = path.join(workingDir, \`youtube_\${Date.now()}.\${bestAudio.container}\`);
await pipeline(
  ytdl(youtubeUrl, { format: bestAudio }),
  createWriteStream(tempFilePath),
);

const audioBase64 = (await fs.readFile(tempFilePath)).toString('base64');
await fs.unlink(tempFilePath);

return processAudioBase64(audioBase64, mimeType);`,
      },
      {
        id: 'study-set',
        tab: 'Study set',
        file: 'functions/index.js',
        label: 'One call builds the whole study set',
        blurb:
          'Client sends content + which assets it wants; server generates what it can and still saves the set if one asset fails.',
        snippet: `const processedInput = await processInput(inputData);
const summary = await callOpenAI(summaryMessages, 'gpt-3.5-turbo', 0.5);

if (assetsToGenerate.includes('flashcards')) {
  try {
    flashcards = await generateFlashcards(processedInput.content);
  } catch {
    flashcards = []; // don't kill the whole study set
  }
}

await db.collection('users').doc(userId).collection('studySets').add({
  title: title || 'Study set',
  inputType,
  summary,
  assets: { flashcards, multipleChoice, writtenQuestions },
  createdAt: now,
});`,
      },
    ],
    liveUrl: '',
    repoUrl: '',
  },
  {
    id: 'imagio',
    title: 'Imagio',
    role: 'Solo — mobile app + Cloud Functions',
    description:
      'AI photo edit app. Pick a style preset, take or choose a photo, optionally add a short instruction — Gemini rewrites the scene while keeping lighting, background, and people consistent. Results save to a personal library.',
    stack: [
      'Expo 54',
      'Firebase Auth',
      'Cloud Functions',
      'Firestore',
      'Storage',
      'Gemini',
    ],
    stackFocus: [
      {
        label: 'Server presets',
        detail: 'Client sends styleId only — prompts stay server-owned',
      },
      {
        label: 'Token billing',
        detail: 'Firestore transaction prevents double-spend',
      },
      {
        label: 'Gemini image',
        detail: 'Multimodal edit; API key stays in Secret Manager',
      },
    ],
    image: '/projects/imagio.jpg',
    images: ['/projects/imagio.jpg', '/projects/imagio2.jpg'],
    layout: 'phone',
    defaultView: 'product',
    highlights: [
      'styleId → server-built prompt',
      'Atomic token spend before the model call',
      'Storage + Firestore library for every result',
    ],
    snippets: [
      {
        id: 'presets',
        tab: 'Presets',
        file: 'functions/index.js',
        label: 'Style presets live on the server',
        blurb:
          'Client only sends a styleId (+ optional extra). Prompt engineering stays server-side so users can’t rewrite product prompts.',
        snippet: `const STYLE_PRESETS = {
  homeless_prank: {
    label: 'Homeless prank',
    requiresImage: true,
    buildPrompt: ({ extra = '' } = {}) => [
      'Edit ONLY the main subject person in the provided image.',
      "Make them look like a staged, comedic 'homeless prank' costume.",
      // lighting / face / background constraints…
      extra ? \`Extra constraints: \${extra.trim()}\` : '',
    ].filter(Boolean).join('\\n'),
  },
  // plumber_prank, fake_cop_prank, …
};

function buildStylePrompt(styleId, params) {
  const preset = STYLE_PRESETS[styleId];
  if (!preset) throw new HttpsError('invalid-argument', 'Unknown styleId.');
  return preset.buildPrompt(params);
}`,
      },
      {
        id: 'tokens',
        tab: 'Tokens',
        file: 'functions/index.js',
        label: 'Tokens spent in a Firestore transaction',
        blurb:
          'Balance is checked and decremented atomically before Gemini runs — concurrent requests can’t double-spend.',
        snippet: `async function spendTokens({ uid, cost }) {
  const ref = userDocRef(uid);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const balance = snap.exists
      ? snap.data().tokens.balance
      : DEFAULT_STARTING_TOKENS;

    if (balance < cost) {
      throw new HttpsError('resource-exhausted', 'Not enough tokens.');
    }

    tx.set(ref, {
      'tokens.balance': balance - cost,
      'tokens.updatedAt': FieldValue.serverTimestamp(),
    }, { merge: true });
  });
}`,
      },
      {
        id: 'gemini',
        tab: 'Gemini',
        file: 'functions/index.js',
        label: 'Prompt + image → Gemini → saved asset',
        blurb:
          'One callable does auth, validation, billing, AI, and persistence. API key never leaves Secret Manager.',
        snippet: `exports.editStyledImage = onCall(async (request) => {
  const uid = requireAuthUid(request);
  const prompt = buildStylePrompt(styleId, params);
  assertBase64Image(base64Image);

  await spendTokens({ uid, cost: TOKENS_PER_IMAGE });

  const out = await callGeminiGenerateContent({
    apiKey,
    contents: [{
      role: 'user',
      parts: [
        { text: prompt },
        { inline_data: { mime_type: mimeType, data: base64Image } },
      ],
    }],
  });

  const saved = await saveImageForUser({
    uid, base64: out.base64, mimeType: out.mimeType,
    meta: { kind: 'editStyledImage', styleId },
  });

  return { ok: true, ...out, saved };
});`,
      },
    ],
    liveUrl: '',
    repoUrl: '',
  },
  {
    id: 'calwiz',
    title: 'calWiz',
    role: 'Solo — mobile app + Cloud Functions',
    description:
      'AI calorie and nutrition coach. Guided onboarding builds a personalized macro plan; log meals by photo, gallery, or text. GPT-4o estimates portions and macros against daily targets, with offline-first history and a daily open streak.',
    stack: [
      'Expo ~53',
      'Firebase Auth',
      'Cloud Functions',
      'Firestore',
      'GPT-4o Vision',
      'AsyncStorage',
    ],
    stackFocus: [
      {
        label: 'On-device plan',
        detail: 'Mifflin–St Jeor targets from onboarding answers',
      },
      {
        label: 'One analyze API',
        detail: 'Camera, gallery, and text all return the same JSON shape',
      },
      {
        label: 'Offline-first',
        detail: 'AsyncStorage updates immediately; Firestore syncs best-effort',
      },
    ],
    image: null,
    layout: 'flow',
    defaultView: 'product',
    flow: ['Onboard', 'Macro plan', 'Scan meal', 'Daily log'],
    highlights: [
      'Questionnaire → BMR / TDEE / macros in one calculator',
      'Vision + text share one Cloud Function contract',
      'Streak tracked on-device without a cron job',
    ],
    snippets: [
      {
        id: 'plan',
        tab: 'Plan',
        file: 'nutritionCalculator.js',
        label: 'Onboarding answers → one nutrition plan',
        blurb:
          'One calculator turns goals and body stats into BMR, TDEE, calorie target, and macros — not ad-hoc math per screen.',
        snippet: `export const calculateNutritionPlan = (userData) => {
  // Mifflin–St Jeor BMR → activity multiplier → goal deficit/surplus
  // protein-first or diet % macros (keto, vegan, …)

  return {
    bmr,
    tdee,
    dailyCalories,
    protein,
    carbs,
    fats,
    healthScore,
    recommendations,
  };
};`,
      },
      {
        id: 'analyze',
        tab: 'Analyze',
        file: 'functions/index.js',
        label: 'Photo or text → one function → structured macros',
        blurb:
          'Camera, gallery, and “describe meal” all hit the same endpoint; the server forces a consistent JSON shape.',
        snippet: `const { imageBase64, textDescription } = req.body;

// Vision messages if image; text prompt if description
// Stepwise: IDENTIFY → ESTIMATE PORTIONS → CALCULATE NUTRITION
const nutrition = await callGPT4o(messages);

res.json({
  description: nutrition.description,
  items: nutrition.items,
  totals: {
    calories: nutrition.totals.calories,
    protein: nutrition.totals.protein,
    carbs: nutrition.totals.carbs,
    fats: nutrition.totals.fats,
  },
});`,
      },
      {
        id: 'log',
        tab: 'Log',
        file: 'userService.js',
        label: 'Confirm meal → local-first daily log',
        blurb:
          'UI updates immediately from AsyncStorage; cloud write is best-effort so a flaky network doesn’t block logging.',
        snippet: `export const addMealToToday = async (nutritionData) => {
  const todayKey = formatDateKey(new Date());
  const updated = mergeMealIntoDay(todayKey, nutritionData);

  await AsyncStorage.setItem(\`dailyConsumption_\${todayKey}\`, JSON.stringify(updated));

  await updateDoc(userDocRef, {
    [\`dailyConsumption.\${todayKey}\`]: updated,
    updatedAt: serverTimestamp(),
  });
};`,
      },
      {
        id: 'streak',
        tab: 'Streak',
        file: 'streakUtils.js',
        label: 'Habit loop without a backend job',
        blurb:
          'Streaks live on device — open once per day, increment if yesterday was consecutive.',
        snippet: `export async function updateStreakOnAppOpen() {
  const last = await getLastOpenDate();
  const diff = daysBetween(last, today);

  if (diff === 1) streak += 1;
  else if (diff !== 0) streak = 1;

  await saveStreak({ streak, lastOpen: today });
}`,
      },
    ],
    liveUrl: '',
    repoUrl: '',
  },
  {
    id: 'hilight',
    title: 'HiLight',
    role: 'Solo — full-stack web studio',
    description:
      'AI short-form video studio. Generate vertical 9:16 videos from long uploads, Reddit scripts, Wikipedia articles, or image stories — Whisper, GPT, TTS, and FFmpeg pipelines with Stripe credits and Firebase storage.',
    stack: [
      'React + Vite',
      'Express',
      'Firebase',
      'OpenAI',
      'FFmpeg',
      'Stripe',
    ],
    stackFocus: [
      {
        label: 'Whisper pipeline',
        detail: 'Long audio split into chunks so limits don’t break the run',
      },
      {
        label: 'FFmpeg composite',
        detail: 'Split-screen gameplay + karaoke ASS captions',
      },
      {
        label: 'Stripe tokens',
        detail: 'Checkout + webhooks gate generation credits',
      },
    ],
    image: '/projects/hilight1.png',
    images: [
      '/projects/hilight1.png',
      '/projects/hilight2.png',
      '/projects/hilight3.png',
    ],
    layout: 'web',
    defaultView: 'product',
    highlights: [
      'Long video → chunked Whisper → GPT highlight topics',
      'Word-level karaoke captions burned in with ASS',
      'Same pattern for Reddit / Wiki / image stories',
    ],
    snippets: [
      {
        id: 'pipeline',
        tab: 'Pipeline',
        file: 'videoProcessingController.js',
        label: 'Long video → highlights → clips',
        blurb:
          'One pipeline that handles long footage without blowing Whisper limits — split audio, transcribe chunks, then cut clips.',
        snippet: `exports.processVideo = async ({ videoFilePath, uid, options }) => {
  await deductTokens(uid, creditCost, videoDuration);
  await extractAudio(videoFilePath, audioFilePath);

  const audioChunks = await splitAudio(audioFilePath);
  let allTopics = [];

  for (const chunkPath of audioChunks) {
    const { segments } = await transcribeAudio(chunkPath);
    allTopics = allTopics.concat(await identifyTopics(segments));
  }

  return generateClips(videoFilePath, allTopics, uid, options);
};`,
      },
      {
        id: 'topics',
        tab: 'Topics',
        file: 'openaiService.js',
        label: 'GPT picks clip-worthy moments',
        blurb:
          'Editor-style rules (length, hooks, no mid-sentence cuts) → structured JSON topics.',
        snippet: `const identifyTopics = async (segments) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }], // 90–300s, hooks ≤5 words
    temperature: 0.6,
  });

  return JSON.parse(jsonString).filter((topic) => {
    const [start, end] = topic.time_range.split('-').map(Number);
    return end - start >= 10;
  });
};`,
      },
      {
        id: 'captions',
        tab: 'Captions',
        file: 'clipsController.js',
        label: 'Word-level Whisper → karaoke ASS',
        blurb:
          'TikTok-style word highlight synced to speech, not a flat subtitle block.',
        snippet: `const transcription = await openai.audio.transcriptions.create({
  file: audioFile,
  model: 'whisper-1',
  response_format: 'verbose_json',
  timestamp_granularities: ['word'],
});

wordGroup.forEach((word) => {
  const duration = Math.round((word.end - word.start) * 100);
  text += \`{\\\\k\${duration}\\\\c\${highlightColor}}\${word.word}{\\\\c\${baseColor}}\`;
});

assContent += \`Dialogue: 0,\${formatTime(groupStart)},\${formatTime(groupEnd)},Default,,0,0,0,,\${text}\\n\`;`,
      },
      {
        id: 'ffmpeg',
        tab: 'FFmpeg',
        file: 'clipsController.js',
        label: 'Main + gameplay + burned-in captions',
        blurb:
          'One encode pass to vertical split-screen with ASS overlay.',
        snippet: `ffmpeg()
  .input(videoFilePath)
  .setStartTime(start)
  .setDuration(end - start)
  .input(gameplayFootagePath)
  .inputOptions(['-stream_loop', '-1', '-an'])
  .complexFilter([
    '[0:v]scale=1080:1080:...crop=1080:1080[main]',
    '[1:v]scale=1080:1080:...crop=1080:1080[gameplay]',
    '[main][gameplay]vstack=inputs=2[stacked]',
    \`[stacked]ass='\${escapedAssPath}'[output]\`,
  ])
  .outputOptions(['-map', '[output]', '-map', '0:a', '-aspect', '9:16']);`,
      },
    ],
    liveUrl: '',
    repoUrl: '',
  },
];

export const contact = {
  email: 'Erikaleksandrl@outlook.com',
  phone: '044 098 8669',
  location: 'Helsinki, Finland',
  github: '',
  linkedin: '',
  cta: 'Your move.',
  subtext: 'Open to internships and junior developer roles.',
  chessUrl: 'https://www.chess.com/member/diizelli',
  chessLabel: 'Challenge me',
  chessHint: 'Chess.com',
};
