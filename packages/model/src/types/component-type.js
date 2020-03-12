import {validateComponentName} from '@liaison/component';
import {isPrototypeOf} from 'core-helpers';
import ow from 'ow';

import {Type} from './type';
import {isModelClass, isModel} from '../utilities';

export class ComponentType extends Type {
  constructor(options = {}) {
    ow(options, 'options', ow.object.partialShape({componentName: ow.string}));

    const {componentName, ...otherOptions} = options;

    super(otherOptions);

    validateComponentName(componentName);

    this._componentName = componentName;
  }

  getComponentName() {
    return this._componentName;
  }

  _getComponent({modelAttribute}) {
    return modelAttribute.getParent().getRelatedComponent(this.getComponentName());
  }

  toString() {
    return `${this.getComponentName()}${super.toString()}`;
  }

  _checkValue(value, {modelAttribute}) {
    const result = super._checkValue(value, {modelAttribute});

    if (result !== undefined) {
      return result;
    }

    const component = this._getComponent({modelAttribute});

    return value === component || isPrototypeOf(component, value);
  }

  _expandAttributeSelector(normalizedAttributeSelector, {modelAttribute, ...options}) {
    if (normalizedAttributeSelector === false) {
      return false;
    }

    const component = this._getComponent({modelAttribute});

    return component.expandAttributeSelector(normalizedAttributeSelector, options);
  }

  runValidators(value) {
    const failedValidators = super.runValidators(value);

    if (isModelClass(value) || isModel(value)) {
      const modelFailedValidators = value.runValidators();
      failedValidators.push(...modelFailedValidators);
    }

    return failedValidators;
  }
}