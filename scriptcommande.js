///GENERAL POUR TOUTES LES PAGES ///////////
//Fonction pour la requete GET:
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

//fonction pour afficher le coompteur a coté de l'icone du panier de la topbar :
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
  

function enleveClassAnimation(){
    panierCompteur.classList.remove("count--grow")
}

//////////////////////////////  


// affichage ou maquage des éléments du DOM en fonction du panier vide ou plein
let panierVide = document.getElementById('paniervide');
let panierPlein = document.getElementById("panierplein");
let formulaire = document.getElementById("formulaire");

let affichageSectionsSelonPanier = function(){
    if(localStorage.length !== 0){
   panierVide.style.display = "none";
   panierPlein.style.display = "flex";
   formulaire.style.display = "block";
   }else{
      panierVide.style.display = "flex";
      panierPlein.style.display = "none";
      formulaire.style.display = "none";
   } 
}
affichageSectionsSelonPanier();
 
   
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
let totalCommande = document.getElementById("total");
let idPresents = []; //array d'id pour la requete GET ensuite, 1 seule fois max par Id de nounours
let products = []; //array d'id pour envoi commande, requete POST (autant de fois chaque nounours en fonction de la quantité choisie)

for (let i=0; i<localStorage.length; i++){//1- recup des infos id, couleur et quantite depuis le panier
   let idEtCouleur = localStorage.key(i);
   let quantiteParArticle = localStorage.getItem(idEtCouleur);
   let idNounours = idEtCouleur.slice(0, 24);
   if (idPresents.includes(idNounours) == false){
       idPresents.push(idNounours);//Rajoute dans le tableau idPresents seulement si pas encore enregistré !
   }
   for(let j =0; j<quantiteParArticle; j++){
       products.push(idNounours);//rajoute dans Products, autant de fois que la quantité
   }
   let couleurNounours = idEtCouleur.slice(25, idEtCouleur.length);//recuperation de la couleur à partir de la clé de l'item de localStorage
   let couleurModifiee = couleurNounours.replace(/ /, '-');//modication dela couleur (retrait des espaces) pour pouvoir la mettre en classe
   let nvRecapElement = document.createElement('div');// 2- création des div et replissage avec éléments déjà présents dans le panier:
   nvRecapElement.innerHTML = '<img src="" alt="photo nounours" class="recap__img"><div class="recap__ligne--text"><p><a href="produit.html?id='+idNounours+'"><span class="nomnounours name'+idNounours+'">Nom + lien</span></a></p><p class="descrip">Decription dkghsk jfgkjsd jqtgskt qkftgjgg qkgjgqlghf</p><p><span>Couleur : </span>'+  couleurNounours + ' </p><p><span>Référence : </span>'+ idNounours +'</p></div><div class="recap__ligne--quantite">Quantité: <span class="qté'+idNounours+'">' + quantiteParArticle +' </div><div class="recap__ligne--prix">Total: </br><span class="recap__ligne--prixtotal">'+quantiteParArticle+'</span> €</div><a href="#" title="Retirer cet article du panier" class="poubelle" id="'+idNounours+'_'+couleurModifiee+'"><i class="far fa-trash-alt"></i></a>';
   ;
   nvRecapElement.classList.add('recap__ligne');
   nvRecapElement.classList.add('recap'+idNounours);
   nvRecapElement.setAttribute("id",'recap'+idNounours+'_'+couleurModifiee);
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
        prix.innerHTML = /*"Total: "+*/ calculPrix*0.01/*+' €'*/;
        totalCommande.innerHTML = "Total à régler :  "+total+'€';
    }
}

//Requete et completion des éléments :
for (let idAChercher of idPresents){
    getInfos('http://localhost:3000/api/teddies/' + idAChercher).then(objetobtenu => completeRecap(objetobtenu)).catch(error => console.log(error));
}

////Icones "poubelles" et removeItem //////
let listPoubelles = document.getElementsByClassName("poubelle");//ciblage de toutes les poubelles dans array node list 


