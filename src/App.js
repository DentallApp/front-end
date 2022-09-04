import RoutesApp from 'routes/RoutesApp';
import SideBarProvider from 'context/SideBarProvider';
import 'App.css';

function App() {
  return (
    <SideBarProvider>
      <RoutesApp />
    </SideBarProvider>
    
  );
}

export default App;
