import TransctionsTable from "./components/TransctionsTable";
import  {MonthProvider}  from "./context/MonthContext";


const App = () => {
  return (
    <>
    <MonthProvider> 
      <TransctionsTable/>
    </MonthProvider>
    </>
  )
}

export default App
