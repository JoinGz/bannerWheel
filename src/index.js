import './main.scss'
// if ( !Array.prototype.forEach ) {
//   Array.prototype.forEach = function forEach( callback, thisArg ) {
//     var T, k;
//     if ( this == null ) {
//       throw new TypeError( "this is null or not defined" );
//     }
//     var O = Object(this);
//     var len = O.length >>> 0; 
//     if ( typeof callback !== "function" ) {
//       throw new TypeError( callback + " is not a function" );
//     }
//     if ( arguments.length > 1 ) {
//       T = thisArg;
//     }
//     k = 0;
//     while( k < len ) {
//       var kValue;
//       if ( k in O ) {
//         kValue = O[ k ];
//         callback.call( T, kValue, k, O );
//       }
//       k++;
//     }
//   };
// }
// function addForEachToNodeList () {
//   if (window.NodeList && !NodeList.prototype.forEach) {
//       NodeList.prototype.forEach = function (callback, thisArg) {
//           thisArg = thisArg || window
//           for (var i = 0; i < this.length; i++) {
//               callback.call(thisArg, this[i], i, this)
//           }
//       }
//   }
// }
// addForEachToNodeList ()
import banner from './banner.js'
// window.onload = function () {
  new banner({
    model:'pc',
    LR:true,
    control:true
  })
// }
