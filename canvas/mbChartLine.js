function MbChartLine(opts){
    MbChart.call(this)
    MbAxis.call(this)

    //初始图标标题和标签
    this.checkData(opts)

    
}

(function(){
    // let Base_proto = function(){};
    // Base_proto.prototype = MbChart.prototype
    // MbChartLine.prototype = new Base_proto()
    // let Base_axis = function(){}
    // Base_axis.prototype = MbAxis.prototype;
    // MbChartLine.prototype = new Base_axis();
})()

// function Animal (name) {
//     // 属性
//     this.name = name || 'Animal';
//     // 实例方法
//     this.sleep = function(){
//       console.log(this.name + '正在睡觉！');
//     }
//   }
//   // 原型方法
//   Animal.prototype.eat = function(food) {
//     console.log(this.name + '正在吃：' + food);
//   };



//   function Cat(name){
//     Animal.call(this);
//     this.name = name || 'Tom';
//   }
//   (function(){
//     // 创建一个没有实例方法的类
//     var Super = function(){};
//     Super.prototype = Animal.prototype;
//     //将实例作为子类的原型
//     Cat.prototype = new Super();
//   })();
  
//   // Test Code
//   var cat = new Cat();
//   console.log(cat.name);
//   console.log(cat.sleep());
//   console.log(cat instanceof Animal); // true
//   console.log(cat instanceof Cat); //true
