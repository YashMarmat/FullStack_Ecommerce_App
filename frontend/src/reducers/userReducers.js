import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,

    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,

    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,

    UPDATE_USER_DETAILS_REQUEST,
    UPDATE_USER_DETAILS_SUCCESS,
    UPDATE_USER_DETAILS_FAIL,
    UPDATE_USER_DETAILS_RESET,

    DELETE_USER_ACCOUNT_REQUEST,
    DELETE_USER_ACCOUNT_SUCCESS,
    DELETE_USER_ACCOUNT_FAIL,
    DELETE_USER_ACCOUNT_RESET,

    GET_USER_ALL_ADDRESSES_REQUEST,
    GET_USER_ALL_ADDRESSES_SUCCESS,
    GET_USER_ALL_ADDRESSES_FAIL,

    GET_SINGLE_ADDRESS_REQUEST,
    GET_SINGLE_ADDRESS_SUCCESS,
    GET_SINGLE_ADDRESS_FAIL,
    GET_SINGLE_ADDRESS_RESET,

    CREATE_USER_ADDRESS_REQUEST,
    CREATE_USER_ADDRESS_SUCCESS,
    CREATE_USER_ADDRESS_FAIL,
    CREATE_USER_ADDRESS_RESET,

    UPDATE_USER_ADDRESS_REQUEST,
    UPDATE_USER_ADDRESS_SUCCESS,
    UPDATE_USER_ADDRESS_FAIL,
    UPDATE_USER_ADDRESS_RESET,

    DELETE_USER_ADDRESS_REQUEST,
    DELETE_USER_ADDRESS_SUCCESS,
    DELETE_USER_ADDRESS_FAIL,
    DELETE_USER_ADDRESS_RESET,

    CHECK_TOKEN_VALID_REQUEST,
    CHECK_TOKEN_VALID_SUCCESS,
    CHECK_TOKEN_VALID_FAIL,
    CHECK_TOKEN_VALID_RESET,

    GET_ALL_ORDERS_REQUEST,
    GET_ALL_ORDERS_SUCCESS,
    GET_ALL_ORDERS_FAIL,

} from '../constants/index'


// Login
export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return {
                ...state,
                loading: true
            }
        case USER_LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                userInfo: action.payload
            }
        case USER_LOGIN_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case USER_LOGOUT:
            return {}

        default:
            return state
    }
}

// Register
export const userRegisterReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            return {
                ...state,
                loading: true
            }
        case USER_REGISTER_SUCCESS:
            return {
                ...state,
                loading: false,
                userInfo: action.payload
            }
        case USER_REGISTER_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case USER_LOGOUT:
            return {}

        default:
            return state
    }
}


// user details reducer
export const userDetailsReducer = (state = {}, action) => {
    switch(action.type) {
        case USER_DETAILS_REQUEST:
            return {
                ...state, 
                loading: true,
                user: {},
                error: ""
            }
        case USER_DETAILS_SUCCESS:
            return {
                ...state, 
                loading: false,
                user: action.payload,
                error: ""
            }
        case USER_DETAILS_FAIL:
            return {
                ...state,
                loading: false,
                user: {},
                error: action.payload
            }
        default:
            return state
    }
}

// user details update reducer
export const userDetailsUpdateReducer = (state = {}, action) => {
    switch(action.type) {
        case UPDATE_USER_DETAILS_REQUEST:
            return {
                ...state, 
                loading: true,
                user: {},
                success: false,
                error: ""
            }
        case UPDATE_USER_DETAILS_SUCCESS:
            return {
                ...state, 
                loading: false,
                success: true,
                user: action.payload,
                error: ""
            }
        case UPDATE_USER_DETAILS_FAIL:
            return {
                ...state,
                loading: false,
                success: false,
                user: {},
                error: action.payload
            }
        case UPDATE_USER_DETAILS_RESET:
            return {
                ...state,
                loading: false,
                success: false,
                user: {},
                error: ""
            }
        default:
            return state
    }
}

// delete user account reducer
export const deleteUserAccountReducer = (state = {}, action) => {
    switch(action.type) {
        case DELETE_USER_ACCOUNT_REQUEST:
            return {
                ...state, 
                loading: true,
                success: false,
                error: ""
            }
        case DELETE_USER_ACCOUNT_SUCCESS:
            return {
                ...state, 
                loading: false,
                success: true,
                error: ""
            }
        case DELETE_USER_ACCOUNT_FAIL:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.payload
            }
        case DELETE_USER_ACCOUNT_RESET:
            return {
                ...state,
                loading: false,
                success: false,
                error: ""
            }
        default:
            return state
    }
}

