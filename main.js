// data:

const PREFIX = "https://ttatsf.github.io/bonden/media/mp3s/akita";
const SUFFIX = ".wav.mp3";
const SONGS = [
  { title: "三吉節（秋田市）", name: "23-5" },
  { title: "女米木梵天唄（秋田市雄和）", name: "24-7" },
  { title: "梵天歌（八郎潟町）", name: "20-6" },
  { title: "梵天上げ歌（大仙市刈和野）", name: "40-2" },
  { title: "梵天歌１（大仙市神宮寺）", name: "46-25" },
  { title: "梵天歌２（同上）", name: "46-29" },
  { title: "梵天歌１（大仙市南外）", name: "48-50" },
  { title: "梵天歌２（同上）", name: "48-58" },
  { title: "梵天歌３（同上）", name: "49-59" },
  { title: "梵天歌（大仙市大曲）", name: "50-3" },
  { title: "梵天歌（大仙市太田）", name: "44-8" },
  { title: "梵天歌（大仙市長野）", name: "42-5" },
  { title: "梵天歌（仙北市田沢湖生保内）", name: "35-32" },
  { title: "梵天あげ歌（美郷町六郷）", name: "51-3" },
  { title: "梵天歌１（横手市横手）", name: "52-9" },
  { title: "梵天歌２（同上）", name: "52-11" },
  { title: "梵天歌（横手市山内）", name: "54-30" },
];

// model:

const init = {
  index: undefined,
  isplaying: false,
};

// update: Msg -> Model -> Model

const Clicked = Symbol("clicked");
const Ended = Symbol("ended");
const Started = Symbol("started");
const Stopped = Symbol("stopped");
const Reset = Symbol("reset");

const update =
  ([msg, i]) =>
  (model) =>
    msg === Ended
      ? stop(model.index)
      : msg === Clicked
        ? !model.isplaying
          ? play(i)
          : model.index === i
            ? stop(model.index)
            : (stop(model.index), play(i))
        : msg === Started
          ? { ...model, index: i, isplaying: true }
          : msg === Stopped
            ? { ...model, isplaying: false }
            : model;

// Cmd: a -> Model
const stop = (i) => {
  const a = document.getElementById(`a${i}`);
  a.pause();
  a.currentTime = 0;
  return sendMsg([Stopped, undefined]);
};

const play = (i) => {
  document.getElementById(`a${i}`).play();
  return sendMsg([Started, i]);
};

// view-functions:
const putButtonsNAudios = (parent) => (prefix) => (songs) => (suffix) => [
  putButtons(parent)(songs),
  putAudios(parent)(prefix)(songs)(suffix),
];

const putButtons = (parent) => (songs) =>
  songs.map((e, i) => {
    const b = document.createElement("button");
    b.className = "button";
    b.id = `b${i}`;
    b.textContent = `${i + 1}. ${e.title}`;
    b.onclick = () => sendMsg([Clicked, i]);
    return parent.appendChild(b);
  });

const putAudios = (parent) => (prefix) => (songs) => (suffix) =>
  songs.map((e, i) => {
    const a = new Audio(`${prefix}${e.name}${suffix}`);
    a.className = "audio";
    a.id = `a${i}`;
    a.onended = () => sendMsg([Ended, undefined]);
    return parent.appendChild(a);
  });

// view-construction:

const _baseDiv = document.createElement("div");
_baseDiv.className = "buttons";
const baseDiv = document.body.appendChild(_baseDiv);
/*const [BUTTONS, AUDIOS] = */
putButtonsNAudios(baseDiv)(PREFIX)(SONGS)(SUFFIX);

// view: Model -> ()

const view = (model) => {
  if (model.index !== undefined) {
    document.getElementById(`b${model.index}`).className = model.isplaying
      ? "button playing"
      : "button";
  }
};

// main: Model -> Msg -> Model

const browserElement = (model) => (msg) => {
  model = update(msg)(model);
  view(model);
  return model;
};

const sendMsg = browserElement(init);

sendMsg([Reset, 0]);
