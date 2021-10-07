import alert from './alert';
import confirm from './confirm';
import prompt from './prompt';

/**
 * 用于队列 interaction 请求
 */
class InteractionManager {
  $tail = null;

  $interactionMap = {
    alert,
    confirm,
    prompt,
  };

  getInteractionMethod(method) {
    return this.$interactionMap[method];
  }

  interactionMethodExists(method) {
    return !!this.$interactionMap[method];
  }

  requestInteraction(method, ...args) {
    if (!this.interactionMethodExists(method)) {
      return Promise.reject(
        new Error(`No such interaction '${method}' found.`)
      );
    }

    const newTail = this.$tail
      ? this.queueInteraction(this.$tail, method, ...args)
      : this.performInteraction(method, ...args);

    newTail.finally(() => {
      if (this.$tail === newTail) {
        this.$tail = null;
      }
    });
    this.$tail = newTail;

    return this.$tail;
  }

  queueInteraction(tail, method, ...args) {
    return new Promise((resolve, reject) => {
      tail.finally(() => {
        this.performInteraction(method, ...args).then(resolve, reject);
      });
    });
  }

  performInteraction(method, ...args) {
    return this.getInteractionMethod(method)(...args);
  }

  resetQueue() {
    this.$tail = null;
  }
}

export default new InteractionManager();
