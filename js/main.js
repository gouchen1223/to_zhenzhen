(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const text = (sel, val) => {
    const el = $(sel);
    if (el) el.textContent = val;
  };
  const safe = (fn) => {
    try { fn(); } catch (err) { console.error(err); }
  };
  const site = () => window.SITE || {};
  let chapterId = 1;
  function chapter() {
    const S = site();
    const extra = (chapterId === 2 && S.chapter2) ? S.chapter2 : {};
    return Object.assign({}, S, extra);
  }

  const pages = [
    { id: "home", label: "封面", title: "从这里看起", desc: "今日一页，和几件可以点的小事" },
    { id: "letter", label: "信", title: "还没寄出的一封", desc: "留言" },
    { id: "time", label: "日子", title: "把日子数清楚", desc: "认识和倒数" },
    { id: "memories", label: "碎片", title: "碎片墙", desc: "一些记下的瞬间" },
    { id: "secret", label: "星", title: "藏起来的一页", desc: "小彩蛋" }
  ];

  const v2Pages = [
    { id: "home", label: "封面" },
    { id: "letter", label: "信" },
    { id: "time", label: "日子" },
    { id: "album", label: "相册" },
    { id: "secret", label: "星" }
  ];

  const mascotLines = [
    "一封信在「信」那一页。",
    "日子还在慢慢走。",
    "碎片可以点开看全图。",
    "墙上的花瓣和小兔，都藏着东西。",
    "想听歌的话，点右上角的音符。"
  ];

  const mascotLines2 = [
    "这一册是第二封。分别过后写下的。",
    "日子那一页，相识、见面、分别是分开数的。",
    "封面、信、日子、相册里，会亮的小星星都可以点。找齐了，「星」才会开。",
    "右上角的音符可以换歌。月亮是关灯。",
    "想回信封那一页，点上面的「信箱」。"
  ];

  const landingLines = [
    "我是小兔。右上角那个音符，点一下就会唱歌。",
    "现在有两封信。左边是第一封，右边是第二封。",
    "第二封打开之前，会先等待一下。",
    "右上角的音符，点开可以换歌，再点就收起来。"
  ];

  const pageGuides = {
    home: "从封面开始逛就好。想看信，走下面那一栏。",
    letter: "这封信会自己长出来。蜡封和星星，都有彩蛋。",
    time: "相识从 7.21 起。线上的日子可以点一下。",
    memories: "照片点开能看全图。墙上的花瓣、纸条和小兔，也藏着彩蛋",
    secret: "那颗星星，连点五次。"
  };

  let typedTimer = null;
  let audio = null;
  let secretClicks = 0;
  let v2SecretClicks = 0;
  let vnIndex = 0;
  let mascotClicks = 0;
  let titleTaps = 0;
  const foundEggs = new Set();
  const hintedPages = new Set();
  const V2_EGG_KEY = "for-you-v2-eggs";
  const foundV2Eggs = loadV2Eggs();

  function loadV2Eggs() {
    try {
      const raw = JSON.parse(localStorage.getItem(V2_EGG_KEY) || "[]");
      return new Set((raw || []).map(String));
    } catch (err) {
      return new Set();
    }
  }

  const pad = (n) => String(n).padStart(2, "0");
  const parseDay = (s) => (s ? new Date(s + "T00:00:00") : null);
  const daysBetween = (a, b) => Math.floor((b - a) / 86400000);

  function fillText() {
    const S = site();
    document.title = S.pageTitle || document.title;
    text("#pageTitle", S.pageTitle || "To 真真");
    text("#landingLine", S.landingLine || "");
    text("#landingHint", S.landingHint || "Message");
    text("#letterPeek", "To. " + (S.herName || "真真"));
    text("#letterPeek2", "To. " + (S.herName || "真真"));
    text("#herNameHero", S.herName || "真真");
    text("#myNameHero", S.myName || "狗晨");
    text("#vnName", S.myName || "狗晨");
    text("#subtitle", S.subtitle || "");
    text("#letterTitle", S.letterTitle || "还没寄出的一封");
    text("#letterSign", "—— " + (S.myName || "狗晨"));
    text("#hiddenMessage", S.hiddenMessage || "");
    text("#makeupTitle", S.makeupTitle || "");
    text("#secretHint", S.secretHint || "只有我们知道的那句");
    const wax = $(".wax");
    if (wax) wax.textContent = "桜";
    const now = new Date();
    const today = now.getFullYear() + "." + pad(now.getMonth() + 1) + "." + pad(now.getDate());
    text("#todayStamp", today);
    text("#homeToday", today);
    const lines = S.dialogue || [];
    text("#vnLine", lines[0] || "有些话，想慢慢说给你听。");
    vnIndex = 0;
    if (!window.SITE) {
      const hint = $("#configHint");
      if (hint) hint.classList.remove("hidden");
    }
  }

  function fillV2() {
    const S = site();
    const c = S.chapter2 || {};
    text("#v2HeroName", "To " + (S.herName || "真真"));
    text("#v2Subtitle", c.subtitle || "分别过后");
    text("#v2From", c.fromLine || ("from " + (S.myName || "狗晨")));
    text("#v2LetterTitle", c.letterTitle || "第二封");
    text("#v2LetterSign", "—— " + (S.myName || "狗晨"));
    text("#v2SideTag", c.makeupTag || "等待夸夸！");
    text("#v2MakeupTitle", c.makeupTitle || "锻炼夸夸能力中————");
    text("#v2AlbumTitle", c.albumTitle || "相册");
    const hintEl = $("#v2AlbumHint");
    if (hintEl) {
      const hint = String(c.albumHint || "").trim();
      hintEl.textContent = hint;
      hintEl.hidden = !hint;
    }
    text("#v2HiddenMessage", c.hiddenMessage || "");
    const fill = $("#v2ProgressFill");
    if (fill) fill.style.width = (c.loaderTo || 40) + "%";
    const spark = $(".v2-spark");
    if (spark) spark.style.left = (c.loaderTo || 40) + "%";
    renderV2Time();
  }

  function countDays(dateStr) {
    const d = parseDay(dateStr);
    if (!d) return 0;
    return Math.max(0, daysBetween(d, new Date()) + 1);
  }

  function renderV2Time() {
    const S = site();
    const now = new Date();
    const today = now.getFullYear() + "." + pad(now.getMonth() + 1) + "." + pad(now.getDate());
    text("#v2Today", today);
    const met = countDays(S.firstMeetDate || "2026-08-09");
    const parted = countDays(S.partedDate || "2026-08-29");
    const known = countDays(S.meetDate || "2026-07-21");
    const setDays = (sel, n) => {
      const el = $(sel);
      if (el) el.innerHTML = n + "<small> 天</small>";
    };
    setDays("#v2DaysMet", met);
    setDays("#v2DaysParted", parted);
    setDays("#v2DaysKnown", known);
    text("#v2MetLabel", "第一次见面 · " + (S.firstMeetDate || "2026-08-09"));
    text("#v2PartedLabel", "从 " + (S.partedDate || "2026-08-29") + " 起");
    text("#v2KnownLabel", "从 " + (S.meetDate || "2026-07-21") + " 起");
    text("#v2MegaParted", String(parted));
    text("#v2MegaKnown", String(known));
    text("#v2MegaPartedLabel", "从 " + (S.partedDate || "2026-08-29") + " 起");
    text("#v2MegaKnownLabel", "从 " + (S.meetDate || "2026-07-21") + " 起");
    text("#v2NextLabel", S.nextMeetLabel || "下次见面");
    renderTimeline($("#timeline2"), { futureStar: true });

    let saved = null;
    try { saved = JSON.parse(localStorage.getItem("for-you-next-meet") || "null"); } catch (err) { saved = null; }
    const nextDate = (saved && saved.date) || S.nextMeetDate || S.specialDate || "";
    const nextTitle = (saved && saved.title) || S.nextMeetLabel || "下次见面";
    const dateInput = $("#v2NextDate");
    const titleInput = $("#v2NextTitle");
    if (dateInput && nextDate) dateInput.value = nextDate;
    if (titleInput && !titleInput.value) titleInput.value = nextTitle;
    paintCountdown($("#v2NextCountdown"), parseDay(nextDate), nextDate ? nextTitle : "");
  }

  function buildNav() {
    const grid = $("#navGrid");
    const dock = $("#dock");
    grid.innerHTML = "";
    dock.innerHTML = "";
    pages.forEach((p) => {
      if (p.id !== "home" && p.id !== "secret") {
        const card = document.createElement("button");
        card.className = "nav-card";
        card.type = "button";
        card.innerHTML = "<b>" + p.title + "</b><span>" + p.desc + "</span>";
        card.addEventListener("click", () => showPage(p.id));
        grid.appendChild(card);
      }
      const tab = document.createElement("button");
      tab.type = "button";
      tab.dataset.page = p.id;
      tab.textContent = p.label;
      tab.addEventListener("click", () => showPage(p.id));
      dock.appendChild(tab);
    });
  }

  function showPage(id, opts) {
    const silent = opts && opts.silent;
    $$("#app .page").forEach((el) => el.classList.toggle("active", el.dataset.page === id));
    $$("#dock button").forEach((el) => el.classList.toggle("active", el.dataset.page === id));
    if (id === "letter") typeLetter(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (!silent && !hintedPages.has(id)) {
      hintedPages.add(id);
      speak(pageGuides[id] || "慢慢看就好。");
    }
  }

  function typeLetter(force) {
    const el = $("#letterBody");
    const body = (site().letter || el.textContent || "").trim();
    if (!el || !body) return;
    if (!force && el.dataset.done === "1") return;
    clearInterval(typedTimer);
    el.textContent = "";
    el.dataset.done = "";
    let i = 0;
    typedTimer = setInterval(() => {
      el.textContent = body.slice(0, ++i);
      if (i >= body.length) {
        clearInterval(typedTimer);
        el.dataset.done = "1";
      }
    }, 26);
  }

  function renderTime() {
    const S = site();
    const now = new Date();
    const meet = parseDay(S.meetDate);
    const special = parseDay(S.specialDate);

    if (meet) {
      const n = Math.max(0, daysBetween(meet, now) + 1);
      $("#daysKnown").textContent = n;
      $("#meetLabel").textContent = "从 " + S.meetDate + " 起";
    }
    $("#specialLabel").textContent = S.specialDateLabel || "特别日子";
    paintCountdown($("#countdown"), special);
    renderTimeline($("#timeline"));

    let saved = null;
    try { saved = JSON.parse(localStorage.getItem("for-you-custom-date") || "null"); } catch (err) { saved = null; }
    if (saved) {
      $("#customDate").value = saved.date || "";
      $("#customTitle").value = saved.title || "";
      paintCountdown($("#customCountdown"), parseDay(saved.date), saved.title);
    }
  }

  function storyNodes() {
    const S = site();
    const now = new Date();
    return [
      { key: "相识", date: parseDay(S.meetDate || "2026-07-21"), whisper: "7.21，从这一天开始数。" },
      { key: "见面", date: parseDay(S.firstMeetDate || "2026-08-09"), whisper: "8.9，第一次见面。" },
      { key: "分别", date: parseDay(S.partedDate || "2026-08-29"), whisper: "8.29，线还在往后走。" },
      { key: "今天", date: now, cls: "now", whisper: "今天也写在这条线上。" }
    ].filter((n) => n.date);
  }

  function renderTimeline(root, opts) {
    if (!root) return;
    const nodes = storyNodes();
    const future = opts && opts.futureStar;
    root.classList.toggle("has-future", Boolean(future));
    root.innerHTML = nodes.map((n, i) => {
      const day = n.date.getFullYear() + "." + pad(n.date.getMonth() + 1) + "." + pad(n.date.getDate());
      return "<div class=\"tl-node " + (n.cls || "") + "\" data-i=\"" + i + "\" role=\"button\" tabindex=\"0\">" +
        "<i></i><b>" + n.key + "</b><span>" + day + "</span></div>";
    }).join("") + (future
      ? "<button class=\"tl-future\" data-v2-egg=\"2\" type=\"button\" aria-label=\"还没走到的那一颗\">✦</button>"
      : "");
    root.querySelectorAll(".tl-node").forEach((el) => {
      const go = () => {
        const n = nodes[Number(el.dataset.i)];
        if (n && n.whisper) speak(n.whisper);
        burst(el.querySelector("i") || el);
      };
      el.addEventListener("click", go);
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          go();
        }
      });
    });
  }

  function paintCountdown(root, date, title) {
    if (!root) return;
    if (!date) {
      root.innerHTML = "<p class=\"soft\">把日期写进 js/config.js，或在下面自己做一个</p>";
      return;
    }
    const tick = () => {
      const now = new Date();
      let ms = date - now;
      const past = ms < 0;
      ms = Math.abs(ms);
      const d = Math.floor(ms / 86400000);
      const h = Math.floor(ms / 3600000) % 24;
      const m = Math.floor(ms / 60000) % 60;
      const s = Math.floor(ms / 1000) % 60;
      const titleHtml = title ? "<p class=\"soft\">" + title + "</p>" : "";
      const pastHtml = past ? "已经过去了这些时间" : "还在路上";
      root.innerHTML = titleHtml +
        "<div class=\"count-cell\"><b>" + d + "</b><span>天</span></div>" +
        "<div class=\"count-cell\"><b>" + pad(h) + "</b><span>时</span></div>" +
        "<div class=\"count-cell\"><b>" + pad(m) + "</b><span>分</span></div>" +
        "<div class=\"count-cell\"><b>" + pad(s) + "</b><span>秒</span></div>" +
        "<p class=\"soft\">" + pastHtml + "</p>";
    };
    tick();
    clearInterval(root._t);
    root._t = setInterval(tick, 1000);
  }

  function slotWrap(node) {
    const slot = document.createElement("div");
    slot.className = "polaroid-slot";
    slot.appendChild(node);
    return slot;
  }

  function renderMemories() {
    const wall = $("#memoryWall");
    if (!wall) return;
    wall.className = "polaroid-wall";
    const palette = ["#ffe0ea", "#fff1cf", "#e8fff4", "#f3e8ff", "#ffe8d6", "#e8f3ff", "#fff1f5"];
    const doodles = ["✿", "✦", "❀", "★", "☾", "☁", "♡"];
    const tapes = ["", "mint", "lemon", "mint", "", "lemon", ""];
    wall.innerHTML = "";
    (site().memories || []).forEach((m, i) => {
      const fig = document.createElement("figure");
      fig.className = "polaroid";
      const deco = i % 2 === 0
        ? "<span class=\"pin\" aria-hidden=\"true\"></span>"
        : "<span class=\"tape-bit " + tapes[i % tapes.length] + "\" aria-hidden=\"true\"></span>";
      const pic = m.photo
        ? "<div class=\"frame\"><img class=\"pic\" src=\"" + m.photo + "\" alt=\"" + (m.title || "") + "\" draggable=\"false\" /></div>"
        : "<div class=\"frame\"><div class=\"pic placeholder\" style=\"background:" + palette[i % palette.length] + "\">" + doodles[i % doodles.length] + "</div></div>";
      fig.innerHTML =
        deco +
        "<span class=\"tag\">" + (m.tag || "记") + "</span>" +
        pic +
        "<figcaption>" + (m.title || "") + "</figcaption>" +
        "<small>" + (m.caption || "") + "</small>";
      if (m.egg) fig.dataset.egg = String(m.egg);
      fig.addEventListener("click", () => {
        openLightbox(m);
        burst(fig);
      });
      wall.appendChild(slotWrap(fig));
    });
  }

  function renderAlbum() {
    const root = $("#albumRoot");
    if (!root) return;
    root.innerHTML = "";
    const album = (site().chapter2 && site().chapter2.album) || [];
    album.forEach((act, actIndex) => {
      const spread = document.createElement("section");
      spread.className = "album-spread";
      spread.innerHTML =
        "<div class=\"album-spine\" aria-hidden=\"true\"></div>" +
        "<h3>" + (act.heading || "") +
          (actIndex === 0 ? "<button class=\"v2-pin\" data-v2-egg=\"3\" type=\"button\" aria-label=\"别着的一颗星\">✦</button>" : "") +
          (actIndex === 1 ? "<button class=\"v2-pin\" data-v2-egg=\"7\" type=\"button\" aria-label=\"别着的一颗星\">✦</button>" : "") +
        "</h3>" +
        (act.copy ? "<p class=\"soft\">" + act.copy + "</p>" : "");
      const grid = document.createElement("div");
      grid.className = "album-grid";
      (act.shots || []).forEach((m, i) => {
        const fig = document.createElement("figure");
        fig.className = "print";
        fig.style.setProperty("--r", ((i % 4) - 1.4) * 1.1 + "deg");
        const note = (m.text || m.title || "").trim();
        fig.innerHTML =
          "<span class=\"print-tape\" aria-hidden=\"true\"></span>" +
          "<div class=\"print-frame\">" +
            (m.photo ? "<img src=\"" + m.photo + "\" alt=\"" + note + "\" draggable=\"false\" />" : "") +
          "</div>" +
          (note ? "<figcaption class=\"print-note\">" + note + "</figcaption>" : "");
        const img = fig.querySelector("img");
        if (img) {
          const fit = () => {
            const w = img.naturalWidth;
            const h = img.naturalHeight;
            if (!w || !h) return;
            const portrait = h / w > 1.12;
            fig.classList.toggle("portrait", portrait);
            fig.classList.toggle("wide", !portrait);
          };
          if (img.complete) fit();
          else img.addEventListener("load", fit);
        }
        fig.addEventListener("click", () => {
          openLightbox(m);
          burst(fig);
        });
        grid.appendChild(fig);
      });
      spread.appendChild(grid);
      root.appendChild(spread);
    });
  }

  function typeLetter2(force) {
    const el = $("#letterBody2");
    const body = (((site().chapter2 || {}).letter) || (el && el.textContent) || "").trim();
    if (!el || !body) return;
    if (!force && el.dataset.done === "1") return;
    clearInterval(typedTimer);
    el.textContent = "";
    el.dataset.done = "";
    let i = 0;
    typedTimer = setInterval(() => {
      el.textContent = body.slice(0, ++i);
      if (i >= body.length) {
        clearInterval(typedTimer);
        el.dataset.done = "1";
      }
    }, 26);
  }

  function letter1EggTotal() {
    return $$("[data-egg]").filter((el) => !el.closest("#app2")).length;
  }

  function v2EggTotal() {
    const n = $$("#app2 [data-v2-egg]").length;
    return n || 10;
  }

  function v2Unlocked() {
    return foundV2Eggs.size >= v2EggTotal();
  }

  function markFoundEggs() {
    $$("#app2 [data-v2-egg]").forEach((el) => {
      el.classList.toggle("found", foundV2Eggs.has(String(el.dataset.v2Egg)));
    });
  }

  function paintEggChip() {
    const chip = $("#eggChip");
    if (!chip) return;
    if (chapterId === 2) {
      const n = foundV2Eggs.size;
      const total = v2EggTotal();
      chip.hidden = n === 0;
      chip.textContent = "彩蛋 " + n + "/" + total;
      return;
    }
    const n = foundEggs.size;
    const total = letter1EggTotal();
    chip.hidden = n === 0;
    chip.textContent = "彩蛋 " + n + "/" + total;
  }

  function updateDock2Lock() {
    const tab = $("#dock2 button[data-page='secret']");
    if (!tab) return;
    const open = v2Unlocked();
    tab.classList.toggle("locked", !open);
    tab.setAttribute("aria-disabled", open ? "false" : "true");
  }

  function collectV2Egg(id) {
    const key = String(id);
    if (foundV2Eggs.has(key)) {
      speak("这颗已经找到过了。");
      return;
    }
    foundV2Eggs.add(key);
    try { localStorage.setItem(V2_EGG_KEY, JSON.stringify([...foundV2Eggs])); } catch (err) {}
    markFoundEggs();
    paintEggChip();
    const lines = (site().chapter2 && site().chapter2.eggs) || [];
    speak(lines[foundV2Eggs.size - 1] || "又找到一颗。");
    updateDock2Lock();
    const left = leftoverV2EggHint();
    if (left) {
      setTimeout(() => speak("还差最后一颗。" + left), 1100);
    } else if (v2Unlocked()) {
      setTimeout(() => speak("找齐了。底下的「星」可以打开了。"), 900);
    }
  }

  function leftoverV2EggHint() {
    if (foundV2Eggs.size !== v2EggTotal() - 1) return "";
    const hints = {
      "0": "在封面那朵小花上。",
      "1": "在信的蜡封上。",
      "2": "在日子线走到今天后面。",
      "3": "在相册「夜色」标题旁边。",
      "4": "在封面进度条尽头那粒光上。",
      "5": "在封面上面的日期上。",
      "6": "在封面 from 那一行。",
      "7": "在相册「掌心」标题旁边。",
      "8": "在信末尾的署名上。",
      "9": "在「日子的可视化」这几个字上。"
    };
    const missing = $$("#app2 [data-v2-egg]").map((el) => String(el.dataset.v2Egg)).find((id) => !foundV2Eggs.has(id));
    return hints[missing] || "再翻一翻封面、信、日子和相册。";
  }

  function showV2Page(id, opts) {
    const silent = opts && opts.silent;
    if (id === "secret" && !v2Unlocked()) {
      const left = leftoverV2EggHint();
      speak(left ? ("还差最后一颗。" + left) : "这一册的彩蛋还没找齐。找齐了才能打开「星」。");
      paintEggChip();
      return;
    }
    $$("#app2 .page").forEach((el) => el.classList.toggle("active", el.dataset.page === id));
    $$("#dock2 button").forEach((el) => el.classList.toggle("active", el.dataset.page === id));
    if (id === "letter") typeLetter2(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (!silent) {
      const tips = {
        home: "封面的日期、署名和那朵小花，都可以点。进度条尽头也有一粒光。",
        letter: "蜡封可以点。信末尾的署名旁边，有一颗小星星。",
        time: "标题旁边有颗星。日子线走到今天之后，还有一颗。",
        album: "两叠标题旁边都别着星星。照片点开能看全图。",
        secret: "那颗星星，连点五次。"
      };
      speak(tips[id] || "慢慢看就好。");
    }
  }

  function buildDock2() {
    const dock = $("#dock2");
    if (!dock) return;
    dock.innerHTML = "";
    v2Pages.forEach((p) => {
      const tab = document.createElement("button");
      tab.type = "button";
      tab.dataset.page = p.id;
      tab.textContent = p.label;
      if (p.id === "secret" && !v2Unlocked()) tab.classList.add("locked");
      tab.addEventListener("click", () => showV2Page(p.id));
      dock.appendChild(tab);
    });
    updateDock2Lock();
  }

  function openLightbox(m) {
    const box = $("#lightbox");
    const img = $("#lightboxImg");
    if (!box || !img) return;
    if (m.photo) {
      img.src = m.photo;
      img.alt = m.text || m.title || "";
      img.hidden = false;
    } else {
      img.removeAttribute("src");
      img.hidden = true;
    }
    text("#lightboxTitle", m.text || m.title || "");
    text("#lightboxCap", m.caption || "");
    box.classList.remove("hidden");
    if (m.say) speak(m.say);
    else if (m.text) speak(m.text);
  }

  function closeLightbox() {
    const box = $("#lightbox");
    if (box) box.classList.add("hidden");
  }

  function nextDialogue() {
    const lines = site().dialogue || [];
    if (!lines.length) return;
    vnIndex = (vnIndex + 1) % lines.length;
    $("#vnLine").textContent = lines[vnIndex];
    hopMascot();
    burst($("#vnBox"));
  }

  function collectEgg(id) {
    const key = String(id);
    if (foundEggs.has(key)) {
      speak("这颗已经找到过了。");
      return;
    }
    foundEggs.add(key);
    paintEggChip();
    const total = letter1EggTotal();
    const lines = site().eggs || [];
    speak(lines[foundEggs.size - 1] || "又找到一颗。");
    if (foundEggs.size >= total) {
      setTimeout(() => {
        speak("都找到了。星那一页还有一句。");
        if ($("#app") && !$("#app").classList.contains("hidden")) showPage("secret");
      }, 900);
    }
  }

  function bindApps() {
    $("#vnBox").addEventListener("click", nextDialogue);
    $("#replayLetter").addEventListener("click", () => {
      typeLetter(true);
      speak("再读一遍。我帮你慢慢念。");
    });
    const replay2 = $("#replayLetter2");
    if (replay2) {
      replay2.addEventListener("click", () => {
        typeLetter2(true);
        speak("再读一遍。");
      });
    }
    $$("[data-v2]").forEach((btn) => {
      btn.addEventListener("click", () => showV2Page(btn.dataset.v2));
    });
    const saveNext = $("#saveNextMeet");
    if (saveNext) {
      saveNext.addEventListener("click", () => {
        const date = $("#v2NextDate") && $("#v2NextDate").value;
        const title = (($("#v2NextTitle") && $("#v2NextTitle").value.trim()) || "下次见面");
        if (!date) {
          speak("先选一个下次见面的日子。");
          return;
        }
        localStorage.setItem("for-you-next-meet", JSON.stringify({ date, title }));
        paintCountdown($("#v2NextCountdown"), parseDay(date), title);
        speak("下次见面开始倒数了。");
      });
    }
    $("#saveCustom").addEventListener("click", () => {
      const date = $("#customDate").value;
      const title = $("#customTitle").value.trim() || "我的倒数";
      if (!date) {
        speak("先选一个日期小兔才会开始数。");
        return;
      }
      localStorage.setItem("for-you-custom-date", JSON.stringify({ date, title }));
      paintCountdown($("#customCountdown"), parseDay(date), title);
      speak("开始倒数了。日子会自己走。");
    });
    $("#secretStar").addEventListener("click", () => {
      secretClicks += 1;
      $("#secretStar").style.transform = "scale(" + (1 + secretClicks * 0.06) + ")";
      if (secretClicks >= 5) {
        $("#secretCard").classList.remove("hidden");
        const hint = $("#page-secret .night-copy");
        if (hint) hint.classList.add("hidden");
        burst($("#secretStar"));
        speak("找到啦。这句是留给真真的。");
      } else {
        speak("还差 " + (5 - secretClicks) + " 下。");
      }
    });
    const v2Star = $("#v2SecretStar");
    if (v2Star) {
      v2Star.addEventListener("click", () => {
        v2SecretClicks += 1;
        v2Star.style.transform = "scale(" + (1 + v2SecretClicks * 0.06) + ")";
        if (v2SecretClicks >= 5) {
          $("#v2SecretCard").classList.remove("hidden");
          const hint = $("#page2-secret .night-copy");
          if (hint) hint.classList.add("hidden");
          burst(v2Star);
          speak("找到了。浓浓的思念，都在这里。");
        } else {
          speak("还差 " + (5 - v2SecretClicks) + " 下。");
        }
      });
    }
    document.addEventListener("click", (e) => {
      const v2 = e.target.closest("[data-v2-egg]");
      if (v2) {
        collectV2Egg(v2.dataset.v2Egg);
        burst(v2);
        return;
      }
      if (chapterId === 2) return;
      const el = e.target.closest("[data-egg]");
      if (!el) return;
      collectEgg(el.dataset.egg);
      burst(el);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const v2 = e.target.closest("[data-v2-egg]");
      if (v2) {
        e.preventDefault();
        collectV2Egg(v2.dataset.v2Egg);
        burst(v2);
        return;
      }
      if (chapterId === 2) return;
      const el = e.target.closest("[data-egg]");
      if (!el) return;
      e.preventDefault();
      collectEgg(el.dataset.egg);
      burst(el);
    });
    $("#lightboxClose").addEventListener("click", closeLightbox);
    $("#lightbox").addEventListener("click", (e) => {
      if (e.target.id === "lightbox") closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });
    const title = $("#memoriesTitle");
    if (title) {
      title.style.cursor = "pointer";
      title.title = "连点三次";
      title.addEventListener("click", () => {
        titleTaps += 1;
        if (titleTaps >= 3) {
          titleTaps = 0;
          sakuraStorm();
          speak("墙也会开花。再点照片看看全图。");
        }
      });
    }
    const v2title = $("#v2TimeTitle");
    if (v2title) {
      v2title.style.cursor = "pointer";
      let taps = 0;
      v2title.addEventListener("click", () => {
        taps += 1;
        if (taps >= 3) {
          taps = 0;
          sakuraStorm();
          speak("日子也会开花。线上的点，可以再点一次。");
        }
      });
    }
  }

  function hopMascot() {
    const el = $("#mascot");
    if (!el) return;
    el.classList.remove("hop");
    void el.offsetWidth;
    el.classList.add("hop", "talk");
    clearTimeout(hopMascot._t);
    hopMascot._t = setTimeout(() => el.classList.remove("hop", "talk"), 520);
  }

  function speak(msg) {
    const bubble = $("#mascotBubble");
    if (!bubble || !msg) return;
    bubble.textContent = msg;
    bubble.classList.remove("hidden");
    hopMascot();
    clearTimeout(speak._t);
    speak._t = setTimeout(() => bubble.classList.add("hidden"), 3800);
  }

  function onLanding() {
    const landing = $("#landing");
    return landing && !landing.classList.contains("hidden");
  }

  function bindMascot() {
    $("#mascot").addEventListener("click", () => {
      mascotClicks += 1;
      if (mascotClicks === 7) {
        sakuraStorm();
        speak("樱花知道了。团子再跳一次。");
      } else if (onLanding()) {
        speak(landingLines[mascotClicks % landingLines.length]);
      } else {
        const lines = chapterId === 2 ? mascotLines2 : mascotLines;
        speak(lines[mascotClicks % lines.length]);
      }
      burst($("#mascot"));
    });
  }

  function openEnvelope(which) {
    const env = $("#envelope" + which);
    if (!env || env.classList.contains("open")) return;
    env.classList.add("open");
    burst(env);
    setTimeout(() => {
      if (which === 2) startChapter2Loader();
      else enterChapter(1);
    }, 980);
  }

  function startChapter2Loader() {
    const S = site().chapter2 || {};
    const from = Number(S.loaderFrom) || 20;
    const to = Number(S.loaderTo) || 40;
    $("#landing").classList.add("hidden");
    $("#app").classList.add("hidden");
    const app2 = $("#app2");
    if (app2) app2.classList.add("hidden");
    document.body.classList.remove("is-app", "chapter-2");
    document.body.classList.add("on-landing");
    const mail = $("#mailboxBtn");
    if (mail) mail.classList.remove("hidden");
    const loader = $("#loader");
    if (loader) loader.classList.remove("hidden");
    text("#loaderHand", "Landing——");
    const fill = $("#progressFill");
    const num = $("#progressNum");
    const btn = $("#openAfterLoad");
    if (btn) btn.classList.add("hidden");
    let p = from;
    if (fill) fill.style.width = from + "%";
    if (num) num.textContent = from + "%";
    speak("Landing.");
    clearInterval(startChapter2Loader._t);
    startChapter2Loader._t = setInterval(() => {
      p += 1;
      if (fill) fill.style.width = p + "%";
      if (num) num.textContent = p + "%";
      if (p >= to) {
        clearInterval(startChapter2Loader._t);
        if (btn) btn.classList.remove("hidden");
        speak("到百分之四十了。可以打开了。");
      }
    }, 72);
  }

  function enterChapter(id) {
    chapterId = id;
    document.body.classList.toggle("chapter-2", id === 2);
    const loader = $("#loader");
    if (loader) loader.classList.add("hidden");
    $("#landing").classList.add("hidden");
    const app = $("#app");
    const app2 = $("#app2");
    if (app) app.classList.toggle("hidden", id !== 1);
    if (app2) app2.classList.toggle("hidden", id !== 2);
    document.body.classList.remove("on-landing");
    document.body.classList.add("is-app");
    const mail = $("#mailboxBtn");
    if (mail) mail.classList.remove("hidden");
    if (audio) audio.setSrc(chapter().musicSrc || "music/eve-kokoro-yohou.mp3");
    if (id === 2) {
      fillV2();
      buildDock2();
      renderAlbum();
      renderV2Time();
      paintEggChip();
      markFoundEggs();
      const letter2 = $("#letterBody2");
      if (letter2) letter2.dataset.done = "";
      showV2Page("home", { silent: true });
      speak((site().herName || "真真") + "，这是第二封。下面有信，也有相册。");
    } else {
      const letterBody = $("#letterBody");
      if (letterBody) letterBody.dataset.done = "";
      fillText();
      paintEggChip();
      showPage("home", { silent: true });
      speak((site().herName || "真真") + "，信在里面。下面可以翻页。");
    }
  }

  function backToMailbox() {
    closeLightbox();
    $("#app").classList.add("hidden");
    const app2 = $("#app2");
    if (app2) app2.classList.add("hidden");
    const loader = $("#loader");
    if (loader) loader.classList.add("hidden");
    $("#landing").classList.remove("hidden");
    document.body.classList.add("on-landing");
    document.body.classList.remove("is-app", "chapter-2");
    const mail = $("#mailboxBtn");
    if (mail) mail.classList.add("hidden");
    $$(".envelope").forEach((el) => el.classList.remove("open"));
    chapterId = 1;
    paintEggChip();
    if (audio) audio.setSrc(site().musicSrc || "music/eve-kokoro-yohou.mp3");
    speak("两封信都在。想看哪封点哪封。");
  }

  function startFlow() {
    const loader = $("#loader");
    if (loader) loader.classList.add("hidden");
    const needGate = Boolean((site().secretWord || "").trim());
    if (needGate) {
      const landing = $("#landing");
      if (landing) landing.classList.add("hidden");
      const gate = $("#gate");
      if (gate) gate.classList.remove("hidden");
      return;
    }
    const landing = $("#landing");
    if (landing) landing.classList.remove("hidden");
    setTimeout(() => {
      speak("我是小兔！现在有两封信。右上角可以开音乐，点信封就能进去。");
    }, 700);
  }

  function bindGate() {
    $("#gateForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = $("#secretInput").value.trim() === String(site().secretWord || "").trim();
      if (!ok) {
        $("#gateError").classList.remove("hidden");
        return;
      }
      $("#gate").classList.add("hidden");
      $("#landing").classList.remove("hidden");
      speak("暗号对上了。右上角可以开音乐，再点信封。");
    });
    const env1 = $("#envelope1") || $("#envelope");
    const env2 = $("#envelope2");
    if (env1) env1.addEventListener("click", () => openEnvelope(1));
    if (env2) env2.addEventListener("click", () => openEnvelope(2));
    const after = $("#openAfterLoad");
    if (after) after.addEventListener("click", () => enterChapter(2));
    const mail = $("#mailboxBtn");
    if (mail) mail.addEventListener("click", backToMailbox);
  }

  function MusicBox() {
    this.el = document.createElement("audio");
    this.el.src = chapter().musicSrc || "music/eve-kokoro-yohou.mp3";
    this.el.loop = true;
    this.el.preload = "auto";
    this.playing = false;
  }
  MusicBox.prototype.setSrc = function setSrc(src) {
    if (!src || this.el.getAttribute("src") === src) return;
    const wasPlaying = this.playing;
    this.stop();
    this.el.src = src;
    this.el.load();
    if (wasPlaying) this.start();
  };
  MusicBox.prototype.start = function start() {
    const play = this.el.play();
    this.playing = true;
    if (play && play.catch) play.catch(() => { this.playing = false; });
  };
  MusicBox.prototype.stop = function stop() {
    this.el.pause();
    this.playing = false;
  };

  function playlist() {
    const S = site();
    if (S.playlist && S.playlist.length) return S.playlist;
    return [{ name: S.musicName || "心予報", src: S.musicSrc || "music/eve-kokoro-yohou.mp3" }];
  }

  function currentMusicSrc() {
    return (audio && audio.el && audio.el.getAttribute("src")) || chapter().musicSrc || site().musicSrc;
  }

  function paintMusicPicker() {
    const box = $("#musicPicker");
    if (!box) return;
    const src = currentMusicSrc();
    box.innerHTML = playlist().map((song) => {
      const on = audio && audio.playing && song.src === src;
      return "<button type=\"button\" class=\"music-item" + (on ? " on" : "") + "\" data-src=\"" + song.src + "\">" +
        (on ? "♫ " : "") + (song.name || "未命名") +
        "</button>";
    }).join("");
  }

  function toggleMusicPicker() {
    const box = $("#musicPicker");
    if (!box) return;
    const open = box.classList.contains("hidden");
    if (open) {
      paintMusicPicker();
      box.classList.remove("hidden");
    } else {
      box.classList.add("hidden");
    }
  }

  function bindChrome() {
    audio = new MusicBox();
    const btn = $("#musicBtn");
    const picker = $("#musicPicker");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (site().musicEnabled === false) return;
      toggleMusicPicker();
    });
    if (picker) {
      picker.addEventListener("click", (e) => {
        e.stopPropagation();
        const item = e.target.closest("[data-src]");
        if (!item) return;
        const src = item.dataset.src;
        const same = currentMusicSrc() === src && audio.playing;
        if (same) {
          audio.stop();
          btn.textContent = "♪";
          speak("先这样静一静也很好。");
        } else {
          audio.setSrc(src);
          audio.start();
          btn.textContent = "♫";
          btn.classList.remove("pulse");
          const song = playlist().find((s) => s.src === src);
          speak((song && song.name ? song.name : "歌") + "响起来了。");
        }
        paintMusicPicker();
      });
    }
    document.addEventListener("click", () => {
      if (picker) picker.classList.add("hidden");
    });
    $("#themeBtn").addEventListener("click", () => {
      document.body.classList.toggle("night");
      const night = document.body.classList.contains("night");
      $("#themeBtn").textContent = night ? "☀" : "☾";
      speak(night ? "夜晚也很好。" : "白天又回来了。");
    });
  }

  function burst(el) {
    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    for (let i = 0; i < 14; i += 1) fx.burst(x, y);
  }

  function sakuraStorm() {
    for (let i = 0; i < 70; i += 1) fx.parts.push(fx.petal(true));
  }

  const fx = {
    canvas: $("#fx"),
    ctx: null,
    parts: [],
    init() {
      this.ctx = this.canvas.getContext("2d");
      const resize = () => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      };
      resize();
      window.addEventListener("resize", resize);
      for (let i = 0; i < 40; i += 1) this.parts.push(this.petal());
      document.addEventListener("pointermove", (e) => {
        if (Math.random() > 0.62) this.parts.push(this.spark(e.clientX, e.clientY, "trail"));
      });
      document.addEventListener("click", (e) => {
        if (e.target.closest("button, input, a, .polaroid, .print, .word-card, .vn-box")) return;
        for (let i = 0; i < 8; i += 1) this.burst(e.clientX, e.clientY);
      });
      const loop = () => {
        this.draw();
        requestAnimationFrame(loop);
      };
      loop();
    },
    petal(storm) {
      return {
        kind: "petal",
        storm: !!storm,
        x: Math.random() * window.innerWidth,
        y: storm ? (-30 - Math.random() * 240) : Math.random() * window.innerHeight,
        r: (storm ? 6 : 4) + Math.random() * 6,
        s: (storm ? 1.3 : 0.4) + Math.random() * (storm ? 1.8 : 0.8),
        a: Math.random() * Math.PI * 2,
        life: storm ? 280 : 9999
      };
    },
    spark(x, y, kind) {
      return {
        kind,
        x,
        y,
        r: 2 + Math.random() * 4,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4 - 1,
        life: 40 + Math.random() * 20
      };
    },
    burst(x, y) {
      this.parts.push(this.spark(x, y, "burst"));
    },
    draw() {
      const { ctx, canvas } = this;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.parts = this.parts.filter((p) => {
        if (p.kind === "petal") {
          p.y += p.s;
          p.x += Math.sin(p.y / 30) * 0.6;
          p.a += 0.02;
          if (p.storm) p.life -= 1;
          if (p.y > canvas.height + 10) {
            if (p.storm) return false;
            p.y = -10;
            p.x = Math.random() * canvas.width;
          }
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.a);
          ctx.fillStyle = p.storm ? "rgba(255, 140, 176, 0.72)" : "rgba(255, 155, 184, 0.55)";
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r * 0.55, p.r, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          return p.storm ? p.life > 0 : true;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        ctx.fillStyle = p.kind === "trail" ? "rgba(255, 183, 204, 0.45)" : "rgba(239, 109, 150, 0.7)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        return p.life > 0;
      });
    }
  };

  function boot() {
    safe(fillText);
    safe(buildNav);
    safe(renderTime);
    safe(renderMemories);
    safe(bindApps);
    safe(bindMascot);
    safe(bindGate);
    safe(bindChrome);
    safe(() => fx.init());
    startFlow();
  }

  boot();
})();
