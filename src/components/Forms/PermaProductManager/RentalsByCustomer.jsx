import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,clearOrders } from '../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import QuerySelect from '../../NewUI/QuerySelect'
// import OrdersMasterManager from './OrdersMasterManager'
// import NewOrder from './NewOrder'
import FormInput from '../../NewUI/FormInput';
import FormButton from '../../NewUI/FormButton'
import ScopeManager from '../../UI/ScopeManager';
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import PermaCheckout from './PermaCheckout';
import Messaging from '../../NewUI/Messaging';
export default function RentalsByCustomer(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const [rentals, setRentals] = useState(null);
  const [userRental, setUserRental] = useState(null);
  const [userRentalQty, setUserRentalQty] = useState(1);
  const [ActiveTab, setActiveTab] = useState(0);

  const [Customers, setCustomers] = useState(null);
  const [Customer, setCustomer] = useState(null);
    const [Message, setMessage] = useState(null);

  const [permaProducts, setPermaProducts] = useState(null);

  const [userNewRental, setUserNewRental] = useState(null);

  useEffect(() => {
    if(Api.NewApiToUserMessage && Api.NewApiToUserMessage?.msg!="Success")
    setMessage(Api.NewApiToUserMessage);
  }, [Api.NewApiToUserMessage]);
  useEffect(() => {
    // console.clear()
    console.log("Message 000===",Message)
  }, [Message]);
  useEffect(() => {
    dispatch(
      apiRequest({
        name: "DailyScheduler.DailyQuery.jsx | Customers/Query",
        url: "api/Customers/Query",
        method: "POST",
        body: {OrganizationId:Api.Token.OrganizationId, IsBlacklisted:false},
        auth: true,
        tokenRequired: true,
        storeIn: null,
      })
    )
    .unwrap() // Waits for the thunk to resolve successfully
    .then((Response) => {
      console.log("Response==>",Response)
        setCustomers(Response.data)
    })


    dispatch(
      apiRequest({
        name: "DailyScheduler.DailyQuery.jsx | Customers/Query",
        url: "api/PermaProducts/Query",
        method: "POST",
        body: {},
        auth: true,
        tokenRequired: true,
        storeIn: null,
      })
    )
    .unwrap() // Waits for the thunk to resolve successfully
    .then((Response) => {
      console.log("PermaProducts==>",Response)
        setPermaProducts(Response.data)
    })


  }, []);


  useEffect(() => {


  dispatch(
    apiRequest({
      name: "RentalsByCustomer.jsx | RentalsByCustomer 111",
      url: "api/PermaProducts/RentalsByCustomer",
      method: "POST",
      body: {CustomerId:Customer?.Id},
      auth: true,
      tokenRequired: true,
      storeIn:null
    })) .unwrap() // Waits for the thunk to resolve successfully
    .then((Response) => {
      console.log("Rentals==>",Response)
        setRentals(Response.data)
    })
  

  }, [ActiveTab,Customer]);






const HCustomer=(val)=>{
  setCustomer(val)
}
const HCheckoutSingleRntal=(val)=>{
alert("Checkout single rental")





}
const HAddRntal=()=>{
  setMessage(null)
  dispatch(
    apiRequest({
      name: "RentalsByCustomer.jsx | RentalsByCustomer 111",
      url: "api/PermaProducts/StartRent",
      method: "POST",
      body: {
        CustomerId:Customer.Id,
        TargetId:userNewRental,
        Quantity:userRentalQty,
      },
      auth: true,
      tokenRequired: true,
      storeIn:null
    })) .unwrap() // Waits for the thunk to resolve successfully
    .then((Response) => {
      console.log("Rentals==>",Response)
       setRentals(Response.data)
    })


}


  return (
    <>
    {ActiveTab==0?
    <div className={`Overview`}>
      <div className='Overview-head'>     
        <div className="ChangeSelection" onClick={()=>ActiveTab==0?props.ChangeSelection():setActiveTab(0)}><FaArrowLeft /></div> 
        <label>{"Rentals by customer"}</label>
      </div>
      <div id='QueryRentalsSelect'>
        <QuerySelect 
          isDynamic={true}
          optionsArray={Customers? Customers:[]}
          placeholder="Customers"
          setValue={(val) => (HCustomer(val!=null?val:null))}
          zIndex={1}
        />
        {/* rentals */}
        {Customer?
        <>
        <div className='Rental-list'>
          {!rentals || rentals.RentsByEstab?.length === 0 ? (
            <span>No rentals yet...</span>
          ) : (
            rentals.RentsByEstab.map((RentsByEstab) => (
              <React.Fragment key={RentsByEstab.id || RentsByEstab.EstablishmentId}>
                {RentsByEstab.GroupedRents.map((GroupedRents) => (
                  <React.Fragment key={GroupedRents.id || GroupedRents.ProductName}>
                    {GroupedRents.Transactions.map((Transaction) => (
                      <div
                        key={Transaction.id || Transaction.TransactionId}
                        className={`Rental ${userRental==Transaction?"selected":null}`}
                        onClick={() => setUserRental(Transaction)}
                      >
                        <div>Name: {GroupedRents.ProductName}</div>
                        <div>Qty: {Transaction.Quantity}</div>  
                        <div>Rented since: {Transaction.RentDay?.split('T')[0]}</div>
                        <div>Charge so far: {Transaction.CurrentAccruedRent}€</div>

                        {userRental==Transaction?
                        <div className='Checkout' onClick={()=>(setActiveTab(1),setMessage(null))}><MdOutlineShoppingCartCheckout /></div>
                        :null}
                        
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))
          )}
        </div>
        <div className='Rental-actions-cont'>

          <ScopeManager label={"Add Rentals"} Prop={"PermaProductId"} setValue={(e)=>setUserNewRental(e)} Sorting={(val) => null} Clear={null} />
            {userNewRental?
            <>
              <FormInput 
                key={0}
                type="text"
                placeholder="Quontity"
                ElValue={userRentalQty ?? ""} 
                ReturnVal={(val) => setUserRentalQty(val)}
              />  
              <FormButton text={"Rent it"} onClick={()=>HAddRntal()}/>
            </>
            :null}
        </div>
         <Messaging ParentMessage={Message} IsLocal={true}/>
        </>:null}
      </div>
      
    </div>

    :null}

 {ActiveTab === 1 ? 

<PermaCheckout PermaProductTransactionId = {userRental.TransactionId} ChangeSelection={()=>setActiveTab(0)}  AfterCheckout={(e)=>(setActiveTab(0),setMessage(e))} />
 : null}



    {/* {ActiveTab==2?
    <NewOrder ChangeSelection={()=> (setActiveTab(0),setCustomer(null))} preVal={Customer}/>
    :null} */}
  </>
  ); 

}


