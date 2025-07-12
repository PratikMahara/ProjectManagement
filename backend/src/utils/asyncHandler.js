


//use the first approch you are familiar with it

// the code is written using try catch
// const asyncHandler=(fn)=>async(req,res,next)=>{
// try{
// await fn(req,res,next)
// }catch(error){
//     res.status(error.code || 500).json({
//         success:false,
//         message:error.message
//     })
// }
// }
// export {asyncHandler}

//the code is written using promises


const asyncHandler=(requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((error) => next(error))
    }
}
 
export {asyncHandler}