// check token validation reducer
export const checkTokenValidationReducer = (state = {}, action) => {
    switch(action.type) {
        case CHECK_TOKEN_VALID_REQUEST:
            return {
                ...state, 
                loading: true,
                valid: false,
                error: ""
            }
        case CHECK_TOKEN_VALID_SUCCESS:
            return {
                ...state, 
                loading: false,
                valid: true,
                error: ""
            }
        case CHECK_TOKEN_VALID_FAIL:
            return {
                ...state,
                loading: false,
                valid: false,
                error: action.payload
            }
        case CHECK_TOKEN_VALID_RESET:
            return {
                ...state,
                loading: false,
                valid: false,
                error: ""
            }
        default:
            return state
    }
}



// get all addresses of user reducer
export const getAllAddressesOfUserReducer = (state = {}, action) => {
    switch(action.type) {
        case GET_USER_ALL_ADDRESSES_REQUEST:
            return {
                ...state, 
                loading: true,
                addresses: [],
                success: false,
                error: ""
            }
        case GET_USER_ALL_ADDRESSES_SUCCESS:
            return {
                ...state, 
                loading: false,
                addresses: action.payload,
                success: true,
                error: ""
            }
        case GET_USER_ALL_ADDRESSES_FAIL:
            return {
                ...state,
                loading: false,
                addresses: [],
                success: false,
                error: action.payload
            }
        default:
            return state
    }
}

// get single address reducer
export const getSingleAddressReducer = (state = {}, action) => {
    switch(action.type) {
        case GET_SINGLE_ADDRESS_REQUEST:
            return {
                ...state, 
                loading: true,
                address: {},
                success: false,
                error: ""
            }
        case GET_SINGLE_ADDRESS_SUCCESS:
            return {
                ...state, 
                loading: false,
                address: action.payload,
                success: true,
                error: ""
            }
        case GET_SINGLE_ADDRESS_FAIL:
            return {
                ...state,
                loading: false,
                address: {},
                success: false,
                error: action.payload
            }
        case GET_SINGLE_ADDRESS_RESET:
            return {
                ...state,
                loading: false,
                address: {},
                success: false,
                error: ""
            }
        default:
            return state
    }
}

// create user address
export const createUserAddressReducer = (state = {}, action) => {
    switch(action.type) {
        case CREATE_USER_ADDRESS_REQUEST:
            return {
                ...state, 
                loading: true,
                address: {},
                success: false,
                error: ""
            }
        case CREATE_USER_ADDRESS_SUCCESS:
            return {
                ...state, 
                loading: false,
                address: action.payload,
                success: true,
                error: ""
            }
        case CREATE_USER_ADDRESS_FAIL:
            return {
                ...state,
                loading: false,
                success: false,
                address: {},
                error: action.payload
            }
        case CREATE_USER_ADDRESS_RESET:
            return {
                ...state,
                loading: false,
                success: false,
                address: {},
                error: ""
            }
        default:
            return state
    }
}

// update user address
export const updateUserAddressReducer = (state = {}, action) => {
    switch(action.type) {
        case UPDATE_USER_ADDRESS_REQUEST:
            return {
                ...state, 
                loading: true,
                success: false,
                error: ""
            }
        case UPDATE_USER_ADDRESS_SUCCESS:
            return {
                ...state, 
                loading: false,
                success: true,
                error: ""
            }
        case UPDATE_USER_ADDRESS_FAIL:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.payload
            }
        case UPDATE_USER_ADDRESS_RESET:
            return {
                ...state,
                loading: false,
                success: false,
                error: ""
            }
        default:
            return state
    }
}

// delete user address reducer
export const deleteUserAddressReducer = (state = {}, action) => {
    switch(action.type) {
        case DELETE_USER_ADDRESS_REQUEST:
            return {
                ...state, 
                loading: true,
                success: false,
                error: ""
            }
        case DELETE_USER_ADDRESS_SUCCESS:
            return {
                ...state, 
                loading: false,
                success: true,
                error: ""
            }
        case DELETE_USER_ADDRESS_FAIL:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.payload
            }
        case DELETE_USER_ADDRESS_RESET:
            return {
                ...state,
                loading: false,
                success: false,
                error: ""
            }
        default:
            return state
    }
}

// get all orders reducer
export const getAllOrdersReducer = (state = {orders: []}, action) => {
    switch(action.type) {
        case GET_ALL_ORDERS_REQUEST:
            return {
                ...state, 
                loading: true,
                orders: [],
                error: ""
            }
        case GET_ALL_ORDERS_SUCCESS:
            return {
                ...state, 
                loading: false,
                orders: action.payload,
                error: ""
            }
        case GET_ALL_ORDERS_FAIL:
            return {
                ...state,
                loading: false,
                orders: [],
                error: action.payload
            }
        default:
            return state
    }
}
