// 変数とは
function Sample1(){
  let pi = 3.14;

  console.log(3 * 3 * pi);
  console.log(4 * 4 * pi);
  console.log(5 * 5 * pi);
  
}

// 配列とは
function Sample2(){

  values1 = [70, 80, 90];

  values2 = [ [1,2,3], [4,5,6], [7,8,9] ];

  console.log(values1[2]);
  console.log(values2[2]);
  console.log(values2[2][0]);

}

// 条件分岐
function Sample3(){
  let score = 85;

  if (score == 100){
    console.log('満点です！')
  }else if (score => 80){
    console.log('合格です！');
  }else{
    console.log('不合格です')
  }
}
