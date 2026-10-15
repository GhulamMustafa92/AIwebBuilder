export const getCurrentUser = async (req,res) => {
    try{
        if(!req.user){
            return res.json({user:null})
        }
        return res.json(req.user)
    }catch(err){
        return res.status(500).json({message : "gerCurrent user erro"})
    }
}



export default getCurrentUser;