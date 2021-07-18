import mongoose from "mongoose"

const ProbdataSchema = mongoose.Schema({
    userid : String,
    totalNum : Number,
    probMap : Map , weightMap :{type : Map,of: String},
    finalResult : Map , result :{type : Map,of: String}
})

export default mongoose.model("UserProbData",ProbdataSchema)

// {
//     "userid": "akhil3",
//     "total_num": 100,
//     "prob_map": {"0-10":23,"10-20":35,"20-30":5,"30-40":5,"40-50":10,"50-60":4,"60-70":3,"70-80":10,"80-90":2,"90-100":3},
//     "final_result": {"0-10":0,"10-20":0,"20-30":0,"30-40":0,"40-50":0,"50-60":0,"60-70":0,"70-80":0,"80-90":0,"90-100":0}
// }