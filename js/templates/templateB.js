/* THE HUMAN ARCHIVE — TEMPLATE B: CHRONO SLIDER */
(() => {
  "use strict";
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = String(text); return n; };
  window.THATemplates = window.THATemplates || {};
  window.THATemplates.TemplateB = Object.freeze({
    id: "B",
    name: "Chrono Slider",
    createTimeline({ stops = [], onChange } = {}) {
      const root = el("section", "tha-template-b tha-chrono-slider");
      const range = document.createElement("input");
      range.type = "range"; range.min = "0"; range.max = String(Math.max(0, stops.length - 1)); range.step = "1"; range.value = "0";
      range.setAttribute("aria-label", "Move through mission timeline");
      const output = el("article", "tha-chrono-stop");
      const update = (index) => {
        const stop = stops[index];
        output.replaceChildren();
        if (stop) output.append(el("p", "tha-template-kicker", stop.date || `STOP ${index + 1}`), el("h3", "", stop.title || "Mission event"), el("p", "", stop.text || ""));
        onChange?.(stop, index);
      };
      range.addEventListener("input", () => update(Number(range.value)));
      root.append(range, output);
      if (stops.length) update(0);
      return root;
    }
  });
})();
