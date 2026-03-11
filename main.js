const sceneDiv = document.getElementById('scene');
const choicesDiv = document.getElementById('choices');

// simple story structure
const story = [
  {
    text: "You wake up in a mysterious room. There are two doors in front of you.",
    choices: [
      { text: "Open the left door", next: 1 },
      { text: "Open the right door", next: 2 }
    ]
  },
  {
    text: "Behind the left door, you find a strange message written on the wall.",
    choices: [
      { text: "Read the message", next: 3 },
      { text: "Ignore it and move on", next: 3 }
    ]
  },
  {
    text: "Behind the right door, you find another character who seems suspicious.",
    choices: [
      { text: "Talk to them", next: 3 },
      { text: "Run away", next: 3 }
    ]
  },
  {
    text: "End of this mini demo. You can restart to try other choices.",
    choices: [
      { text: "Restart", next: 0 }
    ]
  }
];

// function to display the scene
function showScene(index) {
  const scene = story[index];
  sceneDiv.textContent = scene.text;
  choicesDiv.innerHTML = "";
  
  scene.choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.textContent = choice.text;
    btn.onclick = () => showScene(choice.next);
    choicesDiv.appendChild(btn);
  });
}

// start the story
showScene(0);
