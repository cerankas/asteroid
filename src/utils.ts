export function deleteArrayItem(array:any[], item:any) {
  array.splice(array.indexOf(item), 1);
}


export function rnd(min:number, max:number|null=null) {
  if (max == null) {
    max = min;
    min = -min;
  }
  return min + Math.random() * (max - min);
}


export function makeColor({hue=0, saturation=100, lightness=50}) {
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}


export function min<T>(array:T[], expression:(arg:T)=>number) {
  if (array.length == 0) throw Error;
  let minItem = array[0];
  let minValue = expression(minItem);
  for (const item of array) {
    const value = expression(item);
    if (minValue > value) {
      minItem = item;
      minValue = value;
    }
  }
  return minItem;
}


export function outsideBoundingBox({x, y}: {x:number, y:number}, {minx=0, maxx=0, miny=0, maxy=0}, margin=0) {
  const xLow  = x < minx - margin;
  const yLow  = y < miny - margin;
  
  const xHigh = x > maxx + margin;
  const yHigh = y > maxy + margin;

  return xLow || yLow || xHigh || yHigh;
}


export function showScore(score:number) {
  const div = <HTMLDivElement> document.getElementById('score');
  div.innerText = `Score: ${Math.log10(score)*100|0}`;
}