import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { PrefetchMixin } from '../prefetch-mixin.js';
import { SirenEntityMixin } from '../siren-entity-mixin.js';
import '../course-name.js';
import './activity-card.js';
import '@polymer/paper-item/paper-item.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/* @mixes PrefetchMixin
   @mixes SirenEntityMixin */
class UserActivityUsage extends PrefetchMixin(SirenEntityMixin(PolymerElement)) {
	static get template() {
		return html`
        <style>
            :host {
                display: block;
                overflow:hidden;
            }

            .info-box {
                display: flex;
                padding: 10px;
                width: 100%;
            }

            .info-box > * {
                align-self: center;
            }

            .completion {
                padding: 10px;
                border-radius: 10px;
                color:white;
                font-weight: 400;
                width: max-content;
            }

            .right-space {
                margin-right: 10px;
                align-self: center;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .completion-info {
                flex: 1; display: flex;
            }
            @media (max-width:800px) {
                .completion-info {
                    flex: 1;
                    display: block;
                }
                .info-box {
                    display: block;
                }
            }
        </style>


        <paper-item>
            <div class="info-box">
                <div class="completion-info">
                    <div class="right-space">
                        <template is="dom-if" if="{{complete}}">
                            <div class="completion" style="background: #46A661;">COMPLETE</div>
                        </template>
                        <template is="dom-if" if="{{!complete}}">
                            <div class="completion" style="background: #CD2026;">NOT COMPLETE</div>
                        </template>
                    </div>
                    <d2l-activity-card class="right-space" href="{{activityHref}}" token="{{token}}" style="font-weight: bold"></d2l-activity-card>
                    <span style="align-self: center;">in&nbsp;</span><d2l-course-name href="{{organizationHref}}" token="{{token}}" class="right-space"></d2l-course-name>
                </div>
                <span style="display: inline-block;">Due [[dueDate]]</span>
            </div>
        </paper-item>
`;
	}

	static get interesting() {
		return [
			{
				getLinks: entity => entity.getLinkByRel('https://api.brightspace.com/rels/assignment'),
				elements: [window.customElements.get('d2l-activity-card')]
			}, {
				getLinks: entity => entity.getLinkByRel('https://api.brightspace.com/rels/quiz'),
				elements: [window.customElements.get('d2l-activity-card')]
			}, {
				getLinks: entity => entity.getLinkByRel('https://api.brightspace.com/rels/organization'),
				elements: [window.customElements.get('d2l-course-name')]
			}
		];
	}

	static get is() { return 'd2l-user-activity-usage'; }

	static get properties() {
		return {
			activityHref: String,
			complete: Boolean,
			dueDate: String,
			organizationHref: String
		};
	}

	static get observers() {
		return [
			'_changed(entity)'
		];
	}

	_changed(entity) {
		if (entity.hasSubEntityByClass('due-date')) {
			var dateEntity = entity.getSubEntityByClass('due-date');
			if (dateEntity) {
				var uglyAssDate = dateEntity.properties.date;
				this.dueDate = new Intl.DateTimeFormat(this.locale, { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false }).format(new Date(uglyAssDate));
			}
		}
		if (entity.hasLinkByRel('https://api.brightspace.com/rels/assignment')) {
			this.activityHref = entity.getLinkByRel('https://api.brightspace.com/rels/assignment').href;
		} else if (entity.hasLinkByRel('https://api.brightspace.com/rels/quiz')) {
			this.activityHref = entity.getLinkByRel('https://api.brightspace.com/rels/quiz').href;
		}
		if (entity.hasLinkByRel('https://api.brightspace.com/rels/organization')) {
			this.organizationHref = entity.getLinkByRel('https://api.brightspace.com/rels/organization').href;
		}

		this.complete = entity.hasSubEntityByClass('complete');
	}
}

window.customElements.define(UserActivityUsage.is, UserActivityUsage);