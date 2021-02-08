const getInfos = function(url){
    return new Promise(function(resolve, reject){
        let request = new XMLHttpRequest();
        request.onload = function(){
            if (request.status == 200){
                resolve(
                result = JSON.parse(request.response),
                )
                
            }else if (request.onerror || request.status !=200){
                reject(console.log("Erreur d'accès au serveur, " + "readyState = " + request.readyState));
            }
        }
        request.open('GET', url);
        request.send()
    })
}

//Recupération de l'id du produit de la page via son url :
let params = new URLSearchParams(window.location.search);
let pageId = params.get("id"); 


//Adresse de l'API a entrer pour la requête :
let apiAndId = 'http://localhost:3000/api/teddies/' + pageId;


//variables avec différent éléments à modifier de la page: 
let titleproduit = document.getElementById('titleproduit');
let imgproduit = document.getElementById('imgproduit');
let produitref = document.getElementById('produitref');
let produitdescrip = document.getElementById('produitdescrip');
let produitprix = document.getElementById('produitprix');
let select = document.getElementById('choixcouleur');


//fonctions pour entrer les élements de l'api dans la page perosnnalisée :
//--1-création zone sélect en fonction du nombre de couleurs possibles :
let createSelectColor = function(array){
    for (let couleur of array){
      let nvSelect = document.createElement('option');
        nvSelect.setAttribute('value', couleur);
        nvSelect.setAttribute('id', couleur);
        nvSelect.innerHTML = couleur;
       select.append(nvSelect);
    }
}


//--2-creation fonction pour rentrer les différents éléments du nounours à paritr des resultats de l'api :
let persoProductPage = function (object){
    titleproduit.innerHTML = object.name;
    imgproduit.setAttribute('src', object.imageUrl); 
    produitref.innerHTML = "Référence: " + pageId;
    produitdescrip.innerHTML = object.description;
    produitprix.innerHTML = "Prix : " + object.price *0.01 + ' €';
   createSelectColor(object.colors);
} 


//récupération des éléments de l'api, en fonction du nounours :
getInfos(apiAndId)
.then(listNounoursById => persoProductPage(listNounoursById)
).catch (console.error);


