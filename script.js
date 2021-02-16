
///GENERAL POUR TOUTES LES PAGES ///////////
//- 1- fonction pour afficher le compteur a coté de l'icone du panier de la topbar :
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