import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,clearOrders,ResetMsg,clearOrderProducts } from '../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import QuerySelect from '../../NewUI/QuerySelect'
import { CiCircleRemove } from "react-icons/ci";
import { MdOutlineSyncProblem } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";
import { GrSubtractCircle } from "react-icons/gr";
import { LuCircleMinus } from "react-icons/lu";

export default function OrderProducts({Orders,SelectedOrder,ActiveTab,refresh,ChangeSelection,setMessage}) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 

  console.log("");
  console.log("SelectedOrder===",SelectedOrder);
  console.log("");
  console.log("Orders===",Orders);
  const [order, setOrder] = useState(null);
    console.log("order===",order);

  const [OrderProducts, setOrderProducts] = useState(null);
  const [Products, setProducts] = useState(null);
  const [OrderServices, setOrderServices] = useState(null);
  const [OrderInputServices, setOrderInputServices] = useState(null);
  const [FiatReceipts, setFiatReceipts] = useState(null);
  const [CryptoReceipt, setCryptoReceipt] = useState(null);
  const [SelectedItem, setSelectedItem] = useState(null);
  const [NewProduct, setNewProduct] = useState(null);
  const [FixedAmount, setFixedAmount] = useState(0);
  const [ShowNewProductButtons, setShowNewProductButtons] = useState(false);



  const [Quantity, setQuantity] = useState(1);
  useEffect(() => {
    if(ActiveTab!=1) return;
    dispatch(ResetMsg())
    var NewOrder = Orders.OrdersByEstab[0]?.Orders.find(o => o.Id === SelectedOrder.Id) || null;
    setOrder(NewOrder)
    setOrderServices(NewOrder?.OrderServices)
    setOrderInputServices(NewOrder?.OrderInputServices);
    setFiatReceipts(NewOrder?.FiatReceipts)
    setCryptoReceipt(NewOrder?.CryptoReceipt)
    dispatch(
    apiRequest({
      name: "OrderProducts.jsx | HInc",
      url: "api/Products/Query",
      method: "POST",
      body: {
        DepartmentId: SelectedOrder.DepartmentId
      },
      auth: true,
      tokenRequired: true,
      storeIn: "Products"
    })).unwrap() // Waits for the thunk to resolve successfully
      .then((Response) => {
      console.log("Response==>",Response)
      setProducts(Response.data)

    })
  
  dispatch(clearOrderProducts())
  dispatch(
    apiRequest({
      name: "OrderProducts.jsx | HInc",
      url: "api/OrderProducts/Query",
      method: "POST",
      body: {
        OrderId: SelectedOrder.Id
      },
      auth: true,
      tokenRequired: true,
      storeIn: "OrderProducts"
    })
  )
    .unwrap() // Waits for the thunk to resolve successfully
      .then((Response) => {
      console.log("OrderProducts==>",Response)
      setOrderProducts(Response.data)

    })

  }, [ActiveTab,SelectedOrder,refresh
    ,Orders
  ]);

  return (

      <div id="OrderProducts">
        <div className='AddProduct' onClick={()=> setShowNewProductButtons(!ShowNewProductButtons)}>{ShowNewProductButtons?<GrSubtractCircle />:<IoMdAddCircleOutline />}</div>

        <div className={`AddNewItem ${ShowNewProductButtons? 'show':'hide'}`}>
          <QuerySelect 
            isDynamic={true}
            optionsArray={Products? Products:[]}
            placeholder="Add product*"
            setValue={(val) =>  (setNewProduct(val!=null?val:null))}
            zIndex={3}
          />
          <div className={`${NewProduct!=null?"":"NoValue"} Action` } onClick={()=>HNew(NewProduct,SelectedOrder,Quantity,dispatch,apiRequest,setMessage,setOrderProducts)}>ADD</div>
         

        </div>



        <div className='OrderList'>
        
        
          
       
          <>
          {OrderProducts && OrderProducts.map((item, index) => (
            <div className='Item OrderProduct' onClick={()=>setSelectedItem(item)}>
                <div>
                <div><span>Name:</span><span>{item.Product.Name}</span></div>
                {/* <span>Qua:</span><span>{item.Quantity}</span> */}
                
                {/* <span>SKU:</span><span>{item.Product.SKU}</span> */}
                <div><span>Category:</span><span>{item.Product.ProductCategory.Name}</span></div>
                </div>
                <div className='Actions'>
                  <span>Unit:</span><span>{item.Product.Price} €</span>
                  <span>Served:</span><span>{item.LegalQuantity}</span>
                  <span>Expected:</span><span>{item.ExpectedQuantity}</span>

                  <div onClick={()=>HDec(item.Id,1,dispatch,apiRequest,setMessage,setOrderProducts)}><LuCircleMinus /></div>
                  <div><input value={item.Quantity} onChange={(e)=>HFixed(e.target.value,setOrderProducts)}/></div>
                  
                  <div onClick={()=>HInc(item.Id,1,dispatch,apiRequest,setMessage,setOrderProducts)}><IoMdAddCircleOutline /></div>
                  <span>Total:</span><span>{item.Product.Price * item.Quantity} €</span>
                  <div className="SingleTransact" onClick={()=>HInventorySyncSingle(item.Id,dispatch,apiRequest,setMessage,setOrderProducts)}><MdOutlineSyncProblem  /></div>

                  <div className="Remove" onClick={()=>HSingleReturn(item.Id,dispatch,apiRequest,setMessage,setOrderProducts)}><CiCircleRemove/></div>
                </div>
            </div>
          ))}
          </>
       
      




 <div className="MultiTransact" onClick={()=>HInventorySyncEntireOrder(SelectedOrder.Id,dispatch,apiRequest,setMessage,setOrderProducts)}><div><MdOutlineSyncProblem /></div></div>


        </div>
      </div>
  );

}

