// Yüksek Performanslı Object Pool (60 FPS, Sıfır Bellek Sızıntısı / GC)
window.ObjectPool = class ObjectPool {
  constructor(factoryFn, resetFn, initialSize = 32) {
    this.factoryFn = factoryFn;
    this.resetFn = resetFn;
    this.freeList = [];
    this.activeList = [];

    for (let i = 0; i < initialSize; i++) {
      const item = this.factoryFn();
      item._active = false;
      this.freeList.push(item);
    }
  }

  acquire(...args) {
    let item = this.freeList.length > 0 ? this.freeList.pop() : this.factoryFn();
    item._active = true;
    if (this.resetFn) {
      this.resetFn(item, ...args);
    }
    this.activeList.push(item);
    return item;
  }

  releaseAt(index) {
    const lastIdx = this.activeList.length - 1;
    const item = this.activeList[index];
    item._active = false;
    if (index !== lastIdx) {
      this.activeList[index] = this.activeList[lastIdx];
    }
    this.activeList.pop();
    this.freeList.push(item);
  }

  clear() {
    while (this.activeList.length > 0) {
      const item = this.activeList.pop();
      item._active = false;
      this.freeList.push(item);
    }
  }

  updateAll(dt, updateFn) {
    for (let i = this.activeList.length - 1; i >= 0; i--) {
      const item = this.activeList[i];
      const keepAlive = updateFn(item, dt, i);
      if (keepAlive === false || !item._active) {
        this.releaseAt(i);
      }
    }
  }
};
