export default class OriginalIndexes {
  constructor(array) {
    this.nextOriginalIndex = 0;
    this.originalIndexesArray = this.generate(array);
  };
  get(index) {
    if(index != undefined) 
      return this.originalIndexesArray[index];
    else
      return this.originalIndexesArray;
  };
  generate(array) {
    let arr = [];
    array.forEach((item, index) => {
      arr.push(index);
    });
    this.nextOriginalIndex = array.length;
    return arr;
  };
  reorder(fromIndex, toIndex) {
    let element = this.originalIndexesArray[fromIndex];

    this.originalIndexesArray.splice(fromIndex, 1);
    this.originalIndexesArray.splice(toIndex, 0, element);
  };
  deleteElement(index) {
    this.originalIndexesArray.splice(index,1);
  };
  pushNewElement() {
    this.originalIndexesArray.push(this.nextOriginalIndex);
    this.nextOriginalIndex++;
    this.originalIndexesArray;
  };
};
