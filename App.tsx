import { MQTTProvider } from './contexts/MQTTContext';
import Dashboard from './dashboard';

function App() {
  return (
    <MQTTProvider>
      <Dashboard />
    </MQTTProvider>
  );
}

export default App; 