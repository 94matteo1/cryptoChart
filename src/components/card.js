export function createCard() {


    const card_Component = document.createElement('template');

    card_Component.innerHTML = `

    <style>

    .custom-props{
        --width:null;
        --height:null;
    }

    .background{
        margin-top:10px;
        width:var(--width);
        height:var(--height);
        color: rgb(1,1,1);
        border-radius:16px;
        box-shadow:  10px 10px 27px #e1e1e3, -10px -10px 27px #e1e1e3;
        display:flex;
        justify-content:center;
        align-items:center;
    }
    
    </style>
    
    <div class="background" id="background">
        <slot name="my-custom-webcomp"></slot>
    </div>

    `;


    customElements.define('simple-card',
        class extends HTMLElement {
            constructor() {
                super();


                const templateContent = card_Component.content;



                this.attachShadow({
                    mode: 'open'
                }).appendChild(
                    templateContent.cloneNode(true)
                );
            }

            connectedCallback() {
                this.setStyleData();
            };

            setStyleData() {
                var background = this.shadowRoot.getElementById('background');

                background.style.setProperty("--width", this.getAttribute("width"));
                background.style.setProperty("--height", this.getAttribute("height"));

            }


        }
    );
}
