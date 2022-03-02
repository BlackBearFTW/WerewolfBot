class Queue<T> {
	private storage: T[] = [];

	// eslint-disable-next-line no-useless-constructor,no-empty-function
	constructor(private capacity: number = Infinity) {}

	enqueue(item: T): void {
		if (this.size === this.capacity) {
			throw Error("Queue has reached max capacity, you cannot add more items");
		}
		this.storage.push(item);
	}
	dequeue(): T | undefined {
		return this.storage.shift();
	}
	get size(): number {
		return this.storage.length;
	}
}

export default Queue;