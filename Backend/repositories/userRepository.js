const User = require("../models/User");
class UserRepository{

  async createUser(userData){
    return await User.create(userData);
  }
  async findUserById(id){
    return await User.findById(id);
  }
  async findallUsers(){
    return await User.find();
  }

  async findUserByEmail(email){
    return await User.findOne({email}).select("+password role");
  }
  async findUsers({ page, limit, sort, order }) {

    const skip = (page - 1) * limit;
    const query = {};


    const sortOptions = {};
    if (sort) {
      sortOptions[sort] = order === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = -1; // Default to newest
    }
    return await User.find(query).sort(sortOptions).skip(skip).limit(limit);
  }

  async updateUser(id,updateData){
    return await User.findByIdAndUpdate(id,updateData,{
      new: true,
      runValidators: true,
    })
  }

}
module.exports = new UserRepository();



