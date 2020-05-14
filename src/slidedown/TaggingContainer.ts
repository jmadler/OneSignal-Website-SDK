import TagCategory from '../models/TagCategory';
import { addDomElement } from '../utils';
import Log from '../libraries/Log';
import TagManager from '../managers/TagManager';

export default class TaggingContainer {
    private html: string;

    constructor(remoteTagCategories: Array<TagCategory>, existingPlayerTags?: Object){
        const checkedTagCategories = !!existingPlayerTags ?
            remoteTagCategories.map(elem => {
                elem.checked = Object.keys(existingPlayerTags).indexOf(elem.tag) !== -1 ? true : false;
                return elem;
            })
            : remoteTagCategories;
        const firstColumnArr = checkedTagCategories.filter(elem => checkedTagCategories.indexOf(elem) % 2 === 0);
        const secondColumnArr = checkedTagCategories.filter(elem => checkedTagCategories.indexOf(elem) % 2);
        let innerHtml = `<div class="tagging-container-col">`;

        for (const elem of firstColumnArr) {
            innerHtml+=this.getCategoryLabelHtml(elem);
        }

        innerHtml+=`</div><div class="tagging-container-col">`;

        for (const elem of secondColumnArr) {
            innerHtml+=this.getCategoryLabelHtml(elem);
        }

        this.html = `<div class="tagging-container">${innerHtml}</div></div>`;
    }

    public mount(): void {
        addDomElement('#slidedown-body', 'beforeend', this.html);
        if (this.taggingContainer) {
            this.taggingContainer.addEventListener('click', this.toggleCheckedTag);
        }
        // TO DO: remove loading state styling
    }

    private getCategoryLabelHtml(tagCategory: TagCategory): string {
        const isChecked = tagCategory.checked ? 'checked' : '';
        const label = tagCategory.label.length >= 19 ? `${tagCategory.label.slice(0,19)}...` : tagCategory.label;
        return `<label class="onesignal-category-label">${label}
        <input type="checkbox" value="${tagCategory.tag}" ${isChecked}>
        <span class="onesignal-checkmark"></span></label>`;
    }

    private get taggingContainer(){
        return document.querySelector("#slidedown-body > div.tagging-container");
    }

    private toggleCheckedTag(e: Event) {
        if (e.srcElement && e.srcElement.getAttribute("type") === "checkbox") {
            const tag = e.srcElement.getAttribute("value");
            OneSignal.context.tagManager.toggleCheckedTag(tag);
        }
    }
}