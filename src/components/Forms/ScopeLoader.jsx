import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../Redux/features/ApiReducer';

import { MdOutlineClear } from "react-icons/md";
import { RiSortAlphabetAsc } from "react-icons/ri";
import { AiOutlineReload } from "react-icons/ai";
export default function ScopeLoader() {
  const dispatch = useDispatch();
  const Api = useSelector((state) => state.Api);
  const [relaod, setReload] = useState(0);
  useEffect(() => {
    if(Api.Establishments==null){
        var Scopes = [1, 2, 3, 6, 6, 7, 9, 10, 12, 13, 15, 16, 18, 20, 21, 29, 31, 33, 45,47];
        console.log("Api=====",Api)
        for(var i=0; i<Scopes.length; i++){
            dispatch(apiRequest({
                name: "ScopeLoader | useEffect",
                url: Api.Relationships[Scopes[i]][1],
                method: "POST",
                body: {},
                storeIn: Api.Relationships[Scopes[i]][2],
                auth: true,
                tokenRequired: true,
            }))
            .unwrap().then((Res) => {

                console.log("ScopeLoader: "+Api.Relationships[Scopes[i]][1]+" ===",Res.data)

            });


        }
    }
  }, []);

  useEffect(() => {
        if(relaod>0){
            var Scopes = [1, 2, 3, 6, 6, 7, 9, 10, 12, 13, 15, 16, 18, 20, 21, 29, 31, 33, 45, 47];
            console.log("Api=====",Api)
            for(var i=0; i<Scopes.length; i++){
                dispatch(apiRequest({
                    name: "ScopeLoader | useEffect",
                    url: Api.Relationships[Scopes[i]][1],
                    method: "POST",
                    body: {},
                    storeIn: Api.Relationships[Scopes[i]][2],
                    auth: true,
                    tokenRequired: true,
                }))
                .unwrap().then((Res) => {

                    console.log("ScopeLoader: "+Api.Relationships[Scopes[i]][1]+" ===",Res.data)

                });


            }
        }
  }, [relaod]);

    return (
    <div onClick={()=>setReload(relaod+1)}><AiOutlineReload /></div>)



}