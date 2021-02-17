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


//--2-creation fonction pour rentrer les différents éléments du nounours à partir des resultats de l'api :
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
.then(objectNounoursById => persoProductPage(objectNounoursById)
).catch (console.error);


////Ecoute input quantité pour ajuster le prix en fonction de la quantité choisie :
let qtt = document.getElementById("choixquantite");
let calculPrixXQuantite = function(nb){
    return Math.round(0.01* parseInt(qtt.value, 10) * parseInt(nb, 10))
}

qtt.addEventListener('input', function(){ //écoute du sélect de quantité
    getInfos(apiAndId)//requete pour obtenir le prix du produit
        .then(obj => calculPrixXQuantite(obj.price))//calcul en fonction de la quantité choisie
        .then(result =>produitprix.innerHTML = "Prix : " + result + ' €')//affichage dans zone Prix du DOM
        .catch(console.error);
    })


///------------------------------------PANIER --------------------------
//Chaque item a comme clé : IdDuNounours_CouleurChoisieAuSélectCouleur et valeur = quantitéChoisieParSelectQuantité

//Ecoute du click sur bouton "ajout au panier"
//Fonctions préalables nécessaires pour ensuite :
let btnpanier = document.getElementById("btnpanier");


function retraitModifTexteBouton(){
    btnpanier.innerHTML = '<span>Ajouter au panier</span><i class="fas fa-cart-plus"></i>';
}

//Ecouteur d'évennement :
btnpanier.addEventListener('click', function(){
    if(!localStorage.getItem(pageId + "_" + select.value)){//vérifie que l'id+couleur n'existe pas déjà et crée un nouvel item ds panier
      localStorage.setItem(pageId + "_" + select.value, qtt.value);
    
    }else{//si l'id+couleur existe déjà, ajoute la quantité dans l'item déjà présent
       let infosPanier = parseInt(localStorage.getItem(pageId + "_" + select.value), 10);//conversion en number de la qté déjà présente
        infosPanier += parseInt(qtt.value, 10);//ajout de la nouvelle quantité à celle déjà présente dans l'item
        localStorage.setItem(pageId + "_" + select.value, infosPanier);//ajout de la qté rajoutée au total*/
    }
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


