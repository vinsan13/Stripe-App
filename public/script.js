// const button = document.getElementById("checkout");
let plans = document.querySelectorAll(".btn-check");
let a=document.getElementById("option-1");
let b=document.getElementById("option-2");
let money = document.querySelectorAll(".money");

let yearly_plans=["price_1Lb7aUSBgcwoSERnH1pKoKnN","price_1Lb7ajSBgcwoSERn8f49Mzob","price_1Lb7b8SBgcwoSERn4pWGjDNZ","price_1Lb7bSSBgcwoSERnzf5e5edF"];
let monthly_plans=["price_1Lb7ZlSBgcwoSERnHIICO7Xl","price_1Lb7Z9SBgcwoSERneAsyhdTp","price_1Lb7YuSBgcwoSERn9DhnzF9F","price_1Lb7Y7SBgcwoSERnk3PN9T0a"];

let monthly_money =["Monthly Price","₹ 100","₹ 200","₹ 500","₹ 700"]
let yearly_money =["Yearly Price","₹ 1000","₹ 2000","₹ 5000","₹ 7000"]



a.addEventListener("click",()=>{
    let i=3,j=1;
    plans.forEach(plan => {
        money[j].innerHTML = monthly_money[j]; 
        plan.value=monthly_plans[i];
        j++;
        i--;
    });
    money[0].innerHTML=monthly_money[0];
})
b.addEventListener("click",()=>{
    let i=0,j=1;
    plans.forEach(plan => {
        plan.value=yearly_plans[i];
        money[j].innerHTML = yearly_money[j];
        j++
        i++;
    });
    money[0].innerHTML=yearly_money[0];
})


plans.forEach(plan => {
    plan.addEventListener('click',()=>{
        document.getElementById("price").value=plan.value;
    })
});
// button.addEventListener('click' , ()=>{
//     console.log("hello");
//     fetch("/create-checkout-session",{
//         method: 'POST',
//         headers : {
//             "Content-Type": "application/json",
//         },
//         body : JSON.stringify({
//             price :[
//                 {id:1000,quantity:3},
//                 {id:2000,quantity:1},
//             ],
//         }),
//     }).then(res=>{
//         if(res.ok) return res.json()
//         return res.json().then(json=>Promise.reject(json))
        
//     })
//     .then(({url})=>{
//         window.location=url
//     })
//     .catch(e=>{
//         console.error(e.error);
//     })

// })