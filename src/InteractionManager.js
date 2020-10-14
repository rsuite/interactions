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
    return this.performInteraction(method, ...args);
  }

  performInteraction(method, ...args) {
    const tail = this.$tail;

    this.$tail = new Promise(async (resolve) => {
      try {
        await tail;
      } finally {
        const interactionMethod = this.getInteractionMethod(method);
        resolve(interactionMethod(...args));
      }
    });

    return this.$tail;
  }
}

export default new InteractionManager();
