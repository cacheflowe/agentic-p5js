// Sketch loader + menu
//
// Picks a sketch with a query param, using the file name without ".js":
//   /?sketch=sketch
//   /?sketch=sketch-gpu-particles
// With no query param, the default sketch loads.

const defaultSketch = "sketch";

// Vite finds every .js file in src/ (except this one) when the page loads.
// Each entry is a function that loads that sketch file when called.
const sketchFiles = import.meta.glob(["./*.js", "!./main.js"]);

// "./sketch-gpu-particles.js" -> "sketch-gpu-particles"
const sketchNames = Object.keys(sketchFiles).map((path) =>
  path.replace("./", "").replace(".js", ""),
);

const params = new URLSearchParams(window.location.search);
const sketchName = params.get("sketch") || defaultSketch;

// load the chosen sketch
const loadSketch = sketchFiles[`./${sketchName}.js`];
if (loadSketch) {
  loadSketch();
} else {
  console.error(`No sketch named "src/${sketchName}.js"`);
}

// build the hamburger menu
const menu = document.createElement("details");
menu.className = "sketch-menu";
menu.innerHTML = `<summary>☰</summary>`;
for (let name of sketchNames) {
  let link = document.createElement("a");
  link.href = `?sketch=${name}`;
  link.textContent = name;
  if (name === sketchName) link.className = "active";
  menu.append(link);
}
document.body.append(menu);
