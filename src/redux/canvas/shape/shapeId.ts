const elementCounter: { [shapeType: string]: number } = {
  line: 0,
  rect: 0,
  circle: 0,
  ellipse: 0,
  path: 0,
  polygon: 0,
  polyline: 0,
};

export function getShapeId(type: string): string {
  if (!elementCounter[type]) {
    throw new Error(`Unknown shape type ${type}`);
  }
  elementCounter[type] += 1;
  return `${type}${elementCounter[type]}`;
}
