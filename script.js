let resutlApi = document.getElementById('resultsnounoursapi');

let request = new XMLHttpRequest();
request.open('GET', 'http://localhost:3000/api/teddies');
/*request.responseType = "json";*/
request.onreadystatechange = function(){
    if (request.readyState == 4 && request.status == 200) {
    var response = JSON.parse(request.responseText);
    console.log(response);
    resutlApi.innerText = request.responseText;

    }
};
/*{
    if(request.readyState == 4){
        console.log("reussi");
    }else{
        console.log("raté");
    }
};*/
request.send();