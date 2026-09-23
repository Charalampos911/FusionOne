import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import UniversalEditor from '../UniversalEditor';
import { RxHamburgerMenu } from "react-icons/rx";
import { MdOutlineSegment } from "react-icons/md";
import QuerySelect from "../../NewUI/QuerySelect";
import { BsCartCheckFill } from "react-icons/bs";
import { TbTruckReturn } from "react-icons/tb";
export default function SectorManagement(props) { 

  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  const [Scope, setScope] = useState(true);
  const [Establishments, setEstablishments] = useState(null);
  const [Departments, setDepartments] = useState(null);
  const [Inventories, setInventories] = useState(null);
  const [Sectors, setSectors] = useState(null);

  const [Establishment, setEstablishment] = useState(null);
  const [Department, setDepartment] = useState(null);
  const [Inventory, setInventory] = useState(null);
  const [Sector, setSector] = useState(null);

  const [SectorOrders, setSectorOrders] = useState(null);
  const [SectorReturns, setSectorReturns] = useState(null);

  
  const [CustomersForServe, setCustomersForServe] = useState(null);
  const [Customer, setCustomer] = useState(null);

  const [ToggleOrderNumber, setToggleOrderNumber] = useState(false);
  const [ChoiceTab, setChoiceTab] = useState(0);

  useEffect(() => {
if(SectorOrders!=null)
  console.log("SectorOrders=======",SectorOrders)

   }, [SectorOrders]);

  useEffect(() => {
  if(Customer!=null)
    console.log("Customer=======",Customer)

   }, [Customer]);

  useEffect(() => {
    dispatch(
      apiRequest({
        name: "SectorManagement.jsx | Establishments/Query",
        url: "api/Establishments/Query",
        method: "POST",
        body: {},
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    ).unwrap()
        .then((Response) => {
          console.log("Response 1 ==>",Response)
           setEstablishments(Response.data)
        })
   }, []);

  useEffect(() => {
    if(Establishment==null) return;
    dispatch(
      apiRequest({
        name: "SectorManagement.jsx | Departments/Query",
        url: "api/Departments/Query",
        method: "POST",
        body: {EstablishmentId:Establishment.Id},
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    ).unwrap() 
        .then((Response) => {
          console.log("Response 2 ==>",Response)
           setDepartments(Response.data)
        })
   }, [Establishment]);

  useEffect(() => {
    if(Department==null) return;
    dispatch(
      apiRequest({
        name: "SectorManagement.jsx | Inventories/Query",
        url: "api/Inventories/Query",
        method: "POST",
        body: {
          DepartmentId:Department.Id,
          IsActive:true
        },
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    ).unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
          console.log("Response 3 ==>",Response)
           setInventories(Response.data)
        })
   }, [Department]);


  useEffect(() => {
    if(Inventory==null) return;
    dispatch(
      apiRequest({
        name: "SectorManagement.jsx | useEffect",
        url: "api/Sectors/Query",
        method: "POST",
        body: {
          InventoryId:Inventory.Id
        },
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    ).unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
          console.log("Response 4 ==>",Response)
           setSectors(Response.data)
        })
   }, [Inventory]);


  useEffect(() => {
    if(Sector == null) return; 
    dispatch(
      apiRequest({
        name: "SectorManagement.jsx | useEffect.QueryByOrdersTakeOut",
        url: "api/ProductTransactions/QueryByOrdersTakeOut",
        method: "POST",
        body: {
          SectorId: Sector.Id
        },
        auth: true,
        tokenRequired: true,
        storeIn: "OrdersBeforeServe"
      })
    ).unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
          console.clear()
          console.log("Response 5 ==>",Response.data)
           setSectorOrders(Response.data)
           const CustomersA = Response.data.map(item => ({
              Id: item.OrderCustomerId,
              Name: item.OrderCustomerName
            }));
            setCustomer(null)
           setCustomersForServe(CustomersA)

        


            dispatch(
              apiRequest({
                name: "SectorManagement.jsx | useEffect.QueryByOrdersTakeIn",
                url: "api/ProductTransactions/QueryByOrdersTakeIn",
                method: "POST",
                body: {
                  SectorId: Sector.Id
                },
                auth: true,
                tokenRequired: true,
                storeIn: "ReturnItems"
              })
            ).unwrap() // Waits for the thunk to resolve successfully
                .then((Response) => {
                  console.log("Response 6 ==>",Response)
                  if(Response.data.length>0){
                  setSectorReturns(Response.data)
                  const CustomersB = Response.data.map(item => ({
                      Id: item.OrderCustomerId,
                      Name: item.OrderCustomerName
                    }));
                    setCustomer(null)
                  setCustomersForServe(CustomersB)
                  }
                })
        })


   }, [Sector]);








  return (
    <div id='SectorManagement'>
        <div className='vertical-menu'>
        <div className='options'>
          {!props.DivisionId?
          <>
          <div className='Scope-button' onClick={()=>setScope(!Scope)}>{Scope?<MdOutlineSegment /> :<RxHamburgerMenu/>}</div>
          
          <div className={`Scope-select `}>
            {Scope?
            <>
              <QuerySelect 
                isDynamic={true}
                optionsArray={Establishments? Establishments:[]}
                placeholder="Establishments"
                setValue={(val) => setEstablishment(val)}
                 zIndex={4}
              />
              <QuerySelect 
                isDynamic={true}
                optionsArray={Departments? Departments:[]}
                placeholder="Departments"
                setValue={(val) => setDepartment(val)}
                 zIndex={3}
              />
              <QuerySelect 
                isDynamic={true}
                optionsArray={Inventories? Inventories:[]}
                placeholder="Inventories"
                setValue={(val) => setInventory(val)}
                 zIndex={2}
              />
            </>
            :null}
        <QuerySelect 
          isDynamic={true}
          optionsArray={Sectors? Sectors:[]}
          placeholder="Sectors"
          setValue={(val) => (setSector(val),setScope(false))}
           zIndex={1}
        />

        </div>
        </>
        :null}
      </div>
      </div>

      {Sector!=null?
      <>
      <div className='Choice'>
        <div>STOCK</div>
        <div>CUSTOMER SERVICE</div>
      </div>
      {SectorOrders != null?
      <>
      <div className='Orders-Choice'>
        <QuerySelect 
          isDynamic={true}
          optionsArray={CustomersForServe? CustomersForServe:[]}
          placeholder="Customers"
          setValue={(val) => (setCustomer(val))}
           zIndex={1}
        />
      </div>
      
      <div className='Choice-Tabs'>
        <div className={ChoiceTab==1?"selected":null} onClick={()=>setChoiceTab(1)}>Orders:</div>
        <div className={ChoiceTab==2?"selected":null} onClick={()=>setChoiceTab(2)}>Returns:</div>
      </div>

      {ChoiceTab==1?
        <div className='Box'>
          <label>Orders:</label>
          {SectorOrders!=null && Customer && SectorOrders.map((itemA,indexA)=>
          itemA.OrderCustomerId == Customer.Id?
          <div>
          <div className='CurrentOrder'><div onClick={()=>setToggleOrderNumber(!ToggleOrderNumber)}>Order Nunber:</div> {ToggleOrderNumber?itemA.OrderId:"-"}</div>
          
          {itemA.ProductsForTakeOut.map((itemB,indexB)=>
            <div className='Items'>
              <div>
                <span>Product:</span>
                <span>Requested:</span>
                {/* <span>Correction:</span> */}
                <span>Stock:</span>
                <span>SKU:</span>
              </div>
              
              <div>
                <span>{itemB.Product.Name}</span>
                <span>{itemB.Amount}</span>
                {/* <span>{itemB.Correction}</span> */}
                <span>{itemB.Product.Quantity}</span>
                <span> {itemB.Product.SKU}</span>
              </div>



              <div className='Actions' onClick={()=>ServeProduct(itemB.OrderProductId,dispatch,apiRequest,setSectorOrders,setCustomersForServe)}><BsCartCheckFill /></div>
            </div>
          )}

          </div>
          :null
          
          )} 

        </div>
      :null}

      {ChoiceTab==2?
      <div className='Box'>
        <label>Returns:</label>
        {Customer && SectorReturns!=null && SectorReturns.map((itemA,indexA)=>
        itemA.OrderCustomerId == Customer.Id?
        <div>
        <div className='CurrentOrder'><div onClick={()=>setToggleOrderNumber(!ToggleOrderNumber)}>Order Nunber:</div> {ToggleOrderNumber?itemA.OrderId:"-"}</div>
         {itemA.ProductsForTakeIn?.map((itemB,indexB)=>
         <>
         {itemB.TakeIn.map((itemC,indexC)=>{
          console.clear()

          console.log("SectorReturns==",SectorReturns)
          
          console.log("itemA==",itemA)
          console.log("itemB==",itemB)
          return(
          <div className='Items Returns'>
            <div>
              <span>Product:</span>
              <span>Returned amount:</span>
       
              <span>Stock:</span>
              <span>SKU:</span>
            </div>
            
            <div>
              <span>{itemC.ProductName}</span>
              <span>{itemC.Amount}</span>
              <span>{itemC.ProductStock}</span>
              <span>{itemC.ProductSKU}</span>
            </div>



            <div className='Actions Return' onClick={()=>ReturnProduct(itemC.OrderProductId,dispatch,apiRequest,setSectorReturns,itemC.Id,setCustomer,setCustomersForServe)}><TbTruckReturn  /></div>
          </div>
          )
         }

           )}
          </>
        )}

        </div>
        :null
        
        )} 

      </div>
      :null}
      </>
      
      :null}
    </>
    :null}
    </div>


  );

}
const ReturnProduct =(OrderProductId,dispatch,apiRequest,setSectorReturns,TransId,setCustomer,setCustomersForServe)=>{

    dispatch(
      apiRequest({
        name: "SectorManagement.jsx | useEffect.BackDeskServeProduct",
        url: "api/ProductTransactions/BackDeskUserReturnProduct",
        method: "POST",
        body: {
          OrderProductId:OrderProductId,
          TransId:TransId
        },
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    ).unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
          console.log("Response 7 ==>",Response.data)
           setSectorReturns(Response.data)
           const Customers = Response.data.map(item => ({
              Id: item.OrderCustomerId,
              Name: item.OrderCustomerName
            }));
            setCustomer(null)
           setCustomersForServe(Customers)
        })
      }

const ServeProduct =(OrderProductId,dispatch,apiRequest,setSectorOrders,setCustomersForServe)=>{

    dispatch(
      apiRequest({
        name: "SectorManagement.jsx | useEffect.BackDeskServeProduct",
        url: "api/ProductTransactions/BackDeskServeProduct",
        method: "POST",
        body: {
          OrderProductId:OrderProductId
        },
        auth: true,
        tokenRequired: true,
        storeIn: "OrdersBeforeServe"
      })
    ).unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
          console.log("Response 8 ==>",Response.data)
           setSectorOrders(Response.data)
           const Customers = Response.data.map(item => ({
              Id: item.OrderCustomerId,
              Name: item.OrderCustomerName
            }));
           setCustomersForServe(Customers)

        })
      }


const HTransfer=(seg,TransferSegment,setTransferSegment,SelectedTime,SetSelectedTime,EstablishmentId,DepartmentId,PrintState,dispatch,apiRequest,setSelectedSegment )=>{
  PrintState()
  
  setTransferSegment(seg)
  if(TransferSegment != null && seg != null && SelectedTime != null)
    dispatch( 
      apiRequest({
        name: "DailyScheduler.DailyQuery.jsx | HTransfer.SUpdate",
        url: "api/OrderServices/SUpdate",
        method: "PUT",
        body: {
          sectorId
        },
        auth: true,
        tokenRequired: true,
        storeIn: "DailyQueryByDivision"
      })
    ).unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
          console.log("Response== 555 >",Response)
          setSelectedSegment(null)
          setTransferSegment(null)
          SetSelectedTime(null)
        })





}