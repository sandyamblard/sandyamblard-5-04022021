///Fonctions utilisées sur plusieurs pages ///////////

//fonction pour afficher le compteur a coté de l'icone du panier de la topbar :
//1- récupération de l'élément du DOM et initialisation du compteur
let panierCompteur = document.getElementById('paniercompteur');
let count = 0;

//-2- recup des items clés et valeurs du panier et affichage du compteur : 
const updateCompteurPanier = function(){
    for (let i=0; i<localStorage.length; i++){
      let valeur = localStorage.key(i);
      let quantiteParArticle = localStorage.getItem(valeur);
      count += parseInt(quantiteParArticle, 10);
      panierCompteur.innerHTML = count;
  }
}

updateCompteurPanier();

  //////////////////////////////////////////

  // creation requete ajax avec promesse
const getInfos = function(url){
    return new Promise(function(resolve, reject){
        let request = new XMLHttpRequest();
        request.open('GET', url);
        request.onreadystatechange = function(){
            if (this.readyState === request.DONE){
                if (this.status === 200) {
                    resolve(result = JSON.parse(request.response),
                )}else {
                    reject(request.status)
                }
                
            }
        }
        request.send()
    })      
}


/// function pour animation compteur panier (utilisée ensuite pour les écoute des icones poubelles et removeItem)
function enleveClassAnimation(){
    panierCompteur.classList.remove("count--grow")
}
