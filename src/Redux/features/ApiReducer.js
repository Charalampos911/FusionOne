import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from "ethers";
// Generic API Thunk
export const apiRequest = createAsyncThunk(
  'api/request',
  async ({name,url, method = 'GET', body = null, auth = false, tokenRequired = false, storeIn,isForm = false,mediaFiles = [] }, { getState, rejectWithValue }) => {
    if(name==undefined) return;

    try {

      // const Base_url = import.meta.env.DEV ? "https://localhost:5081/" : "/";
      const Base_url = import.meta.env.DEV
          ? "https://fusionone.io/"
          : "/";
      const headers = {};

      let requestBody;

      if (isForm && mediaFiles!=[]) {
        // Prepare FormData
        const formData = new FormData();

        // Append the regular JSON body fields to the form
        if (body && typeof body === 'object') {
          Object.keys(body).forEach(key => {
            formData.append(key, body[key]);
          });
        }

        // Append media files
        if (mediaFiles && Array.isArray(mediaFiles)) {
          mediaFiles.forEach((file) => {
            // "File" is the key name expected by your C# [FromForm] model
            formData.append("File", file); 
          });
        }
        
        requestBody = formData;
        // NOTE: We do NOT set 'Content-Type' for FormData. 
        // The browser adds 'multipart/form-data; boundary=...' automatically.
      } else {
        // Standard JSON logic
        headers['Content-Type'] = 'application/json';
        requestBody = body ? JSON.stringify(body) : null;
      }

      // Add Bearer token if required
      if (tokenRequired) {
        const token = getState()?.Api?.Token?.JwtToken;
        if (!token) {
          return rejectWithValue({
            name: name,
            msg: name,
            apiMessage: 'Authorization token is missing',
            status: 401,
            url
          });
        }

        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(Base_url + url, {
        method,
        headers,
        // body: body ? JSON.stringify(body) : null,
        body: requestBody,
      });

      if (!response.ok) {
        let errorPayload = null;

        try { errorPayload = await response.json(); } catch { }
      
        console.log("errorPayload==",errorPayload)
        return rejectWithValue({
          msg: name,
          apiMessage:
            errorPayload?.errorMessage ||
            'An unexpected server error occurred.',
          exceptionType: errorPayload?.exceptionType,
          status: response.status,
          url
        });
      }

      const data = await response.json();

      console.log("")
      console.log("data======",data)
      console.log("")

      return {
        msg: name,
        // data: flatten && Array.isArray(data) && data.length === 1 ? { ...data[0] } : data,
        data: data,
        storeIn,
        url
      };

    } catch (error) {

      return rejectWithValue({
        msg: name,
        apiMessage: error.message || 'Network error',
        status: 'NETWORK_ERROR',
        url
      });
    }
  }
);


const initialState = {
PayWithVivaBaseUrl: `${window.location.origin}${import.meta.env.BASE_URL}payOrderWithViva/`,
PayWithVivaBaseUrlPerma: `${window.location.origin}${import.meta.env.BASE_URL}payOrderWithVivaPerma/`,
cmsHub: import.meta.env.DEV
    ? "https://fusionone.io/api/cmsHub"
    : `${window.location.origin}/api/cmsHub`,
  Imagehost: `${window.location.origin}`,
  error: null,
  Token: null,
  EstablishmentId:null,
  DepartmentId:null,
  DivisionId:null,
  locale:"el",
  EstablishmentsSU:null,
  DepartmentsSU:null,
  DivisionsSU:null,
  PermaProductsSU:null,
  ProductsSU:null,
  ServicesSU:null,
  EmployeesSU:null,
  CurrentViewSU: 0,
  NavBarSUInteractions:0,
  DepartmentSU:null,
  DailyQueryByDivision:null,
  ProductTransactions:null,
  Organization: null,
  Establishments: null,
  Departments: null,
  Divisions: null,
  OrdersBeforeServe: null,
  DivisionOpenDays: null,
  DivisionOpenAvailabilityDays: null,
  DivisionOpenDaysSegmentAvailability: null,

  EmployeeWorkDays: null,
  EmployeeWorkAvailabilityDays: null,
  EmployeeWorkDaysSegmentAvailability: null,

  Customers: null,
  Inventories: null,
  Sectors: null,
  InputServices: null,
  PermaProducts: null,
  PermaProductCategories: null,
  PermaProductTransactions: null,
  Products: null,
  ProductCategories: null,
  ProductTransactions: null,
  Services: null,
  ServiceCategories: null,
  Supplies: null,
  SupplyCategories: null,
  SupplyTransactions: null,
  CurrentOrder:null,
  Orders: null,
  Taxes: null,
  OrderProducts: null,
  OrderServices: null,
  OrderInputServices: null,
  FiatReceipts: null,
  CryptoReceipts: null,
  Employees: null,
  EmployeeWorkDays: null,
  OpenTemplates: null,
  OpenTemplateDays: null,

  SpecialOperationsDays: null,
  SpecialOperationsAvailabilityDays: null,
  SpecialOperationsDaysSegmentAvailability: null,


  OpenTemplateId:null,
  OpenTemplates: null,
  OpenTemplateDays: null,
  OpenTemplateAvailabilityDays: null,
  OpenTemplateDaysSegmentAvailability: null,

  ScheduleTemplateId:null,
  ScheduleTemplates: null,
  ScheduleTemplateDays: null,
  ScheduleTemplateAvailabilityDays: null,
  ScheduleTemplateDaysSegmentAvailability: null,
  IdDocuments: null,
  BankCards: null,
  OrganizationImages: null,
  EstablishmentImages: null,
  DepartmentImages: null,
  EmployeeImages: null,
  DivisionImages: null,
  ProductImages: null,
  PermaProductImages: null,
  ServiceImages: null,
  RadioAudios: null,
  SecurityVideos: null,
  AssignableRoles:null,

  TenantUsers:null,
  NewApiToUserMessage: null,
  loading: false,
  EmptyStruct: null,
  Relationships: null,
  ServiceAvailabilityCalendar:null,
  ProductCategories:null,

  Get35DayCalendarAvailabilityByDepartment:null,
  GetSingleDayCalendarAvailabilityByDepartment:null,
  Get35DayCalendarOccupancyByDepartment:null,
  GetSingleDayCalendarOccupancyByDepartment:null,
  Get35DayCalendarAvailabilityByDivision:null,
  GetSingleDayCalendarAvailabilityByDivision:null,
  Get35DayCalendarAvailabilityByDivisionForService:null,
  GetSingleDayCalendarAvailabilityByDivisionForService:null,

  Get35DayCalendarAvailabilityByDepartmentForService:null,
  GetSingleDayCalendarAvailabilityByDepartmentForService:null,
  DailyQuery:null,
  GetDailyServiceAvailability:null,
  GetTransferAvailability:null,
GetTransferAvailabilityPerDivision:null,
ServiceCategories:null,
};
const ApiReducer = createSlice({
  name: "ApiReducer",
  initialState,
  reducers: {
  clearState: (state) => {
    Object.keys(initialState).forEach((key) => {
      state[key] = initialState[key];
    });
  },
  clearJunk: (state) => {
    Object.keys(initialState).forEach((key) => {
      // Global constant and univrsal editor scope variables
      if(key=='Organization' || key=='Token' || key=='EstablishmentId' || key=='DepartmentId' ||  
         key=='Establishments' || key=='Departments' || key=='Divisions' || 
         key=='Inventories' || key=='Sectors' || key=='InputServices' || 
         key=='PermaProducts' || key=='PermaProductCategories' || key=='Products' || 
         key=='ProductCategories' || key=='Services' || key=='ServiceCategories' || 
         key=='Supplies' || key=='SupplyCategories' || key=='ServiceCategories' || 
         key=='Taxes' || key=='SupplyCategories' || key=='ServiceCategories' || 
         
         key=='Customers' || key=='DepartmentImages' || key=='EmployeeImages'|| 
         key=='DivisionImages' || key=='ProductImages' || key=='PermaProductImages' || 
         key=='ServiceImages' || key=='RadioAudios' || key=='SecurityVideos' || 
         key=='AssignableRoles' || key=='Relationships') {
          //Do nothing
         }else{
          state[key] = initialState[key];
         }
      
    });
  },
  
    clearOrderProducts: (state) => {

        state.OrderProducts = null;
    },
    clearOrderServices: (state) => {

        state.OrderServices = null;
    },
    clearTenantUsers: (state) => {

        state.TenantUsers = null;
    },
    ResetMsg: (state) => { 
      state.NewApiToUserMessage = null; 

    },
    NavBarInteracted: (state) => { 
      state.NavBarSUInteractions = state.NavBarSUInteractions+1; 

    },


    DefineRelationships: (state) => { 
      state.Relationships = [
         ["OrganizationId", "api/Organizations/Query", "Organizations"],
         ["EstablishmentId", "api/Establishments/Query", "Establishments"],
         ["DepartmentId", "api/Departments/Query", "Departments"],
         ["DivisionId", "api/Divisions/Query", "Divisions"],
         ["DivisionOpenDayId", "api/DivisionOpenDays/Query", "DivisionOpenDays"],
         ["CustomerId", "api/Customers/Query", "Customers"],
         ["InventoryId", "api/Inventories/Query", "Inventories"],


         ["SectorId", "api/Sectors/Query", "Sectors"],
         ["InputServiceId", "api/InputServices/Query", "InputServices"],
         ["PermaProductId", "api/PermaProducts/Query", "PermaProducts"],
         ["PermaProductCategoryId", "api/PermaProductCategories/Query", "PermaProductCategories"],
         ["PermaProductTransactionId", "api/PermaProductTransactions/Query", "PermaProductTransactions"],
         ["ProductId", "api/Products/Query", "Products"],
         ["ProductCategoryId", "api/ProductCategories/Query", "ProductCategories"],
         ["ProductTransactionId", "api/ProductTransactions/Query", "ProductTransactions"],
         ["ServiceId", "api/Services/Query", "Services"],
         ["ServiceCategoryId", "api/ServiceCategories/Query", "ServiceCategories"],
         ["SupplyId", "api/Supplies/Query", "Supplies"],
         ["SupplyCategoryId", "api/SupplyCategories/Query", "SupplyCategories"],
         ["SupplyTransactionId", "api/SupplyTransaction/Query", "SupplyTransactions"],

        ["ServicesTax", "api/Taxes/Query", "Taxes"],
        ["ProductsTax", "api/Taxes/Query", "Taxes"],
        ["PermaProductTax", "api/Taxes/Query", "Taxes"],

         ["OrderId", "api/Orders/Query", "Orders"],
         ["OrderProductId", "api/OrderProducts/Query", "OrderProducts"],
         ["OrderServiceId", "api/OrderServices/Query", "OrderServices"],
         ["OrderInputServiceId", "api/OrderInputServices/Query", "OrderInputServices"],
         ["FiatReceiptId", "api/FiatReceipts/Query", "FiatReceipts"],
         ["CryptoReceiptId", "api/CryptoReceipts/Query", "CryptoReceipts"],

         ["EmployeeId", "api/Employees/Query", "Employees"],
         ["EmployeeWorkDayId", "api/EmployeeWorkDays/Query", "EmployeeWorkDays"],
        
        
         ["OpenTemplateId", "api/OpenTemplates/Query", "OpenTemplates"],
         ["OpenTemplateDayId", "api/OpenTemplateDays/Query", "OpenTemplateDays"],

         ["ScheduleTemplateId", "api/ScheduleTemplates/Query", "ScheduleTemplates"],
         ["ScheduleTemplateDayId", "api/ScheduleTemplateDays/Query", "ScheduleTemplateDays"],


         ["OrganizationImageId", "api/Images/Query", "OrganizationImages"], 
         ["EstablishmentImageId", "api/Images/Query", "EstablishmentImages"],
         ["DepartmentImageId", "api/Images/Query", "DepartmentImages"],
         ["EmployeeImageId", "api/Images/Query", "EmployeeImages"],
         ["DivisionImageId", "api/Images/Query", "DivisionImages"],
         ["ProductImageId", "api/Images/Query", "ProductImages"],
         ["PermaProductImageId", "api/Images/Query", "PermaProductImages"],
         ["ServiceImageId", "api/Images/Query", "ServiceImages"],

         ["RadioAudioId", "api/RadioAudios/Query", "RadioAudios"],
         ["SecurityVideoId", "api/SecurityVideos/Query", "SecurityVideos"],

         ["SpecialId", "api/Specials/Query", "Specials"],
         ["SpecialOperationsDayId", "api/SpecialOperationsDays/Query", "SpecialOperationsDays"],
         ["TimeZoneId","api/Timezones/GetSystemTimeZones","Timezones"]
      ]; 

    },
    setEstablishmentId: (state, action) => {
      state.EstablishmentId = action.payload;
    },
    setDepartmentId: (state, action) => {
      state.DepartmentId = action.payload;
    },
    setDivisionId: (state, action) => {
      state.DivisionId = action.payload;
    },
    setOpenTemplateId: (state, action) => {
      state.OpenTemplateId = action.payload;
    },
    setScheduleTemplateId: (state, action) => {
      state.ScheduleTemplateId = action.payload;
    },
    clearDivisionOpenDays: (state, action) => {
      state.DivisionOpenDays = null;
      state.DivisionOpenAvailabilityDays = null;
      state.DivisionOpenDaysSegmentAvailability = null;
    },
    clearEmployeeWorkDays: (state, action) => {
      state.EmployeeWorkDays = null;
      state.EmployeeWorkAvailabilityDays = null;
      state.EmployeeWorkDaysSegmentAvailability = null;
    },

    clearSpecialOperationsDays: (state, action) => {
      state.SpecialOperationsDays = null;
      state.SpecialOperationsAvailabilityDays = null;
      state.SpecialOperationsDaysSegmentAvailability = null;
    },


    clearOpenTemplateDays: (state, action) => { 
      state.OpenTemplateDays = null; 
      state.OpenTemplateAvailabilityDays = null;
      state.OpenTemplateDaysSegmentAvailability = null;
    },
    clearScheduleTemplateDays: (state, action) => {
      state.ScheduleTemplateDays = null;
      state.ScheduleTemplateAvailabilityDays = null;
      state.ScheduleTemplateDaysSegmentAvailability = null;
    },
    clearServices: (state, action) => {
      state.ServiceAvailabilityCalendar = null;
      state.Services = null;
    },


    setCurrentViewSU: (state, action) => {
      state.CurrentViewSU = action.payload;
    },
    setDepartmentSU: (state, action) => {
      state.DepartmentSU = action.payload;
    },
    clearCurrentOrder: (state, action) => {
      state.CurrentOrder = null;
    },
    clearOrders: (state, action) => {
      state.Orders = null;
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(apiRequest.pending, (state,action) => {
        state.loading = true;
        state.error = null;
        console.log("pending.action===",action)


        state.NewApiToUserMessage = {Name: action.meta.arg.name ,Origin: action.meta.arg.url, Mood:false,msg:false};
      })
      .addCase(apiRequest.fulfilled, (state, action) => {
        console.log("fulfilled------>",action)
        state.loading = false;
        const { data, storeIn} = action.payload;
        console.log("action.payload===",action.payload)
        if (storeIn) {
          state[storeIn] = data;
        }
       

        state.NewApiToUserMessage = {
          Name: action.meta.arg.name ,
          Origin: action.meta.arg.url,
           Mood:data.status?data.status:true,msg:data.message?data.message:"Success"
          };


      })
      .addCase(apiRequest.rejected, (state, action) => {
        console.log("action===========",action)
        state.loading = false;

        state.error =
          action.payload?.apiMessage ||
          action.error?.message ||
          'Unknown error';

          state.NewApiToUserMessage = {
          // Name: action?.meta?.arg?.name,
          Origin: action.payload?.url,
          Mood: false,
          msg: state.error=="Failed to fetch"?"Network error: Failed to fetch":state.error
        };
      });
  }
});
  
  export const { clearState,clearJunk,clearOrderProducts,clearOrderServices,ResetMsg,clearOrders, 
    clearCurrentOrder,setCurrentViewSU,clearTenantUsers,clearServices,clearDivisionOpenDays,clearOpenTemplateDays,
    clearScheduleTemplateDays,clearEmployeeWorkDays,clearSpecialOperationsDays,setEstablishmentId,
    setDepartmentId,setDivisionId,setOpenTemplateId,setScheduleTemplateId,DefineRelationships,setDepartmentSU,NavBarInteracted } = ApiReducer.actions;
  export default ApiReducer.reducer;

  
  