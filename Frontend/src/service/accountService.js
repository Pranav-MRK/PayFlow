import api from '../api/api';

export const getMyAccounts = async ()=>{
    const response = await api.get("accounts/me");
    return response.data;
}