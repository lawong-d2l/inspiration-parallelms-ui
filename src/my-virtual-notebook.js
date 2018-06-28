import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {SirenEntityMixin} from './siren-entity-mixin.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
import './notes/note.js';
import './notes/note-create-self.js'

class MyVirtualNotebook extends SirenEntityMixin(PolymerElement) {

	static get template() {
		return html`
<h1>My Virtual Notebook</h1>
<h2>Write Notes to Self:</h2>
<d2l-note-create-self href="https://notes.api.dev.brightspace.com/" token="[[token]]"></d2l-note-create-self>
<h2>Notes:</h2>
Sort By:
<select id="orderBy" on-change="_updateOrder">
  <option value={{const.DATE_DESC}}>Recent</option>
  <option value={{const.DATE_ASC}}>Oldest</option>
</select>
<template id="tt" is="dom-repeat" items="[[notes]]" as="note" >
	<d2l-note id="note{{index}}" href="{{note}}" token="{{token}}"></d2l-note>
</template>
`;
	}

	static get properties() {
		return {
			href: {
				type: String
			},
			notes: {
				type: Array,
				value: []
			},
			const: {
				type: Object,
				value: {
					DATE_DESC: 'date-desc',
					DATE_ASC: 'date-asc'
				}
			}
		};
	}

	static get observers() {
		return [
			'_changed(entity)'
		];
	}

	static get is() {
		return 'my-virtual-notebook';
	}

	_changed(entity) {
		if (entity && entity.entities) {
			this.notes = entity.entities.map(subEntity => subEntity.href);
		}
	}

	_updateOrder() {
		const sortOrder = this.$.orderBy.value;

		const url = new URL(this.href);
		url.searchParams.set('sortBy', sortOrder);

		this.href = url.toString();
	}

}

window.customElements.define(MyVirtualNotebook.is, MyVirtualNotebook);
