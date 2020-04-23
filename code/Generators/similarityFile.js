// Şöyle bir dosya yapar mısın:
// 6236 satır -- her ayet bir satır
// her satırda en fazla 12 sayı, space ile ayrılmış
// Benzerliği %70'den çok olan ayet numaraları
// Benzerlik sırasında (en baştaki en yüksek skor)
// %70'i geçen ayet yoksa satır boş kalsın
// 12'den fazla ise en büyük 12'yi yazalım
// Bu bilgiyi ayet menüsüne koymak istiyorum
var fs = require("fs");


// fs.writeFile('similarity.txt', 'Hello World!', function (err) {
//   if (err) return console.log(err);
//   console.log('Hello World > helloworld.txt');
// });

function appendFile(text,filename="similarity.txt"){
    fs.appendFile(filename, text, function (err) {
        if (err) return console.log(err);
    
      });
}
function writeToFile(){
    let text="";
    let perDesc = (a, b) => a[0] - b[0]
    let str;
    const reducer = (accumulator, currentValue) => accumulator+' ' + (currentValue[1] + ':'+currentValue[2] );
    suraAr.forEach((ayas, indS) => {
        console.log(indS);
        ayas.forEach(
            (words, indA) => {
                result = checkSimilarity(indS+1, indA+1, 70)
                result =result.sort(perDesc)
                str = result.slice(0, 12)
                str= str.reduce(reducer, ' ')
                
                text += str + "\n"
            }
            
        );
    })
   return text;
  }