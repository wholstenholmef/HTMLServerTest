class Poll{
    constructor(root, title){
        this.root = root;
        this.title = title;
        //Stores memory for selected option
        this.selected = sessionStorage.getItem("poll-selected");
        this.endpoint = "https://8985-45-5-174-126.ngrok-free.app/poll"

        this.root.insertAdjacentHTML("afterbegin", `
            <div class="poll__title">${ title }</div>
        `);
        this._refresh();
    }

    async _refresh(){
        const response = await fetch(this.endpoint, {
            headers:  new Headers({
                "ngrok-skip-browser-warning": "true",
            })
        });
        const data = await response.json();

        //Clear all options when refreshing page
        this.root.querySelectorAll(".poll__option").forEach(option => {
            option.remove();
        });

        for (const option of data){
            const template  = document.createElement("template");
            const fragment = template.content;

            //Indentation. == is equal to, ? is then, : is otherwise
            template.innerHTML = `
            <div class="poll__option ${ this.selected == option.label ? "poll__option--selected" : ""} "> 
                <div class="poll__option-fill"></div>
                <div class="poll__option-info">
                    <span class="poll__label"> ${ option.label } </span>
                    <span class="poll__percentage"> ${ option.percentage }% </span>
                </div>
            </div>
            `;

            if (!this.selected){
                fragment.querySelector(".poll__option").addEventListener("click", () => {
                    console.log(option);
                    fetch(this.endpoint, {
                        method: "post",
                        body: `add=${ option.label }`,
                        headers: new Headers({
                            "ngrok-skip-browser-warning": "true",
                            "Content-Type": "application/x-www-form-urlencoded"
                        })
                    }).then(() => {
                        this.selected = option.label;
                        sessionStorage.setItem("poll-selected", option.label);
                        this._refresh();
                    });
                });
            }

            fragment.querySelector(".poll__option-fill").style.width = `${ option.percentage }%`;
            this.root.appendChild(fragment);
        }
    }
}

const p = new Poll(
    document.querySelector(".poll"), 
    "¿Que final votas por ver?"
);