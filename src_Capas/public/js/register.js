const form = document.getElementById('registerForm');

console.log("entre a registe.js")

form.addEventListener('submit',e=>{
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key)=>obj[key]=value);
    console.log(form.elements['email'].value); // Imprime el valor del campo 'email'

    // fetch('/register',{
    //     method:'POST',
    //     body:JSON.stringify(obj),
    //     headers:{
    //         'Content-Type':'application/json'
    //     }
    // }).then(result=>result.json()).then(json=>console.log(json));
}) 