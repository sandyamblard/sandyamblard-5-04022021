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

// affichage des nounours contenus dans le panier :

for (let i=0; i<localStorage.length; i++){//1- recup des infos id, couleur et quantite depuis le panier
   let idEtCouleur = localStorage.key(i);
   let quantiteParArticle = localStorage.getItem(idEtCouleur);
   let idNounours = idEtCouleur.slice(0, 24);
   let couleurNounours = idEtCouleur.slice(25, idEtCouleur.length);
   console.log(idNounours);
   console.log(couleurNounours);
   console.log(quantiteParArticle);
   let nvRecapElement = document.createElement('div');// 2- création des div et replissage avec éléments déjà présents dans le panier:
   nvRecapElement.innerHTML = '<img src="" alt="photo nounours" class="recap__img"><div class="recap__ligne--text"><p><a href="produit.html?id='+idNounours+'"><span>Nom + lien</span></a></p><p>Decription dkghsk jfgkjsd jqtgskt qkftgjgg qkgjgqlghf</p><p><span>Couleur : </span>'+  couleurNounours + ' </p><p><span>Référence : </span>'+ idNounours +'</p></div><div class="recap__ligne--quantite">Quantité: <span class="qté'+idNounours+'">' + quantiteParArticle +' </div><div class="recap__ligne--prixtotal">Prix total: 25€</div>';
   ;
   nvRecapElement.classList.add('recap__ligne');
   nvRecapElement.classList.add('recap'+idNounours)
   panierPlein.insertBefore(nvRecapElement, viderLePanier);
}

/*Prochaine étape : 
1- rajouter prix ds les clé des items du panierPlein, récup le prix en mm temps que id couleur et qté, pour calcul total avant injection ds innerhtml
2- requete avec id trouvé (faire promesse pour fonction précédente)
3- then : lister les nodelist pour img et description + compléter avec éléments recup de la requete
*/


//fonction pour compléter éléments de recap après la requête ajax :
/*let completerRecap = function(object){

}*/

//console.log(document.querySelectorAll(".recap5beaa8bf1c9d440000a57d94"));

//Adresse de l'API a entrer pour la requête :
//let apiAndId = 'http://localhost:3000/api/teddies/' + pageId;