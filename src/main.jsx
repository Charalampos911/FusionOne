import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Styling/NewStyles/index.scss'


// import './Styling/css/root.css'
import './Styling/NewStyles/_themes.scss'
import './Styling/NewStyles/Elements-UI/Skeleton.scss'
import './Styling/NewStyles/Elements-UI/Theme-toggle-button.scss'
import './Styling/NewStyles/Elements-UI/FormInput.scss'
import './Styling/NewStyles/Elements-UI/Gate.scss'
import './Styling/NewStyles/Elements-UI/FormButton.scss'
import './Styling/NewStyles/Elements-UI/HierarchyMemu.scss'

import './Styling/NewStyles/Elements-UI/DirectionButton.scss'
import './Styling/NewStyles/Elements-UI/FormsSelectFetch.scss'

import './Styling/NewStyles/Elements-UI/SoloScheduler.scss'

import './Styling/NewStyles/Elements-UI/FormDateSelect.scss'

import './Styling/NewStyles/Elements-UI/UniversalEditor.scss'

import './Styling/NewStyles/Elements-UI/DynamicInput.scss'
import './Styling/NewStyles/Elements-UI/FileUpload.scss'
import './Styling/NewStyles/Elements-UI/DynamicSelect.scss'

import './Styling/NewStyles/Elements-UI/TimeTilePicker.scss'

import './Styling/NewStyles/Elements-UI/Overview.scss'
import './Styling/NewStyles/Elements-UI/FormDateTimeCompact.scss'





import './Styling/NewStyles/Elements-UI/FormSelect.scss'
import './Styling/NewStyles/Elements-UI/GlobalOperationHours.scss'
import './Styling/NewStyles/DateTimeEditor.scss'
import './Styling/NewStyles/Elements-UI/DailyScheduler.scss'
import './Styling/NewStyles/Elements-UI/SectorManagement.scss'

import './Styling/css/General.scss'
import './Styling/css/Auth.scss'

import './Styling/css/DateSelect.scss'
import './Styling/css/ManagersMonitor.scss'
import './Styling/css/QuerySelect.scss'
import './Styling/css/QueryDateSelect.scss'
import './Styling/css/QueryTimeSelect.scss'
import './Styling/css/OrdersMasterManager.scss'
import './Styling/NewStyles/Elements-UI/Crypto.scss'
import './Styling/NewStyles/Elements-UI/CryptoCheckout.scss'
import './Styling/NewStyles/Elements-UI/ScopeSelect.scss'
import './Styling/UniversalFadeInOut.scss'

import App from './App.jsx'
import { BrowserRouter, HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./Redux/store.js";
createRoot(document.getElementById('root')).render(
  
  <StrictMode>
  {/* <BrowserRouter basename="/FusionOne">  */} {/*server */}
  
  <BrowserRouter basename={import.meta.env.BASE_URL}>
  <Provider store={store}>

  <App />

  </Provider>
  </BrowserRouter>
  </StrictMode>,
)
