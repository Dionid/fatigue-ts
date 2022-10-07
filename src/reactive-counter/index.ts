export type ReactiveCounter = ReturnType<typeof newReactiveCounter>;

export const newReactiveCounter = (
  initialValue: number = 0,
  zeroAndGreater: boolean = true
) => {
  let value = initialValue;
  const subscribers: Array<(newVal: number, oldVal: number) => any> = [];

  const set = (newValue: number) => {
    if (zeroAndGreater && newValue < 0) {
      return;
    }

    const oldVal = value;
    value = newValue;

    for (let i = 0; i < subscribers.length; i++) {
      subscribers[i]!(newValue, oldVal);
    }
  };

  const subscribe = (fn: (newVal: number, oldVal: number) => any) => {
    subscribers.push(fn);
  };

  return {
    value: () => value,
    subscribe,
    set,
    add: (addVal: number) => {
      set(value + addVal);
    },
    increment: () => {
      set(value + 1);
    },
    decrement: () => {
      set(value - 1);
    },
    waitUntil: async (valBecame: number): Promise<true> => {
      if (value === valBecame) {
        return true;
      }

      return new Promise((resolve) => {
        subscribe((newVal) => {
          if (newVal === valBecame) {
            resolve(true);
          }
        });
      });
    },
  };
};

export const ReactiveCounter = {
  new: newReactiveCounter,
};
