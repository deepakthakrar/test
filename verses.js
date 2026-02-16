// Hanuman Chalisa - Complete verses with Hindi, transliteration, and meaning
// Structured for phrase-by-phrase learning for children

const HANUMAN_CHALISA = [
    // Doha (Opening couplets)
    {
        id: 1,
        section: "Doha",
        hindi: "श्रीगुरु चरन सरोज रज, निज मनु मुकुरु सुधारि",
        transliteration: "Shri Guru Charan Saroj Raj, Nij Manu Mukuru Sudhaari",
        meaning: "With the dust of Guru's lotus feet, I clean the mirror of my mind",
        speakText: "Shri Guru Charan Saroj Raj, Nij Manu Mukuru Sudhaari"
    },
    {
        id: 2,
        section: "Doha",
        hindi: "बरनउँ रघुबर बिमल जसु, जो दायकु फल चारि",
        transliteration: "Baranau Raghubar Bimal Jasu, Jo Daayaku Phal Chaari",
        meaning: "I sing the pure glory of Lord Rama, who gives four fruits of life",
        speakText: "Baranau Raghubar Bimal Jasu, Jo Daayaku Phal Chaari"
    },
    {
        id: 3,
        section: "Doha",
        hindi: "बुद्धिहीन तनु जानिके, सुमिरौं पवन कुमार",
        transliteration: "Buddhiheen Tanu Jaanike, Sumirau Pavan Kumaar",
        meaning: "Knowing myself to be ignorant, I remember Hanuman, son of the Wind",
        speakText: "Buddhiheen Tanu Jaanike, Sumirau Pavan Kumaar"
    },
    {
        id: 4,
        section: "Doha",
        hindi: "बल बुद्धि बिद्या देहु मोहिं, हरहु कलेस बिकार",
        transliteration: "Bal Buddhi Vidya Dehu Mohi, Harahu Kalesh Bikaar",
        meaning: "Give me strength, wisdom, and knowledge, and remove my troubles",
        speakText: "Bal Buddhi Vidya Dehu Mohi, Harahu Kalesh Bikaar"
    },

    // Chaupai 1-40
    {
        id: 5,
        section: "Chaupai 1",
        hindi: "जय हनुमान ज्ञान गुन सागर, जय कपीस तिहुँ लोक उजागर",
        transliteration: "Jai Hanuman Gyaan Gun Saagar, Jai Kapees Tihun Lok Ujaagar",
        meaning: "Victory to Hanuman, ocean of wisdom! Victory to the monkey king, light of three worlds!",
        speakText: "Jai Hanuman Gyaan Gun Saagar, Jai Kapees Tihun Lok Ujaagar"
    },
    {
        id: 6,
        section: "Chaupai 2",
        hindi: "राम दूत अतुलित बल धामा, अंजनि पुत्र पवनसुत नामा",
        transliteration: "Ram Doot Atulith Bal Dhaama, Anjani Putra Pavansut Naama",
        meaning: "Messenger of Rama with immense strength, son of Anjani, named Son of Wind",
        speakText: "Ram Doot Atulith Bal Dhaama, Anjani Putra Pavansut Naama"
    },
    {
        id: 7,
        section: "Chaupai 3",
        hindi: "महाबीर बिक्रम बजरंगी, कुमति निवार सुमति के संगी",
        transliteration: "Mahaabeer Bikram Bajrangi, Kumati Nivaar Sumati Ke Sangi",
        meaning: "Great hero, brave and strong, remover of bad thoughts, friend of good ones",
        speakText: "Mahaabeer Bikram Bajrangi, Kumati Nivaar Sumati Ke Sangi"
    },
    {
        id: 8,
        section: "Chaupai 4",
        hindi: "कंचन बरन बिराज सुबेसा, कानन कुंडल कुंचित केसा",
        transliteration: "Kanchan Baran Biraaj Subesaa, Kaanan Kundal Kunchit Kesaa",
        meaning: "Golden colored, beautifully dressed, with earrings and curly hair",
        speakText: "Kanchan Baran Biraaj Subesaa, Kaanan Kundal Kunchit Kesaa"
    },
    {
        id: 9,
        section: "Chaupai 5",
        hindi: "हाथ बज्र औ ध्वजा बिराजै, काँधे मूँज जनेऊ साजै",
        transliteration: "Haath Bajra Au Dhvajaa Biraaje, Kaandhe Moonj Janeu Saaje",
        meaning: "Holding a thunderbolt and flag, with a sacred thread on shoulder",
        speakText: "Haath Bajra Au Dhvajaa Biraaje, Kaandhe Moonj Janeu Saaje"
    },
    {
        id: 10,
        section: "Chaupai 6",
        hindi: "शंकर सुवन केसरी नंदन, तेज प्रताप महा जग बंदन",
        transliteration: "Shankar Suvan Kesari Nandan, Tej Prataap Mahaa Jag Bandan",
        meaning: "Son of Shiva and Kesari, your glory is praised by the whole world",
        speakText: "Shankar Suvan Kesari Nandan, Tej Prataap Mahaa Jag Bandan"
    },
    {
        id: 11,
        section: "Chaupai 7",
        hindi: "विद्यावान गुनी अति चातुर, राम काज करिबे को आतुर",
        transliteration: "Vidyaavaan Guni Ati Chaatur, Ram Kaaj Karibe Ko Aatur",
        meaning: "Full of knowledge, virtuous, and clever, always eager to do Rama's work",
        speakText: "Vidyaavaan Guni Ati Chaatur, Ram Kaaj Karibe Ko Aatur"
    },
    {
        id: 12,
        section: "Chaupai 8",
        hindi: "प्रभु चरित्र सुनिबे को रसिया, राम लखन सीता मन बसिया",
        transliteration: "Prabhu Charitra Sunibe Ko Rasiyaa, Ram Lakhan Sita Man Basiyaa",
        meaning: "You love hearing about Lord's adventures, Rama, Lakshmana, and Sita live in your heart",
        speakText: "Prabhu Charitra Sunibe Ko Rasiyaa, Ram Lakhan Sita Man Basiyaa"
    },
    {
        id: 13,
        section: "Chaupai 9",
        hindi: "सूक्ष्म रूप धरि सियहिं दिखावा, बिकट रूप धरि लंक जरावा",
        transliteration: "Sukshma Roop Dhari Siyahin Dikhaavaa, Bikat Roop Dhari Lanka Jaraavaa",
        meaning: "In tiny form you met Sita, in fierce form you burned Lanka",
        speakText: "Sukshma Roop Dhari Siyahin Dikhaavaa, Bikat Roop Dhari Lanka Jaraavaa"
    },
    {
        id: 14,
        section: "Chaupai 10",
        hindi: "भीम रूप धरि असुर संहारे, रामचंद्र के काज सँवारे",
        transliteration: "Bheem Roop Dhari Asur Sanhaare, Ramchandra Ke Kaaj Sanvaare",
        meaning: "In giant form you destroyed demons, and completed Rama's mission",
        speakText: "Bheem Roop Dhari Asur Sanhaare, Ramchandra Ke Kaaj Sanvaare"
    },
    {
        id: 15,
        section: "Chaupai 11",
        hindi: "लाय सजीवन लखन जियाये, श्रीरघुबीर हरषि उर लाये",
        transliteration: "Laay Sajeevan Lakhan Jiyaaye, Shri Raghubeer Harashi Ur Laaye",
        meaning: "You brought the magic herb and saved Lakshmana, Rama hugged you with joy",
        speakText: "Laay Sajeevan Lakhan Jiyaaye, Shri Raghubeer Harashi Ur Laaye"
    },
    {
        id: 16,
        section: "Chaupai 12",
        hindi: "रघुपति कीन्हीं बहुत बड़ाई, तुम मम प्रिय भरतहिं सम भाई",
        transliteration: "Raghupati Keenhi Bahut Badaai, Tum Mam Priya Bharatahi Sam Bhaai",
        meaning: "Lord Rama praised you greatly, saying you are dear to him like brother Bharata",
        speakText: "Raghupati Keenhi Bahut Badaai, Tum Mam Priya Bharatahi Sam Bhaai"
    },
    {
        id: 17,
        section: "Chaupai 13",
        hindi: "सहस बदन तुम्हरो जस गावैं, अस कहि श्रीपति कंठ लगावैं",
        transliteration: "Sahas Badan Tumharo Jas Gaave, As Kahi Shripati Kanth Lagaave",
        meaning: "A thousand mouths sing your glory, said Rama as he embraced you",
        speakText: "Sahas Badan Tumharo Jas Gaave, As Kahi Shripati Kanth Lagaave"
    },
    {
        id: 18,
        section: "Chaupai 14",
        hindi: "सनकादिक ब्रह्मादि मुनीसा, नारद सारद सहित अहीसा",
        transliteration: "Sanakaadik Brahmaadi Muneesaa, Naarad Saarad Sahit Aheesaa",
        meaning: "Sages like Sanaka, gods like Brahma, Narada, Saraswati, and Shesha",
        speakText: "Sanakaadik Brahmaadi Muneesaa, Naarad Saarad Sahit Aheesaa"
    },
    {
        id: 19,
        section: "Chaupai 15",
        hindi: "जम कुबेर दिगपाल जहाँ ते, कबि कोबिद कहि सके कहाँ ते",
        transliteration: "Jam Kuber Digpaal Jahaan Te, Kabi Kobid Kahi Sake Kahaan Te",
        meaning: "Yama, Kubera, and guardians of directions, no poet can fully describe your glory",
        speakText: "Jam Kuber Digpaal Jahaan Te, Kabi Kobid Kahi Sake Kahaan Te"
    },
    {
        id: 20,
        section: "Chaupai 16",
        hindi: "तुम उपकार सुग्रीवहिं कीन्हा, राम मिलाय राज पद दीन्हा",
        transliteration: "Tum Upkaar Sugreevahin Keenhaa, Ram Milaay Raaj Pad Deenhaa",
        meaning: "You helped Sugriva by introducing him to Rama and getting him his kingdom back",
        speakText: "Tum Upkaar Sugreevahin Keenhaa, Ram Milaay Raaj Pad Deenhaa"
    },
    {
        id: 21,
        section: "Chaupai 17",
        hindi: "तुम्हरो मंत्र बिभीषन माना, लंकेश्वर भए सब जग जाना",
        transliteration: "Tumharo Mantra Vibheeshan Maanaa, Lankeshwar Bhaye Sab Jag Jaanaa",
        meaning: "Vibhishana followed your advice and became king of Lanka, the whole world knows",
        speakText: "Tumharo Mantra Vibheeshan Maanaa, Lankeshwar Bhaye Sab Jag Jaanaa"
    },
    {
        id: 22,
        section: "Chaupai 18",
        hindi: "जुग सहस्र जोजन पर भानु, लील्यो ताहि मधुर फल जानू",
        transliteration: "Yug Sahasra Yojan Par Bhaanu, Leelyo Taahi Madhur Phal Jaanu",
        meaning: "The sun, millions of miles away, you swallowed thinking it was a sweet fruit!",
        speakText: "Yug Sahasra Yojan Par Bhaanu, Leelyo Taahi Madhur Phal Jaanu"
    },
    {
        id: 23,
        section: "Chaupai 19",
        hindi: "प्रभु मुद्रिका मेलि मुख माहीं, जलधि लाँघि गये अचरज नाहीं",
        transliteration: "Prabhu Mudrikaa Meli Mukh Maahi, Jaladhi Laanghi Gaye Achraj Naahi",
        meaning: "With Rama's ring in your mouth, you crossed the ocean - no surprise!",
        speakText: "Prabhu Mudrikaa Meli Mukh Maahi, Jaladhi Laanghi Gaye Achraj Naahi"
    },
    {
        id: 24,
        section: "Chaupai 20",
        hindi: "दुर्गम काज जगत के जेते, सुगम अनुग्रह तुम्हरे तेते",
        transliteration: "Durgam Kaaj Jagat Ke Jete, Sugam Anugrah Tumhre Tete",
        meaning: "All difficult tasks in the world become easy with your grace",
        speakText: "Durgam Kaaj Jagat Ke Jete, Sugam Anugrah Tumhre Tete"
    },
    {
        id: 25,
        section: "Chaupai 21",
        hindi: "राम दुआरे तुम रखवारे, होत न आज्ञा बिनु पैसारे",
        transliteration: "Ram Duaare Tum Rakhvaare, Hot Na Aagyaa Binu Paisaare",
        meaning: "You are the guardian of Rama's door, no one enters without your permission",
        speakText: "Ram Duaare Tum Rakhvaare, Hot Na Aagyaa Binu Paisaare"
    },
    {
        id: 26,
        section: "Chaupai 22",
        hindi: "सब सुख लहैं तुम्हारी सरना, तुम रक्षक काहू को डर ना",
        transliteration: "Sab Sukh Lahai Tumhaari Sarnaa, Tum Rakshak Kaahu Ko Dar Naa",
        meaning: "All happiness comes from your shelter, with you as protector there is no fear",
        speakText: "Sab Sukh Lahai Tumhaari Sarnaa, Tum Rakshak Kaahu Ko Dar Naa"
    },
    {
        id: 27,
        section: "Chaupai 23",
        hindi: "आपन तेज सम्हारो आपै, तीनों लोक हाँक तें काँपै",
        transliteration: "Aapan Tej Samhaaro Aapai, Teenon Lok Haank Te Kaanpe",
        meaning: "Only you can control your power, all three worlds tremble at your roar",
        speakText: "Aapan Tej Samhaaro Aapai, Teenon Lok Haank Te Kaanpe"
    },
    {
        id: 28,
        section: "Chaupai 24",
        hindi: "भूत पिसाच निकट नहिं आवै, महाबीर जब नाम सुनावै",
        transliteration: "Bhoot Pisaach Nikat Nahi Aavai, Mahaabeer Jab Naam Sunaavai",
        meaning: "Ghosts and evil spirits stay away when they hear your name, brave one",
        speakText: "Bhoot Pisaach Nikat Nahi Aavai, Mahaabeer Jab Naam Sunaavai"
    },
    {
        id: 29,
        section: "Chaupai 25",
        hindi: "नासै रोग हरै सब पीरा, जपत निरंतर हनुमत बीरा",
        transliteration: "Naase Rog Hare Sab Peeraa, Japat Nirantar Hanumat Beeraa",
        meaning: "Diseases end and all pain goes away by always chanting brave Hanuman's name",
        speakText: "Naase Rog Hare Sab Peeraa, Japat Nirantar Hanumat Beeraa"
    },
    {
        id: 30,
        section: "Chaupai 26",
        hindi: "संकट तें हनुमान छुड़ावै, मन क्रम बचन ध्यान जो लावै",
        transliteration: "Sankat Te Hanumaan Chudaave, Man Kram Bachan Dhyaan Jo Laave",
        meaning: "Hanuman saves from all troubles those who remember him in thought, word, and deed",
        speakText: "Sankat Te Hanumaan Chudaave, Man Kram Bachan Dhyaan Jo Laave"
    },
    {
        id: 31,
        section: "Chaupai 27",
        hindi: "सब पर राम तपस्वी राजा, तिन के काज सकल तुम साजा",
        transliteration: "Sab Par Ram Tapasvee Raajaa, Tin Ke Kaaj Sakal Tum Saajaa",
        meaning: "Rama is king above all, and you carry out all his work",
        speakText: "Sab Par Ram Tapasvee Raajaa, Tin Ke Kaaj Sakal Tum Saajaa"
    },
    {
        id: 32,
        section: "Chaupai 28",
        hindi: "और मनोरथ जो कोई लावै, सोइ अमित जीवन फल पावै",
        transliteration: "Aur Manorath Jo Koi Laave, Soi Amit Jeevan Phal Paave",
        meaning: "Whoever comes to you with a wish gets abundant fruit in life",
        speakText: "Aur Manorath Jo Koi Laave, Soi Amit Jeevan Phal Paave"
    },
    {
        id: 33,
        section: "Chaupai 29",
        hindi: "चारों जुग परताप तुम्हारा, है परसिद्ध जगत उजियारा",
        transliteration: "Chaaron Yug Partaap Tumhaaraa, Hai Parasiddh Jagat Ujiyaaraa",
        meaning: "Your glory shines through all four ages, famous as the light of the world",
        speakText: "Chaaron Yug Partaap Tumhaaraa, Hai Parasiddh Jagat Ujiyaaraa"
    },
    {
        id: 34,
        section: "Chaupai 30",
        hindi: "साधु संत के तुम रखवारे, असुर निकंदन राम दुलारे",
        transliteration: "Saadhu Sant Ke Tum Rakhvaare, Asur Nikandan Ram Dulaare",
        meaning: "You protect the good people, destroy evil, and are Rama's beloved",
        speakText: "Saadhu Sant Ke Tum Rakhvaare, Asur Nikandan Ram Dulaare"
    },
    {
        id: 35,
        section: "Chaupai 31",
        hindi: "अष्ट सिद्धि नौ निधि के दाता, अस बर दीन जानकी माता",
        transliteration: "Ashta Siddhi Nau Nidhi Ke Daataa, As Bar Deen Jaanaki Maataa",
        meaning: "You can give eight powers and nine treasures, blessed by Mother Sita",
        speakText: "Ashta Siddhi Nau Nidhi Ke Daataa, As Bar Deen Jaanaki Maataa"
    },
    {
        id: 36,
        section: "Chaupai 32",
        hindi: "राम रसायन तुम्हरे पासा, सदा रहो रघुपति के दासा",
        transliteration: "Ram Rasaayan Tumhare Paasaa, Sadaa Raho Raghupati Ke Daasaa",
        meaning: "You hold the essence of Rama's devotion, forever serving Lord Rama",
        speakText: "Ram Rasaayan Tumhare Paasaa, Sadaa Raho Raghupati Ke Daasaa"
    },
    {
        id: 37,
        section: "Chaupai 33",
        hindi: "तुम्हरे भजन राम को पावै, जनम जनम के दुख बिसरावै",
        transliteration: "Tumhare Bhajan Ram Ko Paave, Janam Janam Ke Dukh Bisraave",
        meaning: "By singing your praise one reaches Rama, and forgets the sorrows of many lives",
        speakText: "Tumhare Bhajan Ram Ko Paave, Janam Janam Ke Dukh Bisraave"
    },
    {
        id: 38,
        section: "Chaupai 34",
        hindi: "अंत काल रघुबर पुर जाई, जहाँ जन्म हरिभक्त कहाई",
        transliteration: "Ant Kaal Raghubar Pur Jaai, Jahaan Janm Haribhakt Kahaai",
        meaning: "At the end, one goes to Rama's abode, and wherever born is known as God's devotee",
        speakText: "Ant Kaal Raghubar Pur Jaai, Jahaan Janm Haribhakt Kahaai"
    },
    {
        id: 39,
        section: "Chaupai 35",
        hindi: "और देवता चित्त न धरई, हनुमत सेइ सर्ब सुख करई",
        transliteration: "Aur Devataa Chitt Na Dharai, Hanumat Sei Sarb Sukh Karai",
        meaning: "Even without worshipping other gods, serving Hanuman gives all happiness",
        speakText: "Aur Devataa Chitt Na Dharai, Hanumat Sei Sarb Sukh Karai"
    },
    {
        id: 40,
        section: "Chaupai 36",
        hindi: "संकट कटै मिटै सब पीरा, जो सुमिरै हनुमत बलबीरा",
        transliteration: "Sankat Kate Mite Sab Peeraa, Jo Sumirai Hanumat Balbeeraa",
        meaning: "Troubles vanish and all pain ends for those who remember brave Hanuman",
        speakText: "Sankat Kate Mite Sab Peeraa, Jo Sumirai Hanumat Balbeeraa"
    },
    {
        id: 41,
        section: "Chaupai 37",
        hindi: "जय जय जय हनुमान गोसाईं, कृपा करहु गुरुदेव की नाईं",
        transliteration: "Jai Jai Jai Hanumaan Gosaai, Kripaa Karahu Gurudev Ki Naai",
        meaning: "Victory, victory, victory to Lord Hanuman! Please bless me like a teacher",
        speakText: "Jai Jai Jai Hanumaan Gosaai, Kripaa Karahu Gurudev Ki Naai"
    },
    {
        id: 42,
        section: "Chaupai 38",
        hindi: "जो सत बार पाठ कर कोई, छूटहि बंदि महा सुख होई",
        transliteration: "Jo Sat Baar Paath Kar Koi, Chhootahi Bandi Mahaa Sukh Hoi",
        meaning: "Whoever reads this a hundred times is freed from bondage and finds great happiness",
        speakText: "Jo Sat Baar Paath Kar Koi, Chhootahi Bandi Mahaa Sukh Hoi"
    },
    {
        id: 43,
        section: "Chaupai 39",
        hindi: "जो यह पढ़ै हनुमान चालीसा, होय सिद्धि साखी गौरीसा",
        transliteration: "Jo Yah Padhe Hanumaan Chaaleesaa, Hoy Siddhi Saakhi Gaureesaa",
        meaning: "Whoever reads this Hanuman Chalisa achieves success, Lord Shiva is witness",
        speakText: "Jo Yah Padhe Hanumaan Chaaleesaa, Hoy Siddhi Saakhi Gaureesaa"
    },
    {
        id: 44,
        section: "Chaupai 40",
        hindi: "तुलसीदास सदा हरि चेरा, कीजै नाथ हृदय महँ डेरा",
        transliteration: "Tulaseedas Sadaa Hari Cheraa, Keejai Naath Hriday Mah Deraa",
        meaning: "Tulsidas is always God's servant, O Lord please make my heart your home",
        speakText: "Tulaseedas Sadaa Hari Cheraa, Keejai Naath Hriday Mah Deraa"
    },

    // Closing Doha
    {
        id: 45,
        section: "Closing Doha",
        hindi: "पवन तनय संकट हरन, मंगल मूरति रूप",
        transliteration: "Pavan Tanay Sankat Haran, Mangal Moorati Roop",
        meaning: "Son of Wind, remover of troubles, embodiment of auspiciousness",
        speakText: "Pavan Tanay Sankat Haran, Mangal Moorati Roop"
    },
    {
        id: 46,
        section: "Closing Doha",
        hindi: "राम लखन सीता सहित, हृदय बसहु सुर भूप",
        transliteration: "Ram Lakhan Sita Sahit, Hriday Basahu Sur Bhoop",
        meaning: "Along with Rama, Lakshmana, and Sita, please live in my heart, O King of Gods",
        speakText: "Ram Lakhan Sita Sahit, Hriday Basahu Sur Bhoop"
    }
];

