import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { LocalizationMixin } from '../localization-mixin.js';
import { SirenEntityMixin } from '../siren-entity-mixin.js';
import { SirenActionMixin } from '../siren-action-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import './note-delete.js';

/* @mixes LocalizationMixin
   @mixes SirenEntityMixin
   @mixes SirenActionMixin */
class Note extends LocalizationMixin(SirenActionMixin(SirenEntityMixin(PolymerElement))) {

	static get template() {
		return html`
		<style>
            :host {
                display: block;
            }
		</style>
        "[[text]]"
		- [[date]]
		<d2l-note-delete href="[[href]]"
		token="[[token]]">
		</d2l-note-delete>
`;
	}

	static get is() { return 'd2l-note'; }

	static get properties() {
		return {
			text: String,
			date: String
		};
	}

	static get observers() {
		return [
			'_changed(entity)'
		];
	}

	_changed(entity) {
		if (!entity.properties) return;
		this.text = entity.properties.text;
		this.date = this._formatDate(entity.getSubEntityByClass('create-date').properties.date, this.locale);
	}

	_getHrefByRel(entity, rel) {
		const link = entity && entity.getLinkByRel && entity.getLinkByRel(rel);
		return link && link.href || '';
	}

	// Leaving this guy in case we need it in the future
	_getActions(entity) {
		if (entity.entities[0] !== undefined) {
			return entity.entities[0].actions;
		} else {
			return [];
		}
	}
}

window.customElements.define(Note.is, Note);