const HNew =(NewProduct,SelectedOrder,Quantity,dispatch,apiRequest,setMessage,setOrderProducts)=>{
    setMessage(null)
    if(SelectedOrder==null){
      setMessage("Error: Must select an order")
    }
    if(NewProduct==null){
      setMessage("Error: Must select a product")
    }
    dispatch(
    apiRequest({
      name: "OrderProducts.jsx | HNew",
      url: "api/OrderProducts/Add",
      method: "POST",
      body: {
        OrderId:SelectedOrder.Id,
        ProductId: NewProduct.Id,
        Quantity:Quantity
      },
      auth: true,
      tokenRequired: true,
      storeIn: "Orders"
    })

  ).unwrap() // Waits for the thunk to resolve successfully
      .then((Response) => {
      console.log("Response==>",Response)
      setOrderProducts(Response.data)

    })
}
const HInc =(item,Quantity,dispatch,apiRequest,setMessage,setOrderProducts)=>{
    setMessage(null)
    if(item==null){
      setMessage("Error: Must select a product")
    }
    if(Quantity<=0){
      setMessage("Error: Quantity must be above 0")
    }
    dispatch(
    apiRequest({
      name: "OrderProducts.jsx | HInc",
      url: "api/OrderProducts/Increase",
      method: "PUT",
      body: {
        ProductId: item,
        IncreaseBy:Quantity
      },
      auth: true,
      tokenRequired: true,
      storeIn: "Orders"
    })
  ).unwrap() // Waits for the thunk to resolve successfully
      .then((Response) => {
      console.log("Response==>",Response)
      setOrderProducts(Response.data)

    })
}
const HFixed =(item,FixedAmount,dispatch,apiRequest,setMessage,setOrderProducts)=>{
    setMessage(null)
    if(item==null){
      setMessage("Error: Must select a product")
    }
    if(FixedAmount<=0){
      setMessage("Error: To remove this product use the remove button")
      return;
    }
    dispatch(
    apiRequest({
      name: "OrderProducts.jsx | HFixed",
      url: "api/OrderProducts/FixedQuantity",
      method: "PUT",
      body: {
        ProductId: item,
        FixedAmount:FixedAmount
      },
      auth: true,
      tokenRequired: true,
      storeIn: "Orders"
    })
  ).unwrap() // Waits for the thunk to resolve successfully
      .then((Response) => {
      console.log("Response==>",Response)
      setOrderProducts(Response.data)

    })
}


const HDec =(item,Quantity,dispatch,apiRequest,setMessage,setOrderProducts)=>{
    setMessage(null)
    if(item==null){
      setMessage("Error: Must select a product")
    }
    if(Quantity<=0){
      setMessage("Error: Quantity must be above 0")
    }
    dispatch(
    apiRequest({
      name: "OrderProducts.jsx | HDec",
      url: "api/OrderProducts/Decrease",
      method: "PUT",
      body: {
        ProductId: item,
        DecreaseBy:Quantity
      },
      auth: true,
      tokenRequired: true,
      storeIn: "Orders"
    })
  ).unwrap() // Waits for the thunk to resolve successfully
      .then((Response) => {
      console.log("Response==>",Response)
      setOrderProducts(Response.data)

    })
}

const HInventorySyncSingle =(item,dispatch,apiRequest,setMessage,setOrderProducts)=>{
    setMessage(null)  
    if(item==null){
      setMessage("Error: Must select a product")
    }
    dispatch(
    apiRequest({
      name: "OrderProducts.jsx | HSingleTransaction",
      url: "api/ProductTransactions/InventorySyncSingle",
      method: "POST",
      body: {
        OrderProductId: item,
      },
      auth: true,
      tokenRequired: true,
      storeIn: null
    })
  ).unwrap() // Waits for the thunk to resolve successfully
      .then((Response) => {
      console.log("Response==>",Response)
      setOrderProducts(Response.data)

    })
}

const HSingleReturn =(item,dispatch,apiRequest,setMessage,setOrderProducts)=>{
    setMessage(null)  
    if(item==null){
      setMessage("Error: Must select a product")
    }
    dispatch(
    apiRequest({
      name: "OrderProducts.jsx | HSingleReturn",
      url: "api/ProductTransactions/FrontDeskCancelSingleOrderProduct",
      method: "POST",
      body: {
        OrderProductId: item,
      },
      auth: true,
      tokenRequired: true,
      storeIn: null
    })
  ).unwrap() // Waits for the thunk to resolve successfully
      .then((Response) => {
      console.log("Response==>",Response)
      setOrderProducts(Response.data)

    })

  }

const HInventorySyncEntireOrder =(OrderId,dispatch,apiRequest,setMessage,setOrderProducts)=>{
    setMessage(null)  
    if(OrderId==null){
      setMessage("Error: Must select an OrderId")
    }
    dispatch(
    apiRequest({
      name: "OrderProducts.jsx | HSingleReturn",
      url: "api/ProductTransactions/InventorySyncEntireOrder",
      method: "POST",
      body: {
        OrderId: OrderId,
      },
      auth: true,
      tokenRequired: true,
      storeIn: null
    })
  ).unwrap() // Waits for the thunk to resolve successfully
      .then((Response) => {
      console.log("Response==>",Response)
      setOrderProducts(Response.data)

    })   
}
