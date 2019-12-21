const runner = {
  running: false
};

function startRunner() {
  registerRunnerElements();
}

function registerRunnerElements() {
  let radioButtons = document.getElementsByName("mode");

  Array.from(radioButtons).forEach(el => {
    el.addEventListener('change', (event) => {
      let value = event.target.value;
      // runner.running = value === "run";
      
    })
  });
}