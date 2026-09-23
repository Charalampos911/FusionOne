import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';


import { FaArrowLeft } from "react-icons/fa";
export default function UserRentals() { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  const [Message, setMessage] = useState(null);
  const [rentals, setRentals] = useState(null);
    const [userRental, setUserRental] = useState(null);


  useEffect(() => {
    dispatch(
      apiRequest({
        name: "UserRentals.jsx | RentalsByCustomerSU",
        url: "api/PermaProductsSU/RentalsByCustomerSU",
        method: "POST",
        body: { 
          CustomerId: Api.Token.Customer.Id,
          OrganizationId: Api.Token.OrganizationId
         },
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    ).unwrap() 
    .then((Response) => {
      console.log("Orders==>", Response.data);
      const freshPermas = Response.data || [];
      setRentals(freshPermas);

    });

  }, []);



  useEffect(() => {
    if(Api.NewApiToUserMessage.msg!="Success")
    setMessage(Api.NewApiToUserMessage);
  }, [Api.NewApiToUserMessage]);
  return (
        <div className='Rental-list Rental-list-su'>
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
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))
          )}
        </div>
  );

}

