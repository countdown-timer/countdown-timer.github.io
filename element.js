customElements.define("countdown-timer", class extends HTMLElement {
    connectedCallback() {
        let countlabels = this.getAttribute("count")?.split(",")
            || ["years", "days", "hours", "minutes", "seconds"].filter(label => !this.hasAttribute("no" + label));
        let labels = this.getAttribute("labels")?.split(",") || countlabels;
        countlabels = countlabels.slice(-1 * (labels.length));

        let tag = ({ name = "div", id, append = [], ...props }) => {
            this[id] = Object.assign(document.createElement(name), { id, ...props });
            this[id].append(...append);
            this[id].setAttribute("part", id);
            return this[id];
        }
        let prop = (name, value, str = `var(--countdown-timer-${name},${value})`) => {
            //console.log(str);
            return str
        };
        this.attachShadow({ mode: "open" }).append(
            tag({
                name: "style",
                innerHTML: `:host {font-family:${prop("font", "arial")},sans-serif;text-align:center;font-size:${prop("font-size", "2.5rem")};` +
                    `display:inline-block;width:${prop("width", "auto")}}` +
                    `#event{padding:0 1rem;background:${prop("event-background", "gold")};color:${prop("event-color", "black")}}` +
                    `#counters{display:grid;grid:1fr/repeat(${countlabels.length},1fr);` +
                    `background:${prop("counters-background", "green")};color:${prop("counters-color", "white")}}` +
                    `[part*="label"]{padding:${prop("label-padding", "0 1em")};font-size:${prop("label-font-size", "35%")}}`
            }),
            tag({ id: "event", innerHTML: this.getAttribute("event") || "New Year" }),
            tag({
                id: "counters", append: countlabels.map((id, idx, times) => tag({
                    id: id + "date",
                    append: [
                        tag({ id, innerHTML: "0" }), // "days", "hours", "minutes", "seconds"
                        tag({
                            id: id + "label",
                            innerHTML: ((labels || countlabels)[countlabels.indexOf(id)] || "").toUpperCase()
                        })]
                }))
            }))
        let futureDate = new Date(this.getAttribute("date") || "2024-1-1");
        let timer = setInterval(() => {
            let diff = this.timedifference(futureDate);
            countlabels.map(label => this[label].innerHTML = diff[label]);
            if ((diff.minutes == 0) && (diff.seconds == 0)) clearInterval(timer);
        }, 1e3);
    }
    timedifference(futureDate, startDate = new Date()) {
        let future = new Date(futureDate);
        let now = new Date(startDate);
        let diff = future - now;
        let day = 1000 * 60 * 60 * 24;
        let timediff = {
            years: ~~(diff / (day * 365))
        }
        diff -= timediff.years * day * 365;
        let leapYears = 0;
        for (let i = now.getFullYear(); i < future.getFullYear(); i++)
            ((i % 4 === 0 && i % 100 !== 0) || i % 400 === 0) && leapYears++;
        timediff.days = ~~(diff / day) + leapYears;
        diff -= (timediff.days - leapYears) * day;
        timediff.hours = ~~(diff / (1000 * 60 * 60));
        diff -= timediff.hours * 1000 * 60 * 60;
        timediff.minutes = ~~(diff / (1000 * 60));
        diff -= timediff.minutes * 1000 * 60;
        timediff.seconds = ~~(diff / 1000);
        return timediff;
    }
})