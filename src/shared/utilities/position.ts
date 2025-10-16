export function getPointerPosition(e: MouseEvent | TouchEvent) {
  if (e instanceof MouseEvent) return [e.clientX, e.clientY];
  if (e instanceof TouchEvent) return [e.targetTouches[0].pageX, e.targetTouches[0].pageY];
  throw new Error("dragging instance must be a valid MoutEvent or TouchEvent");
}
