import api from "../api/api";

// export const getProfile= async()=>{
//     const responce = await api.get
// }

export const login = async(formData)=>{
    
    
    
    const response = await api.post('/auth/login',formData);
    return response.data;
}

export const signup = async(formData)=>{
    const response =await api.post('/auth/signup',formData);
    return response.data;
}

export const logout = async(formData)=>{
    localStorage.removeItem('token');
}

export const getUserDetails = async (id) => {
    const response = await api.get(`/user/${id}`);
    return response.data;
};

export const getMyAccount = async(formData)=>{
    const response = await api.get('/accounts/me',formData);
    return response.data; 
}

export const getMyTransactions = async (page = 1, limit = 5) => {
  const response = await api.get(`/transaction/me?page=${page}&limit=${limit}`);
  return response.data;
};

export const getMyProfile = async () => {
  const response = await api.get("/user/me");
  return response.data;
};

