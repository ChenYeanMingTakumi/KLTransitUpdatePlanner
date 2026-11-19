// ---------- Sample data (fictional scenarios over user-supplied station lists) ----------
const LINES = [
  {
    id: "kajang", name: "MRT Kajang Line", color: "#11753A", status: "normal",
    minPerStop: 2.4, kmPerStop: 1.6,
    notice: "Normal service on the whole line between Kwasa Damansara and Kajang.",
    stations: [
      { n: "Kwasa Damansara", run: true, ic: true }, { n: "Kwasa Sentral", run: true },
      { n: "Kota Damansara", run: true }, { n: "Surian", run: true },
      { n: "Mutiara Damansara", run: true }, { n: "Bandar Utama", run: true, ic: true },
      { n: "Taman Tun Dr Ismail", run: true }, { n: "Phileo Damansara", run: true },
      { n: "Pusat Bandar Damansara", run: true }, { n: "Semantan", run: true },
      { n: "Muzium Negara", run: true, ic: true }, { n: "Pasar Seni", run: true, ic: true },
      { n: "Merdeka", run: true, ic: true }, { n: "Bukit Bintang", run: true, ic: true },
      { n: "Tun Razak Exchange (TRX)", run: true, ic: true }, { n: "Cochrane", run: true },
      { n: "Maluri", run: true, ic: true }, { n: "Taman Pertama", run: true },
      { n: "Taman Midah", run: true }, { n: "Taman Mutiara", run: true },
      { n: "Taman Connaught", run: true }, { n: "Taman Suntex", run: true },
      { n: "Sri Raya", run: true }, { n: "Bandar Tun Hussein Onn", run: true },
      { n: "Batu 11 Cheras", run: true }, { n: "Bukit Dukung", run: true },
      { n: "Sungai Jernih", run: true }, { n: "Stadium Kajang", run: true },
      { n: "Kajang", run: true, ic: true }
    ]
  },
  {
    id: "putrajaya", name: "MRT Putrajaya Line", color: "#FACA05", status: "normal",
    minPerStop: 2.5, kmPerStop: 1.7,
    notice: "Normal service on the whole line between Kwasa Damansara and Putrajaya Sentral.",
    stations: [
      { n: "Kwasa Damansara", run: true, ic: true }, { n: "Kampung Selamat", run: true },
      { n: "Sungai Buloh", run: true, ic: true }, { n: "Damansara Damai", run: true },
      { n: "Sri Damansara Barat", run: true }, { n: "Sri Damansara Sentral", run: true },
      { n: "Sri Damansara Timur", run: true, ic: true }, { n: "Metro Prima", run: true },
      { n: "Kepong Baru", run: true }, { n: "Jinjang", run: true },
      { n: "Sri Delima", run: true }, { n: "Kampung Batu", run: true, ic: true },
      { n: "Kentonmen", run: true }, { n: "Jalan Ipoh", run: true },
      { n: "Sentul Barat", run: true }, { n: "Titiwangsa", run: true, ic: true },
      { n: "Hospital Kuala Lumpur", run: true }, { n: "Raja Uda", run: true },
      { n: "Ampang Park", run: true, ic: true }, { n: "Persiaran KLCC", run: true },
      { n: "Conlay", run: true }, { n: "Tun Razak Exchange (TRX)", run: true, ic: true },
      { n: "Chan Sow Lin", run: true, ic: true }, { n: "Kuchai", run: true },
      { n: "Taman Naga Emas", run: true }, { n: "Sungai Besi", run: true, ic: true },
      { n: "Serdang Raya Utara", run: true }, { n: "Serdang Raya Selatan", run: true },
      { n: "Serdang Jaya", run: true }, { n: "UPM", run: true },
      { n: "Taman Equine", run: true }, { n: "Putra Permai", run: true },
      { n: "16 Sierra", run: true }, { n: "Cyberjaya Utara", run: true },
      { n: "Cyberjaya City Centre", run: true }, { n: "Putrajaya Sentral", run: true, ic: true }
    ]
  },
  {
    id: "kelana", name: "LRT Kelana Jaya Line", color: "#E0115F", status: "normal",
    minPerStop: 2.2, kmPerStop: 1.3,
    notice: "Normal service on the whole line between Gombak and Putra Heights.",
    stations: [
      { n: "Gombak", run: true }, { n: "Taman Melati", run: true },
      { n: "Wangsa Maju", run: true }, { n: "Sri Rampai", run: true },
      { n: "Setiawangsa", run: true }, { n: "Jelatek", run: true },
      { n: "Dato' Keramat", run: true }, { n: "Damai", run: true },
      { n: "Ampang Park", run: true, ic: true }, { n: "KLCC", run: true },
      { n: "Kampung Baru", run: true }, { n: "Dang Wangi", run: true, ic: true },
      { n: "Masjid Jamek", run: true, ic: true }, { n: "Pasar Seni", run: true, ic: true },
      { n: "KL Sentral", run: true, ic: true }, { n: "Bangsar", run: true },
      { n: "Abdullah Hukum", run: true, ic: true }, { n: "Kerinchi", run: true },
      { n: "Universiti", run: true }, { n: "Taman Jaya", run: true },
      { n: "Asia Jaya", run: true }, { n: "Taman Paramount", run: true },
      { n: "Taman Bahagia", run: true }, { n: "Kelana Jaya", run: true },
      { n: "Lembah Subang", run: true }, { n: "Ara Damansara", run: true },
      { n: "Glenmarie", run: true, ic: true }, { n: "Subang Jaya", run: true, ic: true },
      { n: "SS15", run: true }, { n: "SS18", run: true },
      { n: "USJ7", run: true, ic: true }, { n: "Taipan", run: true },
      { n: "Wawasan", run: true }, { n: "USJ21", run: true },
      { n: "Alam Megah", run: true }, { n: "Subang Alam", run: true },
      { n: "Putra Heights", run: true, ic: true }
    ]
  },
  {
    id: "sripetaling", name: "LRT Sri Petaling Line", color: "#721422", status: "normal",
    minPerStop: 2.3, kmPerStop: 1.4,
    notice: "Normal service on the whole line between Sentul Timur and Putra Heights.",
    stations: [
      { n: "Sentul Timur", run: true }, { n: "Sentul", run: true },
      { n: "Titiwangsa", run: true, ic: true }, { n: "PWTC", run: true, ic: true },
      { n: "Sultan Ismail", run: true, ic: true }, { n: "Bandaraya", run: true, ic: true },
      { n: "Masjid Jamek", run: true, ic: true }, { n: "Plaza Rakyat", run: true, ic: true },
      { n: "Hang Tuah", run: true, ic: true }, { n: "Pudu", run: true },
      { n: "Chan Sow Lin", run: true, ic: true }, { n: "Cheras", run: true },
      { n: "Salak Selatan", run: true, ic: true }, { n: "Bandar Tun Razak", run: true },
      { n: "Bandar Tasik Selatan", run: true, ic: true }, { n: "Sungai Besi", run: true, ic: true },
      { n: "Bukit Jalil", run: true }, { n: "Sri Petaling", run: true },
      { n: "Awan Besar", run: true }, { n: "Muhibbah", run: true },
      { n: "Alam Sutera", run: true }, { n: "Kinrara BK5", run: true },
      { n: "IOI Puchong Jaya", run: true }, { n: "Pusat Bandar Puchong", run: true },
      { n: "Taman Perindustrian Puchong", run: true }, { n: "Bandar Puteri", run: true },
      { n: "Puchong Perdana", run: true }, { n: "Puchong Prima", run: true },
      { n: "Putra Heights", run: true, ic: true }
    ]
  },
  {
    id: "ampang", name: "LRT Ampang Line", color: "#FE8E10", status: "cut-short",
    minPerStop: 2.4, kmPerStop: 1.3,
    notice: "Cut short between Chan Sow Lin and Sentul Timur due to a signalling fault near Sentul. Trains run only between Ampang and Chan Sow Lin; the section from Chan Sow Lin to Sentul Timur is suspended.",
    stations: [
      { n: "Sentul Timur", run: false }, { n: "Sentul", run: false },
      { n: "Titiwangsa", run: false, ic: true }, { n: "PWTC", run: false, ic: true },
      { n: "Sultan Ismail", run: false, ic: true }, { n: "Bandaraya", run: false, ic: true },
      { n: "Masjid Jamek", run: false, ic: true }, { n: "Plaza Rakyat", run: false, ic: true },
      { n: "Hang Tuah", run: false, ic: true }, { n: "Pudu", run: false },
      { n: "Chan Sow Lin", run: true, ic: true }, { n: "Miharja", run: true },
      { n: "Maluri", run: true, ic: true }, { n: "Pandan Jaya", run: true },
      { n: "Pandan Indah", run: true }, { n: "Cempaka", run: true },
      { n: "Cahaya", run: true }, { n: "Ampang", run: true }
    ]
  },
  {
    id: "shahalam", name: "LRT Shah Alam Line", color: "#87CEEB", status: "normal",
    minPerStop: 2.6, kmPerStop: 1.8,
    notice: "Normal service on the whole line between Bandar Utama and Johan Setia.",
    stations: [
      { n: "Bandar Utama", run: true, ic: true }, { n: "Kayu Ara", run: true },
      { n: "BU 11", run: true }, { n: "Damansara Idaman", run: true },
      { n: "Subang", run: true }, { n: "Glenmarie 2", run: true, ic: true },
      { n: "Kerjaya", run: true }, { n: "Stadium Shah Alam", run: true },
      { n: "Dato' Menteri", run: true }, { n: "UiTM Shah Alam", run: true },
      { n: "Seksyen 7 Shah Alam", run: true }, { n: "Bandar Baru Klang", run: true },
      { n: "Pasar Klang", run: true }, { n: "Jalan Meru", run: true },
      { n: "Jambatan Kota", run: true }, { n: "Taman Selatan", run: true },
      { n: "Seri Andalas", run: true }, { n: "Klang Jaya", run: true },
      { n: "Bandar Bukit Tinggi", run: true }, { n: "Johan Setia", run: true }
    ]
  },
  {
    id: "tmalim", name: "KTM Komuter Tanjung Malim–Pelabuhan Klang", color: "#DC241F", status: "normal",
    minPerStop: 4.8, kmPerStop: 3.6,
    notice: "Normal service on the whole line between Tanjung Malim and Pelabuhan Klang.",
    stations: [
      { n: "Tanjung Malim", run: true }, { n: "Kuala Kubu Bharu", run: true },
      { n: "Rasa", run: true }, { n: "Batang Kali", run: true },
      { n: "Serendah", run: true }, { n: "Rawang", run: true },
      { n: "Kuang", run: true }, { n: "Sungai Buloh", run: true, ic: true },
      { n: "Kepong Sentral", run: true, ic: true }, { n: "Kepong", run: true },
      { n: "Segambut", run: true }, { n: "Putra", run: true, ic: true },
      { n: "Bank Negara", run: true, ic: true }, { n: "Kuala Lumpur", run: true, ic: true },
      { n: "KL Sentral", run: true, ic: true }, { n: "Abdullah Hukum", run: true, ic: true },
      { n: "Angkasapuri", run: true }, { n: "Pantai Dalam", run: true },
      { n: "Petaling", run: true }, { n: "Jalan Templer", run: true },
      { n: "Kampung Dato Harun", run: true }, { n: "Seri Setia", run: true },
      { n: "Setia Jaya", run: true, ic: true }, { n: "Subang Jaya", run: true, ic: true },
      { n: "Batu Tiga", run: true }, { n: "Shah Alam", run: true },
      { n: "Padang Jawa", run: true }, { n: "Bukit Badak", run: true },
      { n: "Klang", run: true }, { n: "Teluk Pulai", run: true },
      { n: "Teluk Gadong", run: true }, { n: "Kampung Raja Uda", run: true },
      { n: "Jalan Kastam", run: true }, { n: "Pelabuhan Klang", run: true }
    ]
  },
  {
    id: "batucaves", name: "KTM Komuter Batu Caves–Pulau Sebang", color: "#1964b7", status: "cut-short",
    minPerStop: 4.5, kmPerStop: 3.3,
    notice: "Cut short between Batu Caves and Putra due to track maintenance near Sentul. Trains turn back at Putra; Batu Caves, Taman Wahyu, Kampung Batu, Batu Kentonmen and Sentul are not served this hour.",
    stations: [
      { n: "Batu Caves", run: false }, { n: "Taman Wahyu", run: false },
      { n: "Kampung Batu", run: false, ic: true }, { n: "Batu Kentonmen", run: false },
      { n: "Sentul", run: false }, { n: "Putra", run: true, ic: true },
      { n: "Bank Negara", run: true, ic: true }, { n: "Kuala Lumpur", run: true, ic: true },
      { n: "KL Sentral", run: true, ic: true }, { n: "Mid Valley", run: true },
      { n: "Seputeh", run: true }, { n: "Salak Selatan", run: true, ic: true },
      { n: "Bandar Tasik Selatan", run: true, ic: true }, { n: "Serdang", run: true },
      { n: "Kajang", run: true, ic: true }, { n: "Kajang 2", run: true },
      { n: "UKM", run: true }, { n: "Bangi", run: true },
      { n: "Batang Benar", run: true }, { n: "Nilai", run: true },
      { n: "Labu", run: true }, { n: "Tiroi", run: true },
      { n: "Seremban", run: true }, { n: "Senawang", run: true },
      { n: "Sungai Gadut", run: true }, { n: "Rembau", run: true },
      { n: "Pulau Sebang", run: true }
    ]
  },
  {
    id: "kliax", name: "ERL KLIA Express", color: "#FF00FF", status: "normal",
    minPerStop: 28, kmPerStop: 57,
    notice: "Normal non-stop express service between KL Sentral, KLIA T1 and KLIA T2.",
    stations: [
      { n: "KL Sentral", run: true, ic: true }, { n: "KLIA T1", run: true },
      { n: "KLIA T2", run: true }
    ]
  },
  {
    id: "kliat", name: "ERL KLIA Transit", color: "#33A8B5", status: "normal",
    minPerStop: 8, kmPerStop: 11,
    notice: "Normal all-stop service between KL Sentral and KLIA T2.",
    stations: [
      { n: "KL Sentral", run: true, ic: true }, { n: "Bandar Tasik Selatan", run: true, ic: true },
      { n: "Putrajaya Sentral", run: true, ic: true }, { n: "Salak Tinggi", run: true },
      { n: "KLIA T1", run: true }, { n: "KLIA T2", run: true }
    ]
  },
  {
    id: "skypark", name: "KTM Skypark Link", color: "#FFD700", status: "normal",
    minPerStop: 11, kmPerStop: 12,
    notice: "Normal service between KL Sentral and Terminal Skypark via Subang Jaya. Weekend-only service in this scenario.",
    stations: [
      { n: "KL Sentral", run: true, ic: true }, { n: "Subang Jaya", run: true, ic: true },
      { n: "Terminal Skypark", run: true }
    ]
  },
  {
    id: "monorail", name: "KL Monorail", color: "#7DBA00", status: "normal",
    minPerStop: 2.0, kmPerStop: 0.9,
    notice: "Normal service between KL Sentral and Titiwangsa.",
    stations: [
      { n: "KL Sentral", run: true, ic: true }, { n: "Tun Sambanthan", run: true },
      { n: "Maharajalela", run: true }, { n: "Hang Tuah", run: true, ic: true },
      { n: "Imbi", run: true }, { n: "Bukit Bintang", run: true, ic: true },
      { n: "Raja Chulan", run: true }, { n: "Bukit Nanas", run: true, ic: true },
      { n: "Medan Tuanku", run: true, ic: true }, { n: "Chow Kit", run: true },
      { n: "Titiwangsa", run: true, ic: true }
    ]
  },
  {
    id: "brt", name: "BRT Sunway Line", color: "#1E4D2B", status: "normal",
    minPerStop: 3.2, kmPerStop: 1.2,
    notice: "Normal service between Sunway-Setia Jaya and USJ 7.",
    stations: [
      { n: "Sunway-Setia Jaya", run: true, ic: true }, { n: "Mentari", run: true },
      { n: "Sunway Lagoon", run: true }, { n: "SunMed", run: true },
      { n: "SunU-Monash", run: true }, { n: "South Quay-USJ 1", run: true },
      { n: "USJ 7", run: true, ic: true }
    ]
  }
];

// Walkway transfers between differently-named stations (from the supplied list; sample walk times)
const WALK_TRANSFERS = [
  ["Merdeka", "Plaza Rakyat"],
  ["Pasar Seni", "Kuala Lumpur"],
  ["Dang Wangi", "Bukit Nanas"],
  ["Medan Tuanku", "Sultan Ismail"],
  ["PWTC", "Putra"],
  ["Bandaraya", "Bank Negara"],
  ["Sri Damansara Timur", "Kepong Sentral"],
  ["Glenmarie", "Glenmarie 2"],
  ["Setia Jaya", "Sunway-Setia Jaya"],
  ["USJ7", "USJ 7"]
];
const WALK_SAME_NAME = { time: 4, dist: 0.3 };   // same-station transfer between lines
const WALK_NAMED_PAIR = { time: 6, dist: 0.5 };  // walkway between differently-named stations




export { LINES, WALK_TRANSFERS, WALK_SAME_NAME, WALK_NAMED_PAIR };
