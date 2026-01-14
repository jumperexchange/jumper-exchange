type PositionFilters = Record<string, any>;

interface QuerySubscription {
  id: string;
  filters: PositionFilters;
  callbacks: Set<(data: any) => void>;
}

class PositionQueryRegistry {
  private subscriptions = new Map<string, QuerySubscription>();
  private listeners = new Set<() => void>();

  register(
    id: string,
    filters: PositionFilters,
    callback: (data: any) => void,
  ) {
    if (!this.subscriptions.has(id)) {
      this.subscriptions.set(id, {
        id,
        filters,
        callbacks: new Set([callback]),
      });
    } else {
      this.subscriptions.get(id)!.callbacks.add(callback);
    }

    this.notifyListeners();

    return () => this.unregister(id, callback);
  }

  unregister(id: string, callback: (data: any) => void) {
    const subscription = this.subscriptions.get(id);
    if (subscription) {
      subscription.callbacks.delete(callback);
      if (subscription.callbacks.size === 0) {
        this.subscriptions.delete(id);
        this.notifyListeners();
      }
    }
  }

  getActiveQueries() {
    return Array.from(this.subscriptions.values()).map(({ id, filters }) => ({
      id,
      filters,
    }));
  }

  notifySubscribers(id: string, data: any) {
    const subscription = this.subscriptions.get(id);
    if (subscription) {
      subscription.callbacks.forEach((callback) => callback(data));
    }
  }

  onQueriesChange(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }
}

export const positionQueryRegistry = new PositionQueryRegistry();
