const rootsVector = new Map();
const surasVector = new Map();
function initRootVector(){
    [...rootsMap.keys()].forEach((key) => {
        if(rootsVector.get(key)) console.log("key")
        rootsVector.set(key, 0);
    });
}
function tableGenerator(){
    suraSr.forEach((ayas,indS)=>{
        surasVector.set(indS,new Map())
        ayas.forEach(
            (words,indA) => {
                let array = words.split(" ")
              let temp = new Map(rootsVector);
               array.forEach( e=> { temp.set(toBuckwalter(e),temp.get(toBuckwalter(e)))})
               surasVector.get(indS).set(indA,temp)
            }
        );
    })
}
async function  initTable(){
    await init()
    await initMujam();
    initRootVector();
    timer("All vectors created in ",tableGenerator)
}