for(let i=0; i < listPoubelles.length; i++){//pr chaque poubelle : recup de la valeur de l'id = Id_CouleurModifiée
    let idRecupere = listPoubelles[i].getAttribute("id");
    let idPourComparaisonItemLS = idRecupere.replace(/-/, ' ');//changement des - par des espaces pour retrouver la syntaxe des clés des items localStorage
    let idPourRequetePrix = idRecupere.slice(0,24);//preparation Id nounours pour future requete pour récupérer prix total
    let divARetirer = document.getElementById("recap"+idRecupere);//ciblage des futures div a retirer une fois article retiré du local storage
                            
    listPoubelles[i].addEventListener('click', function(e){//écoute du click sur la poubelle
        e.preventDefault;
        let qteARetirer = localStorage.getItem(idPourComparaisonItemLS); //recup qté à enlever au panier
        localStorage.removeItem(idPourComparaisonItemLS);
        ///
        let divARetirer = document.getElementById("recap"+idRecupere);//retrait div correspondaante
        divARetirer.style.display = "none";
        ///
        affichageSectionsSelonPanier();//affichage des différentes section suivant si panier devenu vide ou non
 
        count -= qteARetirer;//changement affichage du nombre au compteur panier
        panierCompteur.innerHTML = count;
        ///
        //recalcul du prix total de commande : requete pour obtenir prix de l'item
        let calculPrixARetirer = function(prixUnitaire){
            let prixARetirer = qteARetirer * prixUnitaire*0.01;
            total -=prixARetirer,10;
            totalCommande.innerHTML = "Total à régler : "+total + '€';
        }
        getInfos('http://localhost:3000/api/teddies/' + idPourRequetePrix).then(ojet => calculPrixARetirer(ojet.price)).catch(error => console.log(error));
        //animation du compteur du panier :
        panierCompteur.classList.add("count--grow");//animation pour compteur pour visualiser l'ajout dans le panier
        setTimeout(enleveClassAnimation, 600);
        

    })
}

let calculPrixARetirer = function(prixUnitaire){
    return qteARetirer * prixUnitaire *0.01}

/////////////FORMULAIRE ET VALIDATION DE COMMANDE////////////////
//1- sauvegarde des différents inputs de formulaire :
let allInputs = document.querySelectorAll('.formulaire input');
let inputFirstName = document.getElementById('firstname');
let inputLastName = document.getElementById('lastname');
let inputAdress = document.getElementById('adress');
let inputCity = document.getElementById('city');
let inputEmail = document.getElementById('email');


//2-Fonction pour la requete POST:
const postInfos = function(objetjson){
    return new Promise(function(resolve, reject){
        let postrequest = new XMLHttpRequest();
        postrequest.onload = function(){
            if (postrequest.status == 201){ //PS : le serveur renvoit une réponse avec statut 201 
                resolve(
                result = JSON.parse(postrequest.response),
                console.log(result),
                )
                
            }else if (postrequest.onerror /*|| postrequest.status !=201*/){
                reject(console.log("Erreur de requete POST, " + "readyState = " + postrequest.readyState) +"code statut: "+ postrequest.statut);
            }
        }
        postrequest.open('POST', 'http://localhost:3000/api/teddies/order');
        postrequest.setRequestHeader('Content-type', 'application/json');
        postrequest.send(objetjson);
    })
 }

let contact; //pré-création de l'objet contact pour remplissage ultérieur en page confirmation

 //3-Ecoute du formulaire :
formulaire.addEventListener('submit', function(e){
    e.preventDefault();
    sessionStorage.setItem("Prix payé", total); //sauvegarde prix total pour la page suivante
    contact = {//creation de l'objet contact à partir des donnes du formulaire
        firstName: inputFirstName.value,
        lastName: inputLastName.value,
        address: inputAdress.value,
        city: inputCity.value,
        email: inputEmail.value,
    }
    let envoi =  JSON.stringify({"contact": contact, "products": products});//préparation pour envoi au serveur
        // envoi au serveur et recup des infos de commande
    postInfos(envoi).then(retourServeur => sessionStorage.setItem("Numéro de commande :", retourServeur.orderId)).catch(erreur => console.log(erreur))
    localStorage.clear(); //vidange du panier

    document.location.pathname="/confirmation.html"; //redirection vers page confirmation
})







///Préparation requete POST
/*const envoiCommande = async function(){
    let response = await fetch('http://localhost:3000/api/teddies/order', {method: 'POST',
        body: contact,
        body.append
        }){
            if(response.ok){console.log(response.json)}
        }
}*/



//--------------- a voir plus tard ------------------
// Retour aux utilisateurs si erreur dans formulaire :
//1 écouter l'evennement change et si input invalide ajoute class invalid
//2 qd click retire class invalid
//sélection des différents inputs:

/*
let inputFirstName = document.getElementById('firstname');


    inputFirstName.addEventListener('invalid', (e)=>{
        if(e.target.validity.valid){
            console.log("input valide");
        }
    })*/

 //ne marche pas ??? a creuser plus tard   



