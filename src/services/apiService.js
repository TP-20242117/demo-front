import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


export const addPatient = async (patientData) => {
  try {
    const response = await api.post('/patients', patientData);
    return response.data;
  } catch (error) {
    console.error('Error al agregar paciente:', error);
    throw error;
  }
};

export const postStroopTaskResults = async (data) => {
    try {
      const response = await api.post('/evaluations/stroop-task', data);
      return response.data;
    } catch (error) {
      console.error('Error al enviar resultados de Stroop Task:', error);
      throw error;
    }
  };

export default api;
