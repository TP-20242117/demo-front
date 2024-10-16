<template>
  <div>
    <AppNavbar></AppNavbar>
    <div v-if="termsScreen" class="terms-screen">
      <h2>Términos y Condiciones</h2>
      <p>Esta versión de demostración está diseñada para recopilar datos anónimos con el fin de evaluar el desempeño de escolares que presentan Trastorno por Déficit de Atención e Hiperactividad (TDAH). Al participar en esta demostración, aceptas que los datos generados durante tu uso serán utilizados con fines de investigación y análisis.
Estos datos incluirán, entre otros, tiempos de reacción, precisión en las tareas y otras métricas relacionadas con el rendimiento cognitivo. Los datos serán anónimos y no se recopilará información personal identificable.
El objetivo de esta recopilación de datos es contribuir a una mejor comprensión de cómo los escolares con TDAH responden a ciertos tipos de estímulos y tareas, lo que permitirá mejorar las estrategias de intervención y apoyo en el futuro.
       marcar la casilla de aceptación, aceptas lo siguiente:
      </p>
       <p>
- Comprendes que esta es una versión demo con fines de investigación.
       </p>
       <p>
- Autorizas el uso de los datos anónimos que generes para propósitos académicos y de investigación.
       </p>
       <p>
- No se te proporcionará compensación alguna por tu participación.
       </p>
       <p>
- Debes realizar todas las evaluaciones antes de salir de la aplicación.</p>
      <div class="checkbox-container">
        <input type="checkbox" id="acceptTerms" v-model="acceptTerms" />
        <label for="acceptTerms">He leído y acepto los términos y condiciones</label>
      </div>
      <button :disabled="!acceptTerms" @click="handleTermsAccepted">Continuar</button>
    </div>

    <!-- Pantalla de introducción: Pregunta sobre TDAH -->
    <div v-else-if="introScreen" class="screen intro-screen">
      <h2>¿Tienes TDAH?</h2>
      <div class="button-container">
        <button @click="handleTdahResponse(true)">Sí</button>
        <button @click="handleTdahResponse(false)">No</button>
      </div>
    </div>

    <!-- Pantalla de selección de tareas -->
    <div v-else-if="!selectedTask" class="screen task-selection">
      <h2>Seleccione una tarea</h2>
      <div class="button-container">
        <button @click="selectTask('stroop')">Stroop Task</button>
        <button @click="selectTask('cpt')">Continuous Performance Task</button>
        <button @click="selectTask('stop')">Stop Signal Task</button>
      </div>
    </div>

    <!-- Mostrar la tarea seleccionada -->
    <div v-else class="task-container">
      <button class="back-button" @click="selectedTask = null">Volver</button>
      <StroopTask v-if="selectedTask === 'stroop'" @backToTaskSelection="selectedTask = null" />
      <ContinuousPerformanceTask v-if="selectedTask === 'cpt'" @backToTaskSelection="selectedTask = null" />
      <StopSignalTask v-if="selectedTask === 'stop'" @backToTaskSelection="selectedTask = null" />
    </div>
  </div>
</template>

<script>
import StroopTask from './components/StroopTask.vue';
import ContinuousPerformanceTask from './components/ContinuousPerformanceTask.vue';
import StopSignalTask from './components/StopSignalTask.vue';
import AppNavbar from './components/AppNavbar.vue';
import { addPatient } from './services/apiService.js';

export default {
  data() {
    return {
      termsScreen: true,
      introScreen: false,
      selectedTask: null,
      acceptTerms: false
    };
  },
  components: {
    StroopTask,
    ContinuousPerformanceTask,
    StopSignalTask,
    AppNavbar
  },
  methods: {
    handleTermsAccepted() {
      this.termsScreen = false;
      this.introScreen = true;
    },
    async handleTdahResponse(response) {
      this.introScreen = false;
      const patientData = {
      hasAdhd: response
      };

      try {
        const result = await addPatient(patientData);
        const patientId = result.id;
        localStorage.setItem('patientId', patientId);
        console.log("Paciente agregado:", result);
      } catch (error) {
      console.error("Error al agregar el paciente:", error);
    }
    
    console.log("Respuesta sobre TDAH:", response);
    },
    selectTask(task) {
      this.selectedTask = task;
    }
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');

body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
  background-color: #f9f9f9;
  font-weight: 300;
}

.terms-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90vh;
  margin-top: -5vh;
  text-align: center;
  padding: 0 30px;
}

h2 {
  text-align: center;
  font-size: 28px;
  color: #333;
}

p {
  text-align: center;
  font-size: 16px;
  margin: 20px 0;
  color: #666;
}

.checkbox-container {
  display: flex;
  align-items: center;
  margin: 20px 0;
}

input[type="checkbox"] {
  margin-right: 10px;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 24px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 200px;
  text-align: center;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

button:hover:enabled {
  background-color: #0056b3;
}

.back-button {
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
}

.back-button:hover {
  background-color: #d9534f;
}

.task-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
