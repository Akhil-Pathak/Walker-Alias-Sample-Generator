// for testing 
// var weightMap = {'0-10':23,'10-20':35,'20-30':5,'30-40':5,'40-50':10,'50-60':4,'60-70':3,'70-80':10,'80-90':2,'90-100':3};

const probability_table_generator = (weightMap) => {

    // based upon: https://code.activestate.com/recipes/576564-walkers-alias-method-for-random-objects-with-diffe/ 
    const  weightMap_arr = Object.entries(weightMap);
    const  weightMap_clean = weightMap_arr.filter(prob => prob[1]>0);
    const n = weightMap_clean.length;
    var weights = weightMap_clean.map(prob => prob[1]);

    const reducer = (accumulator, curr) => accumulator + curr;
    const sum = weights.reduce(reducer);

    weights = weights.map((norm) => (norm*n)/sum)
    // for explanation: https://www.youtube.com/watch?v=retAwpUv42E

    const underfill = [];
    const overfill = [];

    for(var i = 0; i<n; ++i){
        if (weights[i]<1){
            underfill.push(i);
        } else if (weights[i]>1){
            overfill.push(i);
        }
    }
    const index = (Array.from(Array(n))).map(_ => -1);
    while(underfill.length && overfill.length){
        const j = underfill.pop()
        const k = overfill[overfill.length-1]
        index[j] = k
        weights[k] -= (1-weights[j])
        if(weights[k]<1){
            underfill.push(k)
            overfill.pop()
        }
    }
    // console.log(underfill, overfill)
    //console.log(weights, index)
    return {"weights":weights,"index":index,"weight_clean":weightMap_clean};
}

const sampler = (weightMap_clean,weights,index) => {
    const u = Math.random();
    const j = Math.floor(Math.random() * (weights.length));
    const k = (u <= weights[j] ? j : index[j]);
    return weightMap_clean[k][0];
}

// probability_table_generator(weightMap)
export {probability_table_generator , sampler };


