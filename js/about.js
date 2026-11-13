// About: timeline line draw handled by reveal in common.js
document
  .querySelectorAll(".tl")
  .forEach((t, i) => (t.style.transitionDelay = i * 120 + "ms"));
