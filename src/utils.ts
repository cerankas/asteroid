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


export function hueColor(hue:number) {
  return `hsl(${hue}, 100%, 50%)`;
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