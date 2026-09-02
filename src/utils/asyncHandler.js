const asyncHandler= (requestHandler)=>{
    return (error,req,res,next)=>{
        Promise
        .resolve(requestHandler(req,res,next))
        .catch((err)=>(err));
    };
};

export {asyncHandler}