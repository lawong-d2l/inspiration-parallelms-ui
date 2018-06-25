import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import { SirenEntityMixin } from './siren-entity-mixin.js';
import './user/user-first-name.js';
import './user/user-image.js';
import './notes/note.js';
import './my-app-main-page.js';
import { PrefetchMixin } from './prefetch-mixin.js';
import './shared-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/* @mixes PrefetchMixin
   @mixes SirenEntityMixin */
class WelcomePage extends PrefetchMixin(SirenEntityMixin(PolymerElement)) {
	static get template() {
		return html`
        <style include="shared-styles">
            :host {
                display: block;
                overflow: hidden;
            }
            .welcome-container {
                width: 300px;
                height: auto;
                margin-left: auto;
                margin-right: auto;
            }
            .welcome-message {
                text-align: center;
                font-weight: lighter;
                font-size: 40px;
            }
            .user-image {
                border-radius: 50%;
                overflow: hidden;
                width: 300px;
                height: 300px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: center;
                flex: 1 1 auto;
            }
            .go-button {
                background-color: cornflowerblue;
                color: white;
                height: 100%;
                width: 100%;
                margin-top: 30px;
            }
        </style>
        <div class="welcome-container">
            <h2 class="welcome-message invisible" id="welcome">Welcome, <d2l-user-first-name href="{{whoami.href}}" token="{{token}}"></d2l-user-first-name></h2>
            <d2l-user-image id="image" class="user-image invisible" href="{{whoami.href}}" token="{{token}}"></d2l-user-image>
            <paper-button id="go" class="go-button invisible" on-tap="_goToLandingPage">I'm Ready</paper-button>
		</div>
		<d2l-note href="https://notes.api.dev.brightspace.com/notes/c431840b-e939-4d87-a3e7-19649b765bdd"
		token="[[token]]"></d2l-note>
		<d2l-note href="https://notes.api.dev.brightspace.com/notes/58f8c32c-2334-49a1-a459-ba97f9f33871"
		token="[[token]]"></d2l-note>
		<d2l-note href="https://notes.api.dev.brightspace.com/notes/eeab8d84-a9b0-49e6-88a3-f936b07a12a0"
		token="[[token]]"></d2l-note>
		<d2l-note href="https://notes.api.dev.brightspace.com/notes/ddc0a2dd-5926-4594-8e83-a4813f534ca3"
		token="[[token]]"></d2l-note>
        <slot></slot>
`;
	}

	static get interesting() {
		return [
			{
				getLinks: entity => entity.getLinkByRel('self'),
				elements: [window.customElements.get('my-app-main-page')] // We link to it, so we need to prefetch it
			}, {
				getLinks: entity => entity.getLinkByRel('https://api.brightspace.com/rels/whoami'),
				elements: [window.customElements.get('d2l-user-image')]
			}
		];
	}

	static get is() { return 'my-welcome-page'; }

	static get properties() {
		return {
			token: {
				type: String,
				notify: true
			},
			href: {
				type: String
			},
			whoami: {
				type: Object,
				computed: '_getLinkByRel(entity, "https://api.brightspace.com/rels/whoami")',
				notify: true
			},
			route: Object
		};
	}

	static get observers() {
		return [
			'_changed(entity)'
		];
	}

	_changed() {
		this._animateShit();
	}

	_goToLandingPage() {
		var self = this;
		this._animateShitOut();
		setTimeout(function() {
			self.set('route.path', 'app-main-page');
			self.$.welcome.classList.remove('bounceOutRight');
			self.$.image.classList.remove('bounceOutRight');
			self.$.go.classList.remove('bounceOutRight');
		}, 3000);
	}

	_animateShit() {
		var self = this;
		var delay = 500;
		var animation = 'bounceInLeft';
		setTimeout(function() {
			self.$.welcome.classList.add(animation);
			self.$.welcome.classList.add('animated');
			self.$.welcome.classList.remove('invisible');

			setTimeout(function() {
				self.$.image.classList.add(animation);
				self.$.image.classList.add('animated');
				self.$.image.classList.remove('invisible');

				setTimeout(function() {
					self.$.go.classList.add(animation);
					self.$.go.classList.add('animated');
					self.$.go.classList.remove('invisible');
				}, delay);
			}, delay);
		}, delay);
	}

	_animateShitOut() {
		var self = this;
		var delay = 500;
		var animation = 'bounceOutRight';
		setTimeout(function() {
			self.$.welcome.classList.remove('bounceInLeft');
			self.$.welcome.classList.add(animation);
			self.$.welcome.classList.add('animated');

			setTimeout(function() {
				self.$.image.classList.remove('bounceInLeft');
				self.$.image.classList.add(animation);
				self.$.image.classList.add('animated');

				setTimeout(function() {
					self.$.go.classList.remove('bounceInLeft');
					self.$.go.classList.add(animation);
					self.$.go.classList.add('animated');
				}, delay);
			}, delay);
		}, delay);
	}
}

window.customElements.define(WelcomePage.is, WelcomePage);
