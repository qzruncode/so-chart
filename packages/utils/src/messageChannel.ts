import type { ManagedMessageChannel } from '@so-chart/types/common';

export function createMessageChannel(): ManagedMessageChannel {
  const channel = new MessageChannel() as ManagedMessageChannel;
  let disposed = false;

  channel.cleanup = () => {
    if (disposed) return;
    disposed = true;
    channel.port1.onmessage = null;
    channel.port1.close();
    channel.port2.close();
  };

  return channel;
}

type FrameHandle = number | ReturnType<typeof setTimeout>;

export type FrameCoalescer<T> = {
  schedule: (value: T) => void;
  cancelPending: () => void;
  cleanup: () => void;
};

/**
 * Keeps only the latest high-frequency value and dispatches it once per frame.
 * This is intended for pointer movement; enter/leave/click events should keep
 * their existing immediate dispatch semantics.
 */
export function createFrameCoalescer<T>(dispatch: (value: T) => void): FrameCoalescer<T> {
  let latest: T | undefined;
  let frameId: FrameHandle | undefined;
  let disposed = false;

  const run = () => {
    frameId = undefined;
    const value = latest;
    latest = undefined;
    if (!disposed && value !== undefined) {
      dispatch(value);
    }
  };

  const schedule = (value: T) => {
    if (disposed) return;
    latest = value;
    if (frameId !== undefined) return;

    frameId = typeof requestAnimationFrame === 'function' ? requestAnimationFrame(run) : setTimeout(run, 16);
  };

  const cancelPending = () => {
    latest = undefined;
    if (frameId === undefined) return;
    if (typeof cancelAnimationFrame === 'function' && typeof frameId === 'number') {
      cancelAnimationFrame(frameId);
    } else {
      clearTimeout(frameId);
    }
    frameId = undefined;
  };

  return {
    schedule,
    cancelPending,
    cleanup: () => {
      if (disposed) return;
      disposed = true;
      cancelPending();
    },
  };
}
