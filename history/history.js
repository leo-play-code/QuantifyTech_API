
import User from "../models/User"


export const gethistroy = (olddata,newdata,userid) =>{
    const compdata = {}
    var bool = false
    for (const num in olddata){
        if (newdata[num]!==olddata[num]){
            compdata[num] = {
                "orignal":olddata[num],
                "now":newdata[num]
            }
            bool = true
        }
    }
    const history = {"user":userid,"data":compdata}

    return {bool,history}
}