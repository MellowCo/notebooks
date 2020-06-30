(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/news-item/news-item"],{"002f":function(t,n,e){"use strict";var r=e("e9bc"),a=e.n(r);a.a},"614d":function(t,n,e){"use strict";e.r(n);var r=e("940f"),a=e.n(r);for(var i in r)"default"!==i&&function(t){e.d(n,t,function(){return r[t]})}(i);n["default"]=a.a},"69cd":function(t,n,e){"use strict";var r=function(){var t=this,n=t.$createElement,e=(t._self._c,t.__map(t.list,function(n,e){var r=t._f("formatDate")(n.add_time);return{$orig:t.__get_orig(n),f0:r}}));t.$mp.data=Object.assign({},{$root:{l0:e}})},a=[];e.d(n,"a",function(){return r}),e.d(n,"b",function(){return a})},"940f":function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var r={props:["list"],filters:{formatDate:function(t){var n=new Date(t),e=n.getFullYear(),r=n.getMonth().toString().padStart(2,0),a=n.getDay().toString().padStart(2,0);return e+"-"+r+"-"+a}},methods:{navigator:function(t){this.$emit("itemClick",t)}}};n.default=r},e617:function(t,n,e){"use strict";e.r(n);var r=e("69cd"),a=e("614d");for(var i in a)"default"!==i&&function(t){e.d(n,t,function(){return a[t]})}(i);e("002f");var u=e("2877"),o=Object(u["a"])(a["default"],r["a"],r["b"],!1,null,null,null);n["default"]=o.exports},e9bc:function(t,n,e){}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/news-item/news-item-create-component',
    {
        'components/news-item/news-item-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('6e42')['createComponent'](__webpack_require__("e617"))
        })
    },
    [['components/news-item/news-item-create-component']]
]);
