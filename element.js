customElements.define("countdown-timer", class extends HTMLElement {
    connectedCallback() {
        let labels = this.getAttribute("labels")?.split(",");
        let tag = ({ name = "div", id, append = [], ...props }) => {
            this[id] = Object.assign(document.createElement(name), { id, ...props });
            this[id].append(...append);
            this[id].setAttribute("part", id);
            return this[id];
        }
        let prop = (name, value, str = `var(--countdown-timer-${name},${value})`) => (console.log(str), str);
        this.attachShadow({ mode: "open" }).append(
            tag({
                name: "style",
                innerHTML: `:host {font-family:${prop("font", "arial")},sans-serif;text-align:center;font-size:${prop("font-size", "2.5rem")};` +
                    `display:inline-block;width:${prop("width", "auto")}}` +
                    `#event{padding:0 1rem;background:${prop("event-background", "gold")};color:${prop("event-color", "black")}}` +
                    `#counters{display:grid;grid:1fr/repeat(4,auto);` +
                    `background:${prop("counters-background", "green")};color:${prop("counters-color", "white")}}` +
                    `[part*="label"]{padding:0 1em;font-size:${prop("label-font-size", "35%")}}`
            }),
            tag({ id: "event", innerHTML: this.getAttribute("event") || "New Year" }),
            tag({
                id: "counters", append: ["days", "hours", "minutes", "seconds"].map((id, idx, times) => tag({
                    id: id + "date",
                    append: [
                        tag({ id, innerHTML: "0" }), // "days", "hours", "minutes", "seconds"
                        tag({
                            id: id + "label",
                            innerHTML: (labels || times)[times.indexOf(id)].toUpperCase()
                        })]
                }))
            }))
        let date = new Date(this.getAttribute("date") || "2024-1-1").getTime();
        let minute = 1e3 * 60, hour = minute * 60, day = hour * 24;
        let timer = setInterval(() => {
            let remain = date - (new Date().getTime());
            this.days.innerHTML = ~~(remain / day);
            this.hours.innerHTML = ~~((remain % day) / hour);
            this.minutes.innerHTML = ~~((remain % hour) / minute);
            this.seconds.innerHTML = ~~((remain % minute) / 1e3);
            if (remain < 0) clearInterval(timer);
        }, 1e3);
    }
})