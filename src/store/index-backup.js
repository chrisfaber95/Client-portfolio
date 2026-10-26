import { createStore } from 'vuex'
import auth from '@/assets/scripts/auth'
export default createStore({
    state () {
        return{
            shoppingCart: Object.create(null),
            actieShoppingCart: Object.create(null),
            groceryList: Object.create(null),
            koopzegelAmount: 0,
            amountOfShelf: 4,
            scrollDirection: 'horizontal',
            availableDepartments: null,
            availableSubDepartments: null,
            currentDepartment: null,
            currentSubDepartment: null,
            shelfStyle: 0,
            currentActie: null,
            actie: null,
            loggedIn: false ,
            opened: null
        }
    },
    getters: {
        getShoppingCart (state) {
            return state.shoppingCart
        },
        getActieShoppingCart (state) {
            return state.actieShoppingCart
        },
        getGroceryList (state) {
            return state.groceryList
        },
        getKoopzegels (state) {
            return state.koopzegelAmount
        },
        getAvailableDepartments (state){
            return state.availableDepartments
        },
        getAvailableSubDepartments (state){
            return state.availableSubDepartments
        },
        getCurrentDepartment (state){
            return state.currentDepartment
        },
        getCurrentSubDepartment (state){
            return state.currentSubDepartment
        },
        getShelfStyle(state){
            return state.shelfStyle
        },
        getCurrentActie(state){
            return state.currentActie
        },
        getActie(state){
            return state.actie
        },
        getLoggedIn(state){
            return state.loggedIn
        },
        getOpened(state){
            return state.opened
        }
    },
    mutations: {
        addItemToCart(state, payload){
            if(state.shoppingCart[payload.product.id]){
                state.shoppingCart[payload.product.id].amount += payload.amount
            } 
            else { 
                state.shoppingCart[payload.product.id] = payload 
            }
            localStorage.setItem('cart', JSON.stringify(state.shoppingCart))
        },
        updateItemAmount(state, payload){
            state.shoppingCart[payload.product.id] = payload
            if(payload.amount <= 0 || !payload.amount) delete state.shoppingCart[payload.product.id]
            localStorage.setItem('cart', JSON.stringify(state.shoppingCart))
        },
        clearAllItems(state){
            state.shoppingCart = Object.create(null)
            localStorage.setItem('cart', JSON.stringify(state.shoppingCart))
        },
        reloadCart(state){
            state.shoppingCart = JSON.parse(localStorage.getItem('cart'))
        },
        
        addItemToActieCart(state, payload){
            if(state.actieShoppingCart[payload.product.id]){
                state.actieShoppingCart[payload.product.id].amount += payload.amount
                state.actieShoppingCart[payload.product.id].variant = payload.variant
            }
            else {
                state.actieShoppingCart[payload.product.id] = payload        
            }
            localStorage.setItem('actiecart', JSON.stringify(state.actieShoppingCart))
        },
        updateActieItemAmount(state, payload){
            state.actieShoppingCart[payload.product.id] = payload
            if(payload.amount <= 0 || !payload.amount) delete state.actieShoppingCart[payload.product.id]
            localStorage.setItem('actiecart', JSON.stringify(state.actieShoppingCart))
        },
        clearAllActieItems(state){
            state.actieShoppingCart = Object.create(null)
            localStorage.setItem('actiecart', JSON.stringify(state.actieShoppingCart))
        },
        reloadActieCart(state){
            state.actieShoppingCart = JSON.parse(localStorage.getItem('actiecart'))
        },


        addItemToGroceryList(state, payload){
            if(state.groceryList[payload.product.id]){
                state.groceryList[payload.product.id].amount += payload.amount
                state.groceryList[payload.product.id].check = payload.check
            } 
            else { 
                state.groceryList[payload.product.id] = payload 
            }
            localStorage.setItem('groceryList', JSON.stringify(state.groceryList))
        },
        updateItemAmountGroceryList(state, payload){
            var check = false
            if(state.groceryList[payload.product.id]){
                check = state.groceryList[payload.product.id].check
            }
            payload.check = check
            state.groceryList[payload.product.id] = payload
            if(payload.amount <= 0 || !payload.amount) delete state.groceryList[payload.product.id]
            localStorage.setItem('groceryList', JSON.stringify(state.groceryList))
        },
        clearAllItemsGroceryList(state){
            state.groceryList = Object.create(null)
            localStorage.setItem('groceryList', JSON.stringify(state.groceryList))
        },
        reloadGroceryList(state){
            state.groceryList = JSON.parse(localStorage.getItem('groceryList'))
        },
        
        listToMand(state){
            for (const key in state.groceryList) {
                if (Object.hasOwnProperty.call(state.groceryList, key)) {
                    const element = state.groceryList[key];
                    if(state.shoppingCart[element.product.id]){
                        state.shoppingCart[element.product.id].amount += element.amount
                    } 
                    else { 
                        state.shoppingCart[element.product.id] = element 
                    }
                    localStorage.setItem('cart', JSON.stringify(state.shoppingCart))
                    
                }
            }
            //state.shoppingCart = JSON.parse(localStorage.getItem('groceryList'))
        },
        updateCheckListItem(state, payload){
            if(state.groceryList[payload.product.id]){
                if(state.groceryList[payload.product.id].check != payload.check){
                    state.groceryList[payload.product.id].check = payload.check
                }
            }
            localStorage.setItem('groceryList', JSON.stringify(state.groceryList))
        },
        

        changeAvailableDepartment(state, payload){
            state.availableDepartments = payload
        }, 
        
        changeAvailableSubDepartment(state, payload){
            if(payload)
            state.availableSubDepartments.push(payload)
        },
        resetAvailableSubDepartments(state){
            state.availableSubDepartments = []
        },
        setAvailableSubDepartments(state, payload){
            state.availableSubDepartments = []
            state.availableSubDepartments = payload
        },
        changeDepartment(state, payload){
            state.availableSubDepartments = []
            if(payload != 0){
                if(payload?.nix18){
                    if(!localStorage.getItem('nix18') || localStorage.getItem('nix18') == 0){
                        if(auth.isNotUnderaged()){
                            localStorage.setItem('nix18', 1)
                            state.currentDepartment = payload
                        }
                        else{
                            if(confirm('NIX18 Waarschuwing')){
                                localStorage.setItem('nix18', 1)
                                state.currentDepartment = payload
                            }
                            else{
                                localStorage.setItem('nix18', 0)
                            }
                        }
                    }
                    else{
                        state.currentDepartment = payload
                    }
                }
                else{
                    state.currentDepartment = payload
                }
            }
            else{
                state.currentDepartment = payload
            }
        },
        changeSubDepartment(state, payload){
            state.currentSubDepartment = payload
        },
        changeShelfSize(state, payload){
            state.amountOfShelf = payload
        },       
        changeShelfStyle(state, payload){
            state.shelfStyle = payload
        },
        updateKoopzegelAmount(state, payload){
            state.koopzegelAmount = payload
        },
        changeCurrentActie(state, payload){
            state.currentActie = payload
        },
        changeActie(state, payload){
            state.actie = payload
        },
        updateLoggedIn(state, payload){
            state.loggedIn = payload
        },
        updateOpened(state, payload){
            localStorage.setItem('opened', payload)
            state.opened = payload
        }
        /*updatePickingMethod(state, payload) {
            state.pickingMethod = payload
        },
        updateAlarm(state, payload){
            state.alarm = payload
        },
        clearAlarm(state){
            state.alarm = 0
        }*/
    },
    actions: {},
    modules: {}
});