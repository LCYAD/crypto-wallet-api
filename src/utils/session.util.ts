import { destroyNamespace, getNamespace, Namespace, reset } from 'cls-hooked'

import { SESSION_NAMESPACE } from '../configs/metaKey.config'

export class Session {
  static getActiveContext(): Namespace {
    const context = getNamespace(SESSION_NAMESPACE)

    if (!context.active) {
      throw new Error()
    }
    return context
  }

  static get(key: string): any {
    const context = Session.getActiveContext()
    return context.get(key)
  }

  static set(key: string, value: any): void {
    const context = Session.getActiveContext()
    context.set(key, value)
  }

  // currently only use to remove Session namespace when running jest integration test due to memory leak
  static destroyCurrentNamespace(): void {
    reset()
    destroyNamespace(SESSION_NAMESPACE)
  }
}
