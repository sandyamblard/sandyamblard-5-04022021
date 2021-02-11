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

//- 1- fonction pour afficher le coompteur a coté de l'icone du panier de la topbar :
let panierCompteur = document.getElementById('paniercompteur');
let count = 0;
panierCompteur.innerHTML = count;

//recup des items clés du panier pour affichage du compteur du panier : 
  for (let i=0; i<localStorage.length; i++){
      let valeur = localStorage.key(i);
      let quantiteParArticle = localStorage.getItem(valeur);
      count += parseInt(quantiteParArticle, 10);
      panierCompteur.innerHTML = count;
  }

// affichage ou maquage des éléments du DOM en fonction du panier vide ou non
let panierVide = document.getElementById('paniervide');
let panierPlein = document.getElementById("panierplein");
let formulaire = document.getElementById("formulaire");

if(localStorage.length !== 0){
   panierVide.style.display = "none";
   panierPlein.style.display = "flex";
   formulaire.style.display = "block";
   }else{
      panierVide.style.display = "flex";
      panierPlein.style.display = "none";
      formulaire.style.display = "none";
   }  
   
// Pour vider le panier :
let viderLePanier = document.getElementById("viderpanier");

viderLePanier.addEventListener('click', function(){
   localStorage.clear();
   panierCompteur.innerHTML = 0;
   console.log("panier vidé");
   panierVide.style.display = "flex";
   panierPlein.style.display = "none";
   formulaire.style.display = "none";
})

let totalCommande = document.getElementById("total");

// affichage des nounours contenus dans le panier :
let idPresents = []; 
for (let i=0; i<localStorage.length; i++){//1- recup des infos id, couleur et quantite depuis le panier
   let idEtCouleur = localStorage.key(i);
   let quantiteParArticle = localStorage.getItem(idEtCouleur);
   let idNounours = idEtCouleur.slice(0, 24);
   if (idPresents.includes(idNounours) == false){
       idPresents.push(idNounours);//Rajoute dans le tableau idPresents seulement si pas encore enregistré !
   }
   let couleurNounours = idEtCouleur.slice(25, idEtCouleur.length);
   let nvRecapElement = document.createElement('div');// 2- création des div et replissage avec éléments déjà présents dans le panier:
   nvRecapElement.innerHTML = '<img src="" alt="photo nounours" class="recap__img"><div class="recap__ligne--text"><p><a href="produit.html?id='+idNounours+'"><span class="name'+idNounours+'">Nom + lien</span></a></p><p class="descrip">Decription dkghsk jfgkjsd jqtgskt qkftgjgg qkgjgqlghf</p><p><span>Couleur : </span>'+  couleurNounours + ' </p><p><span>Référence : </span>'+ idNounours +'</p></div><div class="recap__ligne--quantite">Quantité: <span class="qté'+idNounours+'">' + quantiteParArticle +' </div><div class="recap__ligne--prixtotal">'+quantiteParArticle+'</div>';
   ;
   nvRecapElement.classList.add('recap__ligne');
   nvRecapElement.classList.add('recap'+idNounours)
   panierPlein.insertBefore(nvRecapElement, totalCommande);
}

let total=0;
totalCommande.innerHTML = "Total à régler : "+total + '€';

// fonction pour compléter les éléments du recapitulatif après requete : à partir object obtenu
let completeRecap = function(object){
    let listeDescriptionParId = document.querySelectorAll(".recap"+object._id+" .descrip");
    for(let descrip of listeDescriptionParId){
        descrip.innerHTML = object.description;
    }
    let listenameParId = document.querySelectorAll(".name"+object._id);
    for(let name of listenameParId){
        name.innerHTML = object.name;
    }
    let listePhotoParId = document.querySelectorAll(".recap"+object._id+" img");
    for(let photo of listePhotoParId){
        photo.setAttribute('src', object.imageUrl);
    }
    let listePrixParId = document.querySelectorAll(".recap"+object._id+" .recap__ligne--prixtotal");
    for(let prix of listePrixParId){
        let recupQte = parseInt(prix.innerText, 10);
        let calculPrix = recupQte * parseInt(object.price, 10);
        total += 0.01* parseInt(calculPrix, 10);
        prix.innerHTML = "Total: "+ calculPrix*0.01+' €';
        totalCommande.innerHTML = "Total à régler :  "+total+'€';
    }
}

//Requete et completion des éléments :
for (let idAChercher of idPresents){
    getInfos('http://localhost:3000/api/teddies/' + idAChercher).then(objetobtenu => completeRecap(objetobtenu));
}





