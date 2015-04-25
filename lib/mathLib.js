/**
 * @Math
 */

//Constants

exports.MAXFLOAT = 1E+37;
exports.EPSILON = 1E-5;
exports.sign= function(x) {
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
},

exports.getPixel= function(x_,y_,width,height){
    if (x_ < 0 || y_ < 0 || x_ > width || y_ > height){
      return undefined;
    }else{
      return (Math.floor(x_) * 4 + width * Math.floor(y_)*4);
    }
}






