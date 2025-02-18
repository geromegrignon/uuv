import { AccessibleRole } from "../../../../step-definition-generator/accessible-role";

enum DEFINITE_ARTICLE {
    THE = "the"
}

enum INDEFINITE_ARTICLE {
    A = "a",
    AN = "an"
}


class EnAccessibleRole extends AccessibleRole {
    definiteArticle: DEFINITE_ARTICLE = DEFINITE_ARTICLE.THE;
    indefiniteArticle: INDEFINITE_ARTICLE = INDEFINITE_ARTICLE.A;

    constructor(id: string, name: string, definiteArticle?: DEFINITE_ARTICLE, indefiniteArticle?: INDEFINITE_ARTICLE) {
        super();
        this.id = id;
        this.name = name;
        if (definiteArticle) {
            this.definiteArticle = definiteArticle;
        }
        if (indefiniteArticle) {
            this.indefiniteArticle = indefiniteArticle;
        }
    }

    public static from(input: any) : AccessibleRole {
        return new EnAccessibleRole(
            input.id,
            input.name,
            input.definiteArticle,
            input.indefiniteArticle,
        );
    }

    override getDefiniteArticle(): string {
        return this.definiteArticle.toString();
    }

    override getIndefiniteArticle(): string {
        return this.indefiniteArticle.toString();
    }

    override getOfDefiniteArticle(): string {
        return `of ${this.definiteArticle}`;
    }

    override namedAdjective(): string {
        return "named";
    }
}

export const EN_ROLES: AccessibleRole[] = [
    { id: "alert", name: "alert", indefiniteArticle: INDEFINITE_ARTICLE.AN },
    { id: "alertdialog", name: "alert dialog", indefiniteArticle: INDEFINITE_ARTICLE.AN },
    { id: "application", name: "application", indefiniteArticle: INDEFINITE_ARTICLE.AN },
    { id: "article", name: "article", indefiniteArticle: INDEFINITE_ARTICLE.AN },
    { id: "banner", name: "banner" },
    { id: "button", name: "button" },
    { id: "cell", name: "cell" },
    { id: "checkbox", name: "checkbox" },
    { id: "columnheader", name: "column header" },
    { id: "combobox", name: "combo box" },
    { id: "command", name: "command" },
    { id: "comment", name: "comment" },
    { id: "complementary", name: "complementary" },
    { id: "composite", name: "composite" },
    { id: "contentinfo", name: "contentinfo" },
    { id: "definition", name: "definition" },
    { id: "dialog", name: "dialog" },
    { id: "directory", name: "directory" },
    { id: "document", name: "document" },
    { id: "feed", name: "flow" },
    { id: "figure", name: "figure" },
    { id: "form", name: "form" },
    { id: "generic", name: "generic" },
    { id: "grid", name: "grid" },
    { id: "gridcell", name: "grid cell" },
    { id: "group", name: "group" },
    { id: "heading", name: "title" },
    { id: "img", name: "picture" },
    { id: "input", name: "entry", indefiniteArticle: INDEFINITE_ARTICLE.AN },
    { id: "landmark", name: "landmark" },
    { id: "link", name: "link" },
    { id: "list", name: "list" },
    { id: "listbox", name: "list box" },
    { id: "listitem", name: "list item" },
    { id: "log", name: "log" },
    { id: "main", name: "main" },
    { id: "mark", name: "mark" },
    { id: "math", name: "math" },
    { id: "menu", name: "menu" },
    { id: "menubar", name: "menubar" },
    { id: "menuitem", name: "menuitem" },
    { id: "menuitemcheckbox", name: "menuitemcheckbox" },
    { id: "menuitemradio", name: "menuitemradio" },
    { id: "meter", name: "counter" },
    { id: "navigation", name: "navigation" },
    { id: "none", name: "no" },
    { id: "note", name: "note" },
    { id: "option", name: "option", indefiniteArticle: INDEFINITE_ARTICLE.AN },
    { id: "presentation", name: "presentation" },
    { id: "progressbar", name: "progress bar" },
    { id: "radio", name: "radio" },
    { id: "radiogroup", name: "radio group" },
    { id: "range", name: "range" },
    { id: "region", name: "region" },
    { id: "roletype", name: "role type" },
    { id: "row", name: "row" },
    { id: "rowgroup", name: "row group" },
    { id: "rowheader", name: "row header" },
    { id: "scrollbar", name: "scroll bar" },
    { id: "search", name: "search" },
    { id: "searchbox", name: "search box" },
    { id: "section", name: "section" },
    { id: "sectionhead", name: "section header" },
    { id: "select", name: "select" },
    { id: "separator", name: "separator" },
    { id: "slider", name: "slider" },
    { id: "spinbutton", name: "spin button" },
    { id: "status", name: "status" },
    { id: "structure", name: "structure" },
    { id: "suggestion", name: "suggestion" },
    { id: "switch", name: "switch" },
    { id: "tab", name: "tab" },
    { id: "table", name: "table" },
    { id: "tablist", name: "tablist" },
    { id: "tabpanel", name: "tabpanel" },
    { id: "term", name: "term" },
    { id: "textbox", name: "text box" },
    { id: "timer", name: "timer" },
    { id: "toolbar", name: "toolbar" },
    { id: "tooltip", name: "tooltip" },
    { id: "tree", name: "tree" },
    { id: "treegrid", name: "tree grid" },
    { id: "treeitem", name: "tree item" },
    { id: "widget", name: "widget" },
    { id: "window", name: "window" }
].map(role => EnAccessibleRole.from(role));
