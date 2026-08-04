import api from "../api/api";

export const transferFunds = async(transferData)=>{
    const response = await api.post("transaction/transfer",transferData);
    return response.data;
}