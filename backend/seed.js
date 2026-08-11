const db = require("./db");

const presenterCount = db.prepare("SELECT COUNT(*) AS c FROM presenters").get().c;

if (presenterCount === 0) {
  console.log("Seeding presenters, schedule, and news...");

  const insertPresenter = db.prepare(`
    INSERT INTO presenters (name, role, bio, photo_url, show_name)
    VALUES (@name, @role, @bio, @photo_url, @show_name)
  `);

  const presenters = [
    {
      name: "Chelangat Rono",
      role: "Breakfast Show Host",
      bio: "Chelangat opens every weekday with news, weather over the tea estates, and the songs that get Kericho moving.",
      photo_url: "",
      show_name: "Morning Light",
    },
    {
      name: "Kiplangat Bett",
      role: "Midday Host",
      bio: "Kiplangat brings community announcements, listener call-ins, and a midday word of encouragement.",
      photo_url: "",
      show_name: "Life Midday",
    },
    {
      name: "Mercy Chepkoech",
      role: "Evening Host",
      bio: "Mercy closes the day with reflective conversation, gospel music, and prayer requests from listeners.",
      photo_url: "",
      show_name: "Evening Grace",
    },
    {
      name: "Pastor Emmanuel Koech",
      role: "Sunday Host",
      bio: "Pastor Emmanuel leads Sunday programming with sermons, worship, and teaching for the whole family.",
      photo_url: "",
      show_name: "Sunday Assembly",
    },
  ];

  const presenterIds = {};
  for (const p of presenters) {
    const info = insertPresenter.run(p);
    presenterIds[p.show_name] = info.lastInsertRowid;
  }

  const insertShow = db.prepare(`
    INSERT INTO schedule (day_of_week, start_time, end_time, show_name, presenter_id, description)
    VALUES (@day_of_week, @start_time, @end_time, @show_name, @presenter_id, @description)
  `);

  const weekdayShows = [
    { start_time: "05:30", end_time: "09:00", show_name: "Morning Light", presenter_id: presenterIds["Morning Light"], description: "News, weather, and the songs that start the day right." },
    { start_time: "09:00", end_time: "12:00", show_name: "Life Midday", presenter_id: presenterIds["Life Midday"], description: "Community announcements, call-ins, and midday encouragement." },
    { start_time: "12:00", end_time: "15:00", show_name: "The Open Mic", presenter_id: null, description: "Listener requests and local voices from around Kericho." },
    { start_time: "15:00", end_time: "18:30", show_name: "Life Midday", presenter_id: presenterIds["Life Midday"], description: "Afternoon drive with news updates and music." },
    { start_time: "18:30", end_time: "21:00", show_name: "Evening Grace", presenter_id: presenterIds["Evening Grace"], description: "Reflective conversation, gospel music, and prayer requests." },
    { start_time: "21:00", end_time: "23:00", show_name: "Night Watch", presenter_id: null, description: "Quiet music to close the day." },
  ];

  for (let day = 1; day <= 5; day++) {
    for (const show of weekdayShows) {
      insertShow.run({ day_of_week: day, ...show });
    }
  }

  // Saturday
  const saturdayShows = [
    { start_time: "06:00", end_time: "09:00", show_name: "Morning Light Weekend", presenter_id: presenterIds["Morning Light"], description: "A relaxed Saturday morning start." },
    { start_time: "09:00", end_time: "13:00", show_name: "Community Voices", presenter_id: null, description: "Interviews with local leaders and changemakers." },
    { start_time: "13:00", end_time: "18:00", show_name: "Saturday Mix", presenter_id: null, description: "Music request line all afternoon." },
    { start_time: "18:00", end_time: "21:00", show_name: "Evening Grace", presenter_id: presenterIds["Evening Grace"], description: "Gospel music and reflection to close the week." },
  ];
  for (const show of saturdayShows) {
    insertShow.run({ day_of_week: 6, ...show });
  }

  // Sunday
  const sundayShows = [
    { start_time: "07:00", end_time: "12:00", show_name: "Sunday Assembly", presenter_id: presenterIds["Sunday Assembly"], description: "Sermons, worship, and teaching for the whole family." },
    { start_time: "12:00", end_time: "16:00", show_name: "Sunday Rest", presenter_id: null, description: "Easy listening for a Sunday afternoon." },
    { start_time: "16:00", end_time: "20:00", show_name: "Evening Grace", presenter_id: presenterIds["Evening Grace"], description: "Closing the week in gratitude." },
  ];
  for (const show of sundayShows) {
    insertShow.run({ day_of_week: 0, ...show });
  }

  const insertNews = db.prepare(`
    INSERT INTO news (title, slug, excerpt, body, cover_image_url)
    VALUES (@title, @slug, @excerpt, @body, @cover_image_url)
  `);

  const news = [
    {
      title: "Radio Light and Life launches new evening lineup",
      slug: "new-evening-lineup",
      excerpt: "Starting this month, Evening Grace moves to a new time to reach more listeners after work.",
      body: "Starting this month, Evening Grace moves to a new time to reach more listeners after work. The show will keep its mix of reflective conversation, gospel music, and listener prayer requests, now airing earlier in the evening so families can tune in together.",
      cover_image_url: "",
    },
    {
      title: "Community Voices returns for a second season",
      slug: "community-voices-season-two",
      excerpt: "Our Saturday interview show is back, featuring more leaders and changemakers from around Kericho.",
      body: "Our Saturday interview show is back, featuring more leaders and changemakers from around Kericho. Season two opens with a conversation about youth enterprise in the tea-growing community, and continues weekly through the year.",
      cover_image_url: "",
    },
    {
      title: "How to listen to 107.3FM outside Kericho",
      slug: "how-to-listen-outside-kericho",
      excerpt: "Family and friends outside our broadcast area can now tune in live from anywhere using our website player.",
      body: "Family and friends outside our broadcast area can now tune in live from anywhere using our website player. Just visit the homepage and press play -- no app download required.",
      cover_image_url: "",
    },
  ];

  for (const n of news) insertNews.run(n);

  const insertEncouragement = db.prepare(`
    INSERT INTO encouragements (message, presenter_id, entry_date)
    VALUES (@message, @presenter_id, @entry_date)
  `);

  const today = new Date();
  const dateStr = (offsetDays) => {
    const d = new Date(today);
    d.setDate(d.getDate() - offsetDays);
    return d.toISOString().slice(0, 10);
  };

  const encouragements = [
    {
      message: "Whatever today holds, you don't have to carry it alone. Light finds its way in, even on the cloudiest mornings over the hills.",
      presenter_id: presenterIds["Evening Grace"],
      entry_date: dateStr(0),
    },
    {
      message: "Small, steady steps still get you there. Be patient with yourself the way you'd be patient with someone you love.",
      presenter_id: presenterIds["Sunday Assembly"],
      entry_date: dateStr(1),
    },
    {
      message: "A new morning is a new mercy. Whatever yesterday looked like, today gets to be different.",
      presenter_id: presenterIds["Morning Light"],
      entry_date: dateStr(2),
    },
  ];

  for (const e of encouragements) insertEncouragement.run(e);

  console.log("Seed complete.");
} else {
  console.log("Database already has data, skipping seed.");
}
