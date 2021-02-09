///GENERAL POUR TOUTES LES PAGES ///////////

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
///////////////////////////


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



//- 1- fonction pour afficher le coompteur a coté de l'icone du panier de la topbar :
let panierCompteur = document.getElementById('paniercompteur');
let count = 0;
panierCompteur.innerHTML = count;

//recup des items clés du panier : 
  for (let i=0; i<localStorage.length; i++){
      let valeur = localStorage.key(i);
      let quantiteParArticle = localStorage.getItem(valeur);
      count += parseInt(quantiteParArticle, 10);
    console.log(count);
  }



///------------------------------------PANIER --------------------------

//Ecoute du click sur bouton "ajout au panier"
let btnpanier = document.getElementById("btnpanier");
let qtt = document.getElementById("choixquantite");
//let arrayCouleurQte = []

btnpanier.addEventListener('click', function(){
    if(!localStorage.getItem(pageId + "_" + select.value)){//vérifie que l'id de l'item du panier n'existe pas déjà
      localStorage.setItem(pageId + "_" + select.value, qtt.value);
    }else{//si l'id existe déjà, ajoute la quantité dans l'item déjà présent
        let infosPanier = parseInt(localStorage.getItem(pageId + "_" + select.value), 10);//conversion en number
        infosPanier += parseInt(qtt.value, 10);
        localStorage.setItem(pageId + "_" + select.value, infosPanier);
        console.log(infosPanier);
    }
    
})    
 
panierCompteur.innerHTML = count;


   //CODE ok mais pb pour dernier cas : rajoute trop de nouvelle couleurs.... SUrement pb a cause de l'ordre de parcours de la boucle
  /* if(!localStorage.getItem(pageId)){ //cas ou nours de la page n'est pas déja dans le panier : creation d'un localstorage
        let ajoutcouleur = {
            'couleur' : select.value,
            'quantite' : parseInt(qtt.value, 10),
            };
        arrayCouleurQte.push(ajoutcouleur);
        localStorage.setItem(pageId, JSON.stringify(arrayCouleurQte)); //ok ça marche, crée un nouvel article dans le panier avec l'id du nouveau nounours
        
        } else { //si id du nounours déjà dans le panier :
            let recupDonnesPanier = JSON.parse(localStorage.getItem(pageId));
            //console.log(recupDonnesPanier);
            for (let donnees of recupDonnesPanier){
                if(donnees.couleur !== select.value){//si couleur n'existe pas dans le panier : ajoute le nv couple couleur/quantité au panier avec l'id du nounours en cours
                    let nvCouleur = {
                        'couleur' : select.value,
                        'quantite' : parseInt(qtt.value, 10),
                        };
                    recupDonnesPanier.push(nvCouleur);
                    localStorage.setItem(pageId, JSON.stringify(recupDonnesPanier)); //ok ça rajoute la nouvelle couleur au panier
                    console.log(recupDonnesPanier);
                }else /*si couleur existe déjà*//*{

                    donnees.quantite += parseInt(qtt.value, 10); //ok ça marche, ça modifie l'object correspondant mais ne sauvegarde pas dans le arrayCouleurQte ...
                    
                    localStorage.setItem(pageId, JSON.stringify(recupDonnesPanier));
                    console.log("dernier cas");
                    console.log(recupDonnesPanier);
                    
                }
            }
        }    */

      /*  if(!localStorage.getItem(pageId)){ //cas ou nours de la page n'est pas déja dans le panier : creation d'un localstorage
        let ajoutcouleur = {
            'couleur' : select.value,
            'quantite' : parseInt(qtt.value, 10),
            };
        arrayCouleurQte.push(ajoutcouleur);
        localStorage.setItem(pageId, JSON.stringify(arrayCouleurQte)); //ok ça marche, crée un nouvel article dans le panier avec l'id du nouveau nounours
        
        } else { //si id du nounours déjà dans le panier :
            let recupDonnesPanier = JSON.parse(localStorage.getItem(pageId)); //recup des éléments associés à l'id du nounours déjà présent
            //console.log(recupDonnesPanier);
            for (let donnees of recupDonnesPanier){
                if(donnees.couleur == select.value){ //si le
                    donnees.quantite += parseInt(qtt.value, 10); //ok ça marche, ça modifie l'object correspondant mais ne sauvegarde pas dans le arrayCouleurQte ...
                    localStorage.setItem(pageId, JSON.stringify(recupDonnesPanier));
                    console.log("dernier cas");
                    console.log(recupDonnesPanier);
            
                }else if(donnees.couleur !== select.value) {
                    let nvCouleur = {
                        'couleur' : select.value,
                        'quantite' : parseInt(qtt.value, 10),
                        };
                    recupDonnesPanier.push(nvCouleur);
                    localStorage.setItem(pageId, JSON.stringify(recupDonnesPanier)); 
                    console.log(recupDonnesPanier);
                    
                }
            }
        }    
*/
