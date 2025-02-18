import { Observable } from "rxjs";
import {
    A11yRule,
    AutoCheckA11yRule,
    ManualCheckA11yRule,
    RuleCheckEnum,
    A11yResultStatus,
    A11yRuleResult,
    A11yReference
} from "../model/";

export class Engine {
    constructor(
        readonly targetUrl: string,
        readonly reference: A11yReference
    ) {
    }

    public buildCheckListItemFromRule(rule: A11yRule): Observable<A11yRuleResult> {
        return new Observable(observer => {
            const foundElements = rule.query.execute();
            const result = this.getRuleResult(rule, foundElements);
            observer.next(result);
            observer.complete();
        });
    }

    private getRuleResult(rule: AutoCheckA11yRule, foundElements: HTMLElement[]): A11yRuleResult {
        if (rule.check === RuleCheckEnum.MANUAL) {
            return this.buildResultForManualCheck(rule as ManualCheckA11yRule, foundElements);
        } else {
            // Then we are considering rule as RuleCheckEnum.AUTO
            return this.buildResultForAutoCheck(rule as AutoCheckA11yRule, foundElements);
        }
    }

    private buildResultForAutoCheck(rule: AutoCheckA11yRule, $el: HTMLElement[]): A11yRuleResult {
        const a11YRuleresult = new A11yRuleResult(this.targetUrl, rule);
        if (rule.shouldNotExist) {
            if ($el?.length > 0) {
                for (const element of $el) {
                    const selector = this.getSelector(element);
                    const validation = a11YRuleresult.getOrAddValidation(rule.criterion);
                    validation.errorNodes.push({
                        node: element,
                        selector: selector,
                        html: element.outerHTML
                    });
                    validation.status = A11yResultStatus.ERROR;
                }
            } else {
                const validation = a11YRuleresult.getOrAddValidation(rule.criterion);
                validation.status = A11yResultStatus.SUCCESS;
            }
        } else {
            if ($el.length === 0 && !rule.elementType.includes("warning") && !rule.elementType.includes("obsolete")) {
                const validation = a11YRuleresult.getOrAddValidation(rule.criterion);
                validation.status = A11yResultStatus.ERROR;
                validation.errorNodes.push({
                    selector: rule.query.getSelector(),
                });
            } else {
                const validation = a11YRuleresult.getOrAddValidation(rule.criterion);
                validation.status = A11yResultStatus.SUCCESS;
            }
        }
        return a11YRuleresult;
    }

    private buildResultForManualCheck(rule: ManualCheckA11yRule, $el: HTMLElement[]): A11yRuleResult {
        const a11YRuleresult = new A11yRuleResult(this.targetUrl, rule);
        const validation = a11YRuleresult.getOrAddValidation(rule.criterion);
        validation.status = A11yResultStatus.SUCCESS;
        for (let i = 0; i < $el.length; i++) {
            const selector = this.getSelector($el[i]);
            const attributesToCheck: string[] = [];
            rule.attributes.forEach((attribute) => {
                const attributeFilledWithInformation = $el[i].getAttribute(attribute);
                if (attributeFilledWithInformation) {
                    attributesToCheck.push(` ${attribute}=${attributeFilledWithInformation}`);
                }
            });
            const manualValidation = a11YRuleresult.getOrAddValidation(rule.criterion);
            manualValidation.status = A11yResultStatus.MANUAL;
            manualValidation.nodesToCheckManually.push({
                node: $el[i],
                selector: selector,
                attributes: attributesToCheck.toString(),
                html: $el[i].outerHTML,
                help: rule.id ? `${this.reference.getRuleUrl(rule.id)}` : ""
            });
        }
        return a11YRuleresult;
    }

    private getSelector(element: any): string {
        const path: string[] = [];
        while (element.nodeType === Node.ELEMENT_NODE) {
            let selector: string = element.nodeName.toLowerCase();
            if (element.id) {
                selector += "#" + element.id;
                path.unshift(selector);
                break;
            } else if (element.getAttribute("data-testid")) {
                selector += `[data-testid=${element.getAttribute("data-testid")}]`;
                path.unshift(selector);
                break;
            } else {
                let sibling = element.previousSibling;
                let index = 1;
                while (sibling) {
                    if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName.toLowerCase() === selector) {
                        index++;
                    }
                    sibling = sibling.previousSibling;
                }
                if (index > 1 || element.nextSibling) {
                    selector += ":nth-of-type(" + index + ")";
                }
            }
            path.unshift(selector);
            element = element.parentNode;
        }
        return path.join(" > ");
    }
}
