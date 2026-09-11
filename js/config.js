/**
 * 只改这一个文件，就能换成日期，和你想留给真真的话。
 *
 * 注意：双引号 "..." 里面不要再写英文双引号，否则整页会挂掉。
 * 字里如果要用引号，写成「这样」或 '这样'。
 *
 * 第一封信：下面这些字。
 * 第二封信：翻到文件末尾的 chapter2，改 letter，以及每张照片的 text。
 * 右上角音符可以选歌。要加歌，写进 playlist。
 */
window.SITE = {
  herName: "真真",
  myName: "狗晨",
  nickname: "真真",

  /* 留空就直接进封面；填上之后，打开网页要先输入这个小暗号 */
  secretWord: "",
  secretHint: "只有我们知道的那句",

  /* 相识 7.21 · 第一次见面 8.9 · 分别 8.29 */
  meetDate: "2026-07-21",
  firstMeetDate: "2026-08-09",
  partedDate: "2026-08-29",
  nextMeetDate: "2027-01-01",
  nextMeetLabel: "下次见面",
  specialDate: "2027-01-01",
  specialDateLabel: "下一个值得数着过的日子",

  pageTitle: "To 真真",
  subtitle: "一些适合慢慢看的内容",
  landingLine: "写在信封中的一些话",
  landingHint: "两封信都在这里，点开其中一封",

  letterTitle: "还没寄出的一封",
  letter: `真真：

还记得第一次和真真Call的北外滩的一晚！

在相识的那一天就在倒数分别的日子
遂很珍惜每一天

很感谢真真的出现
相识之后，晨老师给自己写下过几行话激励自己！

永远不要丧失从头再来的勇气
要沉着冷静，保持思考，坚持不懈，持续学习
努力为了和如此优秀完美的女性交往
这样每次想到真真就不自觉的想要
健康饮食，坚持锻炼，作息规律
希望追赶真真的动力变成习惯

以后的日子希望能保持这些习惯
也希望能和真真共勉

珍重。
`,

  makeupTitle: "之前欠下的hh，想说底妆很清透底很服帖！鼻翼这些容易卡粉的小细节都处理的很好（有仔细观察）很像原生皮肤！妆面质感超好（一共100字）",

  memories: [
    { title: "忆苏州河！", caption: "晨老师的视角", tag: "那晚", photo: "photo/IMG_20260828_091044.jpg", say: "在雨停之前" },
    { title: "心情预报", caption: "很喜欢的一张", tag: "EVE", photo: "photo/bird.jpg", say: "心予報。右上角的音符，可以让它响起来。" },
    { title: "一起努力", caption: "你好世界。", tag: "hello world", photo: "photo/together.jpg", say: "一起努力。这句话可以看两遍。" },
    { title: "雨天车窗", caption: "小兔！", tag: "简直是化身", photo: "photo/rain-chiikawa.jpg", say: "动力源泉！", egg: "10" },
    { title: "神秘状态", caption: "草莓", tag: "今天都会出现", photo: "photo/DSCF0026.JPG", say: "今天都会出现" },
    { title: "无职转生", caption: "看了共情的一张。", tag: "二次元", photo: "photo/meme.jpg", say: "认真生活！" },
    { title: "太氛围叻", caption: "Seasonal Limited。", tag: "桜", photo: "photo/DSCF0027.JPG", say: "~~~" }
  ],

  dialogue: [
    "慢慢看的一些话",
    "紧张是心脏在为你鼓掌",
    "摆脱焦虑的方法是，做好当下的事",
    "封面翻完了，后面还有几页",
    "碎片墙上的照片，点开能看全图",
    "右下角的小兔，会在你点东西的时候说话"
  ],

  eggs: [
    "封面左上那朵花，是第一颗。",
    "♡ 被找到了。",
    "星星也算一颗。",
    "云朵下面原来藏着这个。",
    "标题旁边的小心心，也算数。",
    "信纸上的星星亮了一下。",
    "蜡封打开过一次就够了。",
    "墙角那只更小的兔子，被你摸到了。",
    "纸条背面写着：北外滩记得带伞。",
    "一片樱花落到你手里了。",
    "像素小兔说：四叶草分你一半。"
  ],

  hiddenMessage: "真真是like星星一样buling的人，所以请不要经常自我否定和怀疑，如果在迷茫和踌躇的时候，请想到某个角落还有一直柴犬在一直支持真真！！",

  musicEnabled: true,
  musicSrc: "music/eve-kokoro-yohou.mp3",
  musicName: "心予報",
  playlist: [
    { name: "心予報", src: "music/eve-kokoro-yohou.mp3" },
    { name: "カタオモイ", src: "music/aimer-kataomoi.mp3" }
  ],

  /* ========== 第二封信（单独一册，和第一封分开）==========
   * 只改这里的 letter，以及每张照片的 text（写在照片下面）。
   */
  chapter2: {
    peek: "第二封",
    subtitle: "分别过后",
    fromLine: "狗晨",
    letterTitle: "第二封",
    makeupTag: " ",
    makeupTitle: "锻炼夸夸能力中————",
    albumTitle: "相册",
    albumHint: "",
    musicSrc: "music/aimer-kataomoi.mp3",
    musicName: "カタオモイ",
    loaderFrom: 20,
    loaderTo: 40,
    progressCopy: "从百分之二十，走到百分之四十。",
    eggs: [
      "封面上那枚小小的樱花印。",
      "蜡封也愿意被打开一次。",
      "日子走到今天之后，还有一颗没画上去的星。",
      "相册第一叠标题旁边，别着一颗。",
      "百分之四十的尽头，藏着一粒光。",
      "封面的日期，也可以点一下。",
      "from 后面那行字，也算一颗。",
      "第二叠相册的标题上，还有一颗。",
      "信末尾的署名，藏着一句。",
      "「日子的可视化」这几个字，也可以点。"
    ],
    hiddenMessage: `找到了浓浓的思念————`,
    letter: `真真：

恭喜顺利通过答辩！！
进入下一阶段————
期待真真的进步和成长
同时也希望自己可以保持恒心

继续保持思考，规律生活，持续学习
就这样坚持每一天一起努力下去罢————


珍重喔。
`,
    album: [
      {
        heading: "忆苏州河V2",
        copy: "一些视角！",
        shots: [
          { photo: "photo2/10207b566c13d7294fcb348aa3eb6234.jpg", text: "" },
          { photo: "photo2/15c20052e87c8ff659684a2f77486b42.jpg", text: "" },
          { photo: "photo2/6c698dc98ae663352740479bc59cce4a.jpg", text: "" },
          { photo: "photo2/922b6204fd067ff2160a6bd0bb3be9ac.jpg", text: "" }
        ]
      },
      {
        heading: "记录得美好瞬间",
        copy: "会爱上寿喜烧得———",
        shots: [
          { photo: "photo2/cb8eb34ad1bdbe64772b522ed74e65b8.jpg", text: "" },
          { photo: "photo2/69d235e048832cb2cddcc45fe62b1b49.jpg", text: "" },
          { photo: "photo2/c5cb4578eacc535922e446068e8ca113.jpg", text: "" },
          { photo: "photo2/aef051f89aea9fee0eafa5a07ccc8b95.jpg", text: "" }
        ]
      }
    ]
  }
};
