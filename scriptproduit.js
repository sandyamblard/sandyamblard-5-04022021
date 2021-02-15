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


// fonction pour afficher le coompteur a coté de l'icone du panier de la topbar :
let panierCompteur = document.getElementById('paniercompteur');
let count = 0;
panierCompteur.innerHTML = count;

//recup des items clés du panier pour affichage du compteur du panier : 
   const updateCompteurPanier = function(){
    for (let i=0; i<localStorage.length; i++){
      let valeur = localStorage.key(i);
      let quantiteParArticle = localStorage.getItem(valeur);
      count += parseInt(quantiteParArticle, 10);
      panierCompteur.innerHTML = count;
  }
}

updateCompteurPanier();
  

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







///------------------------------------PANIER --------------------------
//Chaque item a comme clé : IdDuNounours_CouleurChoisieAuSélectCouleur et valeur = quantitéChoisieParSelectQuantité

//Ecoute du click sur bouton "ajout au panier"
let btnpanier = document.getElementById("btnpanier");
let qtt = document.getElementById("choixquantite");
function enleveClassAnimation(){
    panierCompteur.classList.remove("count--grow")
}
function retraitModifTexteBouton(){
    btnpanier.innerHTML = '<span>Ajouter au panier</span><i class="fas fa-cart-plus"></i>';
}


btnpanier.addEventListener('click', function(){
    if(!localStorage.getItem(pageId + "_" + select.value)){//vérifie que l'id+couleur n'existe pas déjà et crée un nouvel item ds panier
      localStorage.setItem(pageId + "_" + select.value, qtt.value);
    }else{//si l'id+couleur existe déjà, ajoute la quantité dans l'item déjà présent
       let infosPanier = parseInt(localStorage.getItem(pageId + "_" + select.value), 10);//conversion en number de la qté déjà présente
        infosPanier += parseInt(qtt.value, 10);//ajout de la nouvelle quantité à celle déjà présente dans l'item
        localStorage.setItem(pageId + "_" + select.value, infosPanier);//ajout de la qté rajoutée au total*/
    }
    console.log("ajouté aupanier");
    panierCompteur.innerHTML = parseInt(panierCompteur.innerText, 10) + parseInt(qtt.value, 10);//mise à jour du compteur panier en haut
    panierCompteur.classList.add("count--grow");//animation pour compteur pour visualiser l'ajout dans le panier
    setTimeout(enleveClassAnimation, 600);//retrait class Animation pour qu'elle puisse se répéter si rajout élément ds le panier depuis cette meme page sans la recharger
    passerCommande.style.display = "block"; //affiche le bouton "passez commande"
    btnpanier.innerHTML = "Ajouté";//modif provisoirement texte du bouton pour mieux visualiser l'ajout au panier 
    setTimeout(retraitModifTexteBouton, 800);
})    
 

// Retirer le bouton "passer comande" si panier vide :
let passerCommande = document.getElementById("passercommande");
if(localStorage.length === 0){
    passerCommande.style.display = "none";
}




//BROUILLON avec sauvegarde des items par clé : id Nounours et valeurs = objet avec qté, couleur etc
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