// Encouraging messages for children
const ENCOURAGE_MESSAGES = {
    great: [
        "Wow! That was amazing! Hanuman Ji is so happy! 🎉",
        "Super duper! You sang that perfectly! ⭐",
        "Incredible! You're a singing star! 🌟",
        "Jai Hanuman! That was beautiful! 🙏",
        "You're doing SO well! Keep going! 💪"
    ],
    good: [
        "Good try! You're getting better! 😊",
        "Nice job! Let's keep practicing! 🎵",
        "That was good! Want to try once more? 🎤",
        "You're learning so fast! Great effort! 👏",
        "Almost perfect! You're so close! ✨"
    ],
    tryAgain: [
        "Let's listen one more time and try again! 🎧",
        "No worries! Even Hanuman practiced! Let's try! 💪",
        "Good effort! Let's listen and try once more! 🎵",
        "You're brave for trying! Let's do it again! 🐵",
        "Practice makes perfect! One more time! 🌟"
    ],
    start: [
        "Let's learn this verse together! Listen first! 🎧",
        "Ready for a new verse? Listen carefully! 🎵",
        "Here comes a new verse! Press Listen first! 🔊",
        "New verse time! I'll say it, then you try! 🎤",
        "Ooh, this is a great verse! Let's hear it! ✨"
    ]
};
